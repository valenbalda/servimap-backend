const solicitudesService = require('../services/solicitudesService');

function esTextoNoVacio(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

async function crear(req, res, next) {
  try {
    const { prestadorId, oficioId, descripcion, direccion, contactoPreferido } = req.body || {};

    if (!esTextoNoVacio(prestadorId)) {
      return res.status(400).json({ error: 'El prestadorId es obligatorio' });
    }
    if (!esTextoNoVacio(oficioId)) {
      return res.status(400).json({ error: 'El oficioId es obligatorio' });
    }
    if (!esTextoNoVacio(descripcion)) {
      return res.status(400).json({ error: 'La descripción es obligatoria' });
    }
    if (descripcion.trim().length > 1000) {
      return res.status(400).json({ error: 'La descripción no puede superar los 1000 caracteres' });
    }
    if (direccion !== undefined && typeof direccion !== 'string') {
      return res.status(400).json({ error: 'La dirección debe ser texto' });
    }
    if (contactoPreferido !== undefined && typeof contactoPreferido !== 'string') {
      return res.status(400).json({ error: 'El contacto preferido debe ser texto' });
    }

    const solicitud = await solicitudesService.crearSolicitud(req.usuario.id, {
      prestadorId: prestadorId.trim(),
      oficioId: oficioId.trim(),
      descripcion: descripcion.trim(),
      direccion: direccion && direccion.trim(),
      contactoPreferido: contactoPreferido && contactoPreferido.trim(),
    });

    res.status(201).json(solicitud);
  } catch (error) {
    next(error);
  }
}

module.exports = { crear };