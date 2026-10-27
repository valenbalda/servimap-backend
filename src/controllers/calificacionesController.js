const calificacionesService = require('../services/calificacionesService');

const MAX_COMENTARIO_LENGTH = 500;
const MAX_MOTIVO_LENGTH = 200;

async function crear(req, res, next) {
  try {
    const { solicitudId, puntaje, comentario } = req.body;

    if (typeof solicitudId !== 'string' || !solicitudId.trim()) {
      return res.status(400).json({ error: 'La solicitud es obligatoria' });
    }

    if (!Number.isInteger(puntaje) || puntaje < 1 || puntaje > 5) {
      return res
        .status(400)
        .json({ error: 'El puntaje debe ser un número entero entre 1 y 5' });
    }

    if (
      comentario !== undefined &&
      (typeof comentario !== 'string' || comentario.length > MAX_COMENTARIO_LENGTH)
    ) {
      return res.status(400).json({
        error: `El comentario debe ser texto de hasta ${MAX_COMENTARIO_LENGTH} caracteres`,
      });
    }

    const calificacion = await calificacionesService.crearCalificacion({
      clienteId: req.usuario.id,
      solicitudId: solicitudId.trim(),
      puntaje,
      comentario: comentario ? comentario.trim() : undefined,
    });

    res.status(201).json(calificacion);
  } catch (error) {
    next(error);
  }
}

async function editarComentario(req, res, next) {
  try {
    const { comentario } = req.body;

    if (
      typeof comentario !== 'string' ||
      !comentario.trim() ||
      comentario.length > MAX_COMENTARIO_LENGTH
    ) {
      return res.status(400).json({
        error: `El comentario es obligatorio y puede tener hasta ${MAX_COMENTARIO_LENGTH} caracteres`,
      });
    }

    const calificacion = await calificacionesService.editarComentario({
      clienteId: req.usuario.id,
      calificacionId: req.params.id,
      comentario: comentario.trim(),
    });

    res.json(calificacion);
  } catch (error) {
    next(error);
  }
}

async function reputacion(req, res, next) {
  try {
    const resultado = await calificacionesService.obtenerReputacion(
      req.params.prestadorId
    );
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

async function listarPorPrestador(req, res, next) {
  try {
    const calificaciones = await calificacionesService.listarCalificacionesPrestador(
      req.params.prestadorId
    );
    res.json(calificaciones);
  } catch (error) {
    next(error);
  }
}

async function listarTodas(req, res, next) {
  try {
    const calificaciones = await calificacionesService.listarTodasLasCalificaciones();
    res.json(calificaciones);
  } catch (error) {
    next(error);
  }
}

async function moderar(req, res, next) {
  try {
    const { motivo } = req.body;

    if (
      typeof motivo !== 'string' ||
      !motivo.trim() ||
      motivo.length > MAX_MOTIVO_LENGTH
    ) {
      return res.status(400).json({
        error: `El motivo es obligatorio y puede tener hasta ${MAX_MOTIVO_LENGTH} caracteres`,
      });
    }

    const calificacion = await calificacionesService.moderarCalificacion(
      req.params.id,
      motivo.trim()
    );

    res.json(calificacion);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crear,
  editarComentario,
  reputacion,
  listarPorPrestador,
  listarTodas,
  moderar,
};