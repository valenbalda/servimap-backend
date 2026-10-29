const { definirCasos, nuevo, BASE_UNITARIA, PROPAGA_ERROR } = require('./definir');

const PRE_MW = 'Middleware importado directamente; request, response y next simulados.';

module.exports = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Sistema y errores', rol: 'Todos', rf: [] },
  [
    nuevo(
      'TC-SIS-001',
      'Health check',
      'GET /health indica que el servidor está funcionando.',
      ['GET /health con Supertest sobre la app real'],
      '200 con { status: "ok" }.',
      { precondiciones: 'App Express cargada (sin base de datos).', prioridad: 'alta' }
    ),
    nuevo(
      'TC-SIS-002',
      'Ruta inexistente responde 404',
      'El middleware notFound responde 404 con un mensaje claro.',
      ['Invocar notFound'],
      '404 con { error: "Recurso no encontrado" }.',
      { precondiciones: PRE_MW }
    ),
    nuevo(
      'TC-SIS-003',
      'Error con respuesta ya enviada',
      'Si la respuesta ya empezó a enviarse, errorHandler delega el error en Express.',
      ['Simular headersSent = true', 'Invocar errorHandler'],
      'Llama a next(error) y no escribe la respuesta.',
      { precondiciones: PRE_MW, ...PROPAGA_ERROR }
    ),
    nuevo(
      'TC-SIS-004',
      'Traducción de errores conocidos',
      'JSON mal escrito, pedido demasiado grande y errores de Prisma (P2002, P2025, P2003) se traducen a 400, 413, 409 y 404.',
      ['Invocar errorHandler con cada error conocido'],
      'Responde el código y el mensaje correspondientes a cada error.',
      { precondiciones: PRE_MW, prioridad: 'alta', severidad: 'mayor' }
    ),
    nuevo(
      'TC-SIS-005',
      'Error del negocio con status propio',
      'Un error con status y mensaje del negocio se responde tal cual.',
      ['Invocar errorHandler con un error { status: 409, message }'],
      'Responde ese status y ese mensaje.',
      { precondiciones: PRE_MW }
    ),
    nuevo(
      'TC-SIS-006',
      'Error inesperado sin detalles',
      'Un error sin status responde 500 sin exponer el detalle y lo registra en consola.',
      ['Invocar errorHandler con un Error común'],
      '500 con "Error interno del servidor" y console.error con el error original.',
      { precondiciones: PRE_MW, tipo: 'seguridad', prioridad: 'alta', severidad: 'mayor' }
    ),
  ]
);
