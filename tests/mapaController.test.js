jest.mock('../src/services/mapaService', () => ({
  listarMarcadores: jest.fn(),
}));

const mapaService = require('../src/services/mapaService');
const mapaController = require('../src/controllers/mapaController');

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
  it.each(['', '   ', ['o1', 'o2']])(
    'responde 400 con el oficioId %j',
    async (oficioId) => {
      const res = crearRes();

      await mapaController.listar({ query: { oficioId } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El oficioId es inválido' });
      expect(mapaService.listarMarcadores).not.toHaveBeenCalled();
    }
  );

  it('sin filtro, pide todos los marcadores y devuelve el resultado', async () => {
    mapaService.listarMarcadores.mockResolvedValue([{ id: 'p1' }]);
    const res = crearRes();

    await mapaController.listar({ query: {} }, res, jest.fn());

    expect(mapaService.listarMarcadores).toHaveBeenCalledWith({ oficioId: undefined });
    expect(res.json).toHaveBeenCalledWith([{ id: 'p1' }]);
  });

  it('pasa el oficioId sin espacios', async () => {
    mapaService.listarMarcadores.mockResolvedValue([]);

    await mapaController.listar({ query: { oficioId: ' o1 ' } }, crearRes(), jest.fn());

    expect(mapaService.listarMarcadores).toHaveBeenCalledWith({ oficioId: 'o1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Falló la consulta');
    mapaService.listarMarcadores.mockRejectedValue(error);
    const next = jest.fn();

    await mapaController.listar({ query: {} }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});