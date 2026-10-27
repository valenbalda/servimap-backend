jest.mock('../src/config/prisma', () => ({
  prestador: { findUnique: jest.fn() },
  oficio: { findMany: jest.fn() },
  prestadorOficio: { deleteMany: jest.fn(), createMany: jest.fn() },
  $transaction: jest.fn(),
}));

const prisma = require('../src/config/prisma');
const prestadoresService = require('../src/services/prestadoresService');

const prestadorBase = {
  id: 'p1',
  usuarioId: 'u1',
  descripcionProfesional: null,
  fotoPerfil: null,
  zonaCobertura: null,
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
  oficios: [],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('asignarMisOficios', () => {
  it('reemplaza los oficios y devuelve el perfil actualizado', async () => {
    prisma.prestador.findUnique
      .mockResolvedValueOnce(prestadorBase)
      .mockResolvedValueOnce({
        ...prestadorBase,
        oficios: [
          { oficio: { id: 'o1', nombre: 'Plomería' } },
          { oficio: { id: 'o2', nombre: 'Electricidad' } },
        ],
      });
    prisma.oficio.findMany.mockResolvedValue([{ id: 'o1' }, { id: 'o2' }]);
    prisma.$transaction.mockResolvedValue([]);

    const perfil = await prestadoresService.asignarMisOficios('u1', ['o1', 'o2']);

    expect(prisma.prestadorOficio.deleteMany).toHaveBeenCalledWith({
      where: { prestadorId: 'p1' },
    });
    expect(prisma.prestadorOficio.createMany).toHaveBeenCalledWith({
      data: [
        { prestadorId: 'p1', oficioId: 'o1' },
        { prestadorId: 'p1', oficioId: 'o2' },
      ],
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(perfil.oficios).toEqual([
      { id: 'o1', nombre: 'Plomería' },
      { id: 'o2', nombre: 'Electricidad' },
    ]);
  });

  it('rechaza con 400 si algún oficio no existe o está desactivado', async () => {
    prisma.prestador.findUnique.mockResolvedValue(prestadorBase);
    prisma.oficio.findMany.mockResolvedValue([{ id: 'o1' }]);

    await expect(
      prestadoresService.asignarMisOficios('u1', ['o1', 'o2'])
    ).rejects.toMatchObject({ status: 400 });

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('ignora los ids repetidos', async () => {
    prisma.prestador.findUnique.mockResolvedValue(prestadorBase);
    prisma.oficio.findMany.mockResolvedValue([{ id: 'o1' }]);
    prisma.$transaction.mockResolvedValue([]);

    await prestadoresService.asignarMisOficios('u1', ['o1', 'o1']);

    expect(prisma.oficio.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { in: ['o1'] }, activo: true } })
    );
    expect(prisma.prestadorOficio.createMany).toHaveBeenCalledWith({
      data: [{ prestadorId: 'p1', oficioId: 'o1' }],
    });
  });

  it('permite dejar al prestador sin oficios con una lista vacía', async () => {
    prisma.prestador.findUnique.mockResolvedValue(prestadorBase);
    prisma.oficio.findMany.mockResolvedValue([]);
    prisma.$transaction.mockResolvedValue([]);

    const perfil = await prestadoresService.asignarMisOficios('u1', []);

    expect(prisma.prestadorOficio.deleteMany).toHaveBeenCalled();
    expect(perfil.oficios).toEqual([]);
  });

  it('lanza 404 si el prestador no existe', async () => {
    prisma.prestador.findUnique.mockResolvedValue(null);

    await expect(
      prestadoresService.asignarMisOficios('u1', ['o1'])
    ).rejects.toMatchObject({ status: 404 });

    expect(prisma.oficio.findMany).not.toHaveBeenCalled();
  });
});