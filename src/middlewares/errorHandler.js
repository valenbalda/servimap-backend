// Se ejecuta cuando nadie respondió al pedido: la dirección no existe.
function notFound(req, res, next) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}

// Se ejecuta cuando algo falla en cualquier parte del backend.
// Recibe el error y devuelve una respuesta ordenada.
function errorHandler(err, req, res, next) {
  // Si el error trae un código (ej. 400, 401), se usa. Si no, es 500 (error del servidor).
  const status = err.status || 500;

  // En errores 500 no se muestra el detalle al usuario por seguridad;
  // se guarda en la consola del servidor para que lo veamos nosotras.
  const message = status === 500 ? 'Error interno del servidor' : err.message;
  if (status === 500) console.error(err);

  res.status(status).json({ error: message });
}

// Exporta las dos funciones para usarlas en app.js
module.exports = { notFound, errorHandler };