const { definirCasos, nuevo, BASE_UNITARIA, SEGURIDAD } = require('./definir');

const PRE_MW = 'Middleware importado directamente; request, response y next simulados; JWT firmados con la clave de test.';
const PRE_HTTP =
  'App Express real con Supertest; servicios de prestadores, solicitudes y mapa simulados; JWT firmados con la clave de test.';

const middlewares = definirCasos(
  { ...BASE_UNITARIA, ...SEGURIDAD, modulo: 'Seguridad: middlewares', rol: 'Todos', rf: ['RF-02'], precondiciones: PRE_MW },
  [
    nuevo('TC-SEG-001', 'Sin header Authorization', 'autenticar rechaza un pedido sin header de autorización.', ['Invocar autenticar sin header'], '401 y no llama a next.'),
    nuevo('TC-SEG-002', 'Tipo de autorización distinto de Bearer', 'autenticar rechaza un header que no es Bearer.', ['Invocar autenticar con "Basic <token>"'], '401 y no llama a next.'),
    nuevo('TC-SEG-003', 'Bearer sin token', 'autenticar rechaza "Bearer" sin token.', ['Invocar autenticar con "Bearer "'], '401 y no llama a next.'),
    nuevo('TC-SEG-004', 'Token mal formado', 'autenticar rechaza un token que no se puede verificar.', ['Invocar autenticar con un token inválido'], '401 "Token inválido o vencido".'),
    nuevo('TC-SEG-005', 'Token firmado con otra clave', 'autenticar rechaza un token firmado con una clave distinta.', ['Firmar un token con otra clave', 'Invocar autenticar'], '401 y no llama a next.'),
    nuevo('TC-SEG-006', 'Token vencido', 'autenticar rechaza un token expirado.', ['Firmar un token ya vencido', 'Invocar autenticar'], '401 y no llama a next.'),
    nuevo('TC-SEG-007', 'Algoritmo distinto de HS256', 'autenticar solo acepta tokens HS256.', ['Firmar un token con HS512', 'Invocar autenticar'], '401 y no llama a next.'),
    nuevo('TC-SEG-008', 'Token válido', 'Con un token válido se carga el usuario en la request y se continúa.', ['Firmar un token válido', 'Invocar autenticar'], 'req.usuario = { id, rol } y se llama a next.', { severidad: 'mayor' }),
    nuevo('TC-SEG-009', 'autorizar sin usuario autenticado', 'autorizar responde 401 si no hay usuario en la request.', ['Invocar autorizar sin req.usuario'], '401 y no llama a next.'),
    nuevo('TC-SEG-010', 'Rol no permitido', 'autorizar responde 403 si el rol no está entre los permitidos.', ['Invocar autorizar("ADMINISTRADOR") con un CLIENTE'], '403 y no llama a next.'),
    nuevo('TC-SEG-011', 'Rol permitido', 'autorizar deja pasar un rol permitido.', ['Invocar autorizar con el rol correcto'], 'Llama a next.', { severidad: 'mayor' }),
    nuevo('TC-SEG-012', 'Varios roles permitidos', 'autorizar acepta cualquiera de los roles indicados.', ['Invocar autorizar("CLIENTE", "PRESTADOR") con un PRESTADOR'], 'Llama a next.', { severidad: 'mayor' }),
  ]
);

const http = definirCasos(
  { ...BASE_UNITARIA, ...SEGURIDAD, modulo: 'Seguridad: API HTTP y JWT', rol: 'Todos', precondiciones: PRE_HTTP },
  [
    nuevo('TC-SEG-013', 'Rutas protegidas sin token', 'Cada ruta protegida responde 401 si no se manda token.', ['Pedir cada ruta protegida sin Authorization'], '401 y no se llama a ningún servicio.', { rf: ['RF-02'] }),
    nuevo('TC-SEG-014', 'Token inválido en rutas protegidas', 'Un token mal formado, firmado con otra clave, vencido o sin "Bearer" responde 401 en todas las rutas protegidas.', ['Pedir cada ruta protegida con el token inválido del caso'], '401 en todas.', { rf: ['RF-02'] }),
    nuevo('TC-SEG-015', 'Rol incorrecto', 'Cada ruta con rol responde 403 a los roles que no tienen permiso.', ['Pedir cada ruta con un token válido de un rol no permitido'], '403 y no se llama a ningún servicio.', { rf: ['RF-03', 'RF-09', 'RF-11', 'RF-12', 'RF-13', 'RF-14', 'RF-15', 'RF-21'] }),
    nuevo('TC-SEG-016', 'Rol correcto y datos válidos', 'Con el rol correcto y datos válidos cada ruta protegida responde 200 o 201.', ['Pedir cada ruta con token del rol permitido y un cuerpo válido'], 'Responde el código esperado (200/201).', { tipo: 'funcional', severidad: 'mayor', rf: ['RF-03', 'RF-04', 'RF-09', 'RF-11', 'RF-12', 'RF-13', 'RF-14', 'RF-15', 'RF-21'] }),
    nuevo('TC-SEG-017', 'El id sale del token', 'El servicio recibe el id del token aunque el cuerpo traiga otro usuarioId.', ['PUT /api/prestadores/me con usuarioId "otro" en el cuerpo'], 'El servicio se llama con el id del token y sin el campo usuarioId.', { rf: ['RF-03'] }),
    nuevo('TC-SEG-018', 'Usuario y rol del token', 'El listado de solicitudes recibe el usuario y el rol del token.', ['GET /api/solicitudes con token de CLIENTE'], 'El servicio recibe { id, rol } del token.', { rf: ['RF-14', 'RF-15'] }),
    nuevo('TC-SEG-019', 'Datos inválidos con JWT válido', 'Con token válido pero cuerpo o filtros inválidos se responde 400 sin llegar al servicio.', ['Pedir cada ruta con token válido y el dato inválido del caso'], '400 con un mensaje de error y sin llamadas a servicios.', { tipo: 'funcional', prioridad: 'media', severidad: 'normal', rf: ['RF-04', 'RF-09', 'RF-10', 'RF-14'] }),
    nuevo('TC-SEG-020', 'JSON inválido', 'Un cuerpo que no es JSON válido responde 400.', ['POST /api/solicitudes como CLIENTE con un JSON roto'], '400 con un mensaje que menciona JSON.', { tipo: 'funcional', prioridad: 'media', severidad: 'normal', rf: [] }),
    nuevo('TC-SEG-021', 'Rutas públicas sin token', 'Health, búsqueda, mapa y ficha no piden token.', ['GET de cada ruta pública sin Authorization'], '200.', { tipo: 'funcional', severidad: 'mayor', rf: ['RF-05', 'RF-07', 'RF-08'] }),
    nuevo('TC-SEG-022', 'Rutas públicas con filtros inválidos', 'La búsqueda y el mapa validan sus filtros.', ['GET /api/prestadores?lat=-34.6', 'GET /api/prestadores/mapa?oficioId=%20'], '400.', { tipo: 'funcional', prioridad: 'media', severidad: 'normal', rf: ['RF-05', 'RF-06'] }),
    nuevo('TC-SEG-023', 'Ruta inexistente', 'Una ruta que no existe responde 404.', ['GET /api/no-existe'], '404.', { tipo: 'funcional', prioridad: 'baja', severidad: 'menor', rf: [] }),
    nuevo('TC-SEG-024', 'Errores del servicio a HTTP', 'Los errores 403, 404 y 409 del servicio se traducen al código y mensaje HTTP.', ['Hacer fallar aceptarSolicitud con el status del caso', 'PATCH /api/solicitudes/s1/aceptar'], 'Responde ese status con el mensaje del servicio.', { tipo: 'funcional', prioridad: 'media', severidad: 'normal', rf: ['RF-11'] }),
    nuevo('TC-SEG-025', '500 sin detalle interno', 'Un error inesperado del servicio responde 500 sin exponer el detalle.', ['Hacer fallar un servicio con un error común', 'Pedir la ruta'], '500 con "Error interno del servidor".', { severidad: 'mayor', rf: [] }),
  ]
);

module.exports = [...middlewares, ...http];
