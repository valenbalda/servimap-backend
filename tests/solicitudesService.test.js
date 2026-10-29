jest.mock('../src/config/prisma', () => ({
  prestador: { findUnique: jest.fn() },
  oficio: { findUnique: jest.fn() },
  solicitud: { create: jest.fn() },
}));

const prisma = require('../src/config/prisma');
const solicitudesService = require('../src/services/solicitudesService');
const { caso } = require('./qase/qase');

const datos = {
  prestadorId: 'p1',
  oficioId: 'o1',
  descripcion: 'Se rompió una canilla',
  direccion: 'Av. Siempreviva 742',
  contactoPreferido: 'WhatsApp',
};

const prestadorOk = {
  id: 'p1',
  activo: true,
  disponible: true,
  oficios: [{ prestadorId: 'p1', oficioId: 'o1' }],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('crearSolicitud', () => {
  it(caso('TC-SOL-017', 'crea la solicitud con el cliente logueado'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(prestadorOk);
    prisma.oficio.findUnique.mockResolvedValue({ id: 'o1', activo: true });
    prisma.solicitud.create.mockResolvedValue({
      id: 's1',
      ...datos,
      estado: 'PENDIENTE',
      fechaCreacion: new Date('2026-10-19'),
      clienteId: 'c1',
    });

    const solicitud = await solicitudesService.crearSolicitud('c1', datos);

    expect(prisma.solicitud.create).toHaveBeenCalledWith({
      data: {
        descripcion: datos.descripcion,
        direccion: datos.direccion,
        contactoPreferido: datos.contactoPreferido,
        clienteId: 'c1',
        prestadorId: 'p1',
        oficioId: 'o1',
      },
    });
    expect(solicitud.estado).toBe('PENDIENTE');
    expect(solicitud.clienteId).toBe('c1');
  });

  it(caso('TC-SOL-018', 'lanza 404 si el prestador no existe'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(null);

    await expect(solicitudesService.crearSolicitud('c1', datos)).rejects.toMatchObject({
      status: 404,
    });
    expect(prisma.solicitud.create).not.toHaveBeenCalled();
  });

  it(caso('TC-SOL-019', 'lanza 404 si el prestador está inactivo'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ ...prestadorOk, activo: false });

    await expect(solicitudesService.crearSolicitud('c1', datos)).rejects.toMatchObject({
      status: 404,
    });
  });

  it(caso('TC-SOL-020', 'lanza 409 si el prestador no está disponible'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ ...prestadorOk, disponible: false });

    await expect(solicitudesService.crearSolicitud('c1', datos)).rejects.toMatchObject({
      status: 409,
    });
    expect(prisma.solicitud.create).not.toHaveBeenCalled();
  });

  it(caso('TC-SOL-021', 'lanza 400 si el oficio no existe'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(prestadorOk);
    prisma.oficio.findUnique.mockResolvedValue(null);

    await expect(solicitudesService.crearSolicitud('c1', datos)).rejects.toMatchObject({
      status: 400,
    });
  });

  it(caso('TC-SOL-022', 'lanza 400 si el oficio está desactivado'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(prestadorOk);
    prisma.oficio.findUnique.mockResolvedValue({ id: 'o1', activo: false });

    await expect(solicitudesService.crearSolicitud('c1', datos)).rejects.toMatchObject({
      status: 400,
    });
    expect(prisma.solicitud.create).not.toHaveBeenCalled();
  });

  it(caso('TC-SOL-023', 'lanza 400 si el prestador no ofrece ese oficio'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ ...prestadorOk, oficios: [] });
    prisma.oficio.findUnique.mockResolvedValue({ id: 'o1', activo: true });

    await expect(solicitudesService.crearSolicitud('c1', datos)).rejects.toMatchObject({
      status: 400,
    });
    expect(prisma.solicitud.create).not.toHaveBeenCalled();
  });
});