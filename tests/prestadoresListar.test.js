jest.mock('../src/config/prisma', () => ({
  prestador: { findMany: jest.fn() },
}));

jest.mock('../src/services/calificacionesService', () => ({
  obtenerReputacion: jest.fn(),
}));

const prisma = require('../src/config/prisma');
const calificacionesService = require('../src/services/calificacionesService');
const prestadoresService = require('../src/services/prestadoresService');
const { caso } = require('./qase/qase');

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
  it(caso('TC-PRE-033', 'devuelve el resumen público con la reputación, sin datos de contacto ni oficios desactivados'), async () => {
    const prestador = crearPrestador('p1', 'Juan', {
      oficios: [
        { oficio: { id: 'o1', nombre: 'Plomería', activo: true } },
        { oficio: { id: 'o2', nombre: 'Electricidad', activo: false } },
      ],
    });
    prisma.prestador.findMany.mockResolvedValue([prestador]);
    calificacionesService.obtenerReputacion.mockResolvedValue(reputacion('p1', 4.5, 2));

    const { registros: lista } = await prestadoresService.listarPrestadores();

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

  it(caso('TC-PRE-034', 'filtra por oficio'), async () => {
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

  it(caso('TC-PRE-035', 'busca por nombre, zona u oficio sin distinguir mayúsculas'), async () => {
    prisma.prestador.findMany.mockResolvedValue([]);

    await prestadoresService.listarPrestadores({ q: 'plom' });

    const { where } = prisma.prestador.findMany.mock.calls[0][0];
    expect(where.OR).toHaveLength(3);
    expect(where.OR[0]).toEqual({
      usuario: { nombre: { contains: 'plom', mode: 'insensitive' } },
    });
  });

  it(caso('TC-PRE-036', 'filtra por distancia y ordena del más cerca al más lejos'), async () => {
    const cerca = crearPrestador('pa', 'Ana', { latitud: -34.605, longitud: -58.4 });
    const medio = crearPrestador('pb', 'Beto', { latitud: -34.63, longitud: -58.4 });
    const lejos = crearPrestador('pc', 'Carla', { latitud: -31.42, longitud: -64.18 });
    prisma.prestador.findMany.mockResolvedValue([medio, lejos, cerca]);
    calificacionesService.obtenerReputacion.mockImplementation(async (id) =>
      reputacion(id, null, 0)
    );

    const { registros: lista } = await prestadoresService.listarPrestadores({
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

  it(caso('TC-PRE-037', 'filtra por calificación mínima y deja afuera a los que no tienen calificaciones'), async () => {
    prisma.prestador.findMany.mockResolvedValue([
      crearPrestador('p1', 'Ana'),
      crearPrestador('p2', 'Beto'),
      crearPrestador('p3', 'Carla'),
    ]);
    const promedios = { p1: 4.8, p2: 3, p3: null };
    calificacionesService.obtenerReputacion.mockImplementation(async (id) =>
      reputacion(id, promedios[id])
    );

    const { registros: lista } = await prestadoresService.listarPrestadores({ calificacionMin: 4 });

    expect(lista.map((p) => p.id)).toEqual(['p1']);
  });

  it(caso('TC-PRE-038', 'respeta el limit y calcula la reputación solo de los devueltos'), async () => {
    prisma.prestador.findMany.mockResolvedValue([
      crearPrestador('p1', 'Ana'),
      crearPrestador('p2', 'Beto'),
      crearPrestador('p3', 'Carla'),
    ]);
    calificacionesService.obtenerReputacion.mockImplementation(async (id) =>
      reputacion(id, 5)
    );

    const { registros: lista } = await prestadoresService.listarPrestadores({ limit: 2 });

    expect(lista.map((p) => p.id)).toEqual(['p1', 'p2']);
    expect(calificacionesService.obtenerReputacion).toHaveBeenCalledTimes(2);
  });

  it(caso('TC-PRE-039', 'devuelve promedio null si el prestador todavía no tiene calificaciones'), async () => {
    prisma.prestador.findMany.mockResolvedValue([crearPrestador('p1', 'Juan')]);
    calificacionesService.obtenerReputacion.mockResolvedValue(reputacion('p1', null, 0));

    const { registros: lista } = await prestadoresService.listarPrestadores();

    expect(lista[0].reputacion.promedio).toBeNull();
    expect(lista[0].reputacion.totalCalificaciones).toBe(0);
  });

  it(caso('TC-PRE-060', 'devuelve la página pedida con el total de registros y de páginas'), async () => {
    prisma.prestador.findMany.mockResolvedValue(
      ['p1', 'p2', 'p3', 'p4', 'p5'].map((id) => crearPrestador(id, `Nombre ${id}`))
    );
    calificacionesService.obtenerReputacion.mockImplementation(async (id) =>
      reputacion(id, 5)
    );

    const respuesta = await prestadoresService.listarPrestadores({ page: 2, limit: 2 });

    expect(respuesta.registros.map((p) => p.id)).toEqual(['p3', 'p4']);
    expect(respuesta.totalRegistros).toBe(5);
    expect(respuesta.pagina).toBe(2);
    expect(respuesta.limite).toBe(2);
    expect(respuesta.totalPaginas).toBe(3);
    expect(calificacionesService.obtenerReputacion).toHaveBeenCalledTimes(2);
  });

  it(caso('TC-PRE-061', 'por defecto devuelve la primera página de 50 y una página fuera de rango queda vacía'), async () => {
    prisma.prestador.findMany.mockResolvedValue([
      crearPrestador('p1', 'Ana'),
      crearPrestador('p2', 'Beto'),
      crearPrestador('p3', 'Carla'),
    ]);
    calificacionesService.obtenerReputacion.mockImplementation(async (id) =>
      reputacion(id, 5)
    );

    const porDefecto = await prestadoresService.listarPrestadores();
    const fueraDeRango = await prestadoresService.listarPrestadores({ page: 9 });

    expect(porDefecto.registros).toHaveLength(3);
    expect(porDefecto.pagina).toBe(1);
    expect(porDefecto.limite).toBe(50);
    expect(porDefecto.totalPaginas).toBe(1);
    expect(fueraDeRango.registros).toEqual([]);
    expect(fueraDeRango.totalRegistros).toBe(3);
    expect(fueraDeRango.totalPaginas).toBe(1);
  });

  it(caso('TC-PRE-062', 'filtra por calificación mínima antes de paginar'), async () => {
    prisma.prestador.findMany.mockResolvedValue([
      crearPrestador('p1', 'Ana'),
      crearPrestador('p2', 'Beto'),
      crearPrestador('p3', 'Carla'),
      crearPrestador('p4', 'Diego'),
    ]);
    const promedios = { p1: 4.8, p2: 3, p3: 4.1, p4: 5 };
    calificacionesService.obtenerReputacion.mockImplementation(async (id) =>
      reputacion(id, promedios[id])
    );

    const respuesta = await prestadoresService.listarPrestadores({
      calificacionMin: 4,
      limit: 2,
      page: 2,
    });

    expect(respuesta.registros.map((p) => p.id)).toEqual(['p4']);
    expect(respuesta.totalRegistros).toBe(3);
    expect(respuesta.totalPaginas).toBe(2);
  });

  it(caso('TC-PRE-063', 'ordena por nombre y desempata por id para que las páginas sean estables'), async () => {
    prisma.prestador.findMany.mockResolvedValue([]);

    await prestadoresService.listarPrestadores();

    expect(prisma.prestador.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ usuario: { nombre: 'asc' } }, { id: 'asc' }],
      })
    );
  });
});
