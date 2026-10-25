const mapaService = require('../services/mapaService');

function esTextoNoVacio(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

async function listar(req, res, next) {
  try {
    const { oficioId } = req.query;

    if (oficioId !== undefined && !esTextoNoVacio(oficioId)) {
      return res.status(400).json({ error: 'El oficioId es inválido' });
    }

    const marcadores = await mapaService.listarMarcadores({
      oficioId: oficioId && oficioId.trim(),
    });
    res.json(marcadores);
  } catch (error) {
    next(error);
  }
}

module.exports = { listar };