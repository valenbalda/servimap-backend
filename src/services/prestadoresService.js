const prisma = require('../config/prisma');

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

// Prisma devuelve los decimales como objetos especiales; los pasamos a número.
function aNumero(valor) {
  return valor === null || valor === undefined ? null : Number(valor);
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

module.exports = { obtenerMiPerfil, actualizarMiPerfil };