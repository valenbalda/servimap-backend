jest.mock('../src/config/prisma', () => ({
  prestador: { findMany: jest.fn() },
}));

jest.mock('../src/services/calificacionesService', () => ({
  obtenerReputacion: jest.fn(),
}));

const prisma = require('../src/config/prisma');
const calificacionesService = require('../src/services/calificacionesService');
const prestadoresService = require('../src/services/prestadoresService');

function crearPrestador(id, nombre, extra = {}) {
  return {
    id,
    usuarioId: `u-${id}`,
    descripcionProfesional: `Descripción de ${nombre}`,
    fotoPerfil: null,
    zonaCobertura: 'Palermo',
    latitud: null,
    longitud: null,
    precioMin: null,
    precioMax: null,
    telefono: '1122334455',
    whatsapp: '1122334455',
    emailContacto: 'contacto@mail.com',
    disponible: true,
    activo: true,
    usuario: { nombre },
    oficios: [{ oficio: { id: 'o1', nombre: 'Plomería', activo: true } }],
    ...extra,
  };
}

function reputacion(prestadorId, promedio, total = 1) {
  return { prestadorId, promedio, totalCalificaciones: total, serviciosFinalizados: total };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('listarPrestadores', () => {
  it('devuelve el resumen público con la reputación, sin datos de contacto ni oficios desactivados', async () => {
    const prestador = crearPrestador('p1', 'Juan', {
      oficios: [
        { oficio: { id: 'o1', nombre: 'Plomería', activo: true } },
        { oficio: { id: 'o2', nombre: 'Electricidad', activo: false } },
      ],
    });
    prisma.prestador.findMany.mockResolvedValue([prestador]);
    calificacionesService.obtenerReputacion.mockResolvedValue(reputacion('p1', 4.5, 2));

    const lista = await prestadoresService.listarPrestadores();

    expect(prisma.prestador.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ activo: true, usuario: { activo: true } }),
      })
    );
    expect(lista).toHaveLength(1);
    expect(lista[0].nombre).toBe('Juan');
    expect(lista[0].oficios).toEqual([{ id: 'o1', nombre: 'Plomería' }]);
    expect(lista[0].reputacion).toEqual({
      promedio: 4.5,
      totalCalificaciones: 2,
      serviciosFinalizados: 2,
    });
    expect(lista[0].telefono).toBeUndefined();
    expect(lista[0].whatsapp).toBeUndefined();
    expect(lista[0].emailContacto).toBeUndefined();
    expect(lista[0].distanciaKm).toBeUndefined();
  });

  it('filtra por oficio', async () => {
    prisma.prestador.findMany.mockResolvedValue([]);

    await prestadoresService.listarPrestadores({ oficioId: 'o1' });

    expect(prisma.prestador.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          oficios: { some: { oficioId: 'o1', oficio: { activo: true } } },
        }),
      })
    );
  });

  it('busca por nombre, zona u oficio sin distinguir mayúsculas', async () => {
    prisma.prestador.findMany.mockResolvedValue([]);

    await prestadoresService.listarPrestadores({ q: 'plom' });

    const { where } = prisma.prestador.findMany.mock.calls[0][0];
    expect(where.OR).toHaveLength(3);
    expect(where.OR[0]).toEqual({
      usuario: { nombre: { contains: 'plom', mode: 'insensitive' } },
    });
  });

  it('filtra por distancia y ordena del más cerca al más lejos', async () => {
    const cerca = crearPrestador('pa', 'Ana', { latitud: -34.605, longitud: -58.4 });
    const medio = crearPrestador('pb', 'Beto', { latitud: -34.63, longitud: -58.4 });
    const lejos = crearPrestador('pc', 'Carla', { latitud: -31.42, longitud: -64.18 });
    prisma.prestador.findMany.mockResolvedValue([medio, lejos, cerca]);
    calificacionesService.obtenerReputacion.mockImplementation(async (id) =>
      reputacion(id, null, 0)
    );

    const lista = await prestadoresService.listarPrestadores({
      lat: -34.6,
      lng: -58.4,
      radioKm: 10,
    });

    expect(prisma.prestador.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          latitud: { not: null },
          longitud: { not: null },
        }),
      })
    );
    expect(lista.map((p) => p.id)).toEqual(['pa', 'pb']);
    expect(lista[0].distanciaKm).toBeLessThan(lista[1].distanciaKm);
    expect(lista[1].distanciaKm).toBeLessThanOrEqual(10);
  });

  it('filtra por calificación mínima y deja afuera a los que no tienen calificaciones', async () => {
    prisma.prestador.findMany.mockResolvedValue([
      crearPrestador('p1', 'Ana'),
      crearPrestador('p2', 'Beto'),
      crearPrestador('p3', 'Carla'),
    ]);
    const promedios = { p1: 4.8, p2: 3, p3: null };
    calificacionesService.obtenerReputacion.mockImplementation(async (id) =>
      reputacion(id, promedios[id])
    );

    const lista = await prestadoresService.listarPrestadores({ calificacionMin: 4 });

    expect(lista.map((p) => p.id)).toEqual(['p1']);
  });

  it('respeta el limit y calcula la reputación solo de los devueltos', async () => {
    prisma.prestador.findMany.mockResolvedValue([
      crearPrestador('p1', 'Ana'),
      crearPrestador('p2', 'Beto'),
      crearPrestador('p3', 'Carla'),
    ]);
    calificacionesService.obtenerReputacion.mockImplementation(async (id) =>
      reputacion(id, 5)
    );

    const lista = await prestadoresService.listarPrestadores({ limit: 2 });

    expect(lista.map((p) => p.id)).toEqual(['p1', 'p2']);
    expect(calificacionesService.obtenerReputacion).toHaveBeenCalledTimes(2);
  });

  it('devuelve promedio null si el prestador todavía no tiene calificaciones', async () => {
    prisma.prestador.findMany.mockResolvedValue([crearPrestador('p1', 'Juan')]);
    calificacionesService.obtenerReputacion.mockResolvedValue(reputacion('p1', null, 0));

    const lista = await prestadoresService.listarPrestadores();

    expect(lista[0].reputacion.promedio).toBeNull();
    expect(lista[0].reputacion.totalCalificaciones).toBe(0);
  });
});