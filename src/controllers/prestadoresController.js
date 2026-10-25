const prestadoresService = require('../services/prestadoresService');

const CAMPOS_TEXTO = [
  'descripcionProfesional',
  'fotoPerfil',
  'zonaCobertura',
  'telefono',
  'whatsapp',
  'emailContacto',
];

function esTextoNoVacio(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

// Los parámetros de la dirección llegan como texto; acá se pasan a número (NaN si no sirven).
function aNumero(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') return NaN;
  return Number(valor);
}

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

async function asignarMisOficios(req, res, next) {
  try {
    const { oficioIds } = req.body || {};

    const listaValida =
      Array.isArray(oficioIds) &&
      oficioIds.every((id) => typeof id === 'string' && id.trim() !== '');

    if (!listaValida) {
      return res
        .status(400)
        .json({ error: 'oficioIds debe ser una lista de identificadores de oficios' });
    }

    const perfil = await prestadoresService.asignarMisOficios(
      req.usuario.id,
      oficioIds.map((id) => id.trim())
    );
    res.json(perfil);
  } catch (error) {
    next(error);
  }
}

async function listar(req, res, next) {
  try {
    const { oficioId, q, lat, lng, radioKm, calificacionMin, limit } = req.query;
    const filtros = {};

    if (oficioId !== undefined) {
      if (!esTextoNoVacio(oficioId)) {
        return res.status(400).json({ error: 'El oficioId es inválido' });
      }
      filtros.oficioId = oficioId.trim();
    }

    if (q !== undefined) {
      if (!esTextoNoVacio(q) || q.trim().length > 100) {
        return res.status(400).json({ error: 'La búsqueda es inválida (máximo 100 caracteres)' });
      }
      filtros.q = q.trim();
    }

    // lat y lng van siempre juntas.
    if ((lat === undefined) !== (lng === undefined)) {
      return res.status(400).json({ error: 'lat y lng se envían juntas' });
    }
    if (lat !== undefined) {
      const latitud = aNumero(lat);
      const longitud = aNumero(lng);
      if (!(latitud >= -90 && latitud <= 90)) {
        return res.status(400).json({ error: 'La latitud debe ser un número entre -90 y 90' });
      }
      if (!(longitud >= -180 && longitud <= 180)) {
        return res.status(400).json({ error: 'La longitud debe ser un número entre -180 y 180' });
      }
      filtros.lat = latitud;
      filtros.lng = longitud;
    }

    if (radioKm !== undefined) {
      if (lat === undefined) {
        return res.status(400).json({ error: 'radioKm necesita lat y lng' });
      }
      const radio = aNumero(radioKm);
      if (!(radio > 0 && radio <= 100)) {
        return res.status(400).json({ error: 'radioKm debe ser un número entre 0 y 100' });
      }
      filtros.radioKm = radio;
    }

    if (calificacionMin !== undefined) {
      const minimo = aNumero(calificacionMin);
      if (!(minimo >= 1 && minimo <= 5)) {
        return res.status(400).json({ error: 'calificacionMin debe ser un número entre 1 y 5' });
      }
      filtros.calificacionMin = minimo;
    }

    if (limit !== undefined) {
      const tope = aNumero(limit);
      if (!Number.isInteger(tope) || tope < 1 || tope > 50) {
        return res.status(400).json({ error: 'limit debe ser un entero entre 1 y 50' });
      }
      filtros.limit = tope;
    }

    const prestadores = await prestadoresService.listarPrestadores(filtros);
    res.json(prestadores);
  } catch (error) {
    next(error);
  }
}

async function detalle(req, res, next) {
  try {
    const prestador = await prestadoresService.obtenerDetallePrestador(req.params.id);
    res.json(prestador);
  } catch (error) {
    next(error);
  }
}

async function misCalificaciones(req, res, next) {
  try {
    const calificaciones = await prestadoresService.listarMisCalificaciones(req.usuario.id);
    res.json(calificaciones);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerMiPerfil,
  actualizarMiPerfil,
  asignarMisOficios,
  listar,
  detalle,
  misCalificaciones,
};