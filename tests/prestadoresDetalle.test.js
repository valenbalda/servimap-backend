jest.mock('../src/config/prisma', () => ({
  prestador: { findFirst: jest.fn() },
}));

jest.mock('../src/services/calificacionesService', () => ({
  obtenerReputacion: jest.fn(),
  listarCalificacionesPrestador: jest.fn(),
}));

const prisma = require('../src/config/prisma');
const calificacionesService = require('../src/services/calificacionesService');
const prestadoresService = require('../src/services/prestadoresService');

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
  telefono: '1122334455',
  whatsapp: '1199887766',
  emailContacto: 'contacto@mail.com',
  disponible: true,
  activo: true,
  usuario: { nombre: 'Juan' },
  oficios: [
    { oficio: { id: 'o1', nombre: 'Plomería', activo: true } },
    { oficio: { id: 'o2', nombre: 'Electricidad', activo: false } },
  ],
};

const comentarios = [
  { id: 'k1', puntaje: 5, comentario: 'Muy bueno', fechaPublicacion: new Date('2026-10-20') },
  { id: 'k2', puntaje: 4, comentario: null, fechaPublicacion: new Date('2026-10-18') },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('obtenerDetallePrestador', () => {
  it('devuelve la ficha con contacto, reputación y comentarios', async () => {
    prisma.prestador.findFirst.mockResolvedValue(prestadorBase);
    calificacionesService.obtenerReputacion.mockResolvedValue({
      prestadorId: 'p1',
      promedio: 4.5,
      totalCalificaciones: 2,
      serviciosFinalizados: 3,
    });
    calificacionesService.listarCalificacionesPrestador.mockResolvedValue(comentarios);

    const detalle = await prestadoresService.obtenerDetallePrestador('p1');

    expect(detalle).toMatchObject({
      id: 'p1',
      nombre: 'Juan',
      descripcionProfesional: 'Plomero con experiencia',
      zonaCobertura: 'Palermo',
      disponible: true,
      telefono: '1122334455',
      whatsapp: '1199887766',
      emailContacto: 'contacto@mail.com',
      oficios: [{ id: 'o1', nombre: 'Plomería' }],
      comentarios,
    });
    expect(detalle.reputacion).toEqual({
      promedio: 4.5,
      totalCalificaciones: 2,
      serviciosFinalizados: 3,
    });
  });

  it('no devuelve datos internos ni el email de la cuenta', async () => {
    prisma.prestador.findFirst.mockResolvedValue(prestadorBase);
    calificacionesService.obtenerReputacion.mockResolvedValue({
      prestadorId: 'p1',
      promedio: null,
      totalCalificaciones: 0,
      serviciosFinalizados: 0,
    });
    calificacionesService.listarCalificacionesPrestador.mockResolvedValue([]);

    const detalle = await prestadoresService.obtenerDetallePrestador('p1');

    expect(detalle).not.toHaveProperty('usuarioId');
    expect(detalle).not.toHaveProperty('email');
    expect(detalle).not.toHaveProperty('activo');
    expect(detalle.reputacion).not.toHaveProperty('prestadorId');
  });

  it('busca solo prestadores activos y con usuario activo', async () => {
    prisma.prestador.findFirst.mockResolvedValue(prestadorBase);
    calificacionesService.obtenerReputacion.mockResolvedValue({
      prestadorId: 'p1',
      promedio: null,
      totalCalificaciones: 0,
      serviciosFinalizados: 0,
    });
    calificacionesService.listarCalificacionesPrestador.mockResolvedValue([]);

    await prestadoresService.obtenerDetallePrestador('p1');

    expect(prisma.prestador.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1', activo: true, usuario: { activo: true } },
      })
    );
  });

  it('devuelve promedio null y sin comentarios si todavía no tiene calificaciones', async () => {
    prisma.prestador.findFirst.mockResolvedValue(prestadorBase);
    calificacionesService.obtenerReputacion.mockResolvedValue({
      prestadorId: 'p1',
      promedio: null,
      totalCalificaciones: 0,
      serviciosFinalizados: 0,
    });
    calificacionesService.listarCalificacionesPrestador.mockResolvedValue([]);

    const detalle = await prestadoresService.obtenerDetallePrestador('p1');

    expect(detalle.reputacion.promedio).toBeNull();
    expect(detalle.reputacion.totalCalificaciones).toBe(0);
    expect(detalle.comentarios).toEqual([]);
  });

  it('lanza 404 si el prestador no existe, está inactivo o su usuario está desactivado', async () => {
    prisma.prestador.findFirst.mockResolvedValue(null);

    await expect(prestadoresService.obtenerDetallePrestador('p9')).rejects.toMatchObject({
      status: 404,
      message: 'Prestador no encontrado',
    });
    expect(calificacionesService.obtenerReputacion).not.toHaveBeenCalled();
    expect(calificacionesService.listarCalificacionesPrestador).not.toHaveBeenCalled();
  });
});
