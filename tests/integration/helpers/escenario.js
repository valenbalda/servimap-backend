// Datos de prueba para los tests de integración. Cada suite crea un escenario propio
// (con un prefijo único en emails, DNI y nombres) y lo borra completo al terminar.
// No se usan datos reales ni cuentas compartidas.
const crypto = require('node:crypto');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../../src/app');
const prisma = require('../../../src/config/prisma');

const PASSWORD = 'clave-de-test-123';

function crearEscenario(nombreSuite) {
  const prefijo = `it${crypto.randomBytes(4).toString('hex')}`;
  const usuarioIds = new Set();
  const oficioIds = new Set();
  let contador = 0;

  function siguiente() {
    contador += 1;
    return contador;
  }

  // DNI de 8 dígitos al azar; la base lo exige único.
  function dniNuevo() {
    return String(crypto.randomInt(10_000_000, 100_000_000));
  }

  function datosDeRegistro(rol, extra = {}) {
    const n = siguiente();
    return {
      nombre: `${nombreSuite} ${rol.toLowerCase()} ${n} ${prefijo}`,
      dni: dniNuevo(),
      email: `${prefijo}-${rol.toLowerCase()}-${n}@servimap.test`,
      password: PASSWORD,
      rol,
      ...extra,
    };
  }

  async function login(email, password = PASSWORD) {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    if (res.status !== 200) {
      throw new Error(`No se pudo iniciar sesión con ${email}: ${res.status}`);
    }
    return res.body.token;
  }

  // Registra una cuenta por la API y devuelve sus datos con el token de sesión.
  async function registrar(rol, extra = {}) {
    const datos = datosDeRegistro(rol, extra);
    const res = await request(app).post('/api/auth/register').send(datos);
    if (res.status !== 201) {
      throw new Error(`No se pudo registrar ${datos.email}: ${res.status} ${res.text}`);
    }
    usuarioIds.add(res.body.id);
    const token = await login(datos.email);
    const prestador =
      rol === 'PRESTADOR'
        ? await prisma.prestador.findUnique({ where: { usuarioId: res.body.id } })
        : null;
    return { ...datos, id: res.body.id, token, prestadorId: prestador?.id ?? null };
  }

  // La API no permite registrar administradores: se crea directo en la base.
  async function crearAdministrador() {
    const datos = datosDeRegistro('ADMINISTRADOR');
    const usuario = await prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        dni: datos.dni,
        email: datos.email,
        passwordHash: await bcrypt.hash(PASSWORD, 10),
        rol: 'ADMINISTRADOR',
      },
    });
    usuarioIds.add(usuario.id);
    const token = await login(datos.email);
    return { ...datos, id: usuario.id, token };
  }

  async function crearOficio(nombre = 'Oficio', { activo = true } = {}) {
    const oficio = await prisma.oficio.create({
      data: { nombre: `${nombre} ${prefijo} ${siguiente()}`, categoria: 'Hogar', activo },
    });
    oficioIds.add(oficio.id);
    return oficio;
  }

  // Registra un oficio creado por la API (por ejemplo, desde el administrador) para borrarlo al final.
  function registrarOficio(id) {
    oficioIds.add(id);
  }

  // Prestador listo para recibir solicitudes: perfil completo, ubicación y un oficio.
  async function crearPrestadorCompleto(oficio, perfil = {}) {
    const prestador = await registrar('PRESTADOR');
    await prisma.prestador.update({
      where: { id: prestador.prestadorId },
      data: {
        descripcionProfesional: 'Prestador de prueba',
        zonaCobertura: `Zona ${prefijo}`,
        latitud: -34.6037,
        longitud: -58.3816,
        precioMin: 1000,
        precioMax: 5000,
        ...perfil,
        oficios: { create: [{ oficioId: oficio.id }] },
      },
    });
    return prestador;
  }

  // Crea una solicitud por la API y, si se pide, la avanza hasta el estado indicado.
  async function crearSolicitud(cliente, prestador, oficio, estadoFinal = 'PENDIENTE') {
    const res = await request(app)
      .post('/api/solicitudes')
      .set('Authorization', `Bearer ${cliente.token}`)
      .send({
        prestadorId: prestador.prestadorId,
        oficioId: oficio.id,
        descripcion: 'Pérdida de agua en la cocina',
      });
    if (res.status !== 201) {
      throw new Error(`No se pudo crear la solicitud: ${res.status} ${res.text}`);
    }
    const pasos = { PENDIENTE: [], ACEPTADA: ['aceptar'], FINALIZADA: ['aceptar', 'finalizar'] };
    for (const accion of pasos[estadoFinal]) {
      await request(app)
        .patch(`/api/solicitudes/${res.body.id}/${accion}`)
        .set('Authorization', `Bearer ${prestador.token}`)
        .expect(200);
    }
    return res.body;
  }

  // Borra todo lo que creó la suite, respetando el orden de las claves foráneas.
  async function limpiar() {
    const usuarios = [...usuarioIds];
    const oficios = [...oficioIds];
    const prestadores = await prisma.prestador.findMany({
      where: { usuarioId: { in: usuarios } },
      select: { id: true },
    });
    const prestadorIds = prestadores.map((p) => p.id);
    const solicitudes = {
      OR: [
        { clienteId: { in: usuarios } },
        { prestadorId: { in: prestadorIds } },
        { oficioId: { in: oficios } },
      ],
    };

    await prisma.calificacion.deleteMany({
      where: { OR: [{ clienteId: { in: usuarios } }, { prestadorId: { in: prestadorIds } }, { solicitud: solicitudes }] },
    });
    await prisma.solicitud.deleteMany({ where: solicitudes });
    await prisma.prestadorOficio.deleteMany({
      where: { OR: [{ prestadorId: { in: prestadorIds } }, { oficioId: { in: oficios } }] },
    });
    await prisma.prestador.deleteMany({ where: { id: { in: prestadorIds } } });
    await prisma.usuario.deleteMany({ where: { id: { in: usuarios } } });
    await prisma.oficio.deleteMany({ where: { id: { in: oficios } } });
    await prisma.$disconnect();
  }

  return {
    prefijo,
    datosDeRegistro,
    registrar,
    login,
    crearAdministrador,
    crearOficio,
    registrarOficio,
    crearPrestadorCompleto,
    crearSolicitud,
    limpiar,
    usuarioIds,
  };
}

// Atajo para mandar pedidos autenticados.
function api(token) {
  const conToken = (pedido) => (token ? pedido.set('Authorization', `Bearer ${token}`) : pedido);
  return {
    get: (ruta) => conToken(request(app).get(ruta)),
    post: (ruta, body) => conToken(request(app).post(ruta)).send(body),
    put: (ruta, body) => conToken(request(app).put(ruta)).send(body),
    patch: (ruta, body) => conToken(request(app).patch(ruta)).send(body),
  };
}

module.exports = { crearEscenario, api, app, prisma, PASSWORD };
