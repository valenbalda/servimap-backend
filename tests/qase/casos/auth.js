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

const PERFIL = { rol: 'Cliente / Prestador', rf: ['RF-01', 'RF-02'] };

const edicionPerfil = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Autenticación: edición de perfil y contraseña', ...PERFIL, precondiciones: PRE_CTRL },
  [
    nuevo('TC-AUTH-031', 'Editar nombre sin nombre válido', 'PATCH /me exige un nombre de texto que no esté vacío.', ['Invocar actualizarMe sin nombre, con espacios o con un número'], '400 sin llamar al servicio.'),
    nuevo('TC-AUTH-032', 'Editar nombre demasiado largo', 'El nombre no puede superar los 100 caracteres.', ['Invocar actualizarMe con un nombre de 101 caracteres'], '400 sin llamar al servicio.'),
    nuevo('TC-AUTH-033', 'Editar solo el nombre', 'El controlador limpia el nombre y usa el id del token; ignora dni, email y rol.', ['Invocar actualizarMe con nombre, dni, email y rol'], 'El servicio recibe solo el id del token y el nombre limpio.', { ...SEGURIDAD }),
    nuevo('TC-AUTH-034', 'Error del servicio al editar el nombre', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar actualizarNombre', 'Invocar actualizarMe'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-AUTH-035', 'Cambiar contraseña sin datos', 'Hacen falta la contraseña actual y la nueva, ambas de texto.', ['Invocar cambiarPassword sin alguna de las dos o con números'], '400 sin llamar al servicio.', { tipo: 'seguridad' }),
    nuevo('TC-AUTH-036', 'Contraseña nueva corta', 'La contraseña nueva tiene que tener al menos 8 caracteres.', ['Invocar cambiarPassword con una nueva de 7 caracteres'], '400 sin llamar al servicio.', { tipo: 'seguridad' }),
    nuevo('TC-AUTH-037', 'Contraseña nueva igual a la actual', 'No se acepta repetir la contraseña actual.', ['Invocar cambiarPassword con la misma contraseña en los dos campos'], '400 sin llamar al servicio.', { tipo: 'seguridad' }),
    nuevo('TC-AUTH-038', 'Cambio de contraseña correcto', 'Usa el id del token y responde sin ningún dato de la clave.', ['Invocar cambiarPassword con datos válidos'], 'Responde { mensaje: "Contraseña actualizada" }.', { ...SEGURIDAD }),
    nuevo('TC-AUTH-039', 'Error del servicio al cambiar la contraseña', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar cambiarPassword', 'Invocar cambiarPassword'], 'Se llama a next(error).', PROPAGA_ERROR),
  ]
);

const edicionServicio = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Autenticación: edición de perfil y contraseña (servicio)', ...PERFIL, precondiciones: PRE_SRV },
  [
    nuevo('TC-AUTH-040', 'Actualizar nombre', 'actualizarNombre cambia solo el nombre y devuelve el perfil sin la contraseña.', ['Simular el usuario', 'Llamar a actualizarNombre'], 'prisma.usuario.update recibe solo el nombre y el perfil no incluye passwordHash.', { ...CENTRAL }),
    nuevo('TC-AUTH-041', 'Actualizar nombre de usuario inexistente o desactivado', 'No se edita a un usuario que no existe o está desactivado.', ['Simular que no hay usuario o que está desactivado', 'Llamar a actualizarNombre'], 'Lanza 404 y no actualiza.'),
    nuevo('TC-AUTH-042', 'Contraseña nueva hasheada', 'cambiarPassword guarda la nueva contraseña con hash bcrypt y no devuelve nada.', ['Simular un usuario con su contraseña actual', 'Llamar a cambiarPassword'], 'prisma.usuario.update recibe solo passwordHash, que valida contra la nueva y no es el texto plano.', { ...SEGURIDAD }),
    nuevo('TC-AUTH-043', 'Contraseña actual incorrecta', 'No se cambia la contraseña si la actual no coincide.', ['Simular un usuario', 'Llamar a cambiarPassword con otra contraseña actual'], 'Lanza 400 y no actualiza.', { ...SEGURIDAD }),
    nuevo('TC-AUTH-044', 'Cambiar contraseña de usuario inexistente o desactivado', 'No se cambia la contraseña de un usuario que no existe o está desactivado.', ['Simular que no hay usuario o que está desactivado', 'Llamar a cambiarPassword'], 'Lanza 404 y no actualiza.'),
  ]
);

const numeroUsuario = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Autenticación: número identificador', ...PERFIL, precondiciones: PRE_SRV },
  [
    nuevo('TC-AUTH-045', 'Número en el registro', 'El registro devuelve el número autogenerado del usuario y no acepta uno elegido por quien se registra.', ['Simular el alta con un número en los datos', 'Llamar a registrarUsuario'], 'prisma.usuario.create no recibe número y la respuesta incluye id y numero.', { ...CENTRAL }),
    nuevo('TC-AUTH-046', 'Número en el perfil', 'El perfil del usuario incluye su número además del id.', ['Simular el usuario con número', 'Llamar a obtenerPerfil'], 'La respuesta incluye id y numero.'),
  ]
);

const fotoPerfil = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Autenticación: foto de perfil', ...PERFIL, precondiciones: PRE_SRV },
  [
    nuevo('TC-AUTH-047', 'Foto de perfil de un cliente', 'El perfil de un cliente incluye su foto, o null si no tiene.', ['Simular un cliente con foto y otro sin foto', 'Llamar a obtenerPerfil'], 'La respuesta incluye fotoPerfil con la URL o null.', { ...CENTRAL }),
    nuevo('TC-AUTH-048', 'Foto de perfil de un prestador', 'El perfil de un prestador toma la foto del campo fotoPerfil de su perfil de prestador.', ['Simular un usuario prestador y su perfil con foto', 'Llamar a obtenerPerfil y actualizarNombre'], 'La respuesta incluye la foto del prestador (o null si no hay perfil) tanto al consultar como al editar el nombre.', { ...CENTRAL }),
  ]
);

module.exports = [...registro, ...sesion, ...servicio, ...edicionPerfil, ...edicionServicio, ...numeroUsuario, ...fotoPerfil];
