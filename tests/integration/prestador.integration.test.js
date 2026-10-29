const crypto = require('node:crypto');
const { describeConBase } = require('./helpers/baseDeTest');
const { caso } = require('../qase/qase');
const { crearEscenario, api, prisma } = require('./helpers/escenario');

describeConBase('Integración: flujo del prestador', () => {
  const escenario = crearEscenario('Prestador');
  let oficio;
  let prestador;
  let otroPrestador;
  let cliente;

  beforeAll(async () => {
    oficio = await escenario.crearOficio('Electricidad');
    prestador = await escenario.crearPrestadorCompleto(oficio);
    otroPrestador = await escenario.crearPrestadorCompleto(oficio);
    cliente = await escenario.registrar('CLIENTE');
  });

  afterAll(() => escenario.limpiar());

  async function estadoGuardado(solicitudId) {
    const solicitud = await prisma.solicitud.findUnique({ where: { id: solicitudId } });
    return solicitud.estado;
  }

  it(caso('TC-INT-PRE-001', 'consulta su perfil recién registrado'), async () => {
    const nuevo = await escenario.registrar('PRESTADOR');

    const res = await api(nuevo.token).get('/api/prestadores/me');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: nuevo.prestadorId,
      email: nuevo.email,
      descripcionProfesional: null,
      disponible: true,
      oficios: [],
    });
  });

  it(caso('TC-INT-PRE-002', 'edita su perfil y los cambios quedan guardados'), async () => {
    const nuevo = await escenario.registrar('PRESTADOR');

    const res = await api(nuevo.token).put('/api/prestadores/me', {
      descripcionProfesional: '  Electricista matriculado  ',
      zonaCobertura: 'Palermo',
      precioMin: 2000,
      precioMax: 8000,
      telefono: '+54 11 2233-4455',
      latitud: -34.58,
      longitud: -58.42,
      disponible: false,
      activo: false,
    });

    expect(res.status).toBe(200);
    const guardado = await prisma.prestador.findUnique({ where: { id: nuevo.prestadorId } });
    expect(guardado.descripcionProfesional).toBe('Electricista matriculado');
    expect(guardado.zonaCobertura).toBe('Palermo');
    expect(Number(guardado.precioMin)).toBe(2000);
    expect(Number(guardado.precioMax)).toBe(8000);
    expect(Number(guardado.latitud)).toBe(-34.58);
    expect(guardado.disponible).toBe(false);
    // "activo" no es un campo editable por el prestador.
    expect(guardado.activo).toBe(true);
  });

  it.each([
    ['un precio mínimo mayor al máximo', { precioMin: 9000, precioMax: 100 }],
    ['un teléfono inválido', { telefono: 'llamame' }],
    ['una descripción vacía', { descripcionProfesional: '   ' }],
  ])(caso('TC-INT-PRE-003', 'rechaza %s con 400 sin modificar la base'), async (_, cambio) => {
    const antes = await prisma.prestador.findUnique({ where: { id: prestador.prestadorId } });

    const res = await api(prestador.token).put('/api/prestadores/me', cambio);

    expect(res.status).toBe(400);
    const despues = await prisma.prestador.findUnique({ where: { id: prestador.prestadorId } });
    expect(despues).toEqual(antes);
  });

  it(caso('TC-INT-PRE-004', 'reemplaza sus oficios y quedan guardados'), async () => {
    const nuevo = await escenario.registrar('PRESTADOR');
    const pintura = await escenario.crearOficio('Pintura');
    const carpinteria = await escenario.crearOficio('Carpintería');

    const res = await api(nuevo.token).put('/api/prestadores/me/oficios', {
      oficioIds: [pintura.id, carpinteria.id, pintura.id],
    });

    expect(res.status).toBe(200);
    const guardados = await prisma.prestadorOficio.findMany({
      where: { prestadorId: nuevo.prestadorId },
    });
    expect(guardados.map((po) => po.oficioId).sort()).toEqual([pintura.id, carpinteria.id].sort());
  });

  it(caso('TC-INT-PRE-005', 'rechaza asignar un oficio desactivado o inexistente'), async () => {
    const desactivado = await escenario.crearOficio('Herrería', { activo: false });

    const conDesactivado = await api(prestador.token).put('/api/prestadores/me/oficios', {
      oficioIds: [desactivado.id],
    });
    const conInexistente = await api(prestador.token).put('/api/prestadores/me/oficios', {
      oficioIds: [crypto.randomUUID()],
    });

    expect(conDesactivado.status).toBe(400);
    expect(conInexistente.status).toBe(400);
    const guardados = await prisma.prestadorOficio.findMany({
      where: { prestadorId: prestador.prestadorId },
    });
    expect(guardados.map((po) => po.oficioId)).toEqual([oficio.id]);
  });

  it(caso('TC-INT-PRE-006', 'acepta una solicitud pendiente'), async () => {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio);

    const res = await api(prestador.token).patch(`/api/solicitudes/${solicitud.id}/aceptar`);

    expect(res.status).toBe(200);
    expect(await estadoGuardado(solicitud.id)).toBe('ACEPTADA');
  });

  it(caso('TC-INT-PRE-007', 'rechaza una solicitud pendiente'), async () => {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio);

    const res = await api(prestador.token).patch(`/api/solicitudes/${solicitud.id}/rechazar`);

    expect(res.status).toBe(200);
    expect(await estadoGuardado(solicitud.id)).toBe('RECHAZADA');
  });

  it(caso('TC-INT-PRE-008', 'finaliza una solicitud aceptada y suma un servicio finalizado'), async () => {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio, 'ACEPTADA');
    const antes = await api().get(`/api/calificaciones/prestador/${prestador.prestadorId}/reputacion`);

    const res = await api(prestador.token).patch(`/api/solicitudes/${solicitud.id}/finalizar`);

    expect(res.status).toBe(200);
    expect(await estadoGuardado(solicitud.id)).toBe('FINALIZADA');
    const despues = await api().get(`/api/calificaciones/prestador/${prestador.prestadorId}/reputacion`);
    expect(despues.body.serviciosFinalizados).toBe(antes.body.serviciosFinalizados + 1);
  });

  it.each([
    ['finalizar', 'PENDIENTE'],
    ['aceptar', 'ACEPTADA'],
    ['rechazar', 'ACEPTADA'],
  ])(caso('TC-INT-PRE-009', 'responde 409 al intentar %s una solicitud %s'), async (accion, estado) => {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio, estado);

    const res = await api(prestador.token).patch(`/api/solicitudes/${solicitud.id}/${accion}`);

    expect(res.status).toBe(409);
    expect(await estadoGuardado(solicitud.id)).toBe(estado);
  });

  it.each([['aceptar'], ['rechazar'], ['finalizar']])(
    caso('TC-INT-PRE-010', 'no puede %s una solicitud de otro prestador'),
    async (accion) => {
      const ajena = await escenario.crearSolicitud(cliente, otroPrestador, oficio);

      const res = await api(prestador.token).patch(`/api/solicitudes/${ajena.id}/${accion}`);

      expect(res.status).toBe(403);
      expect(await estadoGuardado(ajena.id)).toBe('PENDIENTE');
    }
  );

  it(caso('TC-INT-PRE-011', 'lista solo las solicitudes que recibió, con filtro por estado'), async () => {
    const propia = await escenario.crearSolicitud(cliente, prestador, oficio, 'ACEPTADA');
    const ajena = await escenario.crearSolicitud(cliente, otroPrestador, oficio, 'ACEPTADA');

    const res = await api(prestador.token).get('/api/solicitudes?estado=ACEPTADA');

    expect(res.status).toBe(200);
    const ids = res.body.map((s) => s.id);
    expect(ids).toContain(propia.id);
    expect(ids).not.toContain(ajena.id);
    expect(res.body.every((s) => s.estado === 'ACEPTADA')).toBe(true);
  });

  it(caso('TC-INT-PRE-012', 've las calificaciones recibidas sin las moderadas'), async () => {
    const visible = await escenario.crearSolicitud(cliente, prestador, oficio, 'FINALIZADA');
    const moderada = await escenario.crearSolicitud(cliente, prestador, oficio, 'FINALIZADA');
    const calificar = (solicitudId, comentario) =>
      api(cliente.token).post('/api/calificaciones', { solicitudId, puntaje: 5, comentario });
    const cVisible = await calificar(visible.id, 'Excelente');
    const cModerada = await calificar(moderada.id, 'Comentario ofensivo');
    await prisma.calificacion.update({
      where: { id: cModerada.body.id },
      data: { moderada: true, fechaModeracion: new Date(), motivoModeracion: 'Lenguaje ofensivo' },
    });

    const res = await api(prestador.token).get('/api/prestadores/me/calificaciones');

    expect(res.status).toBe(200);
    const ids = res.body.map((c) => c.id);
    expect(ids).toContain(cVisible.body.id);
    expect(ids).not.toContain(cModerada.body.id);
  });

  it(caso('TC-INT-PRE-013', 'responde 404 al operar sobre una solicitud que no existe'), async () => {
    const res = await api(prestador.token).patch(`/api/solicitudes/${crypto.randomUUID()}/aceptar`);

    expect(res.status).toBe(404);
  });
});
