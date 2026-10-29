jest.mock('../src/config/prisma', () => ({
  oficio: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

const prisma = require('../src/config/prisma');
const oficiosService = require('../src/services/oficiosService');
const { caso } = require('./qase/qase');

const oficioBase = {
  id: 'o1',
  nombre: 'Plomería',
  categoria: 'Hogar',
  activo: true,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('listarOficios', () => {
  it(caso('TC-OFI-018', 'lista solo los oficios activos por defecto'), async () => {
    prisma.oficio.findMany.mockResolvedValue([oficioBase]);

    const oficios = await oficiosService.listarOficios();

    expect(prisma.oficio.findMany).toHaveBeenCalledWith({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
    expect(oficios).toEqual([oficioBase]);
  });

  it(caso('TC-OFI-019', 'incluye los inactivos cuando se pide'), async () => {
    prisma.oficio.findMany.mockResolvedValue([]);

    await oficiosService.listarOficios({ incluirInactivos: true });

    expect(prisma.oficio.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { nombre: 'asc' },
    });
  });
});

describe('crearOficio', () => {
  it(caso('TC-OFI-020', 'rechaza un nombre que ya existe con 409'), async () => {
    prisma.oficio.findUnique.mockResolvedValue(oficioBase);

    await expect(
      oficiosService.crearOficio({ nombre: 'Plomería', categoria: 'Hogar' })
    ).rejects.toMatchObject({ status: 409 });

    expect(prisma.oficio.create).not.toHaveBeenCalled();
  });

  it(caso('TC-OFI-021', 'crea el oficio si el nombre está libre'), async () => {
    prisma.oficio.findUnique.mockResolvedValue(null);
    prisma.oficio.create.mockResolvedValue(oficioBase);

    const oficio = await oficiosService.crearOficio({
      nombre: 'Plomería',
      categoria: 'Hogar',
    });

    expect(prisma.oficio.create).toHaveBeenCalledWith({
      data: { nombre: 'Plomería', categoria: 'Hogar' },
    });
    expect(oficio).toEqual(oficioBase);
  });
});

describe('actualizarOficio', () => {
  it(caso('TC-OFI-022', 'lanza 404 si el oficio no existe'), async () => {
    prisma.oficio.findUnique.mockResolvedValue(null);

    await expect(
      oficiosService.actualizarOficio('o1', { nombre: 'Gas' })
    ).rejects.toMatchObject({ status: 404 });

    expect(prisma.oficio.update).not.toHaveBeenCalled();
  });

  it(caso('TC-OFI-023', 'rechaza un nombre que ya usa otro oficio con 409'), async () => {
    prisma.oficio.findUnique.mockImplementation(async ({ where }) =>
      where.id ? oficioBase : { id: 'o2', nombre: where.nombre }
    );

    await expect(
      oficiosService.actualizarOficio('o1', { nombre: 'Gas' })
    ).rejects.toMatchObject({ status: 409 });

    expect(prisma.oficio.update).not.toHaveBeenCalled();
  });

  it(caso('TC-OFI-024', 'no busca duplicados si el nombre no cambia'), async () => {
    prisma.oficio.findUnique.mockResolvedValue(oficioBase);
    prisma.oficio.update.mockResolvedValue({ ...oficioBase, categoria: 'Obra' });

    await oficiosService.actualizarOficio('o1', {
      nombre: 'Plomería',
      categoria: 'Obra',
    });

    expect(prisma.oficio.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.oficio.update).toHaveBeenCalledWith({
      where: { id: 'o1' },
      data: { nombre: 'Plomería', categoria: 'Obra' },
    });
  });

  it(caso('TC-OFI-025', 'actualiza el oficio con un nombre nuevo disponible'), async () => {
    prisma.oficio.findUnique.mockImplementation(async ({ where }) =>
      where.id ? oficioBase : null
    );
    prisma.oficio.update.mockResolvedValue({ ...oficioBase, nombre: 'Gas' });

    const oficio = await oficiosService.actualizarOficio('o1', { nombre: 'Gas' });

    expect(oficio.nombre).toBe('Gas');
    expect(prisma.oficio.update).toHaveBeenCalledTimes(1);
  });
});

describe('cambiarEstadoOficio', () => {
  it(caso('TC-OFI-026', 'lanza 404 si el oficio no existe'), async () => {
    prisma.oficio.findUnique.mockResolvedValue(null);

    await expect(
      oficiosService.cambiarEstadoOficio('o1', false)
    ).rejects.toMatchObject({ status: 404 });

    expect(prisma.oficio.update).not.toHaveBeenCalled();
  });

  it(caso('TC-OFI-027', 'desactiva el oficio sin borrarlo'), async () => {
    prisma.oficio.findUnique.mockResolvedValue(oficioBase);
    prisma.oficio.update.mockResolvedValue({ ...oficioBase, activo: false });

    const oficio = await oficiosService.cambiarEstadoOficio('o1', false);

    expect(prisma.oficio.update).toHaveBeenCalledWith({
      where: { id: 'o1' },
      data: { activo: false },
    });
    expect(oficio.activo).toBe(false);
  });
});