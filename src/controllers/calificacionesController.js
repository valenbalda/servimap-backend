const calificacionesService = require('../services/calificacionesService');

const MAX_COMENTARIO_LENGTH = 500;

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

module.exports = { crear };
