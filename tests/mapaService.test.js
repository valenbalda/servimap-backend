jest.mock('../src/config/prisma', () => ({
  prestador: { findMany: jest.fn() },
  calificacion: { groupBy: jest.fn() },
}));

const prisma = require('../src/config/prisma');
const mapaService = require('../src/services/mapaService');
const { caso } = require('./qase/qase');

function crearPrestador(id, nombre, extra = {}) {
  return {
    id,
    latitud: -34.6037,
    longitud: -58.3816,
    usuario: { nombre },
    oficios: [{ oficio: { nombre: 'Plomería' } }],
    ...extra,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('listarMarcadores', () => {
  it(caso('TC-MAPA-005', 'devuelve los marcadores con ubicación aproximada, oficio principal y promedio'), async () => {
    prisma.prestador.findMany.mockResolvedValue([
      crearPrestador('p1', 'Juan', { latitud: '-34.603722', longitud: '-58.381592' }),
    ]);
    prisma.calificacion.groupBy.mockResolvedValue([
      { prestadorId: 'p1', _avg: { puntaje: 4.46 } },
    ]);

    const marcadores = await mapaService.listarMarcadores();

    expect(marcadores).toEqual([
      {
        id: 'p1',
        nombre: 'Juan',
        latitud: -34.6,
        longitud: -58.38,
        oficioPrincipal: 'Plomería',
        promedio: 4.5,
      },
    ]);
  });

  it(caso('TC-MAPA-006', 'busca solo prestadores activos, disponibles y con coordenadas'), async () => {
    prisma.prestador.findMany.mockResolvedValue([]);

    await mapaService.listarMarcadores();

    expect(prisma.prestador.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          activo: true,
          disponible: true,
          usuario: { activo: true },
          latitud: { not: null },
          longitud: { not: null },
          oficios: { some: { oficio: { activo: true } } },
        }),
        take: 200,
      })
    );
  });

  it(caso('TC-MAPA-007', 'filtra por oficio cuando se pide'), async () => {
    prisma.prestador.findMany.mockResolvedValue([]);

    await mapaService.listarMarcadores({ oficioId: 'o1' });

    const { where } = prisma.prestador.findMany.mock.calls[0][0];
    expect(where.oficios).toEqual({ some: { oficioId: 'o1', oficio: { activo: true } } });
  });

  it(caso('TC-MAPA-008', 'devuelve promedio null si el prestador todavía no tiene calificaciones'), async () => {
    prisma.prestador.findMany.mockResolvedValue([crearPrestador('p1', 'Juan')]);
    prisma.calificacion.groupBy.mockResolvedValue([]);

    const [marcador] = await mapaService.listarMarcadores();

    expect(marcador.promedio).toBeNull();
  });

  it(caso('TC-MAPA-009', 'pide los promedios solo de los prestadores encontrados'), async () => {
    prisma.prestador.findMany.mockResolvedValue([
      crearPrestador('p1', 'Ana'),
      crearPrestador('p2', 'Beto'),
    ]);
    prisma.calificacion.groupBy.mockResolvedValue([]);

    await mapaService.listarMarcadores();

    expect(prisma.calificacion.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { prestadorId: { in: ['p1', 'p2'] } } })
    );
  });

  it(caso('TC-MAPA-010', 'devuelve una lista vacía sin consultar los promedios si no hay prestadores'), async () => {
    prisma.prestador.findMany.mockResolvedValue([]);

    const marcadores = await mapaService.listarMarcadores();

    expect(marcadores).toEqual([]);
    expect(prisma.calificacion.groupBy).not.toHaveBeenCalled();
  });
});