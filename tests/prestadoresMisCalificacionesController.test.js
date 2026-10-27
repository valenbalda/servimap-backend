jest.mock('../src/services/prestadoresService', () => ({
  listarMisCalificaciones: jest.fn(),
}));

const prestadoresService = require('../src/services/prestadoresService');
const prestadoresController = require('../src/controllers/prestadoresController');

function crearRes() {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const usuario = { id: 'u1' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('misCalificaciones', () => {
  it('devuelve las calificaciones del prestador autenticado', async () => {
    prestadoresService.listarMisCalificaciones.mockResolvedValue([{ id: 'k1' }]);
    const res = crearRes();

    await prestadoresController.misCalificaciones({ usuario }, res, jest.fn());

    expect(prestadoresService.listarMisCalificaciones).toHaveBeenCalledWith('u1');
    expect(res.json).toHaveBeenCalledWith([{ id: 'k1' }]);
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Perfil de prestador no encontrado');
    prestadoresService.listarMisCalificaciones.mockRejectedValue(error);
    const next = jest.fn();

    await prestadoresController.misCalificaciones({ usuario }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});