const prisma = require('../config/prisma');
const calificacionesService = require('./calificacionesService');

const RADIO_TIERRA_KM = 6371;

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

// Prisma devuelve los decimales como objetos especiales; los pasamos a número.
function aNumero(valor) {
  return valor === null || valor === undefined ? null : Number(valor);
}

function aRadianes(grados) {
  return (grados * Math.PI) / 180;
}

// Distancia en km entre dos puntos del mapa (fórmula de haversine).
function distanciaKm(lat1, lng1, lat2, lng2) {
  const dLat = aRadianes(lat2 - lat1);
  const dLng = aRadianes(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(a));
}

function redondear(valor) {
  return Math.round(valor * 10) / 10;
}

// Qué datos relacionados se traen junto con el prestador.
const INCLUIR = {
  usuario: { select: { nombre: true, email: true } },
  oficios: { include: { oficio: true } },
};

// Arma la respuesta que ve el prestador (sin datos internos).
function formatearPerfil(prestador) {
  return {
    id: prestador.id,
    nombre: prestador.usuario.nombre,
    email: prestador.usuario.email,
    descripcionProfesional: prestador.descripcionProfesional,
    fotoPerfil: prestador.fotoPerfil,
    zonaCobertura: prestador.zonaCobertura,
    latitud: aNumero(prestador.latitud),
    longitud: aNumero(prestador.longitud),
    precioMin: aNumero(prestador.precioMin),
    precioMax: aNumero(prestador.precioMax),
    telefono: prestador.telefono,
    whatsapp: prestador.whatsapp,
    emailContacto: prestador.emailContacto,
    disponible: prestador.disponible,
    oficios: prestador.oficios.map((po) => ({
      id: po.oficio.id,
      nombre: po.oficio.nombre,
    })),
  };
}

// Arma el resumen público para el listado (sin datos de contacto).
function formatearResumen(prestador) {
  return {
    id: prestador.id,
    nombre: prestador.usuario.nombre,
    descripcionProfesional: prestador.descripcionProfesional,
    fotoPerfil: prestador.fotoPerfil,
    zonaCobertura: prestador.zonaCobertura,
    latitud: aNumero(prestador.latitud),
    longitud: aNumero(prestador.longitud),
    precioMin: aNumero(prestador.precioMin),
    precioMax: aNumero(prestador.precioMax),
    disponible: prestador.disponible,
    oficios: prestador.oficios
      .filter((po) => po.oficio.activo)
      .map((po) => ({ id: po.oficio.id, nombre: po.oficio.nombre })),
  };
}

async function buscarPrestador(usuarioId) {
  const prestador = await prisma.prestador.findUnique({
    where: { usuarioId },
    include: INCLUIR,
  });

  if (!prestador || !prestador.activo) {
    throw crearError('Perfil de prestador no encontrado', 404);
  }

  return prestador;
}

async function obtenerMiPerfil(usuarioId) {
  const prestador = await buscarPrestador(usuarioId);
  return formatearPerfil(prestador);
}

async function actualizarMiPerfil(usuarioId, datos) {
  const actual = await buscarPrestador(usuarioId);

  // Si solo se manda uno de los precios, se compara con el que ya estaba guardado.
  const min = datos.precioMin !== undefined ? datos.precioMin : aNumero(actual.precioMin);
  const max = datos.precioMax !== undefined ? datos.precioMax : aNumero(actual.precioMax);

  if (min !== null && max !== null && min > max) {
    throw crearError('El precio mínimo no puede ser mayor al máximo', 400);
  }

  const actualizado = await prisma.prestador.update({
    where: { usuarioId },
    data: datos,
    include: INCLUIR,
  });

  return formatearPerfil(actualizado);
}

// Reemplaza los oficios del prestador por la lista que manda.
async function asignarMisOficios(usuarioId, oficioIds) {
  const prestador = await buscarPrestador(usuarioId);

  // Sin repetidos: si mandan el mismo id dos veces, cuenta una sola vez.
  const ids = [...new Set(oficioIds)];

  // Solo se aceptan oficios que existan y estén activos.
  const oficios = await prisma.oficio.findMany({
    where: { id: { in: ids }, activo: true },
    select: { id: true },
  });

  if (oficios.length !== ids.length) {
    throw crearError('Algún oficio no existe o está desactivado', 400);
  }

  // Se borran los oficios anteriores y se crean los nuevos, todo junto o nada.
  await prisma.$transaction([
    prisma.prestadorOficio.deleteMany({ where: { prestadorId: prestador.id } }),
    prisma.prestadorOficio.createMany({
      data: ids.map((oficioId) => ({ prestadorId: prestador.id, oficioId })),
    }),
  ]);

  return obtenerMiPerfil(usuarioId);
}

// Busca prestadores (público): filtros por oficio, texto y cercanía, con su reputación.
async function listarPrestadores({
  oficioId,
  q,
  lat,
  lng,
  radioKm = 10,
  calificacionMin,
  limit = 20,
} = {}) {
  const conUbicacion = lat !== undefined && lng !== undefined;

  // Solo prestadores activos, con usuario activo y con algún oficio activo.
  const where = {
    activo: true,
    usuario: { activo: true },
    oficios: { some: { ...(oficioId && { oficioId }), oficio: { activo: true } } },
  };

  if (q) {
    where.OR = [
      { usuario: { nombre: { contains: q, mode: 'insensitive' } } },
      { zonaCobertura: { contains: q, mode: 'insensitive' } },
      { oficios: { some: { oficio: { nombre: { contains: q, mode: 'insensitive' } } } } },
    ];
  }

  // Para medir distancias hacen falta las coordenadas.
  if (conUbicacion) {
    where.latitud = { not: null };
    where.longitud = { not: null };
  }

  const prestadores = await prisma.prestador.findMany({
    where,
    include: {
      usuario: { select: { nombre: true } },
      oficios: { include: { oficio: true } },
    },
    orderBy: { usuario: { nombre: 'asc' } },
  });

  let resultados = prestadores.map((prestador) => {
    const resumen = formatearResumen(prestador);
    if (!conUbicacion) return resumen;
    return {
      ...resumen,
      distanciaKm: redondear(distanciaKm(lat, lng, resumen.latitud, resumen.longitud)),
    };
  });

  // Con ubicación: solo los que están dentro del radio, del más cerca al más lejos.
  if (conUbicacion) {
    resultados = resultados
      .filter((prestador) => prestador.distanciaKm <= radioKm)
      .sort((a, b) => a.distanciaKm - b.distanciaKm);
  }

  // Reutiliza la reputación de Valen para no calcular el promedio dos veces.
  const conReputacion = async (prestador) => {
    const { promedio, totalCalificaciones, serviciosFinalizados } =
      await calificacionesService.obtenerReputacion(prestador.id);
    return { ...prestador, reputacion: { promedio, totalCalificaciones, serviciosFinalizados } };
  };

  // Sin filtro por calificación, la reputación se calcula solo para los que se devuelven.
  if (calificacionMin === undefined) {
    return Promise.all(resultados.slice(0, limit).map(conReputacion));
  }

  const todos = await Promise.all(resultados.map(conReputacion));
  return todos
    .filter(
      (prestador) =>
        prestador.reputacion.promedio !== null &&
        prestador.reputacion.promedio >= calificacionMin
    )
    .slice(0, limit);
}

module.exports = {
  obtenerMiPerfil,
  actualizarMiPerfil,
  asignarMisOficios,
  listarPrestadores,
};