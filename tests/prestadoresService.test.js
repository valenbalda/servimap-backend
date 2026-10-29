jest.mock('../src/config/prisma', () => ({
  prestador: { findUnique: jest.fn(), update: jest.fn() },
}));

const prisma = require('../src/config/prisma');
const prestadoresService = require('../src/services/prestadoresService');
const { caso } = require('./qase/qase');

const prestadorBase = {
  id: 'p1',
  usuarioId: 'u1',
  descripcionProfesional: 'Plomero con experiencia',
  fotoPerfil: null,
  zonaCobertura: 'Palermo',
  latitud: null,
  longitud: null,
  precioMin: null,
  precioMax: null,
  telefono: null,
  whatsapp: null,
  emailContacto: null,
  disponible: true,
  activo: true,
  usuario: { nombre: 'Juan', email: 'juan@mail.com' },
  oficios: [{ oficio: { id: 'o1', nombre: 'Plomería' } }],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('obtenerMiPerfil', () => {
  it(caso('TC-PRE-023', 'devuelve el perfil con nombre, email y oficios'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(prestadorBase);

    const perfil = await prestadoresService.obtenerMiPerfil('u1');

    expect(perfil.nombre).toBe('Juan');
    expect(perfil.zonaCobertura).toBe('Palermo');
    expect(perfil.oficios).toEqual([{ id: 'o1', nombre: 'Plomería' }]);
  });

  it(caso('TC-PRE-024', 'lanza 404 si el prestador no existe'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(null);

    await expect(prestadoresService.obtenerMiPerfil('u1')).rejects.toMatchObject({
      status: 404,
    });
  });

  it(caso('TC-PRE-025', 'lanza 404 si el prestador está inactivo'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ ...prestadorBase, activo: false });

    await expect(prestadoresService.obtenerMiPerfil('u1')).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe('actualizarMiPerfil', () => {
  it(caso('TC-PRE-026', 'actualiza los datos y devuelve el perfil nuevo'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(prestadorBase);
    prisma.prestador.update.mockResolvedValue({
      ...prestadorBase,
      zonaCobertura: 'Recoleta',
    });

    const perfil = await prestadoresService.actualizarMiPerfil('u1', {
      zonaCobertura: 'Recoleta',
    });

    expect(prisma.prestador.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { usuarioId: 'u1' },
        data: { zonaCobertura: 'Recoleta' },
      })
    );
    expect(perfil.zonaCobertura).toBe('Recoleta');
  });

  it(caso('TC-PRE-027', 'rechaza si el precio mínimo supera al máximo guardado'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({
      ...prestadorBase,
      precioMin: 1000,
      precioMax: 2000,
    });

    await expect(
      prestadoresService.actualizarMiPerfil('u1', { precioMin: 5000 })
    ).rejects.toMatchObject({ status: 400 });

    expect(prisma.prestador.update).not.toHaveBeenCalled();
  });
});