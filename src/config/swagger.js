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

const parametroOficioId = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'Identificador del oficio',
};

const parametroPrestadorId = {
  name: 'prestadorId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'Identificador del prestador',
};

const parametroCalificacionId = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'Identificador de la calificación',
};

const perfilPrestador = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    nombre: { type: 'string' },
    email: { type: 'string' },
    descripcionProfesional: { type: 'string', nullable: true },
    fotoPerfil: { type: 'string', nullable: true },
    zonaCobertura: { type: 'string', nullable: true },
    latitud: { type: 'number', nullable: true },
    longitud: { type: 'number', nullable: true },
    precioMin: { type: 'number', nullable: true },
    precioMax: { type: 'number', nullable: true },
    telefono: { type: 'string', nullable: true },
    whatsapp: { type: 'string', nullable: true },
    emailContacto: { type: 'string', nullable: true },
    disponible: { type: 'boolean' },
    oficios: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, nombre: { type: 'string' } },
      },
    },
  },
};

// Esquemas que comparten el listado y la ficha de prestadores.
const oficioResumen = {
  type: 'object',
  properties: { id: { type: 'string' }, nombre: { type: 'string' } },
};

const resumenPrestador = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    nombre: { type: 'string' },
    descripcionProfesional: { type: 'string', nullable: true },
    fotoPerfil: { type: 'string', nullable: true },
    zonaCobertura: { type: 'string', nullable: true },
    latitud: { type: 'number', nullable: true },
    longitud: { type: 'number', nullable: true },
    precioMin: { type: 'number', nullable: true },
    precioMax: { type: 'number', nullable: true },
    disponible: { type: 'boolean' },
    oficios: { type: 'array', items: oficioResumen },
  },
};

const reputacionPrestador = {
  type: 'object',
  properties: {
    promedio: { type: 'number', nullable: true, example: 4.5 },
    totalCalificaciones: { type: 'integer', example: 12 },
    serviciosFinalizados: { type: 'integer', example: 15 },
  },
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
    { name: 'Prestadores', description: 'Perfil del prestador' },
    {
      name: 'Calificaciones',
      description: 'Calificaciones, reputación de los prestadores y moderación',
    },
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
      Calificacion: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          puntaje: { type: 'integer', minimum: 1, maximum: 5 },
          comentario: { type: 'string', nullable: true },
          fechaPublicacion: { type: 'string', format: 'date-time' },
          moderada: { type: 'boolean' },
          fechaModeracion: { type: 'string', format: 'date-time', nullable: true },
          motivoModeracion: { type: 'string', nullable: true },
          solicitudId: { type: 'string' },
          clienteId: { type: 'string' },
          prestadorId: { type: 'string' },
        },
      },
      CalificacionPublica: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          puntaje: { type: 'integer', minimum: 1, maximum: 5 },
          comentario: { type: 'string', nullable: true },
          fechaPublicacion: { type: 'string', format: 'date-time' },
        },
      },
      Reputacion: {
        type: 'object',
        properties: {
          prestadorId: { type: 'string' },
          promedio: { type: 'number', nullable: true, example: 4.5 },
          totalCalificaciones: { type: 'integer', example: 12 },
          serviciosFinalizados: { type: 'integer', example: 15 },
        },
      },
    },
  },
  paths: {
        '/api/prestadores/me/calificaciones': {
      get: {
        tags: ['Prestadores'],
        summary: 'Consultar las calificaciones y comentarios que recibió el prestador autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: respuestaJson('Calificaciones recibidas, de la más nueva a la más vieja (sin las moderadas)', {
            type: 'array',
            items: { $ref: '#/components/schemas/CalificacionPublica' },
          }),
          401: respuestaError('No autenticado'),
          403: respuestaError('Solo los prestadores pueden usar este endpoint'),
          404: respuestaError('Perfil de prestador no encontrado'),
        },
      },
    },
        '/api/prestadores/{id}': {
      get: {
        tags: ['Prestadores'],
        summary: 'Consultar la ficha de un prestador: contacto, reputación y comentarios (público)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Identificador del prestador (no del usuario)',
          },
        ],
        responses: {
          200: respuestaJson('Ficha del prestador', {
            allOf: [
              resumenPrestador,
              {
                type: 'object',
                properties: {
                  telefono: { type: 'string', nullable: true },
                  whatsapp: { type: 'string', nullable: true },
                  emailContacto: { type: 'string', nullable: true },
                  reputacion: reputacionPrestador,
                  comentarios: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CalificacionPublica' },
                  },
                },
              },
            ],
          }),
          404: respuestaError('Prestador no encontrado'),
        },
      },
    },
    '/api/prestadores': {
      get: {
        tags: ['Prestadores'],
        summary: 'Buscar prestadores por oficio, texto y cercanía, con su reputación (público)',
        parameters: [
          {
            name: 'oficioId',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Solo prestadores que ofrecen este oficio',
          },
          {
            name: 'q',
            in: 'query',
            required: false,
            schema: { type: 'string', maxLength: 100 },
            description: 'Busca por nombre, zona de cobertura u oficio',
          },
          {
            name: 'lat',
            in: 'query',
            required: false,
            schema: { type: 'number', minimum: -90, maximum: 90, example: -34.6037 },
            description: 'Latitud de referencia (se envía junto con lng)',
          },
          {
            name: 'lng',
            in: 'query',
            required: false,
            schema: { type: 'number', minimum: -180, maximum: 180, example: -58.3816 },
            description: 'Longitud de referencia (se envía junto con lat)',
          },
          {
            name: 'radioKm',
            in: 'query',
            required: false,
            schema: { type: 'number', minimum: 0, maximum: 100, default: 10 },
            description: 'Radio de búsqueda en km (necesita lat y lng)',
          },
          {
            name: 'calificacionMin',
            in: 'query',
            required: false,
            schema: { type: 'number', minimum: 1, maximum: 5 },
            description: 'Promedio mínimo de calificaciones',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
            description: 'Cantidad máxima de resultados',
          },
        ],
        responses: {
          200: respuestaJson('Lista de prestadores (con distanciaKm si se envió lat y lng)', {
            type: 'array',
            items: {
              allOf: [
                resumenPrestador,
                {
                  type: 'object',
                  properties: {
                    distanciaKm: { type: 'number' },
                    reputacion: reputacionPrestador,
                  },
                },
              ],
            },
          }),
          400: respuestaError('Algún filtro es inválido'),
        },
      },
    },
    '/api/prestadores/me': {
      get: {
        tags: ['Prestadores'],
        summary: 'Consultar el perfil del prestador autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: respuestaJson('Perfil del prestador', perfilPrestador),
          401: respuestaError('No autenticado'),
          403: respuestaError('Solo los prestadores pueden usar este endpoint'),
          404: respuestaError('Perfil de prestador no encontrado'),
        },
      },
      put: {
        tags: ['Prestadores'],
        summary: 'Actualizar el perfil del prestador autenticado',
        security: [{ bearerAuth: [] }],
        requestBody: cuerpoJson({
          type: 'object',
          properties: {
            descripcionProfesional: { type: 'string', example: 'Plomero con 10 años de experiencia' },
            fotoPerfil: { type: 'string' },
            zonaCobertura: { type: 'string', example: 'Palermo' },
            latitud: { type: 'number', minimum: -90, maximum: 90, example: -34.5875 },
            longitud: { type: 'number', minimum: -180, maximum: 180, example: -58.4264 },
            precioMin: { type: 'number', minimum: 0, example: 5000 },
            precioMax: { type: 'number', minimum: 0, example: 20000 },
            telefono: { type: 'string' },
            whatsapp: { type: 'string' },
            emailContacto: { type: 'string', example: 'contacto@mail.com' },
            disponible: { type: 'boolean', example: true },
          },
        }),
        responses: {
          200: respuestaJson('Perfil actualizado', perfilPrestador),
          400: respuestaError('Datos inválidos, sin datos para actualizar o precio mínimo mayor al máximo'),
          401: respuestaError('No autenticado'),
          403: respuestaError('Solo los prestadores pueden usar este endpoint'),
          404: respuestaError('Perfil de prestador no encontrado'),
        },
      },
    },
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
          required: ['nombre', 'dni', 'email', 'password', 'rol'],
          properties: {
            nombre: { type: 'string', example: 'Ana Pérez' },
            dni: { type: 'string', example: '12345678', description: 'Solo números (7 u 8 dígitos). Único por persona: no se puede repetir.' },
            email: { type: 'string', example: 'ana@mail.com' },
            password: { type: 'string', minLength: 8, example: '12345678' },
            rol: { type: 'string', enum: ['CLIENTE', 'PRESTADOR'] },
          },
        }),
        responses: {
          201: respuestaJson('Usuario creado', { $ref: '#/components/schemas/Usuario' }),
          400: respuestaError('Datos inválidos o faltantes'),
          409: respuestaError('El DNI o email ya están registrados'),
        },
      },
    },
        '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión con email y contraseña y obtener el token JWT',
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
        summary: 'Obtener el perfil del usuario autenticado (incluye su DNI)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: respuestaJson('Perfil del usuario. El DNI solo lo ve su dueño.', {
            allOf: [
              { $ref: '#/components/schemas/Usuario' },
              {
                type: 'object',
                properties: { dni: { type: 'string', example: '12345678' } },
              },
            ],
          }),
          401: respuestaError('Token no proporcionado, inválido o vencido'),
          404: respuestaError('Usuario no encontrado'),
        },
      },
    },
    '/api/oficios': {
      get: {
        tags: ['Oficios'],
        summary: 'Consultar los oficios activos',
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
        summary: 'Consultar todos los oficios, incluidos los desactivados (administrador)',
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
        summary: 'Actualizar el nombre o la categoría de un oficio (administrador)',
        security: [{ bearerAuth: [] }],
        parameters: [parametroOficioId],
        requestBody: cuerpoJson({
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            categoria: { type: 'string' },
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
    },
    '/api/oficios/{id}/estado': {
      patch: {
        tags: ['Oficios'],
        summary: 'Activar o desactivar un oficio sin borrarlo (administrador)',
        security: [{ bearerAuth: [] }],
        parameters: [parametroOficioId],
        requestBody: cuerpoJson({
          type: 'object',
          required: ['activo'],
          properties: {
            activo: { type: 'boolean', example: false },
          },
        }),
        responses: {
          200: respuestaJson('Estado del oficio actualizado', {
            $ref: '#/components/schemas/Oficio',
          }),
          400: respuestaError('El campo activo debe ser true o false'),
          401: respuestaError('No autenticado'),
          403: respuestaError('Sin permisos'),
          404: respuestaError('Oficio no encontrado'),
        },
      },
    },
    '/api/calificaciones': {
      post: {
        tags: ['Calificaciones'],
        summary: 'Crear una calificación de una solicitud finalizada (cliente)',
        security: [{ bearerAuth: [] }],
        requestBody: cuerpoJson({
          type: 'object',
          required: ['solicitudId', 'puntaje'],
          properties: {
            solicitudId: { type: 'string' },
            puntaje: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comentario: { type: 'string', maxLength: 500, example: 'Muy buen servicio' },
          },
        }),
        responses: {
          201: respuestaJson('Calificación creada', { $ref: '#/components/schemas/Calificacion' }),
          400: respuestaError('Datos inválidos'),
          401: respuestaError('No autenticado'),
          403: respuestaError('La solicitud no es del cliente o el rol no tiene permisos'),
          404: respuestaError('Solicitud no encontrada'),
          409: respuestaError('La solicitud no está finalizada o ya fue calificada'),
        },
      },
      get: {
        tags: ['Calificaciones'],
        summary: 'Consultar todas las calificaciones, incluidas las moderadas (administrador)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: respuestaJson('Lista completa de calificaciones', {
            type: 'array',
            items: { $ref: '#/components/schemas/Calificacion' },
          }),
          401: respuestaError('No autenticado'),
          403: respuestaError('Sin permisos'),
        },
      },
    },
    '/api/calificaciones/{id}/comentario': {
      patch: {
        tags: ['Calificaciones'],
        summary: 'Editar el comentario de una calificación propia (cliente)',
        security: [{ bearerAuth: [] }],
        parameters: [parametroCalificacionId],
        requestBody: cuerpoJson({
          type: 'object',
          required: ['comentario'],
          properties: {
            comentario: {
              type: 'string',
              maxLength: 500,
              example: 'Excelente atención y muy puntual',
            },
          },
        }),
        responses: {
          200: respuestaJson('Comentario actualizado', {
            $ref: '#/components/schemas/Calificacion',
          }),
          400: respuestaError('Comentario inválido'),
          401: respuestaError('No autenticado'),
          403: respuestaError('La calificación no es del cliente o el rol no tiene permisos'),
          404: respuestaError('Calificación no encontrada'),
          409: respuestaError('La calificación está moderada'),
        },
      },
    },
    '/api/calificaciones/{id}/moderacion': {
      patch: {
        tags: ['Calificaciones'],
        summary: 'Moderar una calificación: se oculta al público y queda registrada (administrador)',
        security: [{ bearerAuth: [] }],
        parameters: [parametroCalificacionId],
        requestBody: cuerpoJson({
          type: 'object',
          required: ['motivo'],
          properties: {
            motivo: { type: 'string', maxLength: 200, example: 'Lenguaje inapropiado' },
          },
        }),
        responses: {
          200: respuestaJson('Calificación moderada', { $ref: '#/components/schemas/Calificacion' }),
          400: respuestaError('El motivo es obligatorio'),
          401: respuestaError('No autenticado'),
          403: respuestaError('Sin permisos'),
          404: respuestaError('Calificación no encontrada'),
          409: respuestaError('La calificación ya fue moderada'),
        },
      },
    },
    '/api/calificaciones/prestador/{prestadorId}/reputacion': {
      get: {
        tags: ['Calificaciones'],
        summary: 'Consultar la reputación de un prestador: promedio y servicios finalizados',
        parameters: [parametroPrestadorId],
        responses: {
          200: respuestaJson('Reputación del prestador', { $ref: '#/components/schemas/Reputacion' }),
          404: respuestaError('Prestador no encontrado'),
        },
      },
    },
    '/api/calificaciones/prestador/{prestadorId}': {
      get: {
        tags: ['Calificaciones'],
        summary: 'Consultar las calificaciones y comentarios de un prestador (sin los moderados)',
        parameters: [parametroPrestadorId],
        responses: {
          200: respuestaJson('Calificaciones del prestador', {
            type: 'array',
            items: { $ref: '#/components/schemas/CalificacionPublica' },
          }),
          404: respuestaError('Prestador no encontrado'),
        },
      },
    },
  },
};

module.exports = swaggerSpec;

// Mapa de prestadores (se agrega acá para no chocar con otros cambios en paths).
swaggerSpec.paths['/api/prestadores/mapa'] = {
  get: {
    tags: ['Prestadores'],
    summary: 'Consultar los marcadores del mapa: prestadores activos y disponibles, con ubicación aproximada (público)',
    parameters: [
      {
        name: 'oficioId',
        in: 'query',
        required: false,
        schema: { type: 'string' },
        description: 'Solo prestadores que ofrecen este oficio',
      },
    ],
    responses: {
      200: respuestaJson('Marcadores del mapa (máximo 200), ordenados por nombre', {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Identificador del prestador, para abrir su ficha' },
            nombre: { type: 'string' },
            latitud: { type: 'number', description: 'Aproximada, con 2 decimales' },
            longitud: { type: 'number', description: 'Aproximada, con 2 decimales' },
            oficioPrincipal: { type: 'string' },
            promedio: { type: 'number', nullable: true, example: 4.5 },
          },
        },
      }),
      400: respuestaError('El oficioId es inválido'),
    },
  },
};


// Solicitudes (se agrega al final para no tocar el resto del archivo).
const solicitud = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    descripcion: { type: 'string' },
    direccion: { type: 'string', nullable: true },
    contactoPreferido: { type: 'string', nullable: true },
    estado: {
      type: 'string',
      enum: ['PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'FINALIZADA'],
    },
    fechaCreacion: { type: 'string', format: 'date-time' },
    clienteId: { type: 'string' },
    prestadorId: { type: 'string' },
    oficioId: { type: 'string' },
  },
};

swaggerSpec.tags.push({ name: 'Solicitudes', description: 'Solicitudes de servicio' });

swaggerSpec.paths['/api/solicitudes'] = {
  post: {
    tags: ['Solicitudes'],
    summary: 'Crear una solicitud de servicio a un prestador (cliente)',
    security: [{ bearerAuth: [] }],
    requestBody: cuerpoJson({
      type: 'object',
      required: ['prestadorId', 'oficioId', 'descripcion'],
      properties: {
        prestadorId: { type: 'string', description: 'Id del Prestador (no del Usuario)' },
        oficioId: { type: 'string' },
        descripcion: { type: 'string', maxLength: 1000, example: 'Se rompió una canilla' },
        direccion: { type: 'string', example: 'Av. Siempreviva 742' },
        contactoPreferido: { type: 'string', example: 'WhatsApp' },
      },
    }),
    responses: {
      201: respuestaJson('Solicitud creada en estado PENDIENTE', solicitud),
      400: respuestaError('Datos inválidos, oficio inexistente o desactivado, o el prestador no ofrece ese oficio'),
      401: respuestaError('No autenticado'),
      403: respuestaError('Solo los clientes pueden crear solicitudes'),
      404: respuestaError('Prestador no encontrado'),
      409: respuestaError('El prestador no está disponible'),
    },
  },
};

// Oficios del prestador (se agrega al final para no tocar el resto del archivo).
swaggerSpec.paths['/api/prestadores/me/oficios'] = {
  put: {
    tags: ['Prestadores'],
    summary: 'Elegir los oficios que ofrece el prestador autenticado (reemplaza los anteriores)',
    security: [{ bearerAuth: [] }],
    requestBody: cuerpoJson({
      type: 'object',
      required: ['oficioIds'],
      properties: {
        oficioIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['id-del-oficio-1', 'id-del-oficio-2'],
        },
      },
    }),
    responses: {
      200: respuestaJson('Perfil con los oficios actualizados', perfilPrestador),
      400: respuestaError('Lista inválida, o algún oficio no existe o está desactivado'),
      401: respuestaError('No autenticado'),
      403: respuestaError('Solo los prestadores pueden usar este endpoint'),
      404: respuestaError('Perfil de prestador no encontrado'),
    },
  },
};


// Estados de la solicitud (se agrega al final porque reutiliza la variable solicitud).
const parametroSolicitudId = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'Identificador de la solicitud',
};

const accionSobreSolicitud = (resumen, mensaje403, mensaje409) => ({
  patch: {
    tags: ['Solicitudes'],
    summary: resumen,
    security: [{ bearerAuth: [] }],
    parameters: [parametroSolicitudId],
    responses: {
      200: respuestaJson('Solicitud actualizada', solicitud),
      401: respuestaError('No autenticado'),
      403: respuestaError(mensaje403),
      404: respuestaError('Solicitud no encontrada'),
      409: respuestaError(mensaje409),
    },
  },
});

swaggerSpec.paths['/api/solicitudes/{id}/aceptar'] = accionSobreSolicitud(
  'Aceptar una solicitud pendiente (prestador dueño)',
  'La solicitud no es del prestador o el rol no tiene permisos',
  'La solicitud no está pendiente'
);

swaggerSpec.paths['/api/solicitudes/{id}/rechazar'] = accionSobreSolicitud(
  'Rechazar una solicitud pendiente (prestador dueño)',
  'La solicitud no es del prestador o el rol no tiene permisos',
  'La solicitud no está pendiente'
);

swaggerSpec.paths['/api/solicitudes/{id}/cancelar'] = accionSobreSolicitud(
  'Cancelar una solicitud pendiente o aceptada (cliente dueño)',
  'La solicitud no es del cliente o el rol no tiene permisos',
  'La solicitud ya no se puede cancelar'
);

// Finalizar solicitud (se agrega al final porque reutiliza accionSobreSolicitud).
swaggerSpec.paths['/api/solicitudes/{id}/finalizar'] = accionSobreSolicitud(
  'Finalizar una solicitud aceptada (prestador dueño)',
  'La solicitud no es del prestador o el rol no tiene permisos',
  'La solicitud no está aceptada'
);

// Consulta de solicitudes (se agrega al final porque reutiliza la variable solicitud).
swaggerSpec.paths['/api/solicitudes'].get = {
  tags: ['Solicitudes'],
  summary: 'Consultar mis solicitudes: el cliente ve las que creó y el prestador las que recibió',
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'estado',
      in: 'query',
      required: false,
      schema: {
        type: 'string',
        enum: ['PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'FINALIZADA'],
      },
      description: 'Filtra por estado de la solicitud',
    },
  ],
  responses: {
    200: respuestaJson('Lista de solicitudes, de la más nueva a la más vieja', {
      type: 'array',
      items: {
        allOf: [
          solicitud,
          {
            type: 'object',
            properties: {
              oficio: {
                type: 'object',
                properties: { id: { type: 'string' }, nombre: { type: 'string' } },
              },
              cliente: {
                type: 'object',
                properties: { id: { type: 'string' }, nombre: { type: 'string' } },
              },
              prestador: {
                type: 'object',
                properties: { id: { type: 'string' }, nombre: { type: 'string' } },
              },
              calificada: { type: 'boolean' },
            },
          },
        ],
      },
    }),
    400: respuestaError('El estado es inválido'),
    401: respuestaError('No autenticado'),
    403: respuestaError('Solo clientes y prestadores pueden consultar solicitudes'),
    404: respuestaError('Perfil de prestador no encontrado'),
  },
};