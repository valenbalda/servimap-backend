jest.mock('../src/config/prisma', () => ({
  prestador: { findUnique: jest.fn() },
  solicitud: { findUnique: jest.fn(), update: jest.fn() },
}));

const prisma = require('../src/config/prisma');
const solicitudesService = require('../src/services/solicitudesService');
const { caso } = require('./qase/qase');

const solicitudAceptada = {
  id: 's1',
  descripcion: 'Se rompió una canilla',
  direccion: null,
  contactoPreferido: null,
  estado: 'ACEPTADA',
  fechaCreacion: new Date('2026-10-24'),
  clienteId: 'c1',
  prestadorId: 'p1',
  oficioId: 'o1',
};

const prestadorDueno = { id: 'p1', activo: true };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('finalizarSolicitud', () => {
  it(caso('TC-SOL-044', 'pasa la solicitud aceptada a FINALIZADA'), async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudAceptada);
    prisma.prestador.findUnique.mockResolvedValue(prestadorDueno);
    prisma.solicitud.update.mockResolvedValue({ ...solicitudAceptada, estado: 'FINALIZADA' });

    const solicitud = await solicitudesService.finalizarSolicitud('u1', 's1');

    expect(prisma.prestador.findUnique).toHaveBeenCalledWith({ where: { usuarioId: 'u1' } });
    expect(prisma.solicitud.update).toHaveBeenCalledWith({
      where: { id: 's1' },
      data: { estado: 'FINALIZADA' },
    });
    expect(solicitud.estado).toBe('FINALIZADA');
  });

  it(caso('TC-SOL-045', 'lanza 404 si la solicitud no existe'), async () => {
    prisma.solicitud.findUnique.mockResolvedValue(null);

    await expect(solicitudesService.finalizarSolicitud('u1', 's1')).rejects.toMatchObject({
      status: 404,
    });
    expect(prisma.prestador.findUnique).not.toHaveBeenCalled();
  });

  it(caso('TC-SOL-046', 'lanza 403 si la solicitud es de otro prestador'), async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudAceptada);
    prisma.prestador.findUnique.mockResolvedValue({ id: 'p2', activo: true });

    await expect(solicitudesService.finalizarSolicitud('u2', 's1')).rejects.toMatchObject({
      status: 403,
    });
    expect(prisma.solicitud.update).not.toHaveBeenCalled();
  });

  it(caso('TC-SOL-047', 'lanza 403 si el usuario no tiene perfil de prestador'), async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudAceptada);
    prisma.prestador.findUnique.mockResolvedValue(null);

    await expect(solicitudesService.finalizarSolicitud('u9', 's1')).rejects.toMatchObject({
      status: 403,
    });
    expect(prisma.solicitud.update).not.toHaveBeenCalled();
  });

  it.each(['PENDIENTE', 'RECHAZADA', 'CANCELADA', 'FINALIZADA'])(
    caso('TC-SOL-048', 'lanza 409 si la solicitud está %s y no aceptada'),
    async (estado) => {
      prisma.solicitud.findUnique.mockResolvedValue({ ...solicitudAceptada, estado });
      prisma.prestador.findUnique.mockResolvedValue(prestadorDueno);

      await expect(solicitudesService.finalizarSolicitud('u1', 's1')).rejects.toMatchObject({
        status: 409,
        message: 'Solo se puede finalizar una solicitud aceptada',
      });
      expect(prisma.solicitud.update).not.toHaveBeenCalled();
    }
  );
});