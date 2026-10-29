const { describeConBase } = require('./helpers/baseDeTest');
const { caso } = require('../qase/qase');
const { crearEscenario, api, prisma } = require('./helpers/escenario');

describeConBase('Integración: flujo del cliente', () => {
  const escenario = crearEscenario('Cliente');
  let oficio;
  let prestador;
  let cliente;
  let otroCliente;

  beforeAll(async () => {
    oficio = await escenario.crearOficio('Plomería');
    prestador = await escenario.crearPrestadorCompleto(oficio, {
      telefono: '1122334455',
      emailContacto: `${escenario.prefijo}-contacto@servimap.test`,
    });
    cliente = await escenario.registrar('CLIENTE');
    otroCliente = await escenario.registrar('CLIENTE');
  });

  afterAll(() => escenario.limpiar());

  it(caso('TC-INT-CLI-001', 'busca prestadores por texto y por oficio'), async () => {
    const porTexto = await api().get(`/api/prestadores?q=${escenario.prefijo}`);
    const porOficio = await api().get(`/api/prestadores?oficioId=${oficio.id}`);

    expect(porTexto.status).toBe(200);
    expect(porTexto.body.map((p) => p.id)).toContain(prestador.prestadorId);
    expect(porOficio.body.map((p) => p.id)).toEqual([prestador.prestadorId]);
    const encontrado = porOficio.body[0];
    expect(encontrado.oficios).toEqual([{ id: oficio.id, nombre: oficio.nombre }]);
    expect(encontrado).not.toHaveProperty('telefono');
    expect(encontrado.reputacion).toEqual({
      promedio: null,
      totalCalificaciones: 0,
      serviciosFinalizados: 0,
    });
  });

  it(caso('TC-INT-CLI-002', 'filtra prestadores por distancia a una ubicación'), async () => {
    const cerca = await api().get(
      `/api/prestadores?oficioId=${oficio.id}&lat=-34.61&lng=-58.39&radioKm=5`
    );
    const lejos = await api().get(
      `/api/prestadores?oficioId=${oficio.id}&lat=-31.42&lng=-64.18&radioKm=10`
    );

    expect(cerca.status).toBe(200);
    expect(cerca.body).toHaveLength(1);
    expect(cerca.body[0].distanciaKm).toBeLessThanOrEqual(5);
    expect(lejos.body).toEqual([]);
  });

  it(caso('TC-INT-CLI-003', 'el mapa muestra al prestador disponible con ubicación aproximada'), async () => {
    const res = await api().get(`/api/prestadores/mapa?oficioId=${oficio.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: prestador.prestadorId,
        nombre: prestador.nombre,
        latitud: -34.6,
        longitud: -58.38,
        oficioPrincipal: oficio.nombre,
        promedio: null,
      },
    ]);
  });

  it(caso('TC-INT-CLI-004', 'la ficha del prestador muestra contacto, reputación y comentarios'), async () => {
    const res = await api().get(`/api/prestadores/${prestador.prestadorId}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: prestador.prestadorId,
      telefono: '1122334455',
      emailContacto: `${escenario.prefijo}-contacto@servimap.test`,
      comentarios: [],
    });
    expect(res.body).not.toHaveProperty('email');
  });

  it(caso('TC-INT-CLI-005', 'crea una solicitud y queda guardada como PENDIENTE'), async () => {
    const res = await api(cliente.token).post('/api/solicitudes', {
      prestadorId: prestador.prestadorId,
      oficioId: oficio.id,
      descripcion: '  Cambiar el cuerito de la canilla  ',
      direccion: 'Av. Siempreviva 742',
    });

    expect(res.status).toBe(201);
    const guardada = await prisma.solicitud.findUnique({ where: { id: res.body.id } });
    expect(guardada).toMatchObject({
      estado: 'PENDIENTE',
      clienteId: cliente.id,
      prestadorId: prestador.prestadorId,
      oficioId: oficio.id,
      descripcion: 'Cambiar el cuerito de la canilla',
      direccion: 'Av. Siempreviva 742',
    });
  });

  it(caso('TC-INT-CLI-006', 'lista solo sus propias solicitudes'), async () => {
    const propia = await escenario.crearSolicitud(cliente, prestador, oficio);
    const ajena = await escenario.crearSolicitud(otroCliente, prestador, oficio);

    const res = await api(cliente.token).get('/api/solicitudes');

    expect(res.status).toBe(200);
    const ids = res.body.map((s) => s.id);
    expect(ids).toContain(propia.id);
    expect(ids).not.toContain(ajena.id);
    expect(res.body.every((s) => s.cliente.id === cliente.id)).toBe(true);
  });

  it(caso('TC-INT-CLI-007', 'cancela su solicitud pendiente y queda CANCELADA en la base'), async () => {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio);

    const res = await api(cliente.token).patch(`/api/solicitudes/${solicitud.id}/cancelar`);

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('CANCELADA');
    const guardada = await prisma.solicitud.findUnique({ where: { id: solicitud.id } });
    expect(guardada.estado).toBe('CANCELADA');
  });

  it(caso('TC-INT-CLI-008', 'no puede cancelar la solicitud de otro cliente'), async () => {
    const ajena = await escenario.crearSolicitud(otroCliente, prestador, oficio);

    const res = await api(cliente.token).patch(`/api/solicitudes/${ajena.id}/cancelar`);

    expect(res.status).toBe(403);
    const guardada = await prisma.solicitud.findUnique({ where: { id: ajena.id } });
    expect(guardada.estado).toBe('PENDIENTE');
  });

  it(caso('TC-INT-CLI-009', 'califica una solicitud finalizada y se actualiza la reputación'), async () => {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio, 'FINALIZADA');

    const res = await api(cliente.token).post('/api/calificaciones', {
      solicitudId: solicitud.id,
      puntaje: 4,
      comentario: '  Muy prolijo  ',
    });

    expect(res.status).toBe(201);
    const guardada = await prisma.calificacion.findUnique({ where: { solicitudId: solicitud.id } });
    expect(guardada).toMatchObject({
      puntaje: 4,
      comentario: 'Muy prolijo',
      clienteId: cliente.id,
      prestadorId: prestador.prestadorId,
      moderada: false,
    });
    const reputacion = await api().get(
      `/api/calificaciones/prestador/${prestador.prestadorId}/reputacion`
    );
    expect(reputacion.body.totalCalificaciones).toBeGreaterThanOrEqual(1);
    expect(reputacion.body.serviciosFinalizados).toBeGreaterThanOrEqual(1);
  });

  it(caso('TC-INT-CLI-010', 'permite una sola calificación por solicitud'), async () => {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio, 'FINALIZADA');
    const calificar = () =>
      api(cliente.token).post('/api/calificaciones', { solicitudId: solicitud.id, puntaje: 5 });

    expect((await calificar()).status).toBe(201);
    const segunda = await calificar();

    expect(segunda.status).toBe(409);
    expect(await prisma.calificacion.count({ where: { solicitudId: solicitud.id } })).toBe(1);
  });

  it(caso('TC-INT-CLI-011', 'no puede calificar una solicitud que no está finalizada'), async () => {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio, 'ACEPTADA');

    const res = await api(cliente.token).post('/api/calificaciones', {
      solicitudId: solicitud.id,
      puntaje: 5,
    });

    expect(res.status).toBe(409);
    expect(await prisma.calificacion.count({ where: { solicitudId: solicitud.id } })).toBe(0);
  });

  it(caso('TC-INT-CLI-012', 'edita el comentario de su calificación'), async () => {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio, 'FINALIZADA');
    const calificacion = await api(cliente.token).post('/api/calificaciones', {
      solicitudId: solicitud.id,
      puntaje: 3,
      comentario: 'Bien',
    });

    const res = await api(cliente.token).patch(
      `/api/calificaciones/${calificacion.body.id}/comentario`,
      { comentario: 'Bien, aunque llegó tarde' }
    );

    expect(res.status).toBe(200);
    const guardada = await prisma.calificacion.findUnique({ where: { id: calificacion.body.id } });
    expect(guardada.comentario).toBe('Bien, aunque llegó tarde');
  });

  it(caso('TC-INT-CLI-013', 'no puede pedir un servicio a un prestador no disponible'), async () => {
    const otroOficio = await escenario.crearOficio('Gas');
    const noDisponible = await escenario.crearPrestadorCompleto(otroOficio, { disponible: false });

    const res = await api(cliente.token).post('/api/solicitudes', {
      prestadorId: noDisponible.prestadorId,
      oficioId: otroOficio.id,
      descripcion: 'Arreglo urgente',
    });

    expect(res.status).toBe(409);
    expect(await prisma.solicitud.count({ where: { prestadorId: noDisponible.prestadorId } })).toBe(0);
  });
});
