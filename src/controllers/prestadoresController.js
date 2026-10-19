const prestadoresService = require('../services/prestadoresService');

const CAMPOS_TEXTO = [
  'descripcionProfesional',
  'fotoPerfil',
  'zonaCobertura',
  'telefono',
  'whatsapp',
  'emailContacto',
];

// Devuelve un mensaje de error si algo está mal, o null si todo está bien.
function validarPerfil(body) {
  for (const campo of CAMPOS_TEXTO) {
    if (body[campo] !== undefined && typeof body[campo] !== 'string') {
      return `El campo ${campo} debe ser texto`;
    }
  }

  if (body.emailContacto !== undefined && !body.emailContacto.includes('@')) {
    return 'El email de contacto es inválido';
  }

  const { latitud, longitud, precioMin, precioMax, disponible } = body;

  if (latitud !== undefined && (typeof latitud !== 'number' || latitud < -90 || latitud > 90)) {
    return 'La latitud debe ser un número entre -90 y 90';
  }
  if (longitud !== undefined && (typeof longitud !== 'number' || longitud < -180 || longitud > 180)) {
    return 'La longitud debe ser un número entre -180 y 180';
  }
  if (precioMin !== undefined && (typeof precioMin !== 'number' || precioMin < 0)) {
    return 'El precio mínimo debe ser un número mayor o igual a 0';
  }
  if (precioMax !== undefined && (typeof precioMax !== 'number' || precioMax < 0)) {
    return 'El precio máximo debe ser un número mayor o igual a 0';
  }
  if (disponible !== undefined && typeof disponible !== 'boolean') {
    return 'El campo disponible debe ser true o false';
  }

  return null;
}

// Se queda solo con los campos permitidos (ignora cualquier otro que manden).
function limpiarDatos(body) {
  const datos = {};
  for (const campo of CAMPOS_TEXTO) {
    if (body[campo] !== undefined) datos[campo] = body[campo].trim();
  }
  for (const campo of ['latitud', 'longitud', 'precioMin', 'precioMax', 'disponible']) {
    if (body[campo] !== undefined) datos[campo] = body[campo];
  }
  return datos;
}

async function obtenerMiPerfil(req, res, next) {
  try {
    const perfil = await prestadoresService.obtenerMiPerfil(req.usuario.id);
    res.json(perfil);
  } catch (error) {
    next(error);
  }
}

async function actualizarMiPerfil(req, res, next) {
  try {
    const body = req.body || {};

    const mensaje = validarPerfil(body);
    if (mensaje) {
      return res.status(400).json({ error: mensaje });
    }

    const datos = limpiarDatos(body);
    if (Object.keys(datos).length === 0) {
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    const perfil = await prestadoresService.actualizarMiPerfil(req.usuario.id, datos);
    res.json(perfil);
  } catch (error) {
    next(error);
  }
}

module.exports = { obtenerMiPerfil, actualizarMiPerfil };