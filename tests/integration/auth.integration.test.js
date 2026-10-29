const { describeConBase } = require('./helpers/baseDeTest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { caso } = require('../qase/qase');
const { crearEscenario, api, prisma, PASSWORD } = require('./helpers/escenario');

describeConBase('Integración: registro, inicio de sesión y perfil', () => {
  const escenario = crearEscenario('Auth');

  afterAll(() => escenario.limpiar());

  it(caso('TC-INT-AUTH-001', 'registra un cliente con DNI y lo guarda con la contraseña hasheada'), async () => {
    const datos = escenario.datosDeRegistro('CLIENTE');
    const dniConPuntos = `${datos.dni.slice(0, 2)}.${datos.dni.slice(2, 5)}.${datos.dni.slice(5)}`;

    const res = await api().post('/api/auth/register', { ...datos, dni: dniConPuntos });

    expect(res.status).toBe(201);
    escenario.usuarioIds.add(res.body.id);
    expect(res.body).toMatchObject({ email: datos.email, rol: 'CLIENTE' });
    expect(res.body).not.toHaveProperty('dni');
    expect(res.body).not.toHaveProperty('passwordHash');

    const guardado = await prisma.usuario.findUnique({ where: { id: res.body.id } });
    expect(guardado.dni).toBe(datos.dni);
    expect(guardado.passwordHash).not.toBe(PASSWORD);
    expect(await bcrypt.compare(PASSWORD, guardado.passwordHash)).toBe(true);
    expect(guardado.activo).toBe(true);
  });

  it(caso('TC-INT-AUTH-002', 'registra un prestador y crea su perfil de prestador en la base'), async () => {
    const prestador = await escenario.registrar('PRESTADOR');

    const perfil = await prisma.prestador.findUnique({ where: { usuarioId: prestador.id } });
    expect(perfil).not.toBeNull();
    expect(perfil).toMatchObject({ activo: true, disponible: true, descripcionProfesional: null });
  });

  it(caso('TC-INT-AUTH-003', 'inicia sesión y devuelve un token con el id y el rol del usuario'), async () => {
    const cliente = await escenario.registrar('CLIENTE');

    const res = await api().post('/api/auth/login', {
      email: cliente.email.toUpperCase(),
      password: PASSWORD,
    });

    expect(res.status).toBe(200);
    expect(res.body.usuario).toMatchObject({ id: cliente.id, rol: 'CLIENTE' });
    expect(res.body.usuario).not.toHaveProperty('dni');
    const payload = jwt.decode(res.body.token);
    expect(payload).toMatchObject({ sub: cliente.id, rol: 'CLIENTE' });
  });

  it(caso('TC-INT-AUTH-004', 'rechaza credenciales incorrectas con 401 y el mismo mensaje'), async () => {
    const cliente = await escenario.registrar('CLIENTE');

    const malaClave = await api().post('/api/auth/login', {
      email: cliente.email,
      password: 'otra-clave-123',
    });
    const emailInexistente = await api().post('/api/auth/login', {
      email: `${escenario.prefijo}-nadie@servimap.test`,
      password: PASSWORD,
    });

    expect(malaClave.status).toBe(401);
    expect(emailInexistente.status).toBe(401);
    expect(malaClave.body.error).toBe(emailInexistente.body.error);
  });

  it(caso('TC-INT-AUTH-005', 'GET /me devuelve el perfil con el DNI solo a su dueño'), async () => {
    const cliente = await escenario.registrar('CLIENTE');

    const res = await api(cliente.token).get('/api/auth/me');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: cliente.id, dni: cliente.dni, email: cliente.email });
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it(caso('TC-INT-AUTH-006', 'responde 409 si el email ya está registrado y no crea otra cuenta'), async () => {
    const cliente = await escenario.registrar('CLIENTE');
    const otro = escenario.datosDeRegistro('CLIENTE', { email: cliente.email });

    const res = await api().post('/api/auth/register', otro);

    expect(res.status).toBe(409);
    expect(await prisma.usuario.count({ where: { email: cliente.email } })).toBe(1);
    expect(await prisma.usuario.count({ where: { dni: otro.dni } })).toBe(0);
  });

  it(caso('TC-INT-AUTH-007', 'responde 409 si el DNI ya está registrado, aunque venga con otro formato'), async () => {
    const cliente = await escenario.registrar('CLIENTE');
    const dniConEspacios = `${cliente.dni.slice(0, 2)} ${cliente.dni.slice(2, 5)} ${cliente.dni.slice(5)}`;
    const otro = escenario.datosDeRegistro('PRESTADOR', { dni: dniConEspacios });

    const res = await api().post('/api/auth/register', otro);

    expect(res.status).toBe(409);
    expect(await prisma.usuario.count({ where: { dni: cliente.dni } })).toBe(1);
    expect(await prisma.usuario.count({ where: { email: otro.email } })).toBe(0);
  });

  it.each([
    ['un DNI de 6 números', { dni: '123456' }],
    ['un email inválido', { email: 'sin-arroba' }],
    ['una contraseña corta', { password: '1234567' }],
    ['el rol ADMINISTRADOR', { rol: 'ADMINISTRADOR' }],
  ])(caso('TC-INT-AUTH-008', 'responde 400 con %s y no guarda nada'), async (_, cambio) => {
    const datos = escenario.datosDeRegistro('CLIENTE', cambio);

    const res = await api().post('/api/auth/register', datos);

    expect(res.status).toBe(400);
    expect(await prisma.usuario.count({ where: { email: datos.email } })).toBe(0);
  });

  it(caso('TC-INT-AUTH-009', 'rechaza el inicio de sesión de una cuenta desactivada con 403'), async () => {
    const cliente = await escenario.registrar('CLIENTE');
    await prisma.usuario.update({ where: { id: cliente.id }, data: { activo: false } });

    const res = await api().post('/api/auth/login', { email: cliente.email, password: PASSWORD });

    expect(res.status).toBe(403);
    expect(res.body).not.toHaveProperty('token');
  });
});
