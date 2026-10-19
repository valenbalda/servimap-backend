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

async function editarComentario({ clienteId, calificacionId, comentario }) {
  const calificacion = await prisma.calificacion.findUnique({
    where: { id: calificacionId },
  });

  if (!calificacion) {
    throw crearError('Calificación no encontrada', 404);
  }

  if (calificacion.clienteId !== clienteId) {
    throw crearError('Solo podés editar tus propias calificaciones', 403);
  }

  if (calificacion.moderada) {
    throw crearError('No se puede editar una calificación moderada', 409);
  }

  return prisma.calificacion.update({
    where: { id: calificacionId },
    data: { comentario },
  });
}

async function verificarPrestador(prestadorId) {
  const prestador = await prisma.prestador.findUnique({
    where: { id: prestadorId },
  });
  if (!prestador) {
    throw crearError('Prestador no encontrado', 404);
  }
}

async function obtenerReputacion(prestadorId) {
  await verificarPrestador(prestadorId);

  const [calificaciones, serviciosFinalizados] = await Promise.all([
    prisma.calificacion.aggregate({
      where: { prestadorId },
      _avg: { puntaje: true },
      _count: { puntaje: true },
    }),
    prisma.solicitud.count({
      where: { prestadorId, estado: 'FINALIZADA' },
    }),
  ]);

  const promedio = calificaciones._avg.puntaje;

  return {
    prestadorId,
    promedio: promedio === null ? null : Math.round(promedio * 10) / 10,
    totalCalificaciones: calificaciones._count.puntaje,
    serviciosFinalizados,
  };
}

async function listarCalificacionesPrestador(prestadorId) {
  await verificarPrestador(prestadorId);

  return prisma.calificacion.findMany({
    where: { prestadorId, moderada: false },
    orderBy: { fechaPublicacion: 'desc' },
    select: {
      id: true,
      puntaje: true,
      comentario: true,
      fechaPublicacion: true,
    },
  });
}

async function listarTodasLasCalificaciones() {
  return prisma.calificacion.findMany({
    orderBy: { fechaPublicacion: 'desc' },
  });
}

async function moderarCalificacion(id, motivo) {
  const calificacion = await prisma.calificacion.findUnique({ where: { id } });

  if (!calificacion) {
    throw crearError('Calificación no encontrada', 404);
  }

  if (calificacion.moderada) {
    throw crearError('La calificación ya fue moderada', 409);
  }

  return prisma.calificacion.update({
    where: { id },
    data: {
      moderada: true,
      fechaModeracion: new Date(),
      motivoModeracion: motivo,
    },
  });
}

module.exports = {
  crearCalificacion,
  editarComentario,
  obtenerReputacion,
  listarCalificacionesPrestador,
  listarTodasLasCalificaciones,
  moderarCalificacion,
};