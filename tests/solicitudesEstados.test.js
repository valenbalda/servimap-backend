jest.mock('../src/config/prisma', () => ({
  prestador: { findUnique: jest.fn() },
  solicitud: { findUnique: jest.fn(), update: jest.fn() },
}));

const prisma = require('../src/config/prisma');
const solicitudesService = require('../src/services/solicitudesService');

const solicitudBase = {
  id: 's1',
  descripcion: 'Se rompió una canilla',
  direccion: null,
  contactoPreferido: null,
  estado: 'PENDIENTE',
  fechaCreacion: new Date('2026-10-19'),
  clienteId: 'c1',
  prestadorId: 'p1',
  oficioId: 'o1',
};

const prestadorDueno = { id: 'p1', activo: true };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('aceptarSolicitud', () => {
  it('pasa la solicitud pendiente a ACEPTADA', async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudBase);
    prisma.prestador.findUnique.mockResolvedValue(prestadorDueno);
    prisma.solicitud.update.mockResolvedValue({ ...solicitudBase, estado: 'ACEPTADA' });

    const solicitud = await solicitudesService.aceptarSolicitud('u1', 's1');

    expect(prisma.prestador.findUnique).toHaveBeenCalledWith({ where: { usuarioId: 'u1' } });
    expect(prisma.solicitud.update).toHaveBeenCalledWith({
      where: { id: 's1' },
      data: { estado: 'ACEPTADA' },
    });
    expect(solicitud.estado).toBe('ACEPTADA');
  });

  it('lanza 404 si la solicitud no existe', async () => {
    prisma.solicitud.findUnique.mockResolvedValue(null);

    await expect(solicitudesService.aceptarSolicitud('u1', 's1')).rejects.toMatchObject({
      status: 404,
    });
    expect(prisma.prestador.findUnique).not.toHaveBeenCalled();
  });

  it('lanza 403 si la solicitud es de otro prestador', async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudBase);
    prisma.prestador.findUnique.mockResolvedValue({ id: 'p2', activo: true });

    await expect(solicitudesService.aceptarSolicitud('u2', 's1')).rejects.toMatchObject({
      status: 403,
    });
    expect(prisma.solicitud.update).not.toHaveBeenCalled();
  });

  it('lanza 403 si el usuario no tiene perfil de prestador', async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudBase);
    prisma.prestador.findUnique.mockResolvedValue(null);

    await expect(solicitudesService.aceptarSolicitud('u9', 's1')).rejects.toMatchObject({
      status: 403,
    });
  });

  it('lanza 409 si la solicitud no está pendiente', async () => {
    prisma.solicitud.findUnique.mockResolvedValue({ ...solicitudBase, estado: 'RECHAZADA' });
    prisma.prestador.findUnique.mockResolvedValue(prestadorDueno);

    await expect(solicitudesService.aceptarSolicitud('u1', 's1')).rejects.toMatchObject({
      status: 409,
    });
    expect(prisma.solicitud.update).not.toHaveBeenCalled();
  });
});

describe('rechazarSolicitud', () => {
  it('pasa la solicitud pendiente a RECHAZADA', async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudBase);
    prisma.prestador.findUnique.mockResolvedValue(prestadorDueno);
    prisma.solicitud.update.mockResolvedValue({ ...solicitudBase, estado: 'RECHAZADA' });

    const solicitud = await solicitudesService.rechazarSolicitud('u1', 's1');

    expect(prisma.solicitud.update).toHaveBeenCalledWith({
      where: { id: 's1' },
      data: { estado: 'RECHAZADA' },
    });
    expect(solicitud.estado).toBe('RECHAZADA');
  });

  it('lanza 409 si la solicitud ya fue aceptada', async () => {
    prisma.solicitud.findUnique.mockResolvedValue({ ...solicitudBase, estado: 'ACEPTADA' });
    prisma.prestador.findUnique.mockResolvedValue(prestadorDueno);

    await expect(solicitudesService.rechazarSolicitud('u1', 's1')).rejects.toMatchObject({
      status: 409,
    });
  });
});

describe('cancelarSolicitud', () => {
  it('cancela una solicitud pendiente del cliente dueño', async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudBase);
    prisma.solicitud.update.mockResolvedValue({ ...solicitudBase, estado: 'CANCELADA' });

    const solicitud = await solicitudesService.cancelarSolicitud('c1', 's1');

    expect(prisma.solicitud.update).toHaveBeenCalledWith({
      where: { id: 's1' },
      data: { estado: 'CANCELADA' },
    });
    expect(solicitud.estado).toBe('CANCELADA');
  });

  it('también permite cancelar una solicitud aceptada', async () => {
    prisma.solicitud.findUnique.mockResolvedValue({ ...solicitudBase, estado: 'ACEPTADA' });
    prisma.solicitud.update.mockResolvedValue({ ...solicitudBase, estado: 'CANCELADA' });

    const solicitud = await solicitudesService.cancelarSolicitud('c1', 's1');

    expect(solicitud.estado).toBe('CANCELADA');
  });

  it('lanza 404 si la solicitud no existe', async () => {
    prisma.solicitud.findUnique.mockResolvedValue(null);

    await expect(solicitudesService.cancelarSolicitud('c1', 's1')).rejects.toMatchObject({
      status: 404,
    });
  });

  it('lanza 403 si la solicitud es de otro cliente', async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudBase);

    await expect(solicitudesService.cancelarSolicitud('c2', 's1')).rejects.toMatchObject({
      status: 403,
    });
    expect(prisma.solicitud.update).not.toHaveBeenCalled();
  });

  it('lanza 409 si la solicitud ya está finalizada', async () => {
    prisma.solicitud.findUnique.mockResolvedValue({ ...solicitudBase, estado: 'FINALIZADA' });

    await expect(solicitudesService.cancelarSolicitud('c1', 's1')).rejects.toMatchObject({
      status: 409,
    });
    expect(prisma.solicitud.update).not.toHaveBeenCalled();
  });
});