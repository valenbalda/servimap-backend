jest.mock('../src/services/fotosService', () => ({
  subirFoto: jest.fn(),
  eliminarFoto: jest.fn(),
}));

const fotosService = require('../src/services/fotosService');
const fotosController = require('../src/controllers/fotosController');
const { caso } = require('./qase/qase');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

// Los primeros bytes de cada formato (su "firma"), seguidos de relleno.
const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(8)]);
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(8)]);
const WEBP = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP'), Buffer.alloc(4)]);

function crearReq(tipo, body) {
  return {
    headers: tipo ? { 'content-type': tipo } : {},
    body,
    usuario: { id: 'u1', rol: 'CLIENTE' },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('subir', () => {
  it.each([
    ['sin Content-Type', undefined, PNG],
    ['con un tipo que no es imagen', 'application/json', PNG],
    ['con un formato no permitido (gif)', 'image/gif', PNG],
    ['sin cuerpo', 'image/png', undefined],
    ['con el cuerpo vacío', 'image/png', Buffer.alloc(0)],
    ['con un cuerpo que no es una imagen cruda', 'image/png', { foto: 'x' }],
  ])(caso('TC-FOT-001', 'responde 400 %s'), async (_, tipo, body) => {
    const res = crearRes();

    await fotosController.subir(crearReq(tipo, body), res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Enviá la imagen como JPG, PNG o WebP en el cuerpo del pedido',
    });
    expect(fotosService.subirFoto).not.toHaveBeenCalled();
  });

  it.each([
    ['un texto que dice ser PNG', 'image/png', Buffer.from('esto no es una imagen')],
    ['un PNG que dice ser JPG', 'image/jpeg', PNG],
    ['un JPG que dice ser WebP', 'image/webp', JPEG],
    ['un archivo RIFF que no es WebP', 'image/webp', Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WAVE')])],
  ])(caso('TC-FOT-002', 'responde 400 con %s'), async (_, tipo, body) => {
    const res = crearRes();

    await fotosController.subir(crearReq(tipo, body), res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El archivo no es una imagen válida o no coincide con su tipo',
    });
    expect(fotosService.subirFoto).not.toHaveBeenCalled();
  });

  it.each([
    ['image/png', PNG],
    ['image/jpeg', JPEG],
    ['image/webp', WEBP],
  ])(caso('TC-FOT-003', 'acepta una imagen %s y usa el usuario del token'), async (tipo, body) => {
    const res = crearRes();
    fotosService.subirFoto.mockResolvedValue({ fotoPerfil: 'https://x/foto' });

    await fotosController.subir(crearReq(`${tipo}; charset=binary`, body), res, jest.fn());

    expect(fotosService.subirFoto).toHaveBeenCalledWith('u1', 'CLIENTE', { buffer: body, tipo });
    expect(res.json).toHaveBeenCalledWith({ fotoPerfil: 'https://x/foto' });
  });

  it(caso('TC-FOT-004', 'pasa el error del servicio al manejador de errores'), async () => {
    const error = new Error('falló');
    fotosService.subirFoto.mockRejectedValue(error);
    const next = jest.fn();

    await fotosController.subir(crearReq('image/png', PNG), crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('eliminar', () => {
  it(caso('TC-FOT-005', 'elimina la foto del usuario del token'), async () => {
    const res = crearRes();
    fotosService.eliminarFoto.mockResolvedValue({ fotoPerfil: null });

    await fotosController.eliminar({ usuario: { id: 'u1', rol: 'PRESTADOR' } }, res, jest.fn());

    expect(fotosService.eliminarFoto).toHaveBeenCalledWith('u1', 'PRESTADOR');
    expect(res.json).toHaveBeenCalledWith({ fotoPerfil: null });
  });

  it(caso('TC-FOT-006', 'pasa el error del servicio al manejador de errores'), async () => {
    const error = new Error('falló');
    fotosService.eliminarFoto.mockRejectedValue(error);
    const next = jest.fn();

    await fotosController.eliminar({ usuario: { id: 'u1', rol: 'CLIENTE' } }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});