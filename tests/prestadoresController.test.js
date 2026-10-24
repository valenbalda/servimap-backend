jest.mock('../src/services/prestadoresService', () => ({
  obtenerMiPerfil: jest.fn(),
  actualizarMiPerfil: jest.fn(),
  asignarMisOficios: jest.fn(),
  listarPrestadores: jest.fn(),
}));

const prestadoresService = require('../src/services/prestadoresService');
const prestadoresController = require('../src/controllers/prestadoresController');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const usuario = { id: 'u1' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('obtenerMiPerfil', () => {
  it('devuelve el perfil del prestador autenticado', async () => {
    prestadoresService.obtenerMiPerfil.mockResolvedValue({ id: 'p1' });
    const res = crearRes();

    await prestadoresController.obtenerMiPerfil({ usuario }, res, jest.fn());

    expect(prestadoresService.obtenerMiPerfil).toHaveBeenCalledWith('u1');
    expect(res.json).toHaveBeenCalledWith({ id: 'p1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Perfil de prestador no encontrado');
    prestadoresService.obtenerMiPerfil.mockRejectedValue(error);
    const next = jest.fn();

    await prestadoresController.obtenerMiPerfil({ usuario }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('actualizarMiPerfil', () => {
  async function actualizarConBody(body) {
    const res = crearRes();
    const next = jest.fn();

    await prestadoresController.actualizarMiPerfil({ usuario, body }, res, next);

    return { res, next };
  }

  it.each([
    'descripcionProfesional',
    'fotoPerfil',
    'zonaCobertura',
    'telefono',
    'whatsapp',
    'emailContacto',
  ])('responde 400 si %s no es texto', async (campo) => {
    const { res } = await actualizarConBody({ [campo]: 5 });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: `El campo ${campo} debe ser texto` });
    expect(prestadoresService.actualizarMiPerfil).not.toHaveBeenCalled();
  });

  it('responde 400 si el email de contacto no tiene arroba', async () => {
    const { res } = await actualizarConBody({ emailContacto: 'sin-arroba' });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'El email de contacto es inválido' });
    expect(prestadoresService.actualizarMiPerfil).not.toHaveBeenCalled();
  });

  it.each([
    [{ latitud: 91 }, 'La latitud debe ser un número entre -90 y 90'],
    [{ latitud: '5' }, 'La latitud debe ser un número entre -90 y 90'],
    [{ longitud: -181 }, 'La longitud debe ser un número entre -180 y 180'],
    [{ longitud: 'x' }, 'La longitud debe ser un número entre -180 y 180'],
    [{ precioMin: -1 }, 'El precio mínimo debe ser un número mayor o igual a 0'],
    [{ precioMin: '5' }, 'El precio mínimo debe ser un número mayor o igual a 0'],
    [{ precioMax: -1 }, 'El precio máximo debe ser un número mayor o igual a 0'],
    [{ precioMax: '5' }, 'El precio máximo debe ser un número mayor o igual a 0'],
    [{ disponible: 'si' }, 'El campo disponible debe ser true o false'],
  ])('responde 400 con los datos %j', async (body, mensaje) => {
    const { res } = await actualizarConBody(body);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: mensaje });
    expect(prestadoresService.actualizarMiPerfil).not.toHaveBeenCalled();
  });

  it.each([undefined, {}])(
    'responde 400 si no hay datos para actualizar (%p)',
    async (body) => {
      const { res } = await actualizarConBody(body);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No hay datos para actualizar' });
      expect(prestadoresService.actualizarMiPerfil).not.toHaveBeenCalled();
    }
  );

  it('actualiza con los datos limpios e ignora los campos que no se pueden editar', async () => {
    prestadoresService.actualizarMiPerfil.mockResolvedValue({ id: 'p1' });

    const { res } = await actualizarConBody({
      zonaCobertura: ' Palermo ',
      precioMin: 100,
      disponible: true,
      activo: false,
    });

    expect(prestadoresService.actualizarMiPerfil).toHaveBeenCalledWith('u1', {
      zonaCobertura: 'Palermo',
      precioMin: 100,
      disponible: true,
    });
    expect(res.json).toHaveBeenCalledWith({ id: 'p1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('El precio mínimo no puede ser mayor al máximo');
    prestadoresService.actualizarMiPerfil.mockRejectedValue(error);

    const { next } = await actualizarConBody({ precioMin: 5 });

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('asignarMisOficios', () => {
  async function asignarConBody(body) {
    const res = crearRes();
    const next = jest.fn();

    await prestadoresController.asignarMisOficios({ usuario, body }, res, next);

    return { res, next };
  }

  it.each([
    [undefined],
    [{}],
    [{ oficioIds: 'o1' }],
    [{ oficioIds: [5] }],
    [{ oficioIds: ['   '] }],
  ])('responde 400 con el cuerpo %j', async (body) => {
    const { res } = await asignarConBody(body);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'oficioIds debe ser una lista de identificadores de oficios',
    });
    expect(prestadoresService.asignarMisOficios).not.toHaveBeenCalled();
  });

  it('asigna los oficios con los identificadores limpios', async () => {
    prestadoresService.asignarMisOficios.mockResolvedValue({ id: 'p1' });

    const { res } = await asignarConBody({ oficioIds: [' o1 ', 'o2'] });

    expect(prestadoresService.asignarMisOficios).toHaveBeenCalledWith('u1', ['o1', 'o2']);
    expect(res.json).toHaveBeenCalledWith({ id: 'p1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Algún oficio no existe o está desactivado');
    prestadoresService.asignarMisOficios.mockRejectedValue(error);

    const { next } = await asignarConBody({ oficioIds: ['o1'] });

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('listar', () => {
  async function listarConQuery(query) {
    const res = crearRes();
    const next = jest.fn();

    await prestadoresController.listar({ query }, res, next);

    return { res, next };
  }

  it.each([
    [{ oficioId: '   ' }, 'El oficioId es inválido'],
    [{ q: '   ' }, 'La búsqueda es inválida (máximo 100 caracteres)'],
    [{ q: 'a'.repeat(101) }, 'La búsqueda es inválida (máximo 100 caracteres)'],
    [{ lat: '-34.6' }, 'lat y lng se envían juntas'],
    [{ lng: '-58.4' }, 'lat y lng se envían juntas'],
    [{ lat: '100', lng: '-58.4' }, 'La latitud debe ser un número entre -90 y 90'],
    [{ lat: 'abc', lng: '-58.4' }, 'La latitud debe ser un número entre -90 y 90'],
    [{ lat: '-34.6', lng: '200' }, 'La longitud debe ser un número entre -180 y 180'],
    [{ radioKm: '5' }, 'radioKm necesita lat y lng'],
    [{ lat: '-34.6', lng: '-58.4', radioKm: '0' }, 'radioKm debe ser un número entre 0 y 100'],
    [{ lat: '-34.6', lng: '-58.4', radioKm: '101' }, 'radioKm debe ser un número entre 0 y 100'],
    [{ calificacionMin: '0' }, 'calificacionMin debe ser un número entre 1 y 5'],
    [{ calificacionMin: '6' }, 'calificacionMin debe ser un número entre 1 y 5'],
    [{ limit: '0' }, 'limit debe ser un entero entre 1 y 50'],
    [{ limit: '51' }, 'limit debe ser un entero entre 1 y 50'],
    [{ limit: '2.5' }, 'limit debe ser un entero entre 1 y 50'],
    [{ limit: 'abc' }, 'limit debe ser un entero entre 1 y 50'],
  ])('responde 400 con la consulta %j', async (query, mensaje) => {
    const { res } = await listarConQuery(query);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: mensaje });
    expect(prestadoresService.listarPrestadores).not.toHaveBeenCalled();
  });

  it('sin filtros, busca con la consulta vacía y devuelve el resultado', async () => {
    prestadoresService.listarPrestadores.mockResolvedValue([{ id: 'p1' }]);

    const { res } = await listarConQuery({});

    expect(prestadoresService.listarPrestadores).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith([{ id: 'p1' }]);
  });

  it('pasa los filtros ya convertidos a número y sin espacios', async () => {
    prestadoresService.listarPrestadores.mockResolvedValue([]);

    await listarConQuery({
      oficioId: ' o1 ',
      q: ' plom ',
      lat: '-34.6',
      lng: '-58.4',
      radioKm: '5',
      calificacionMin: '4',
      limit: '10',
    });

    expect(prestadoresService.listarPrestadores).toHaveBeenCalledWith({
      oficioId: 'o1',
      q: 'plom',
      lat: -34.6,
      lng: -58.4,
      radioKm: 5,
      calificacionMin: 4,
      limit: 10,
    });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Falló la consulta');
    prestadoresService.listarPrestadores.mockRejectedValue(error);

    const { next } = await listarConQuery({});

    expect(next).toHaveBeenCalledWith(error);
  });
});