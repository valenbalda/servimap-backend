const prisma = require('../config/prisma');

// 2 decimales equivalen a unos 1 km: la ubicación es aproximada, no el domicilio exacto.
const DECIMALES_UBICACION = 2;
const MAXIMO_MARCADORES = 200;

function aproximar(valor) {
  return Number(Number(valor).toFixed(DECIMALES_UBICACION));
}

function redondearPromedio(promedio) {
  return promedio === null ? null : Math.round(promedio * 10) / 10;
}

// Marcadores del mapa: prestadores activos y disponibles, con ubicación aproximada.
async function listarMarcadores({ oficioId } = {}) {
  const prestadores = await prisma.prestador.findMany({
    where: {
      activo: true,
      disponible: true,
      usuario: { activo: true },
      latitud: { not: null },
      longitud: { not: null },
      oficios: { some: { ...(oficioId && { oficioId }), oficio: { activo: true } } },
    },
    include: {
      usuario: { select: { nombre: true } },
      oficios: {
        where: { oficio: { activo: true } },
        orderBy: { oficio: { nombre: 'asc' } },
        include: { oficio: { select: { nombre: true } } },
      },
    },
    orderBy: { usuario: { nombre: 'asc' } },
    take: MAXIMO_MARCADORES,
  });

  if (prestadores.length === 0) {
    return [];
  }

  // Un solo pedido a la base trae el promedio de todos los prestadores encontrados.
  const promedios = await prisma.calificacion.groupBy({
    by: ['prestadorId'],
    where: { prestadorId: { in: prestadores.map((prestador) => prestador.id) } },
    _avg: { puntaje: true },
  });
  const promedioPorPrestador = new Map(
    promedios.map((fila) => [fila.prestadorId, fila._avg.puntaje])
  );

  return prestadores.map((prestador) => ({
    id: prestador.id,
    nombre: prestador.usuario.nombre,
    latitud: aproximar(prestador.latitud),
    longitud: aproximar(prestador.longitud),
    oficioPrincipal: prestador.oficios[0].oficio.nombre,
    promedio: redondearPromedio(promedioPorPrestador.get(prestador.id) ?? null),
  }));
}

module.exports = { listarMarcadores };