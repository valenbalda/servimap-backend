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

async function listarOficios({ incluirInactivos = false } = {}) {
  return prisma.oficio.findMany({
    where: incluirInactivos ? {} : { activo: true },
    orderBy: { nombre: 'asc' },
  });
}

async function crearOficio({ nombre, categoria }) {
  const existente = await prisma.oficio.findUnique({ where: { nombre } });
  if (existente) {
    throw crearError('Ya existe un oficio con ese nombre', 409);
  }

  return prisma.oficio.create({ data: { nombre, categoria } });
}

async function actualizarOficio(id, { nombre, categoria, activo }) {
  const oficio = await buscarOficio(id);

  if (nombre && nombre !== oficio.nombre) {
    const existente = await prisma.oficio.findUnique({ where: { nombre } });
    if (existente) {
      throw crearError('Ya existe un oficio con ese nombre', 409);
    }
  }

  return prisma.oficio.update({
    where: { id },
    data: { nombre, categoria, activo },
  });
}

async function desactivarOficio(id) {
  await buscarOficio(id);

  return prisma.oficio.update({
    where: { id },
    data: { activo: false },
  });
}

module.exports = {
  listarOficios,
  crearOficio,
  actualizarOficio,
  desactivarOficio,
};
