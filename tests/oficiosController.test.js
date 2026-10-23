jest.mock('../src/services/oficiosService', () => ({
  listarOficios: jest.fn(),
  crearOficio: jest.fn(),
  actualizarOficio: jest.fn(),
  cambiarEstadoOficio: jest.fn(),
}));

const oficiosService = require('../src/services/oficiosService');
const oficiosController = require('../src/controllers/oficiosController');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('listar', () => {
  it('devuelve los oficios activos', async () => {
    oficiosService.listarOficios.mockResolvedValue([{ id: 'o1' }]);
    const res = crearRes();

    await oficiosController.listar({}, res, jest.fn());

    expect(oficiosService.listarOficios).toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith([{ id: 'o1' }]);
  });

  it('pasa el error al manejador de errores', async () => {
    const error = new Error('falla');
    oficiosService.listarOficios.mockRejectedValue(error);
    const next = jest.fn();

    await oficiosController.listar({}, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('listarTodos', () => {
  it('devuelve también los oficios inactivos', async () => {
    oficiosService.listarOficios.mockResolvedValue([{ id: 'o1' }, { id: 'o2' }]);
    const res = crearRes();

    await oficiosController.listarTodos({}, res, jest.fn());

    expect(oficiosService.listarOficios).toHaveBeenCalledWith({
      incluirInactivos: true,
    });
    expect(res.json).toHaveBeenCalledWith([{ id: 'o1' }, { id: 'o2' }]);
  });

  it('pasa el error al manejador de errores', async () => {
    const error = new Error('falla');
    oficiosService.listarOficios.mockRejectedValue(error);
    const next = jest.fn();

    await oficiosController.listarTodos({}, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('crear', () => {
  it.each([undefined, '   ', 123])(
    'responde 400 si el nombre es %p',
    async (nombre) => {
      const res = crearRes();

      await oficiosController.crear({ body: { nombre } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El nombre es obligatorio' });
      expect(oficiosService.crearOficio).not.toHaveBeenCalled();
    }
  );

  it('responde 400 si la categoría no es texto', async () => {
    const res = crearRes();

    await oficiosController.crear(
      { body: { nombre: 'Gas', categoria: 5 } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'La categoría es inválida' });
  });

  it('crea el oficio con los datos limpios y responde 201', async () => {
    oficiosService.crearOficio.mockResolvedValue({ id: 'o1' });
    const res = crearRes();

    await oficiosController.crear(
      { body: { nombre: ' Gas ', categoria: ' Hogar ' } },
      res,
      jest.fn()
    );

    expect(oficiosService.crearOficio).toHaveBeenCalledWith({
      nombre: 'Gas',
      categoria: 'Hogar',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 'o1' });
  });

  it('permite crear un oficio sin categoría', async () => {
    oficiosService.crearOficio.mockResolvedValue({ id: 'o1' });

    await oficiosController.crear(
      { body: { nombre: 'Gas' } },
      crearRes(),
      jest.fn()
    );

    expect(oficiosService.crearOficio).toHaveBeenCalledWith({
      nombre: 'Gas',
      categoria: undefined,
    });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Ya existe un oficio con ese nombre');
    oficiosService.crearOficio.mockRejectedValue(error);
    const next = jest.fn();

    await oficiosController.crear({ body: { nombre: 'Gas' } }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('actualizar', () => {
  it.each(['', '   ', 123])('responde 400 si el nombre es %p', async (nombre) => {
    const res = crearRes();

    await oficiosController.actualizar(
      { params: { id: 'o1' }, body: { nombre } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'El nombre es inválido' });
    expect(oficiosService.actualizarOficio).not.toHaveBeenCalled();
  });

  it('responde 400 si la categoría no es texto', async () => {
    const res = crearRes();

    await oficiosController.actualizar(
      { params: { id: 'o1' }, body: { categoria: 5 } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'La categoría es inválida' });
  });

  it('responde 400 si no hay nada para actualizar', async () => {
    const res = crearRes();

    await oficiosController.actualizar(
      { params: { id: 'o1' }, body: {} },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'No hay datos para actualizar' });
  });

  it('actualiza con los datos limpios y devuelve el oficio', async () => {
    oficiosService.actualizarOficio.mockResolvedValue({ id: 'o1' });
    const res = crearRes();

    await oficiosController.actualizar(
      { params: { id: 'o1' }, body: { nombre: ' Gas ', categoria: ' Hogar ' } },
      res,
      jest.fn()
    );

    expect(oficiosService.actualizarOficio).toHaveBeenCalledWith('o1', {
      nombre: 'Gas',
      categoria: 'Hogar',
    });
    expect(res.json).toHaveBeenCalledWith({ id: 'o1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Oficio no encontrado');
    oficiosService.actualizarOficio.mockRejectedValue(error);
    const next = jest.fn();

    await oficiosController.actualizar(
      { params: { id: 'o1' }, body: { nombre: 'Gas' } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('cambiarEstado', () => {
  it.each(['true', 1, undefined])(
    'responde 400 si activo es %p',
    async (activo) => {
      const res = crearRes();

      await oficiosController.cambiarEstado(
        { params: { id: 'o1' }, body: { activo } },
        res,
        jest.fn()
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'El campo activo debe ser true o false',
      });
      expect(oficiosService.cambiarEstadoOficio).not.toHaveBeenCalled();
    }
  );

  it('cambia el estado y devuelve el oficio', async () => {
    oficiosService.cambiarEstadoOficio.mockResolvedValue({ id: 'o1', activo: false });
    const res = crearRes();

    await oficiosController.cambiarEstado(
      { params: { id: 'o1' }, body: { activo: false } },
      res,
      jest.fn()
    );

    expect(oficiosService.cambiarEstadoOficio).toHaveBeenCalledWith('o1', false);
    expect(res.json).toHaveBeenCalledWith({ id: 'o1', activo: false });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Oficio no encontrado');
    oficiosService.cambiarEstadoOficio.mockRejectedValue(error);
    const next = jest.fn();

    await oficiosController.cambiarEstado(
      { params: { id: 'o1' }, body: { activo: true } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});