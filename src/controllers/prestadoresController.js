const prestadoresService = require('../services/prestadoresService');

const CAMPOS_TEXTO = [
  'descripcionProfesional',
  'fotoPerfil',
  'zonaCobertura',
  'telefono',
  'whatsapp',
  'emailContacto',
];

// Teléfono o WhatsApp: números, con + al principio y espacios, guiones o paréntesis.
const FORMATO_TELEFONO = /^\+?\d[\d\s()-]{5,19}$/;

function esTextoNoVacio(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

function esNumeroEnRango(valor, minimo, maximo) {
  return typeof valor === 'number' && valor >= minimo && valor <= maximo;
}

// Los parámetros de la dirección llegan como texto; acá se pasan a número (NaN si no sirven).
function aNumero(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') return Number.NaN;
  return Number(valor);
}

// --- Validaciones del perfil: cada función devuelve un mensaje de error o null ---

function validarTextos(body) {
  for (const campo of CAMPOS_TEXTO) {
    if (body[campo] !== undefined && typeof body[campo] !== 'string') {
      return `El campo ${campo} debe ser texto`;
    }
  }

  const { descripcionProfesional } = body;
  if (descripcionProfesional !== undefined && descripcionProfesional.trim() === '') {
    return 'La descripción profesional no puede quedar vacía';
  }

  return null;
}

function validarContacto(body) {
  const { emailContacto, telefono, whatsapp } = body;

  if (emailContacto !== undefined && !emailContacto.includes('@')) {
    return 'El email de contacto es inválido';
  }
  if (telefono !== undefined && !FORMATO_TELEFONO.test(telefono.trim())) {
    return 'El teléfono es inválido';
  }
  if (whatsapp !== undefined && !FORMATO_TELEFONO.test(whatsapp.trim())) {
    return 'El WhatsApp es inválido';
  }

  return null;
}

function validarNumeros(body) {
  const { latitud, longitud, precioMin, precioMax, disponible } = body;

  if (latitud !== undefined && !esNumeroEnRango(latitud, -90, 90)) {
    return 'La latitud debe ser un número entre -90 y 90';
  }
  if (longitud !== undefined && !esNumeroEnRango(longitud, -180, 180)) {
    return 'La longitud debe ser un número entre -180 y 180';
  }
  if (precioMin !== undefined && !esNumeroEnRango(precioMin, 0, Infinity)) {
    return 'El precio mínimo debe ser un número mayor o igual a 0';
  }
  if (precioMax !== undefined && !esNumeroEnRango(precioMax, 0, Infinity)) {
    return 'El precio máximo debe ser un número mayor o igual a 0';
  }
  if (disponible !== undefined && typeof disponible !== 'boolean') {
    return 'El campo disponible debe ser true o false';
  }

  return null;
}

// Devuelve un mensaje de error si algo está mal, o null si todo está bien.
function validarPerfil(body) {
  return validarTextos(body) || validarContacto(body) || validarNumeros(body);
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

// --- Lectura de los filtros del listado: cada función revisa un grupo de filtros ---
// Devuelven { error } si algo está mal, o { filtros } con lo que sí se pidió.

function leerOficioYTexto({ oficioId, q }) {
  const filtros = {};

  if (oficioId !== undefined) {
    if (!esTextoNoVacio(oficioId)) return { error: 'El oficioId es inválido' };
    filtros.oficioId = oficioId.trim();
  }

  if (q !== undefined) {
    if (!esTextoNoVacio(q) || q.trim().length > 100) {
      return { error: 'La búsqueda es inválida (máximo 100 caracteres)' };
    }
    filtros.q = q.trim();
  }

  return { filtros };
}

function leerUbicacion({ lat, lng, radioKm }) {
  // lat y lng van siempre juntas.
  if ((lat === undefined) !== (lng === undefined)) {
    return { error: 'lat y lng se envían juntas' };
  }

  if (lat === undefined) {
    return radioKm === undefined ? { filtros: {} } : { error: 'radioKm necesita lat y lng' };
  }

  const latitud = aNumero(lat);
  const longitud = aNumero(lng);
  if (!esNumeroEnRango(latitud, -90, 90)) {
    return { error: 'La latitud debe ser un número entre -90 y 90' };
  }
  if (!esNumeroEnRango(longitud, -180, 180)) {
    return { error: 'La longitud debe ser un número entre -180 y 180' };
  }

  const filtros = { lat: latitud, lng: longitud };

  if (radioKm !== undefined) {
    const radio = aNumero(radioKm);
    if (!(radio > 0 && radio <= 100)) {
      return { error: 'radioKm debe ser un número entre 0 y 100' };
    }
    filtros.radioKm = radio;
  }

  return { filtros };
}

function leerCalificacionMin({ calificacionMin }) {
  if (calificacionMin === undefined) return { filtros: {} };

  const minimo = aNumero(calificacionMin);
  if (!esNumeroEnRango(minimo, 1, 5)) {
    return { error: 'calificacionMin debe ser un número entre 1 y 5' };
  }

  return { filtros: { calificacionMin: minimo } };
}

function leerLimit({ limit }) {
  if (limit === undefined) return { filtros: {} };

  const tope = aNumero(limit);
  if (!Number.isInteger(tope) || tope < 1 || tope > 50) {
    return { error: 'limit debe ser un entero entre 1 y 50' };
  }

  return { filtros: { limit: tope } };
}

function leerDisponible({ disponible }) {
  if (disponible === undefined) return { filtros: {} };

  if (disponible !== 'true' && disponible !== 'false') {
    return { error: 'disponible debe ser true o false' };
  }

  return { filtros: { disponible: disponible === 'true' } };
}

const LECTORES_DE_FILTROS = [
  leerOficioYTexto,
  leerUbicacion,
  leerCalificacionMin,
  leerLimit,
  leerDisponible,
];

// Recorre cada grupo de filtros y se detiene en el primer error.
function leerFiltros(query) {
  const filtros = {};

  for (const leer of LECTORES_DE_FILTROS) {
    const resultado = leer(query);
    if (resultado.error) return resultado;
    Object.assign(filtros, resultado.filtros);
  }

  return { filtros };
}

// --- Controladores ---

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
    const { error, filtros } = leerFiltros(req.query);
    if (error) {
      return res.status(400).json({ error });
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