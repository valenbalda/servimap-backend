const prisma = require('../config/prisma');

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

// Arma la respuesta de una solicitud (sin datos internos).
function formatearSolicitud(solicitud) {
  return {
    id: solicitud.id,
    descripcion: solicitud.descripcion,
    direccion: solicitud.direccion,
    contactoPreferido: solicitud.contactoPreferido,
    estado: solicitud.estado,
    fechaCreacion: solicitud.fechaCreacion,
    clienteId: solicitud.clienteId,
    prestadorId: solicitud.prestadorId,
    oficioId: solicitud.oficioId,
  };
}

async function crearSolicitud(clienteId, { prestadorId, oficioId, descripcion, direccion, contactoPreferido }) {
  // El prestador tiene que existir, estar activo y disponible.
  const prestador = await prisma.prestador.findUnique({
    where: { id: prestadorId },
    include: { oficios: true },
  });

  if (!prestador || !prestador.activo) {
    throw crearError('Prestador no encontrado', 404);
  }
  if (!prestador.disponible) {
    throw crearError('El prestador no está disponible', 409);
  }

  // El oficio tiene que existir y estar activo.
  const oficio = await prisma.oficio.findUnique({ where: { id: oficioId } });
  if (!oficio || !oficio.activo) {
    throw crearError('El oficio no existe o está desactivado', 400);
  }

  // Y el prestador tiene que ofrecer ese oficio.
  const ofreceElOficio = prestador.oficios.some((po) => po.oficioId === oficioId);
  if (!ofreceElOficio) {
    throw crearError('El prestador no ofrece ese oficio', 400);
  }

  const solicitud = await prisma.solicitud.create({
    data: {
      descripcion,
      direccion,
      contactoPreferido,
      clienteId,
      prestadorId,
      oficioId,
    },
  });

  return formatearSolicitud(solicitud);
}

module.exports = { crearSolicitud };