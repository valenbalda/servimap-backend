jest.mock('../src/config/prisma', () => ({
  solicitud: { findUnique: jest.fn(), count: jest.fn() },
  calificacion: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    aggregate: jest.fn(),
  },
  prestador: { findUnique: jest.fn() },
}));

const prisma = require('../src/config/prisma');
const calificacionesService = require('../src/services/calificacionesService');
const { caso } = require('./qase/qase');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('crearCalificacion', () => {
  const datos = {
    clienteId: 'u1',
    solicitudId: 's1',
    puntaje: 5,
    comentario: 'Excelente',
  };

  const solicitudBase = {
    id: 's1',
    clienteId: 'u1',
    prestadorId: 'p1',
    estado: 'FINALIZADA',
    calificacion: null,
  };

  it(caso('TC-CAL-019', 'lanza 404 si la solicitud no existe'), async () => {
    prisma.solicitud.findUnique.mockResolvedValue(null);

    await expect(
      calificacionesService.crearCalificacion(datos)
    ).rejects.toMatchObject({ status: 404 });

    expect(prisma.calificacion.create).not.toHaveBeenCalled();
  });

  it(caso('TC-CAL-020', 'lanza 403 si la solicitud es de otro cliente'), async () => {
    prisma.solicitud.findUnique.mockResolvedValue({
      ...solicitudBase,
      clienteId: 'otro',
    });

    await expect(
      calificacionesService.crearCalificacion(datos)
    ).rejects.toMatchObject({ status: 403 });

    expect(prisma.calificacion.create).not.toHaveBeenCalled();
  });

  it(caso('TC-CAL-021', 'lanza 409 si la solicitud no está finalizada'), async () => {
    prisma.solicitud.findUnique.mockResolvedValue({
      ...solicitudBase,
      estado: 'ACEPTADA',
    });

    await expect(
      calificacionesService.crearCalificacion(datos)
    ).rejects.toMatchObject({ status: 409 });

    expect(prisma.calificacion.create).not.toHaveBeenCalled();
  });

  it(caso('TC-CAL-022', 'lanza 409 si la solicitud ya fue calificada'), async () => {
    prisma.solicitud.findUnique.mockResolvedValue({
      ...solicitudBase,
      calificacion: { id: 'c1' },
    });

    await expect(
      calificacionesService.crearCalificacion(datos)
    ).rejects.toMatchObject({ status: 409 });

    expect(prisma.calificacion.create).not.toHaveBeenCalled();
  });

  it(caso('TC-CAL-023', 'crea la calificación con el prestador de la solicitud'), async () => {
    prisma.solicitud.findUnique.mockResolvedValue(solicitudBase);
    prisma.calificacion.create.mockResolvedValue({ id: 'c1' });

    const calificacion = await calificacionesService.crearCalificacion(datos);

    expect(prisma.calificacion.create).toHaveBeenCalledWith({
      data: {
        puntaje: 5,
        comentario: 'Excelente',
        solicitudId: 's1',
        clienteId: 'u1',
        prestadorId: 'p1',
      },
    });
    expect(calificacion).toEqual({ id: 'c1' });
  });
});

describe('editarComentario', () => {
  const datos = { clienteId: 'u1', calificacionId: 'c1', comentario: 'Nuevo' };
  const calificacionBase = { id: 'c1', clienteId: 'u1', moderada: false };

  it(caso('TC-CAL-024', 'lanza 404 si la calificación no existe'), async () => {
    prisma.calificacion.findUnique.mockResolvedValue(null);

    await expect(
      calificacionesService.editarComentario(datos)
    ).rejects.toMatchObject({ status: 404 });
  });

  it(caso('TC-CAL-025', 'lanza 403 si la calificación es de otro cliente'), async () => {
    prisma.calificacion.findUnique.mockResolvedValue({
      ...calificacionBase,
      clienteId: 'otro',
    });

    await expect(
      calificacionesService.editarComentario(datos)
    ).rejects.toMatchObject({ status: 403 });

    expect(prisma.calificacion.update).not.toHaveBeenCalled();
  });

  it(caso('TC-CAL-026', 'lanza 409 si la calificación está moderada'), async () => {
    prisma.calificacion.findUnique.mockResolvedValue({
      ...calificacionBase,
      moderada: true,
    });

    await expect(
      calificacionesService.editarComentario(datos)
    ).rejects.toMatchObject({ status: 409 });

    expect(prisma.calificacion.update).not.toHaveBeenCalled();
  });

  it(caso('TC-CAL-027', 'actualiza el comentario de la propia calificación'), async () => {
    prisma.calificacion.findUnique.mockResolvedValue(calificacionBase);
    prisma.calificacion.update.mockResolvedValue({ id: 'c1', comentario: 'Nuevo' });

    const calificacion = await calificacionesService.editarComentario(datos);

    expect(prisma.calificacion.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { comentario: 'Nuevo' },
    });
    expect(calificacion.comentario).toBe('Nuevo');
  });
});

describe('obtenerReputacion', () => {
  it(caso('TC-CAL-028', 'lanza 404 si el prestador no existe'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(null);

    await expect(
      calificacionesService.obtenerReputacion('p1')
    ).rejects.toMatchObject({ status: 404 });
  });

  it(caso('TC-CAL-029', 'calcula el promedio redondeado a un decimal y los servicios finalizados'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ id: 'p1' });
    prisma.calificacion.aggregate.mockResolvedValue({
      _avg: { puntaje: 4.666 },
      _count: { puntaje: 3 },
    });
    prisma.solicitud.count.mockResolvedValue(5);

    const reputacion = await calificacionesService.obtenerReputacion('p1');

    expect(reputacion).toEqual({
      prestadorId: 'p1',
      promedio: 4.7,
      totalCalificaciones: 3,
      serviciosFinalizados: 5,
    });
    expect(prisma.solicitud.count).toHaveBeenCalledWith({
      where: { prestadorId: 'p1', estado: 'FINALIZADA' },
    });
  });

  it(caso('TC-CAL-030', 'devuelve promedio null si todavía no tiene calificaciones'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ id: 'p1' });
    prisma.calificacion.aggregate.mockResolvedValue({
      _avg: { puntaje: null },
      _count: { puntaje: 0 },
    });
    prisma.solicitud.count.mockResolvedValue(0);

    const reputacion = await calificacionesService.obtenerReputacion('p1');

    expect(reputacion.promedio).toBeNull();
    expect(reputacion.totalCalificaciones).toBe(0);
  });
});

describe('listarCalificacionesPrestador', () => {
  it(caso('TC-CAL-031', 'lanza 404 si el prestador no existe'), async () => {
    prisma.prestador.findUnique.mockResolvedValue(null);

    await expect(
      calificacionesService.listarCalificacionesPrestador('p1')
    ).rejects.toMatchObject({ status: 404 });
  });

  it(caso('TC-CAL-032', 'lista solo las calificaciones no moderadas, las más nuevas primero'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ id: 'p1' });
    prisma.calificacion.findMany.mockResolvedValue([{ id: 'c1' }]);

    const lista = await calificacionesService.listarCalificacionesPrestador('p1');

    expect(prisma.calificacion.findMany).toHaveBeenCalledWith({
      where: { prestadorId: 'p1', moderada: false },
      orderBy: { fechaPublicacion: 'desc' },
      select: {
        id: true,
        puntaje: true,
        comentario: true,
        fechaPublicacion: true,
      },
    });
    expect(lista).toEqual([{ id: 'c1' }]);
  });
});

describe('listarTodasLasCalificaciones', () => {
  it(caso('TC-CAL-033', 'lista todas, incluidas las moderadas'), async () => {
    prisma.calificacion.findMany.mockResolvedValue([{ id: 'c1' }, { id: 'c2' }]);

    const lista = await calificacionesService.listarTodasLasCalificaciones();

    expect(prisma.calificacion.findMany).toHaveBeenCalledWith({
      orderBy: { fechaPublicacion: 'desc' },
    });
    expect(lista).toHaveLength(2);
  });
});

describe('moderarCalificacion', () => {
  it(caso('TC-CAL-034', 'lanza 404 si la calificación no existe'), async () => {
    prisma.calificacion.findUnique.mockResolvedValue(null);

    await expect(
      calificacionesService.moderarCalificacion('c1', 'Spam')
    ).rejects.toMatchObject({ status: 404 });
  });

  it(caso('TC-CAL-035', 'lanza 409 si ya fue moderada'), async () => {
    prisma.calificacion.findUnique.mockResolvedValue({ id: 'c1', moderada: true });

    await expect(
      calificacionesService.moderarCalificacion('c1', 'Spam')
    ).rejects.toMatchObject({ status: 409 });

    expect(prisma.calificacion.update).not.toHaveBeenCalled();
  });

  it(caso('TC-CAL-036', 'marca la calificación como moderada con fecha y motivo'), async () => {
    prisma.calificacion.findUnique.mockResolvedValue({ id: 'c1', moderada: false });
    prisma.calificacion.update.mockResolvedValue({ id: 'c1', moderada: true });

    await calificacionesService.moderarCalificacion('c1', 'Spam');

    expect(prisma.calificacion.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: {
        moderada: true,
        fechaModeracion: expect.any(Date),
        motivoModeracion: 'Spam',
      },
    });
  });
});