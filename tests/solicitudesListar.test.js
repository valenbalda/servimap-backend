jest.mock('../src/config/prisma', () => ({
  prestador: { findUnique: jest.fn() },
  solicitud: { findMany: jest.fn() },
}));

const prisma = require('../src/config/prisma');
const solicitudesService = require('../src/services/solicitudesService');
const { caso } = require('./qase/qase');

const solicitudBase = {
  id: 's1',
  descripcion: 'Se rompió una canilla',
  direccion: null,
  contactoPreferido: null,
  estado: 'PENDIENTE',
  fechaCreacion: new Date('2026-10-24'),
  clienteId: 'c1',
  prestadorId: 'p1',
  oficioId: 'o1',
  oficio: { id: 'o1', nombre: 'Plomería' },
  cliente: { id: 'c1', nombre: 'Ana' },
  prestador: { id: 'p1', usuario: { nombre: 'Juan' } },
  calificacion: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('listarMisSolicitudes', () => {
  it(caso('TC-SOL-024', 'el cliente ve solo las suyas, de la más nueva a la más vieja'), async () => {
    prisma.solicitud.findMany.mockResolvedValue([solicitudBase]);

    const lista = await solicitudesService.listarMisSolicitudes({ id: 'c1', rol: 'CLIENTE' });

    expect(prisma.solicitud.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { clienteId: 'c1' },
        orderBy: { fechaCreacion: 'desc' },
      })
    );
    expect(prisma.prestador.findUnique).not.toHaveBeenCalled();
    expect(lista[0].oficio.nombre).toBe('Plomería');
    expect(lista[0].prestador.nombre).toBe('Juan');
  });

  it(caso('TC-SOL-025', 'el prestador ve las que le llegaron, buscando su perfil por usuarioId'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ id: 'p1', activo: true });
    prisma.solicitud.findMany.mockResolvedValue([solicitudBase]);

    const lista = await solicitudesService.listarMisSolicitudes({ id: 'u1', rol: 'PRESTADOR' });

    expect(prisma.prestador.findUnique).toHaveBeenCalledWith({ where: { usuarioId: 'u1' } });
    expect(prisma.solicitud.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { prestadorId: 'p1' } })
    );
    expect(lista[0].cliente.nombre).toBe('Ana');
  });

  it(caso('TC-SOL-026', 'filtra por estado cuando se pide'), async () => {
    prisma.solicitud.findMany.mockResolvedValue([]);

    await solicitudesService.listarMisSolicitudes(
      { id: 'c1', rol: 'CLIENTE' },
      { estado: 'ACEPTADA' }
    );

    expect(prisma.solicitud.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { clienteId: 'c1', estado: 'ACEPTADA' } })
    );
  });

  it(caso('TC-SOL-027', 'marca como calificada solo la que ya tiene calificación'), async () => {
    prisma.solicitud.findMany.mockResolvedValue([
      { ...solicitudBase, calificacion: { id: 'k1' } },
      solicitudBase,
    ]);

    const lista = await solicitudesService.listarMisSolicitudes({ id: 'c1', rol: 'CLIENTE' });

    expect(lista.map((s) => s.calificada)).toEqual([true, false]);
  });

  it(caso('TC-SOL-028', 'no devuelve datos sensibles de las personas'), async () => {
    prisma.solicitud.findMany.mockResolvedValue([solicitudBase]);

    const [solicitud] = await solicitudesService.listarMisSolicitudes({ id: 'c1', rol: 'CLIENTE' });

    expect(solicitud.cliente).toEqual({ id: 'c1', nombre: 'Ana' });
    expect(solicitud.prestador).toEqual({ id: 'p1', nombre: 'Juan' });
  });

  it(caso('TC-SOL-029', 'lanza 404 si el prestador no existe'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(null);

    await expect(
      solicitudesService.listarMisSolicitudes({ id: 'u1', rol: 'PRESTADOR' })
    ).rejects.toMatchObject({ status: 404 });
    expect(prisma.solicitud.findMany).not.toHaveBeenCalled();
  });

  it(caso('TC-SOL-030', 'lanza 404 si el prestador está inactivo'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ id: 'p1', activo: false });

    await expect(
      solicitudesService.listarMisSolicitudes({ id: 'u1', rol: 'PRESTADOR' })
    ).rejects.toMatchObject({ status: 404 });
  });

  it(caso('TC-SOL-031', 'lanza 403 si el rol no es cliente ni prestador'), async () => {
    await expect(
      solicitudesService.listarMisSolicitudes({ id: 'a1', rol: 'ADMINISTRADOR' })
    ).rejects.toMatchObject({ status: 403 });
    expect(prisma.solicitud.findMany).not.toHaveBeenCalled();
  });
});