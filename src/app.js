// Express es el framework que crea el servidor web.
const express = require('express');
// Helmet agrega headers HTTP que protegen contra ataques comunes.
const helmet = require('helmet');
// CORS controla qué páginas web pueden hablar con esta API.
const cors = require('cors');
// Rate limit frena a quien mande demasiados pedidos en poco tiempo.
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Crea la aplicación Express.
const app = express();

// Seguridad: headers de protección.
app.use(helmet());

// Solo el frontend definido en CORS_ORIGIN puede usar esta API.
app.use(cors({ origin: env.CORS_ORIGIN }));

// Permite leer el cuerpo (body) de los pedidos que vienen en formato JSON.
app.use(express.json());

// Máximo 300 pedidos cada 15 minutos por dirección IP.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Ruta de prueba para saber si el servidor está funcionando.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Estos dos van siempre al final:
// primero, el 404 si ninguna ruta respondió; después, el manejador de errores.
app.use(notFound);
app.use(errorHandler);

// Exporta la app para que server.js la arranque.
module.exports = app;