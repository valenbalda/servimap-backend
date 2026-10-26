jest.mock('../src/config/prisma', () => ({
  prestador: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn() },
}));

jest.mock('../src/services/calificacionesService', () => ({
  obtenerReputacion: jest.fn(),
  listarCalificacionesPrestador: jest.fn(),
}));

const prisma = require('../src/config/prisma');
const calificacionesService = require('../src/services/calificacionesService');
const prestadoresService = require('../src/services/prestadoresService');

function crearPrestador(id, latitud, longitud) {
  return {
    id,
    usuarioId: `u-${id}`,
    descripcionProfesional: null,
    fotoPerfil: null,
    zonaCobertura: 'Palermo',
    latitud,
    longitud,
    precioMin: null,
    precioMax: null,
    telefono: null,
    whatsapp: null,
    emailContacto: null,
    disponible: true,
    activo: true,
    usuario: { nombre: `Prestador ${id}`, email: 'cuenta@mail.com' },
    oficios: [{ oficio: { id: 'o1', nombre: 'Plomería', activo: true } }],
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  calificacionesService.obtenerReputacion.mockResolvedValue({
    prestadorId: 'p1',
    promedio: null,
    totalCalificaciones: 0,
    serviciosFinalizados: 0,
  });
  calificacionesService.listarCalificacionesPrestador.mockResolvedValue([]);
});

describe('ubicación aproximada', () => {
  it('el listado devuelve las coordenadas redondeadas a 2 decimales', async () => {
    prisma.prestador.findMany.mockResolvedValue([crearPrestador('p1', '-34.603722', '-58.381592')]);

    const [prestador] = await prestadoresService.listarPrestadores();

    expect(prestador.latitud).toBe(-34.6);
    expect(prestador.longitud).toBe(-58.38);
  });

  it('la ficha devuelve las coordenadas redondeadas a 2 decimales', async () => {
    prisma.prestador.findFirst.mockResolvedValue(crearPrestador('p1', '-34.603722', '-58.381592'));

    const detalle = await prestadoresService.obtenerDetallePrestador('p1');

    expect(detalle.latitud).toBe(-34.6);
    expect(detalle.longitud).toBe(-58.38);
  });

  it('el perfil propio sigue devolviendo la coordenada exacta', async () => {
    prisma.prestador.findUnique.mockResolvedValue(crearPrestador('p1', '-34.603722', '-58.381592'));

    const perfil = await prestadoresService.obtenerMiPerfil('u-p1');

    expect(perfil.latitud).toBe(-34.603722);
    expect(perfil.longitud).toBe(-58.381592);
  });

  it('un prestador sin coordenadas las sigue devolviendo como null', async () => {
    prisma.prestador.findMany.mockResolvedValue([crearPrestador('p1', null, null)]);

    const [prestador] = await prestadoresService.listarPrestadores();

    expect(prestador.latitud).toBeNull();
    expect(prestador.longitud).toBeNull();
  });

  it('la distancia se calcula con la coordenada aproximada y no con la exacta', async () => {
    // Las dos ubicaciones difieren en ~500 m, pero se redondean al mismo punto.
    prisma.prestador.findMany.mockResolvedValue([
      crearPrestador('p1', '-34.6001', '-58.4'),
      crearPrestador('p2', '-34.6049', '-58.4'),
    ]);

    const lista = await prestadoresService.listarPrestadores({
      lat: -34.5,
      lng: -58.4,
      radioKm: 50,
    });

    expect(lista).toHaveLength(2);
    expect(lista[0].distanciaKm).toBe(lista[1].distanciaKm);
  });
});