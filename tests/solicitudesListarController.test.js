jest.mock('../src/services/solicitudesService', () => ({
  listarMisSolicitudes: jest.fn(),
}));

const solicitudesService = require('../src/services/solicitudesService');
const solicitudesController = require('../src/controllers/solicitudesController');
const { caso } = require('./qase/qase');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const usuario = { id: 'u1', rol: 'CLIENTE' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('listar', () => {
  it.each(['pendiente', 'CUALQUIERA', '', 'ACEPTADA,RECHAZADA'])(
    caso('TC-SOL-013', 'responde 400 con el estado inválido "%s"'),
    async (estado) => {
      const res = crearRes();

      await solicitudesController.listar({ usuario, query: { estado } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El estado es inválido' });
      expect(solicitudesService.listarMisSolicitudes).not.toHaveBeenCalled();
    }
  );

  it(caso('TC-SOL-014', 'sin filtro, delega en el servicio con el usuario del token'), async () => {
    solicitudesService.listarMisSolicitudes.mockResolvedValue([{ id: 's1' }]);
    const res = crearRes();

    await solicitudesController.listar({ usuario, query: {} }, res, jest.fn());

    expect(solicitudesService.listarMisSolicitudes).toHaveBeenCalledWith(usuario, {
      estado: undefined,
    });
    expect(res.json).toHaveBeenCalledWith([{ id: 's1' }]);
  });

  it.each(['PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'FINALIZADA'])(
    caso('TC-SOL-015', 'acepta el estado %s y se lo pasa al servicio'),
    async (estado) => {
      solicitudesService.listarMisSolicitudes.mockResolvedValue([]);
      const res = crearRes();

      await solicitudesController.listar({ usuario, query: { estado } }, res, jest.fn());

      expect(solicitudesService.listarMisSolicitudes).toHaveBeenCalledWith(usuario, { estado });
      expect(res.status).not.toHaveBeenCalledWith(400);
    }
  );

  it(caso('TC-SOL-016', 'pasa el error del servicio al manejador de errores'), async () => {
    const error = new Error('Perfil de prestador no encontrado');
    solicitudesService.listarMisSolicitudes.mockRejectedValue(error);
    const next = jest.fn();

    await solicitudesController.listar({ usuario, query: {} }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});