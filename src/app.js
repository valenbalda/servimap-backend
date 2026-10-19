// Express es el framework que crea el servidor web.
const express = require('express');
// Helmet agrega headers HTTP que protegen contra ataques comunes.
const helmet = require('helmet');
// CORS controla qué páginas web pueden hablar con esta API.
const cors = require('cors');
// Rate limit frena a quien mande demasiados pedidos en poco tiempo.
const rateLimit = require('express-rate-limit');
// Swagger UI muestra la documentación de la API en el navegador.
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const swaggerSpec = require('./config/swagger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const authRouter = require('./routes/authRouter');
const oficiosRouter = require('./routes/oficiosRouter');
const calificacionesRouter = require('./routes/calificacionesRouter');
const prestadoresRouter = require('./routes/prestadoresRouter');

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

// Documentación de la API (Swagger) en /api-docs.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de autenticación (registro, login).
app.use('/api/auth', authRouter);

// Rutas de oficios (listado público, gestión del administrador).
app.use('/api/oficios', oficiosRouter);

// Rutas de calificaciones (los clientes califican servicios finalizados).
app.use('/api/calificaciones', calificacionesRouter);

// Rutas de prestadores (perfil propio del prestador).
app.use('/api/prestadores', prestadoresRouter);

// Estos dos van siempre al final:
// primero, el 404 si ninguna ruta respondió; después, el manejador de errores.
app.use(notFound);
app.use(errorHandler);

// Exporta la app para que server.js la arranque.
module.exports = app;