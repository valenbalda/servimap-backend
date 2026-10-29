jest.mock('../src/config/env', () => ({
  JWT_SECRET: 'clave-de-prueba-solo-para-los-tests-0123456789',
}));

const jwt = require('jsonwebtoken');
const { autenticar } = require('../src/middlewares/authMiddleware');
const { autorizar } = require('../src/middlewares/rolesMiddleware');
const { notFound, errorHandler } = require('../src/middlewares/errorHandler');
const { caso } = require('./qase/qase');

const SECRET = 'clave-de-prueba-solo-para-los-tests-0123456789';

function crearRes() {
  const res = { headersSent: false };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('autenticar', () => {
  it(caso('TC-SEG-001', 'responde 401 si no hay header de autorización'), () => {
    const res = crearRes();
    const next = jest.fn();

    autenticar({ headers: {} }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token no proporcionado' });
    expect(next).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-002', 'responde 401 si el tipo no es Bearer'), () => {
    const res = crearRes();
    const next = jest.fn();

    autenticar({ headers: { authorization: 'Basic abc123' } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token no proporcionado' });
    expect(next).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-003', 'responde 401 si el header es Bearer pero no trae token'), () => {
    const res = crearRes();
    const next = jest.fn();

    autenticar({ headers: { authorization: 'Bearer' } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-004', 'responde 401 si el token no es válido'), () => {
    const res = crearRes();
    const next = jest.fn();

    autenticar({ headers: { authorization: 'Bearer token-roto' } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o vencido' });
    expect(next).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-005', 'responde 401 si el token está firmado con otra clave'), () => {
    const token = jwt.sign({ sub: 'u1', rol: 'CLIENTE' }, 'otra-clave-distinta');
    const res = crearRes();
    const next = jest.fn();

    autenticar({ headers: { authorization: `Bearer ${token}` } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-006', 'responde 401 si el token está vencido'), () => {
    const token = jwt.sign({ sub: 'u1', rol: 'CLIENTE' }, SECRET, {
      expiresIn: -10,
    });
    const res = crearRes();
    const next = jest.fn();

    autenticar({ headers: { authorization: `Bearer ${token}` } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o vencido' });
    expect(next).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-007', 'responde 401 si el token usa un algoritmo distinto de HS256'), () => {
    const token = jwt.sign({ sub: 'u1', rol: 'CLIENTE' }, SECRET, {
      algorithm: 'HS512',
    });
    const res = crearRes();
    const next = jest.fn();

    autenticar({ headers: { authorization: `Bearer ${token}` } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-008', 'carga el usuario en la request y sigue si el token es válido'), () => {
    const token = jwt.sign({ sub: 'u1', rol: 'CLIENTE' }, SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = crearRes();
    const next = jest.fn();

    autenticar(req, res, next);

    expect(req.usuario).toEqual({ id: 'u1', rol: 'CLIENTE' });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('autorizar', () => {
  it(caso('TC-SEG-009', 'responde 401 si no hay usuario autenticado'), () => {
    const res = crearRes();
    const next = jest.fn();

    autorizar('CLIENTE')({}, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No autenticado' });
    expect(next).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-010', 'responde 403 si el rol no está permitido'), () => {
    const res = crearRes();
    const next = jest.fn();

    autorizar('ADMINISTRADOR')({ usuario: { rol: 'CLIENTE' } }, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No tenés permisos para realizar esta acción',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-011', 'sigue si el rol está permitido'), () => {
    const res = crearRes();
    const next = jest.fn();

    autorizar('CLIENTE')({ usuario: { rol: 'CLIENTE' } }, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it(caso('TC-SEG-012', 'acepta cualquiera de varios roles permitidos'), () => {
    const res = crearRes();
    const next = jest.fn();

    autorizar('CLIENTE', 'PRESTADOR')({ usuario: { rol: 'PRESTADOR' } }, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('notFound', () => {
  it(caso('TC-SIS-002', 'responde 404 con un mensaje claro'), () => {
    const res = crearRes();

    notFound({}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Recurso no encontrado' });
  });
});

describe('errorHandler', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it(caso('TC-SIS-003', 'le deja el error a Express si la respuesta ya empezó a enviarse'), () => {
    const res = crearRes();
    res.headersSent = true;
    const next = jest.fn();
    const error = new Error('falla');

    errorHandler(error, {}, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });

  it.each([
    ['JSON mal escrito', { type: 'entity.parse.failed' }, 400, 'El cuerpo del pedido no es un JSON válido'],
    ['pedido demasiado grande', { type: 'entity.too.large' }, 413, 'El pedido es demasiado grande'],
    ['registro duplicado de Prisma', { code: 'P2002' }, 409, 'Ya existe un registro con esos datos'],
    ['registro inexistente de Prisma', { code: 'P2025' }, 404, 'Recurso no encontrado'],
    ['referencia inválida de Prisma', { code: 'P2003' }, 409, 'La operación hace referencia a un registro que no existe'],
  ])(caso('TC-SIS-004', 'traduce el error: %s'), (_descripcion, error, status, mensaje) => {
    const res = crearRes();

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({ error: mensaje });
  });

  it(caso('TC-SIS-005', 'usa el status y el mensaje de un error conocido del negocio'), () => {
    const res = crearRes();
    const error = new Error('Solo podés calificar tus propias solicitudes');
    error.status = 403;

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Solo podés calificar tus propias solicitudes',
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it(caso('TC-SIS-006', 'oculta el detalle de un error inesperado y lo registra en consola'), () => {
    const res = crearRes();
    const error = new Error('detalle interno secreto');

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    expect(consoleError).toHaveBeenCalledWith(error);
  });
});