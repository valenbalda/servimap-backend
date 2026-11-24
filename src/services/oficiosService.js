const prisma = require('../config/prisma');

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function buscarOficio(id) {
  const oficio = await prisma.oficio.findUnique({ where: { id } });
  if (!oficio) {
    throw crearError('Oficio no encontrado', 404);
  }
  return oficio;
}

// Busca un oficio por nombre sin distinguir mayúsculas de minúsculas (Plomería = plomería).
// Con excluirId se ignora el oficio que se está editando.
async function buscarPorNombre(nombre, { excluirId } = {}) {
  return prisma.oficio.findFirst({
    where: {
      nombre: { equals: nombre, mode: 'insensitive' },
      ...(excluirId && { NOT: { id: excluirId } }),
    },
  });
}

async function listarOficios({ incluirInactivos = false } = {}) {
  return prisma.oficio.findMany({
    where: incluirInactivos ? {} : { activo: true },
    orderBy: { nombre: 'asc' },
  });
}

async function crearOficio({ nombre, categoria }) {
  const existente = await buscarPorNombre(nombre);
  if (existente) {
    throw crearError('Ya existe un oficio con ese nombre', 409);
  }

  return prisma.oficio.create({ data: { nombre, categoria } });
}

async function actualizarOficio(id, { nombre, categoria }) {
  const oficio = await buscarOficio(id);

  if (nombre && nombre !== oficio.nombre) {
    const existente = await buscarPorNombre(nombre, { excluirId: id });
    if (existente) {
      throw crearError('Ya existe un oficio con ese nombre', 409);
    }
  }

  return prisma.oficio.update({
    where: { id },
    data: { nombre, categoria },
  });
}

async function cambiarEstadoOficio(id, activo) {
  await buscarOficio(id);

  return prisma.oficio.update({
    where: { id },
    data: { activo },
  });
}

module.exports = {
  listarOficios,
  crearOficio,
  actualizarOficio,
  cambiarEstadoOficio,
};