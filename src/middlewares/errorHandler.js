// Se ejecuta cuando nadie respondió al pedido: la dirección no existe.
function notFound(req, res, next) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}

// Convierte errores conocidos (JSON mal escrito, errores de Prisma) en una
// respuesta clara. Si el error no es conocido, devuelve null.
function traducirError(err) {
  if (err.type === 'entity.parse.failed') {
    return { status: 400, message: 'El cuerpo del pedido no es un JSON válido' };
  }
  if (err.type === 'entity.too.large') {
    return { status: 413, message: 'El pedido es demasiado grande' };
  }
  if (err.code === 'P2002') {
    return { status: 409, message: 'Ya existe un registro con esos datos' };
  }
  if (err.code === 'P2025') {
    return { status: 404, message: 'Recurso no encontrado' };
  }
  if (err.code === 'P2003') {
    return { status: 409, message: 'La operación hace referencia a un registro que no existe' };
  }
  return null;
}

// Se ejecuta cuando algo falla en cualquier parte del backend.
// Recibe el error y devuelve una respuesta ordenada.
function errorHandler(err, req, res, next) {
  // Si la respuesta ya empezó a enviarse, se la deja a Express.
  if (res.headersSent) {
    return next(err);
  }

  const traducido = traducirError(err);

  // Si el error trae un código (ej. 400, 401), se usa. Si no, es 500 (error del servidor).
  const status = traducido ? traducido.status : err.status || 500;

  // En errores 500 no se muestra el detalle al usuario por seguridad;
  // se guarda en la consola del servidor para que lo veamos nosotras.
  let message;
  if (traducido) {
    message = traducido.message;
  } else if (status === 500) {
    message = 'Error interno del servidor';
  } else {
    message = err.message;
  }
  if (status === 500) console.error(err);

  res.status(status).json({ error: message });
}

// Exporta las dos funciones para usarlas en app.js
module.exports = { notFound, errorHandler };