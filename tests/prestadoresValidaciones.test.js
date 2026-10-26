jest.mock('../src/services/prestadoresService', () => ({
  actualizarMiPerfil: jest.fn(),
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
  prestadoresService.actualizarMiPerfil.mockResolvedValue({ id: 'p1' });
  prestadoresService.listarPrestadores.mockResolvedValue([]);
});

describe('validaciones del perfil (RF-04)', () => {
  async function actualizarConBody(body) {
    const res = crearRes();

    await prestadoresController.actualizarMiPerfil({ usuario, body }, res, jest.fn());

    return res;
  }

  it.each(['', '   '])('responde 400 si la descripción profesional está vacía (%j)', async (valor) => {
    const res = await actualizarConBody({ descripcionProfesional: valor });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'La descripción profesional no puede quedar vacía',
    });
    expect(prestadoresService.actualizarMiPerfil).not.toHaveBeenCalled();
  });

  it.each([
    ['telefono', 'abc', 'El teléfono es inválido'],
    ['telefono', '123', 'El teléfono es inválido'],
    ['whatsapp', '11-22-ab', 'El WhatsApp es inválido'],
    ['whatsapp', '1'.repeat(30), 'El WhatsApp es inválido'],
  ])('responde 400 si %s es %j', async (campo, valor, mensaje) => {
    const res = await actualizarConBody({ [campo]: valor });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: mensaje });
    expect(prestadoresService.actualizarMiPerfil).not.toHaveBeenCalled();
  });

  it.each(['1122334455', '+54 11 2233-4455', '011 4444-5555'])(
    'acepta el teléfono %s',
    async (telefono) => {
      const res = await actualizarConBody({ telefono });

      expect(res.status).not.toHaveBeenCalledWith(400);
      expect(prestadoresService.actualizarMiPerfil).toHaveBeenCalledWith('u1', { telefono });
    }
  );

  it('acepta una descripción con texto y la guarda sin espacios sobrantes', async () => {
    await actualizarConBody({ descripcionProfesional: '  Plomero con experiencia  ' });

    expect(prestadoresService.actualizarMiPerfil).toHaveBeenCalledWith('u1', {
      descripcionProfesional: 'Plomero con experiencia',
    });
  });
});

describe('filtro por disponibilidad en el listado', () => {
  async function listarConQuery(query) {
    const res = crearRes();

    await prestadoresController.listar({ query }, res, jest.fn());

    return res;
  }

  it.each(['si', '1', 'TRUE', ''])('responde 400 con disponible=%j', async (disponible) => {
    const res = await listarConQuery({ disponible });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'disponible debe ser true o false' });
    expect(prestadoresService.listarPrestadores).not.toHaveBeenCalled();
  });

  it.each([
    ['true', true],
    ['false', false],
  ])('pasa disponible=%s como %s', async (texto, valor) => {
    await listarConQuery({ disponible: texto });

    expect(prestadoresService.listarPrestadores).toHaveBeenCalledWith({ disponible: valor });
  });

  it('sin el parámetro, no manda ningún filtro de disponibilidad', async () => {
    await listarConQuery({});

    expect(prestadoresService.listarPrestadores).toHaveBeenCalledWith({});
  });
});