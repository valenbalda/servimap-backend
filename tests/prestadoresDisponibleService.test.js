jest.mock('../src/config/prisma', () => ({
  prestador: { findMany: jest.fn() },
}));

jest.mock('../src/services/calificacionesService', () => ({
  obtenerReputacion: jest.fn(),
}));

const prisma = require('../src/config/prisma');
const prestadoresService = require('../src/services/prestadoresService');
const { caso } = require('./qase/qase');

beforeEach(() => {
  jest.clearAllMocks();
  prisma.prestador.findMany.mockResolvedValue([]);
});

describe('listarPrestadores y la disponibilidad', () => {
  it(caso('TC-PRE-040', 'no filtra por disponibilidad si no se pide'), async () => {
    await prestadoresService.listarPrestadores();

    const { where } = prisma.prestador.findMany.mock.calls[0][0];
    expect(where).not.toHaveProperty('disponible');
  });

  it.each([true, false])(caso('TC-PRE-041', 'filtra por disponible=%s cuando se pide'), async (disponible) => {
    await prestadoresService.listarPrestadores({ disponible });

    const { where } = prisma.prestador.findMany.mock.calls[0][0];
    expect(where.disponible).toBe(disponible);
  });
});