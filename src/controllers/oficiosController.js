const oficiosService = require('../services/oficiosService');

async function listar(req, res, next) {
  try {
    const oficios = await oficiosService.listarOficios();
    res.json(oficios);
  } catch (error) {
    next(error);
  }
}

async function listarTodos(req, res, next) {
  try {
    const oficios = await oficiosService.listarOficios({ incluirInactivos: true });
    res.json(oficios);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const { nombre, categoria } = req.body;

    if (typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    if (categoria !== undefined && typeof categoria !== 'string') {
      return res.status(400).json({ error: 'La categoría es inválida' });
    }

    const oficio = await oficiosService.crearOficio({
      nombre: nombre.trim(),
      categoria: categoria?.trim(),
    });

    res.status(201).json(oficio);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const { nombre, categoria } = req.body;

    if (nombre !== undefined && (typeof nombre !== 'string' || !nombre.trim())) {
      return res.status(400).json({ error: 'El nombre es inválido' });
    }
    if (categoria !== undefined && typeof categoria !== 'string') {
      return res.status(400).json({ error: 'La categoría es inválida' });
    }
    if (nombre === undefined && categoria === undefined) {
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    const oficio = await oficiosService.actualizarOficio(req.params.id, {
      nombre: nombre?.trim(),
      categoria: categoria?.trim(),
    });

    res.json(oficio);
  } catch (error) {
    next(error);
  }
}

async function cambiarEstado(req, res, next) {
  try {
    const { activo } = req.body;

    if (typeof activo !== 'boolean') {
      return res.status(400).json({ error: 'El campo activo debe ser true o false' });
    }

    const oficio = await oficiosService.cambiarEstadoOficio(req.params.id, activo);

    res.json(oficio);
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, listarTodos, crear, actualizar, cambiarEstado };