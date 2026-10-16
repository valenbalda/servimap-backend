const respuestaError = (descripcion) => ({
  description: descripcion,
  content: {
    'application/json': { schema: { $ref: '#/components/schemas/Error' } },
  },
});

const respuestaJson = (descripcion, schema) => ({
  description: descripcion,
  content: { 'application/json': { schema } },
});

const cuerpoJson = (schema) => ({
  required: true,
  content: { 'application/json': { schema } },
});

const parametroId = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'Identificador del oficio',
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'ServiMap API',
    version: '1.0.0',
    description:
      'API REST de ServiMap: mapa interactivo y directorio de prestadores de servicios del hogar. ' +
      'Para probar los endpoints protegidos, hacé login, copiá el token y pegalo en el botón Authorize.',
  },
  servers: [{ url: '/' }],
  tags: [
    { name: 'Sistema' },
    { name: 'Auth', description: 'Registro, inicio de sesión y perfil' },
    { name: 'Oficios', description: 'Catálogo de oficios' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nombre: { type: 'string' },
          email: { type: 'string' },
          rol: { type: 'string', enum: ['CLIENTE', 'PRESTADOR', 'ADMINISTRADOR'] },
          fechaRegistro: { type: 'string', format: 'date-time' },
        },
      },
      Oficio: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nombre: { type: 'string' },
          categoria: { type: 'string', nullable: true },
          activo: { type: 'boolean' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verificar que el servidor está funcionando',
        responses: {
          200: respuestaJson('Servidor funcionando', {
            type: 'object',
            properties: { status: { type: 'string', example: 'ok' } },
          }),
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar un usuario (cliente o prestador)',
        requestBody: cuerpoJson({
          type: 'object',
          required: ['nombre', 'email', 'password', 'rol'],
          properties: {
            nombre: { type: 'string', example: 'Ana Pérez' },
            email: { type: 'string', example: 'ana@mail.com' },
            password: { type: 'string', minLength: 8, example: '12345678' },
            rol: { type: 'string', enum: ['CLIENTE', 'PRESTADOR'] },
          },
        }),
        responses: {
          201: respuestaJson('Usuario creado', { $ref: '#/components/schemas/Usuario' }),
          400: respuestaError('Datos inválidos o faltantes'),
          409: respuestaError('El email ya está registrado'),
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión y obtener el token JWT',
        requestBody: cuerpoJson({
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'ana@mail.com' },
            password: { type: 'string', example: '12345678' },
          },
        }),
        responses: {
          200: respuestaJson('Sesión iniciada', {
            type: 'object',
            properties: {
              token: { type: 'string' },
              usuario: { $ref: '#/components/schemas/Usuario' },
            },
          }),
          400: respuestaError('Faltan datos obligatorios'),
          401: respuestaError('Email o contraseña incorrectos'),
          403: respuestaError('La cuenta está desactivada'),
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener el perfil del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: respuestaJson('Perfil del usuario', { $ref: '#/components/schemas/Usuario' }),
          401: respuestaError('Token no proporcionado, inválido o vencido'),
          404: respuestaError('Usuario no encontrado'),
        },
      },
    },
    '/api/oficios': {
      get: {
        tags: ['Oficios'],
        summary: 'Listar los oficios activos',
        responses: {
          200: respuestaJson('Lista de oficios activos', {
            type: 'array',
            items: { $ref: '#/components/schemas/Oficio' },
          }),
        },
      },
      post: {
        tags: ['Oficios'],
        summary: 'Crear un oficio (administrador)',
        security: [{ bearerAuth: [] }],
        requestBody: cuerpoJson({
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string', example: 'Plomería' },
            categoria: { type: 'string', example: 'Hogar' },
          },
        }),
        responses: {
          201: respuestaJson('Oficio creado', { $ref: '#/components/schemas/Oficio' }),
          400: respuestaError('Datos inválidos'),
          401: respuestaError('No autenticado'),
          403: respuestaError('Sin permisos'),
          409: respuestaError('Ya existe un oficio con ese nombre'),
        },
      },
    },
    '/api/oficios/todos': {
      get: {
        tags: ['Oficios'],
        summary: 'Listar todos los oficios, incluidos los desactivados (administrador)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: respuestaJson('Lista completa de oficios', {
            type: 'array',
            items: { $ref: '#/components/schemas/Oficio' },
          }),
          401: respuestaError('No autenticado'),
          403: respuestaError('Sin permisos'),
        },
      },
    },
    '/api/oficios/{id}': {
      put: {
        tags: ['Oficios'],
        summary: 'Editar o reactivar un oficio (administrador)',
        security: [{ bearerAuth: [] }],
        parameters: [parametroId],
        requestBody: cuerpoJson({
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            categoria: { type: 'string' },
            activo: { type: 'boolean' },
          },
        }),
        responses: {
          200: respuestaJson('Oficio actualizado', { $ref: '#/components/schemas/Oficio' }),
          400: respuestaError('Datos inválidos'),
          401: respuestaError('No autenticado'),
          403: respuestaError('Sin permisos'),
          404: respuestaError('Oficio no encontrado'),
          409: respuestaError('Ya existe un oficio con ese nombre'),
        },
      },
      delete: {
        tags: ['Oficios'],
        summary: 'Desactivar un oficio sin borrarlo (administrador)',
        security: [{ bearerAuth: [] }],
        parameters: [parametroId],
        responses: {
          200: respuestaJson('Oficio desactivado', { $ref: '#/components/schemas/Oficio' }),
          401: respuestaError('No autenticado'),
          403: respuestaError('Sin permisos'),
          404: respuestaError('Oficio no encontrado'),
        },
      },
    },
  },
};

module.exports = swaggerSpec;