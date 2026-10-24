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

async function buscarSolicitud(id) {
  const solicitud = await prisma.solicitud.findUnique({ where: { id } });
  if (!solicitud) {
    throw crearError('Solicitud no encontrada', 404);
  }
  return solicitud;
}

// Cambio de estado que solo puede hacer el prestador dueño de la solicitud.
// Se revisa en este orden: existe (404), es suya (403), el estado lo permite (409).
async function cambiarEstadoComoPrestador(usuarioId, solicitudId, { desde, hacia, mensajeConflicto }) {
  const solicitud = await buscarSolicitud(solicitudId);

  // El prestador es otra tabla: se busca su perfil a partir del usuario.
  const prestador = await prisma.prestador.findUnique({ where: { usuarioId } });
  if (!prestador || !prestador.activo || solicitud.prestadorId !== prestador.id) {
    throw crearError('La solicitud no es tuya', 403);
  }

  if (solicitud.estado !== desde) {
    throw crearError(mensajeConflicto, 409);
  }

  const actualizada = await prisma.solicitud.update({
    where: { id: solicitudId },
    data: { estado: hacia },
  });

  return formatearSolicitud(actualizada);
}

function aceptarSolicitud(usuarioId, solicitudId) {
  return cambiarEstadoComoPrestador(usuarioId, solicitudId, {
    desde: 'PENDIENTE',
    hacia: 'ACEPTADA',
    mensajeConflicto: 'Solo se puede responder una solicitud pendiente',
  });
}

function rechazarSolicitud(usuarioId, solicitudId) {
  return cambiarEstadoComoPrestador(usuarioId, solicitudId, {
    desde: 'PENDIENTE',
    hacia: 'RECHAZADA',
    mensajeConflicto: 'Solo se puede responder una solicitud pendiente',
  });
}

// Solo se puede finalizar una solicitud que ya fue aceptada.
function finalizarSolicitud(usuarioId, solicitudId) {
  return cambiarEstadoComoPrestador(usuarioId, solicitudId, {
    desde: 'ACEPTADA',
    hacia: 'FINALIZADA',
    mensajeConflicto: 'Solo se puede finalizar una solicitud aceptada',
  });
}

// El cliente dueño puede cancelar mientras no esté finalizada, rechazada o cancelada.
async function cancelarSolicitud(clienteId, solicitudId) {
  const solicitud = await buscarSolicitud(solicitudId);

  if (solicitud.clienteId !== clienteId) {
    throw crearError('La solicitud no es tuya', 403);
  }

  if (!['PENDIENTE', 'ACEPTADA'].includes(solicitud.estado)) {
    throw crearError('La solicitud ya no se puede cancelar', 409);
  }

  const actualizada = await prisma.solicitud.update({
    where: { id: solicitudId },
    data: { estado: 'CANCELADA' },
  });

  return formatearSolicitud(actualizada);
}

module.exports = {
  crearSolicitud,
  aceptarSolicitud,
  rechazarSolicitud,
  finalizarSolicitud,
  cancelarSolicitud,
};