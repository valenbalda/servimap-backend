jest.mock('../src/services/prestadoresService', () => ({
  obtenerDetallePrestador: jest.fn(),
}));

const prestadoresService = require('../src/services/prestadoresService');
const prestadoresController = require('../src/controllers/prestadoresController');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('detalle', () => {
  it('delega en el servicio con el id de la dirección y devuelve la ficha', async () => {
    prestadoresService.obtenerDetallePrestador.mockResolvedValue({ id: 'p1' });
    const res = crearRes();

    await prestadoresController.detalle({ params: { id: 'p1' } }, res, jest.fn());

    expect(prestadoresService.obtenerDetallePrestador).toHaveBeenCalledWith('p1');
    expect(res.json).toHaveBeenCalledWith({ id: 'p1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Prestador no encontrado');
    prestadoresService.obtenerDetallePrestador.mockRejectedValue(error);
    const next = jest.fn();

    await prestadoresController.detalle({ params: { id: 'p9' } }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});