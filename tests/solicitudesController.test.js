jest.mock('../src/services/solicitudesService', () => ({
  crearSolicitud: jest.fn(),
  aceptarSolicitud: jest.fn(),
  rechazarSolicitud: jest.fn(),
  cancelarSolicitud: jest.fn(),
}));

const solicitudesService = require('../src/services/solicitudesService');
const solicitudesController = require('../src/controllers/solicitudesController');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const usuario = { id: 'u1' };

const bodyValido = {
  prestadorId: 'p1',
  oficioId: 'o1',
  descripcion: 'Pérdida de agua en la cocina',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('crear', () => {
  async function crearConBody(body) {
    const res = crearRes();
    const next = jest.fn();

    await solicitudesController.crear({ usuario, body }, res, next);

    return { res, next };
  }

  it.each([undefined, '   ', 5])(
    'responde 400 si el prestadorId es %p',
    async (prestadorId) => {
      const { res } = await crearConBody({ ...bodyValido, prestadorId });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El prestadorId es obligatorio' });
      expect(solicitudesService.crearSolicitud).not.toHaveBeenCalled();
    }
  );

  it.each([undefined, '   ', 5])(
    'responde 400 si el oficioId es %p',
    async (oficioId) => {
      const { res } = await crearConBody({ ...bodyValido, oficioId });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El oficioId es obligatorio' });
      expect(solicitudesService.crearSolicitud).not.toHaveBeenCalled();
    }
  );

  it.each([undefined, '   ', 5])(
    'responde 400 si la descripción es %p',
    async (descripcion) => {
      const { res } = await crearConBody({ ...bodyValido, descripcion });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'La descripción es obligatoria' });
      expect(solicitudesService.crearSolicitud).not.toHaveBeenCalled();
    }
  );

  it('responde 400 si la descripción supera los 1000 caracteres', async () => {
    const { res } = await crearConBody({
      ...bodyValido,
      descripcion: 'a'.repeat(1001),
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'La descripción no puede superar los 1000 caracteres',
    });
    expect(solicitudesService.crearSolicitud).not.toHaveBeenCalled();
  });

  it('responde 400 si la dirección no es texto', async () => {
    const { res } = await crearConBody({ ...bodyValido, direccion: 5 });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'La dirección debe ser texto' });
    expect(solicitudesService.crearSolicitud).not.toHaveBeenCalled();
  });

  it('responde 400 si el contacto preferido no es texto', async () => {
    const { res } = await crearConBody({ ...bodyValido, contactoPreferido: 5 });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El contacto preferido debe ser texto',
    });
    expect(solicitudesService.crearSolicitud).not.toHaveBeenCalled();
  });

  it('responde 400 si el pedido no trae body', async () => {
    const { res } = await crearConBody(undefined);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(solicitudesService.crearSolicitud).not.toHaveBeenCalled();
  });

  it('crea la solicitud con los datos limpios y responde 201', async () => {
    solicitudesService.crearSolicitud.mockResolvedValue({ id: 's1' });

    const { res } = await crearConBody({
      prestadorId: ' p1 ',
      oficioId: ' o1 ',
      descripcion: ' Pérdida de agua ',
      direccion: ' Calle 123 ',
      contactoPreferido: ' WhatsApp ',
    });

    expect(solicitudesService.crearSolicitud).toHaveBeenCalledWith('u1', {
      prestadorId: 'p1',
      oficioId: 'o1',
      descripcion: 'Pérdida de agua',
      direccion: 'Calle 123',
      contactoPreferido: 'WhatsApp',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 's1' });
  });

  it('permite crear la solicitud sin dirección ni contacto preferido', async () => {
    solicitudesService.crearSolicitud.mockResolvedValue({ id: 's1' });

    await crearConBody(bodyValido);

    expect(solicitudesService.crearSolicitud).toHaveBeenCalledWith('u1', {
      prestadorId: 'p1',
      oficioId: 'o1',
      descripcion: 'Pérdida de agua en la cocina',
      direccion: undefined,
      contactoPreferido: undefined,
    });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('El prestador no existe');
    solicitudesService.crearSolicitud.mockRejectedValue(error);

    const { next } = await crearConBody(bodyValido);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe.each([
  ['aceptar', 'aceptarSolicitud'],
  ['rechazar', 'rechazarSolicitud'],
  ['cancelar', 'cancelarSolicitud'],
])('%s', (accion, metodoServicio) => {
  it('delega en el servicio con el usuario y la solicitud', async () => {
    solicitudesService[metodoServicio].mockResolvedValue({ id: 's1' });
    const res = crearRes();

    await solicitudesController[accion](
      { usuario, params: { id: 's1' } },
      res,
      jest.fn()
    );

    expect(solicitudesService[metodoServicio]).toHaveBeenCalledWith('u1', 's1');
    expect(res.json).toHaveBeenCalledWith({ id: 's1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('La solicitud no es tuya');
    solicitudesService[metodoServicio].mockRejectedValue(error);
    const next = jest.fn();

    await solicitudesController[accion](
      { usuario, params: { id: 's1' } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});