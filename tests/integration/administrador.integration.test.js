const { describeConBase } = require('./helpers/baseDeTest');
const { caso } = require('../qase/qase');
const { crearEscenario, api, prisma } = require('./helpers/escenario');

describeConBase('Integración: flujo del administrador', () => {
  const escenario = crearEscenario('Admin');
  let admin;
  let cliente;
  let prestador;
  let oficio;

  beforeAll(async () => {
    admin = await escenario.crearAdministrador();
    oficio = await escenario.crearOficio('Jardinería');
    prestador = await escenario.crearPrestadorCompleto(oficio);
    cliente = await escenario.registrar('CLIENTE');
  });

  afterAll(() => escenario.limpiar());

  // Crea una calificación real: solicitud finalizada y calificada por el cliente.
  async function crearCalificacion(comentario) {
    const solicitud = await escenario.crearSolicitud(cliente, prestador, oficio, 'FINALIZADA');
    const res = await api(cliente.token).post('/api/calificaciones', {
      solicitudId: solicitud.id,
      puntaje: 2,
      comentario,
    });
    return res.body;
  }

  it(caso('TC-INT-ADM-001', 'crea un oficio y queda guardado activo'), async () => {
    const nombre = `Techista ${escenario.prefijo}`;

    const res = await api(admin.token).post('/api/oficios', {
      nombre: `  ${nombre}  `,
      categoria: 'Construcción',
    });

    expect(res.status).toBe(201);
    escenario.registrarOficio(res.body.id);
    const guardado = await prisma.oficio.findUnique({ where: { id: res.body.id } });
    expect(guardado).toMatchObject({ nombre, categoria: 'Construcción', activo: true });
  });

  it(caso('TC-INT-ADM-002', 'responde 409 si ya existe un oficio con ese nombre'), async () => {
    const res = await api(admin.token).post('/api/oficios', { nombre: oficio.nombre });

    expect(res.status).toBe(409);
    expect(await prisma.oficio.count({ where: { nombre: oficio.nombre } })).toBe(1);
  });

  it(caso('TC-INT-ADM-003', 'edita el nombre y la categoría de un oficio'), async () => {
    const aEditar = await escenario.crearOficio('Vidriería');
    const nuevoNombre = `Vidriería y aberturas ${escenario.prefijo}`;

    const res = await api(admin.token).put(`/api/oficios/${aEditar.id}`, {
      nombre: nuevoNombre,
      categoria: 'Aberturas',
    });

    expect(res.status).toBe(200);
    const guardado = await prisma.oficio.findUnique({ where: { id: aEditar.id } });
    expect(guardado).toMatchObject({ nombre: nuevoNombre, categoria: 'Aberturas' });
  });

  it(caso('TC-INT-ADM-004', 'desactiva un oficio sin borrarlo y lo vuelve a activar'), async () => {
    const aDesactivar = await escenario.crearOficio('Cerrajería');

    const desactivar = await api(admin.token).patch(`/api/oficios/${aDesactivar.id}/estado`, {
      activo: false,
    });

    expect(desactivar.status).toBe(200);
    const guardado = await prisma.oficio.findUnique({ where: { id: aDesactivar.id } });
    expect(guardado.activo).toBe(false);
    const publicos = await api().get('/api/oficios');
    expect(publicos.body.map((o) => o.id)).not.toContain(aDesactivar.id);
    const todos = await api(admin.token).get('/api/oficios/todos');
    expect(todos.body.map((o) => o.id)).toContain(aDesactivar.id);

    const activar = await api(admin.token).patch(`/api/oficios/${aDesactivar.id}/estado`, {
      activo: true,
    });
    expect(activar.status).toBe(200);
    expect((await prisma.oficio.findUnique({ where: { id: aDesactivar.id } })).activo).toBe(true);
  });

  it(caso('TC-INT-ADM-005', 'al desactivar el único oficio de un prestador, deja de aparecer en la búsqueda'), async () => {
    const soloOficio = await escenario.crearOficio('Fumigación');
    const afectado = await escenario.crearPrestadorCompleto(soloOficio);

    await api(admin.token).patch(`/api/oficios/${soloOficio.id}/estado`, { activo: false });

    const busqueda = await api().get(`/api/prestadores?q=${escenario.prefijo}`);
    expect(busqueda.body.map((p) => p.id)).not.toContain(afectado.prestadorId);
    const mapa = await api().get('/api/prestadores/mapa');
    expect(mapa.body.map((p) => p.id)).not.toContain(afectado.prestadorId);
  });

  it(caso('TC-INT-ADM-006', 'lista todas las calificaciones, incluidas las moderadas'), async () => {
    const normal = await crearCalificacion('Correcto');
    const moderada = await crearCalificacion('Para moderar');
    await prisma.calificacion.update({ where: { id: moderada.id }, data: { moderada: true } });

    const res = await api(admin.token).get('/api/calificaciones');

    expect(res.status).toBe(200);
    const ids = res.body.map((c) => c.id);
    expect(ids).toEqual(expect.arrayContaining([normal.id, moderada.id]));
  });

  it(caso('TC-INT-ADM-007', 'modera un comentario: queda registrado y sale del listado público'), async () => {
    const calificacion = await crearCalificacion('Comentario con insultos');

    const res = await api(admin.token).patch(`/api/calificaciones/${calificacion.id}/moderacion`, {
      motivo: '  Lenguaje ofensivo  ',
    });

    expect(res.status).toBe(200);
    const guardada = await prisma.calificacion.findUnique({ where: { id: calificacion.id } });
    expect(guardada).toMatchObject({ moderada: true, motivoModeracion: 'Lenguaje ofensivo' });
    expect(guardada.fechaModeracion).toBeInstanceOf(Date);
    expect(guardada.comentario).toBe('Comentario con insultos');
    const publico = await api().get(`/api/calificaciones/prestador/${prestador.prestadorId}`);
    expect(publico.body.map((c) => c.id)).not.toContain(calificacion.id);

    const otraVez = await api(admin.token).patch(`/api/calificaciones/${calificacion.id}/moderacion`, {
      motivo: 'Otra vez',
    });
    expect(otraVez.status).toBe(409);
  });

  const noAutorizado = `No autorizado ${escenario.prefijo}`;
  const rutasDeAdministrador = [
    ['get', '/api/oficios/todos'],
    ['post', '/api/oficios', { nombre: noAutorizado }],
    ['put', '/api/oficios/:oficio', { nombre: noAutorizado }],
    ['patch', '/api/oficios/:oficio/estado', { activo: false }],
    ['get', '/api/calificaciones'],
    ['patch', '/api/calificaciones/:calificacion/moderacion', { motivo: 'No autorizado' }],
  ];
  const casosDe403 = ['CLIENTE', 'PRESTADOR'].flatMap((rol) =>
    rutasDeAdministrador.map(([metodo, ruta, body]) => [rol, metodo, ruta, body])
  );

  it.each(casosDe403)(
    caso('TC-INT-ADM-008', 'un %s recibe 403 en %s %s y no cambia nada'),
    async (rol, metodo, ruta, body) => {
      const calificacion = await crearCalificacion('Comentario');
      const token = rol === 'CLIENTE' ? cliente.token : prestador.token;
      const url = ruta.replace(':oficio', oficio.id).replace(':calificacion', calificacion.id);

      const res = await api(token)[metodo](url, body);

      expect(res.status).toBe(403);
      expect(await prisma.oficio.count({ where: { nombre: noAutorizado } })).toBe(0);
      expect(await prisma.oficio.findUnique({ where: { id: oficio.id } })).toMatchObject({
        nombre: oficio.nombre,
        activo: true,
      });
      expect(
        (await prisma.calificacion.findUnique({ where: { id: calificacion.id } })).moderada
      ).toBe(false);
    }
  );
});
