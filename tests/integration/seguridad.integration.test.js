const crypto = require('node:crypto');
const { describeConBase } = require('./helpers/baseDeTest');
const jwt = require('jsonwebtoken');
const { caso } = require('../qase/qase');
const { crearEscenario, api, app, prisma } = require('./helpers/escenario');
const request = require('supertest');

const RUTAS_PROTEGIDAS = [
  ['get', '/api/auth/me'],
  ['get', '/api/prestadores/me'],
  ['put', '/api/prestadores/me'],
  ['put', '/api/prestadores/me/oficios'],
  ['get', '/api/prestadores/me/calificaciones'],
  ['post', '/api/solicitudes'],
  ['get', '/api/solicitudes'],
  ['patch', '/api/solicitudes/x/aceptar'],
  ['patch', '/api/solicitudes/x/cancelar'],
  ['post', '/api/calificaciones'],
  ['get', '/api/calificaciones'],
  ['get', '/api/oficios/todos'],
  ['post', '/api/oficios'],
];

describeConBase('Integración: seguridad y errores transversales', () => {
  const escenario = crearEscenario('Seguridad');
  let cliente;
  let prestador;

  beforeAll(async () => {
    const oficio = await escenario.crearOficio('Albañilería');
    prestador = await escenario.crearPrestadorCompleto(oficio);
    cliente = await escenario.registrar('CLIENTE');
  });

  afterAll(() => escenario.limpiar());

  it.each(RUTAS_PROTEGIDAS)(caso('TC-INT-SEG-001', '%s %s responde 401 sin token'), async (metodo, ruta) => {
    const res = await api()[metodo](ruta);

    expect(res.status).toBe(401);
  });

  it.each([
    ['mal formado', () => 'abc.def.ghi'],
    ['firmado con otra clave', (id) => jwt.sign({ sub: id, rol: 'CLIENTE' }, 'otra-clave-cualquiera')],
    [
      'vencido',
      (id) => jwt.sign({ sub: id, rol: 'CLIENTE' }, process.env.JWT_SECRET, { expiresIn: -10 }),
    ],
  ])(caso('TC-INT-SEG-002', 'responde 401 con un token %s'), async (_, crearToken) => {
    const res = await api(crearToken(cliente.id)).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Token inválido o vencido' });
  });

  it.each([
    ['CLIENTE', 'get', '/api/prestadores/me'],
    ['CLIENTE', 'patch', '/api/solicitudes/x/aceptar'],
    ['PRESTADOR', 'post', '/api/solicitudes'],
    ['PRESTADOR', 'post', '/api/calificaciones'],
    ['PRESTADOR', 'patch', '/api/solicitudes/x/cancelar'],
  ])(caso('TC-INT-SEG-003', 'un %s recibe 403 en %s %s'), async (rol, metodo, ruta) => {
    const token = rol === 'CLIENTE' ? cliente.token : prestador.token;

    const res = await api(token)[metodo](ruta, {});

    expect(res.status).toBe(403);
  });

  it.each([
    ['una ruta que no existe', 'get', '/api/no-existe'],
    ['un prestador que no existe', 'get', '/api/prestadores/:uuid'],
    ['la reputación de un prestador que no existe', 'get', '/api/calificaciones/prestador/:uuid/reputacion'],
    ['una solicitud que no existe', 'patch', '/api/solicitudes/:uuid/cancelar'],
    ['una calificación que no existe', 'patch', '/api/calificaciones/:uuid/comentario'],
  ])(caso('TC-INT-SEG-004', 'responde 404 para %s'), async (_, metodo, ruta) => {
    const res = await api(cliente.token)[metodo](ruta.replace(':uuid', crypto.randomUUID()), {
      comentario: 'Texto',
    });

    expect(res.status).toBe(404);
  });

  it(caso('TC-INT-SEG-005', 'responde 400 si el cuerpo no es un JSON válido'), async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": "roto"');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'El cuerpo del pedido no es un JSON válido' });
  });

  it(caso('TC-INT-SEG-006', 'el token de una cuenta desactivada ya no permite ver el perfil'), async () => {
    const desactivado = await escenario.registrar('CLIENTE');
    await prisma.usuario.update({ where: { id: desactivado.id }, data: { activo: false } });

    const res = await api(desactivado.token).get('/api/auth/me');

    expect(res.status).toBe(404);
  });
});
