const { put, del } = require('@vercel/blob');
const prisma = require('../config/prisma');

// Las fotos se guardan en el store público de Vercel Blob (servimap-fotos).
// Esta es la terminación de las URLs de ese store; sirve para distinguir
// nuestras fotos de URLs externas que pudo cargar un prestador a mano.
const DOMINIO_BLOB = '.blob.vercel-storage.com';

const EXTENSIONES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

function esFotoDelStore(url) {
  if (typeof url !== 'string') return false;
  try {
    return new URL(url).hostname.endsWith(DOMINIO_BLOB);
  } catch {
    return false;
  }
}

// Borrar del store es "lo mejor posible": si falla, la foto vieja queda
// huérfana pero el usuario no tiene por qué enterarse ni perder su cambio.
async function borrarDelStore(url) {
  if (!esFotoDelStore(url)) return;
  try {
    await del(url);
  } catch (error) {
    console.error('No se pudo borrar la foto del store', error);
  }
}

// Los prestadores guardan la foto en Prestador.fotoPerfil (el campo que ya
// usaban los listados y la ficha). Los clientes, en Usuario.fotoPerfil.
async function buscarFotoActual(usuarioId, rol) {
  if (rol === 'PRESTADOR') {
    const prestador = await prisma.prestador.findUnique({
      where: { usuarioId },
      select: { fotoPerfil: true, activo: true },
    });
    if (!prestador?.activo) {
      throw crearError('Perfil de prestador no encontrado', 404);
    }
    return prestador.fotoPerfil;
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { fotoPerfil: true, activo: true },
  });
  if (!usuario?.activo) {
    throw crearError('Usuario no encontrado', 404);
  }
  return usuario.fotoPerfil;
}

async function guardarFoto(usuarioId, rol, fotoPerfil) {
  if (rol === 'PRESTADOR') {
    await prisma.prestador.update({ where: { usuarioId }, data: { fotoPerfil } });
  } else {
    await prisma.usuario.update({ where: { id: usuarioId }, data: { fotoPerfil } });
  }
}

// Sube la foto (o reemplaza la anterior) y devuelve la URL pública.
async function subirFoto(usuarioId, rol, { buffer, tipo }) {
  const anterior = await buscarFotoActual(usuarioId, rol);

  // addRandomSuffix: cada subida tiene una URL nueva, así el navegador no
  // muestra la foto vieja que quedó en caché.
  const subida = await put(`fotos-perfil/${usuarioId}.${EXTENSIONES[tipo]}`, buffer, {
    access: 'public',
    contentType: tipo,
    addRandomSuffix: true,
  });

  try {
    await guardarFoto(usuarioId, rol, subida.url);
  } catch (error) {
    // Si no se pudo guardar en la base, no dejamos la foto nueva huérfana.
    await borrarDelStore(subida.url);
    throw error;
  }

  await borrarDelStore(anterior);

  return { fotoPerfil: subida.url };
}

// Quita la foto de perfil. Si no tenía, responde 404.
async function eliminarFoto(usuarioId, rol) {
  const anterior = await buscarFotoActual(usuarioId, rol);

  if (!anterior) {
    throw crearError('No tenés una foto de perfil', 404);
  }

  await guardarFoto(usuarioId, rol, null);
  await borrarDelStore(anterior);

  return { fotoPerfil: null };
}

module.exports = { subirFoto, eliminarFoto, esFotoDelStore };