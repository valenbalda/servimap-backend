jest.mock('../src/config/prisma', () => ({
  prestador: { findUnique: jest.fn() },
}));

jest.mock('../src/services/calificacionesService', () => ({
  listarCalificacionesPrestador: jest.fn(),
}));

const prisma = require('../src/config/prisma');
const calificacionesService = require('../src/services/calificacionesService');
const prestadoresService = require('../src/services/prestadoresService');
const { caso } = require('./qase/qase');

const calificaciones = [
  { id: 'k1', puntaje: 5, comentario: 'Muy bueno', fechaPublicacion: new Date('2026-10-20') },
  { id: 'k2', puntaje: 4, comentario: null, fechaPublicacion: new Date('2026-10-18') },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('listarMisCalificaciones', () => {
  it(caso('TC-PRE-054', 'busca al prestador por el usuario del token y devuelve sus calificaciones'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ id: 'p1', activo: true });
    calificacionesService.listarCalificacionesPrestador.mockResolvedValue(calificaciones);

    const lista = await prestadoresService.listarMisCalificaciones('u1');

    expect(prisma.prestador.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { usuarioId: 'u1' } })
    );
    expect(calificacionesService.listarCalificacionesPrestador).toHaveBeenCalledWith('p1');
    expect(lista).toEqual(calificaciones);
  });

  it(caso('TC-PRE-055', 'devuelve una lista vacía si todavía no recibió calificaciones'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ id: 'p1', activo: true });
    calificacionesService.listarCalificacionesPrestador.mockResolvedValue([]);

    const lista = await prestadoresService.listarMisCalificaciones('u1');

    expect(lista).toEqual([]);
  });

  it.each([null, { id: 'p1', activo: false }])(
    caso('TC-PRE-056', 'lanza 404 si el perfil de prestador es %j'),
    async (perfil) => {
      prisma.prestador.findUnique.mockResolvedValue(perfil);

      await expect(prestadoresService.listarMisCalificaciones('u1')).rejects.toMatchObject({
        status: 404,
      });
      expect(calificacionesService.listarCalificacionesPrestador).not.toHaveBeenCalled();
    }
  );
});