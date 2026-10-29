const { definirCasos, nuevo, BASE_UNITARIA, CENTRAL, SEGURIDAD, PROPAGA_ERROR } = require('./definir');

const PRE_CTRL = 'Controlador de autenticación con authService simulado; request y response simulados.';
const PRE_SRV = 'authService con Prisma simulado (sin base de datos real) y una clave JWT de test.';

const registro = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Autenticación: registro', rol: 'Visitante', rf: ['RF-01'], precondiciones: PRE_CTRL },
  [
    nuevo('TC-AUTH-001', 'Registro sin datos obligatorios', 'El registro exige nombre, DNI, email, contraseña y rol.', ['Invocar register sin alguno de los datos'], '400 "Faltan datos obligatorios" sin llamar al servicio.'),
    nuevo('TC-AUTH-002', 'Registro sin DNI', 'El DNI es obligatorio para crear una cuenta.', ['Invocar register sin dni'], '400 sin llamar al servicio.', CENTRAL),
    nuevo('TC-AUTH-003', 'Dato que no es texto', 'Todos los datos del registro tienen que ser texto.', ['Invocar register con un dato numérico'], '400 sin llamar al servicio.'),
    nuevo('TC-AUTH-004', 'DNI numérico', 'El DNI tiene que llegar como texto, no como número.', ['Invocar register con dni numérico'], '400 sin llamar al servicio.'),
    nuevo('TC-AUTH-005', 'DNI con formato inválido', 'Se rechazan DNI con letras, guiones o con menos de 7 o más de 8 dígitos.', ['Invocar register con cada DNI inválido'], '400 "El DNI debe tener 7 u 8 números".'),
    nuevo('TC-AUTH-006', 'Email inválido', 'Se rechazan emails sin arroba, sin dominio o con espacios.', ['Invocar register con cada email inválido'], '400 "Email inválido".'),
    nuevo('TC-AUTH-007', 'Contraseña corta', 'La contraseña tiene que tener al menos 8 caracteres.', ['Invocar register con una contraseña de 7 caracteres'], '400 sin llamar al servicio.', { tipo: 'seguridad' }),
    nuevo('TC-AUTH-008', 'Registro exitoso con datos limpios', 'El controlador limpia los datos (trim, email en minúsculas) y responde 201.', ['Invocar register con datos válidos con espacios y mayúsculas'], 'El servicio recibe los datos normalizados y se responde 201.', CENTRAL),
    nuevo('TC-AUTH-009', 'DNI normalizado', 'El DNI se guarda siempre igual aunque se escriba con puntos o espacios.', ['Invocar register con el DNI en cada formato'], 'El servicio recibe el DNI solo con números.', CENTRAL),
    nuevo('TC-AUTH-010', 'DNI que empieza con 9', 'Se aceptan DNI de 8 dígitos que empiezan con 9.', ['Invocar register con un DNI que empieza con 9'], '201.'),
    nuevo('TC-AUTH-011', 'Error del servicio en el registro', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar registrarUsuario', 'Invocar register'], 'Se llama a next(error).', PROPAGA_ERROR),
  ]
);

const sesion = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Autenticación: sesión', rol: 'Visitante', rf: ['RF-02'], precondiciones: PRE_CTRL },
  [
    nuevo('TC-AUTH-012', 'Login sin email o contraseña', 'El login exige email y contraseña.', ['Invocar login sin alguno de los dos'], '400 sin llamar al servicio.'),
    nuevo('TC-AUTH-013', 'Login con email en minúsculas', 'El email se normaliza a minúsculas antes de iniciar sesión.', ['Invocar login con el email en mayúsculas'], 'El servicio recibe el email en minúsculas y se devuelve su resultado.', CENTRAL),
    nuevo('TC-AUTH-014', 'Login sin DNI', 'El inicio de sesión no pide el DNI.', ['Invocar login solo con email y contraseña'], 'Se inicia sesión normalmente.'),
    nuevo('TC-AUTH-015', 'Error del servicio en el login', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar iniciarSesion', 'Invocar login'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-AUTH-016', 'Perfil del usuario autenticado', 'GET /me devuelve el perfil del usuario del token.', ['Invocar me con req.usuario'], 'Responde el perfil devuelto por el servicio.', { rol: 'Cliente / Prestador', rf: ['RF-01', 'RF-02'] }),
    nuevo('TC-AUTH-017', 'Error del servicio en el perfil', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar obtenerPerfil', 'Invocar me'], 'Se llama a next(error).', { ...PROPAGA_ERROR, rol: 'Cliente / Prestador', rf: ['RF-01', 'RF-02'] }),
  ]
);

const servicio = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Autenticación: servicio', rol: 'Visitante', precondiciones: PRE_SRV },
  [
    nuevo('TC-AUTH-018', 'Rol no permitido en el registro', 'El registro público solo permite CLIENTE o PRESTADOR.', ['Llamar a registrarUsuario con rol ADMINISTRADOR'], 'Lanza 400 y no crea el usuario.', { ...SEGURIDAD, rf: ['RF-01'] }),
    nuevo('TC-AUTH-019', 'DNI ya registrado', 'No se puede crear otra cuenta con un DNI existente.', ['Simular un usuario con ese DNI', 'Llamar a registrarUsuario'], 'Lanza 409 y no crea el usuario.', { ...CENTRAL, rf: ['RF-01'] }),
    nuevo('TC-AUTH-020', 'Email ya registrado', 'No se puede crear otra cuenta con un email existente.', ['Simular un usuario con ese email', 'Llamar a registrarUsuario'], 'Lanza 409 y no crea el usuario.', { ...CENTRAL, rf: ['RF-01'] }),
    nuevo('TC-AUTH-021', 'Alta de cliente', 'Un cliente se crea con la contraseña hasheada y sin perfil de prestador.', ['Llamar a registrarUsuario con rol CLIENTE'], 'prisma.usuario.create recibe un hash bcrypt (no la contraseña) y sin perfil de prestador.', { ...SEGURIDAD, rf: ['RF-01'] }),
    nuevo('TC-AUTH-022', 'Alta de prestador', 'Registrar un PRESTADOR crea su perfil de prestador vacío.', ['Llamar a registrarUsuario con rol PRESTADOR'], 'prisma.usuario.create incluye prestador: { create: {} }.', { ...CENTRAL, rf: ['RF-01', 'RF-03'] }),
    nuevo('TC-AUTH-023', 'Búsqueda por email al iniciar sesión', 'iniciarSesion busca al usuario por su email.', ['Llamar a iniciarSesion'], 'Se consulta prisma.usuario.findUnique por email.', { rf: ['RF-02'] }),
    nuevo('TC-AUTH-024', 'Email inexistente', 'Un email que no existe se rechaza con 401.', ['Simular que no hay usuario', 'Llamar a iniciarSesion'], 'Lanza 401 "Email o contraseña incorrectos".', { ...SEGURIDAD, rf: ['RF-02'] }),
    nuevo('TC-AUTH-025', 'Contraseña incorrecta', 'Una contraseña incorrecta responde con el mismo mensaje que un email inexistente.', ['Simular un usuario', 'Llamar a iniciarSesion con otra contraseña'], 'Lanza 401 con el mismo mensaje.', { ...SEGURIDAD, rf: ['RF-02'] }),
    nuevo('TC-AUTH-026', 'Cuenta desactivada', 'Un usuario desactivado no puede iniciar sesión.', ['Simular un usuario con activo = false', 'Llamar a iniciarSesion'], 'Lanza 403.', { ...SEGURIDAD, rf: ['RF-02'] }),
    nuevo('TC-AUTH-027', 'Token de sesión', 'El login devuelve un JWT con el id y el rol, sin contraseña ni DNI.', ['Llamar a iniciarSesion con credenciales correctas', 'Verificar el token con la clave de test'], 'El token tiene sub = id del usuario y su rol; la respuesta no incluye passwordHash ni dni.', { ...SEGURIDAD, rf: ['RF-02'] }),
    nuevo('TC-AUTH-028', 'Perfil con DNI', 'obtenerPerfil devuelve el DNI y no la contraseña.', ['Simular el usuario', 'Llamar a obtenerPerfil'], 'Incluye dni y no incluye passwordHash.', { ...SEGURIDAD, rol: 'Cliente / Prestador', rf: ['RF-01', 'RF-02'] }),
    nuevo('TC-AUTH-029', 'Perfil de usuario inexistente', 'obtenerPerfil lanza 404 si el usuario no existe.', ['Simular que no hay usuario', 'Llamar a obtenerPerfil'], 'Lanza 404.', { rol: 'Cliente / Prestador', rf: ['RF-01', 'RF-02'] }),
    nuevo('TC-AUTH-030', 'Perfil de usuario desactivado', 'obtenerPerfil lanza 404 si el usuario está desactivado.', ['Simular un usuario con activo = false', 'Llamar a obtenerPerfil'], 'Lanza 404.', { rol: 'Cliente / Prestador', rf: ['RF-01', 'RF-02'] }),
  ]
);

module.exports = [...registro, ...sesion, ...servicio];
