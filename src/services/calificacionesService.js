const prisma = require('../config/prisma');

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function crearCalificacion({ clienteId, solicitudId, puntaje, comentario }) {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id: solicitudId },
    include: { calificacion: true },
  });

  if (!solicitud) {
    throw crearError('Solicitud no encontrada', 404);
  }

  if (solicitud.clienteId !== clienteId) {
    throw crearError('Solo podés calificar tus propias solicitudes', 403);
  }

  if (solicitud.estado !== 'FINALIZADA') {
    throw crearError('Solo se puede calificar una solicitud finalizada', 409);
  }

  if (solicitud.calificacion) {
    throw crearError('Esta solicitud ya fue calificada', 409);
  }

  return prisma.calificacion.create({
    data: {
      puntaje,
      comentario,
      solicitudId,
      clienteId,
      prestadorId: solicitud.prestadorId,
    },
  });
}

module.exports = { crearCalificacion };