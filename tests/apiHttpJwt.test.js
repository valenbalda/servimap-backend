jest.mock('../src/services/prestadoresService', () => ({
  obtenerMiPerfil: jest.fn(),
  actualizarMiPerfil: jest.fn(),
  asignarMisOficios: jest.fn(),
  listarPrestadores: jest.fn(),
  obtenerDetallePrestador: jest.fn(),
  listarMisCalificaciones: jest.fn(),
}));

jest.mock('../src/services/solicitudesService', () => ({
  crearSolicitud: jest.fn(),
  listarMisSolicitudes: jest.fn(),
  aceptarSolicitud: jest.fn(),
  rechazarSolicitud: jest.fn(),
  finalizarSolicitud: jest.fn(),
  cancelarSolicitud: jest.fn(),
}));

jest.mock('../src/services/mapaService', () => ({
  listarMarcadores: jest.fn(),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const env = require('../src/config/env');
const app = require('../src/app');
const prestadoresService = require('../src/services/prestadoresService');
const solicitudesService = require('../src/services/solicitudesService');
const mapaService = require('../src/services/mapaService');

const ROLES = ['CLIENTE', 'PRESTADOR', 'ADMINISTRADOR'];

const todosLosMocks = [prestadoresService, solicitudesService, mapaService].flatMap(
  (servicio) => Object.values(servicio)
);

// Rutas protegidas por rol: [método, ruta, roles que pueden entrar].
const rutasConRol = [
  ['get', '/api/prestadores/me', ['PRESTADOR']],
  ['put', '/api/prestadores/me', ['PRESTADOR']],
  ['put', '/api/prestadores/me/oficios', ['PRESTADOR']],
  ['get', '/api/prestadores/me/calificaciones', ['PRESTADOR']],
  ['post', '/api/solicitudes', ['CLIENTE']],
  ['get', '/api/solicitudes', ['CLIENTE', 'PRESTADOR']],
  ['patch', '/api/solicitudes/s1/aceptar', ['PRESTADOR']],
  ['patch', '/api/solicitudes/s1/rechazar', ['PRESTADOR']],
  ['patch', '/api/solicitudes/s1/finalizar', ['PRESTADOR']],
  ['patch', '/api/solicitudes/s1/cancelar', ['CLIENTE']],
];

// Todas las rutas que piden estar logueado (la última no depende del rol).
const rutasProtegidas = [
  ...rutasConRol.map(([metodo, ruta]) => [metodo, ruta]),
  ['get', '/api/auth/me'],
];

const casosRolIncorrecto = rutasConRol.flatMap(([metodo, ruta, permitidos]) =>
  ROLES.filter((rol) => !permitidos.includes(rol)).map((rol) => [metodo, ruta, rol])
);

function firmar(rol, id = 'u1') {
  return jwt.sign({ sub: id, rol }, env.JWT_SECRET, { expiresIn: '1h' });
}

function conToken(rol, id) {
  return `Bearer ${firmar(rol, id)}`;
}

const autorizacionesInvalidas = [
  ['mal formado', 'Bearer abc.def.ghi'],
  [
    'firmado con otra clave',
    `Bearer ${jwt.sign({ sub: 'u1', rol: 'PRESTADOR' }, 'otra-clave-que-no-es-la-del-servidor')}`,
  ],
  [
    'vencido',
    `Bearer ${jwt.sign({ sub: 'u1', rol: 'PRESTADOR' }, env.JWT_SECRET, { expiresIn: -10 })}`,
  ],
  ['sin la palabra Bearer', `Basic ${firmar('PRESTADOR')}`],
];

function pedir(metodo, ruta, { autorizacion, body } = {}) {
  let pedido = request(app)[metodo](ruta);
  if (autorizacion) {
    pedido = pedido.set('Authorization', autorizacion);
  }
  return body === undefined ? pedido : pedido.send(body);
}

beforeEach(() => {
  jest.clearAllMocks();
  todosLosMocks.forEach((mock) => mock.mockResolvedValue({ ok: true }));
});

describe('sin token', () => {
  it.each(rutasProtegidas)('%s %s responde 401', async (metodo, ruta) => {
    const res = await pedir(metodo, ruta);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Token no proporcionado' });
  });
});

describe('token inválido', () => {
  it.each(autorizacionesInvalidas)(
    'un token %s responde 401 en todas las rutas protegidas',
    async (_motivo, autorizacion) => {
      for (const [metodo, ruta] of rutasProtegidas) {
        const res = await pedir(metodo, ruta, { autorizacion });

        expect({ ruta, estado: res.status }).toEqual({ ruta, estado: 401 });
      }
    }
  );
});

describe('rol incorrecto', () => {
  it.each(casosRolIncorrecto)('%s %s con el rol %s responde 403', async (metodo, ruta, rol) => {
    const res = await pedir(metodo, ruta, { autorizacion: conToken(rol) });

    expect(res.status).toBe(403);
    expect(todosLosMocks.some((mock) => mock.mock.calls.length > 0)).toBe(false);
  });
});

describe('con JWT válido y datos válidos', () => {
  it.each([
    ['get', '/api/prestadores/me', 'PRESTADOR', undefined, 200],
    ['put', '/api/prestadores/me', 'PRESTADOR', { zonaCobertura: 'Palermo' }, 200],
    ['put', '/api/prestadores/me/oficios', 'PRESTADOR', { oficioIds: ['o1'] }, 200],
    ['get', '/api/prestadores/me/calificaciones', 'PRESTADOR', undefined, 200],
    [
      'post',
      '/api/solicitudes',
      'CLIENTE',
      { prestadorId: 'p1', oficioId: 'o1', descripcion: 'Pérdida de agua' },
      201,
    ],
    ['get', '/api/solicitudes', 'CLIENTE', undefined, 200],
    ['get', '/api/solicitudes?estado=PENDIENTE', 'PRESTADOR', undefined, 200],
    ['patch', '/api/solicitudes/s1/aceptar', 'PRESTADOR', undefined, 200],
    ['patch', '/api/solicitudes/s1/rechazar', 'PRESTADOR', undefined, 200],
    ['patch', '/api/solicitudes/s1/finalizar', 'PRESTADOR', undefined, 200],
    ['patch', '/api/solicitudes/s1/cancelar', 'CLIENTE', undefined, 200],
  ])('%s %s como %s responde %i', async (metodo, ruta, rol, body, esperado) => {
    const res = await pedir(metodo, ruta, { autorizacion: conToken(rol), body });

    expect(res.status).toBe(esperado);
  });

  it('usa el id del token y no uno que venga en el pedido', async () => {
    await pedir('put', '/api/prestadores/me', {
      autorizacion: conToken('PRESTADOR', 'u7'),
      body: { zonaCobertura: 'Palermo', usuarioId: 'otro' },
    });

    expect(prestadoresService.actualizarMiPerfil).toHaveBeenCalledWith('u7', {
      zonaCobertura: 'Palermo',
    });
  });

  it('le pasa al servicio el usuario y el rol que vienen en el token', async () => {
    await pedir('get', '/api/solicitudes', { autorizacion: conToken('CLIENTE', 'u3') });

    expect(solicitudesService.listarMisSolicitudes).toHaveBeenCalledWith(
      { id: 'u3', rol: 'CLIENTE' },
      { estado: undefined }
    );
  });
});

describe('con JWT válido y datos inválidos', () => {
  it.each([
    ['put', '/api/prestadores/me', 'PRESTADOR', { latitud: 200 }],
    ['put', '/api/prestadores/me', 'PRESTADOR', {}],
    ['put', '/api/prestadores/me/oficios', 'PRESTADOR', { oficioIds: 'o1' }],
    ['post', '/api/solicitudes', 'CLIENTE', {}],
    ['post', '/api/solicitudes', 'CLIENTE', { prestadorId: 'p1', oficioId: 'o1' }],
    ['get', '/api/solicitudes?estado=pendiente', 'CLIENTE', undefined],
  ])('%s %s como %s con el cuerpo %j responde 400', async (metodo, ruta, rol, body) => {
    const res = await pedir(metodo, ruta, { autorizacion: conToken(rol), body });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
    expect(todosLosMocks.some((mock) => mock.mock.calls.length > 0)).toBe(false);
  });

  it('responde 400 si el cuerpo no es un JSON válido', async () => {
    const res = await request(app)
      .post('/api/solicitudes')
      .set('Authorization', conToken('CLIENTE'))
      .set('Content-Type', 'application/json')
      .send('{"descripcion": ');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: expect.stringContaining('JSON') });
  });
});

describe('rutas públicas', () => {
  it.each(['/health', '/api/prestadores', '/api/prestadores/mapa', '/api/prestadores/p1'])(
    'GET %s no pide token y responde 200',
    async (ruta) => {
      const res = await pedir('get', ruta);

      expect(res.status).toBe(200);
    }
  );

  it.each(['/api/prestadores?lat=-34.6', '/api/prestadores/mapa?oficioId=%20'])(
    'GET %s con filtros inválidos responde 400',
    async (ruta) => {
      const res = await pedir('get', ruta);

      expect(res.status).toBe(400);
    }
  );

  it('responde 404 en una ruta que no existe', async () => {
    const res = await pedir('get', '/api/no-existe');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Recurso no encontrado' });
  });
});

describe('errores de los servicios', () => {
  it.each([
    [403, 'La solicitud no es tuya'],
    [404, 'Solicitud no encontrada'],
    [409, 'Solo se puede responder una solicitud pendiente'],
  ])('traduce un error %i del servicio al código HTTP y a su mensaje', async (estado, mensaje) => {
    solicitudesService.aceptarSolicitud.mockRejectedValue(
      Object.assign(new Error(mensaje), { status: estado })
    );

    const res = await pedir('patch', '/api/solicitudes/s1/aceptar', {
      autorizacion: conToken('PRESTADOR'),
    });

    expect(res.status).toBe(estado);
    expect(res.body).toEqual({ error: mensaje });
  });

  it('responde 500 sin mostrar el detalle interno', async () => {
    const consola = jest.spyOn(console, 'error').mockImplementation(() => {});
    solicitudesService.aceptarSolicitud.mockRejectedValue(new Error('detalle interno de la base'));

    const res = await pedir('patch', '/api/solicitudes/s1/aceptar', {
      autorizacion: conToken('PRESTADOR'),
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Error interno del servidor' });
    consola.mockRestore();
  });
});