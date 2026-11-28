const { definirCasos, nuevo, BASE_UNITARIA, CENTRAL, SEGURIDAD, PROPAGA_ERROR } = require('./definir');

const PRE_CTRL = 'Controlador de fotos con fotosService simulado; request y response simulados.';
const PRE_SRV = 'fotosService con Prisma y el SDK de Vercel Blob simulados, sin base de datos ni almacenamiento reales.';
const PRE_HTTP = 'API completa con supertest y fotosService simulado; token JWT firmado con la clave de test.';
const PERFIL_FOTO = { rol: 'Cliente / Prestador', rf: ['RF-01', 'RF-03'] };

const controlador = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Foto de perfil: controlador', ...PERFIL_FOTO, precondiciones: PRE_CTRL },
  [
    nuevo('TC-FOT-001', 'Subida sin imagen o con tipo no permitido', 'Solo se acepta una imagen JPG, PNG o WebP en el cuerpo del pedido.', ['Invocar subir sin Content-Type, con un tipo que no es imagen, con gif, sin cuerpo, con cuerpo vacío o con un cuerpo que no es una imagen cruda'], '400 "Enviá la imagen como JPG, PNG o WebP en el cuerpo del pedido" sin llamar al servicio.', CENTRAL),
    nuevo('TC-FOT-002', 'Archivo que no es lo que dice ser', 'Se comprueban los primeros bytes del archivo: un texto con la etiqueta image/png, o un formato distinto al declarado, se rechaza.', ['Invocar subir con un texto como image/png', 'Invocar subir con un PNG como image/jpeg, un JPG como image/webp y un RIFF que no es WebP'], '400 "El archivo no es una imagen válida o no coincide con su tipo" sin llamar al servicio.', SEGURIDAD),
    nuevo('TC-FOT-003', 'Subida válida', 'Una imagen JPG, PNG o WebP válida llega al servicio con el usuario y el rol del token.', ['Invocar subir con cada formato válido, incluso con parámetros en el Content-Type'], 'El servicio recibe el id y el rol del token, la imagen y su tipo, y se responde con la URL.', CENTRAL),
    nuevo('TC-FOT-004', 'Error del servicio al subir la foto', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar subirFoto', 'Invocar subir'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-FOT-005', 'Eliminar la foto propia', 'Se elimina la foto del usuario del token.', ['Invocar eliminar con req.usuario'], 'El servicio recibe el id y el rol del token y se responde { fotoPerfil: null }.', CENTRAL),
    nuevo('TC-FOT-006', 'Error del servicio al eliminar la foto', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar eliminarFoto', 'Invocar eliminar'], 'Se llama a next(error).', PROPAGA_ERROR),
  ]
);

const servicio = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Foto de perfil: servicio', ...PERFIL_FOTO, precondiciones: PRE_SRV },
  [
    nuevo('TC-FOT-007', 'Subir la foto de un cliente', 'La imagen se sube al store público con una URL única y la URL se guarda en el usuario.', ['Llamar a subirFoto con rol CLIENTE'], 'put recibe access público, el tipo de la imagen y addRandomSuffix; el usuario guarda la URL y se devuelve.', CENTRAL),
    nuevo('TC-FOT-008', 'Subir la foto de un prestador', 'La URL se guarda en el campo fotoPerfil del prestador, el mismo que usan los listados y la ficha.', ['Llamar a subirFoto con rol PRESTADOR'], 'El prestador guarda la URL y no se modifica la tabla de usuarios.', CENTRAL),
    nuevo('TC-FOT-009', 'Reemplazar la foto', 'Al subir una foto nueva se borra la anterior del store.', ['Simular un usuario con una foto del store', 'Llamar a subirFoto'], 'del recibe la URL de la foto anterior.', CENTRAL),
    nuevo('TC-FOT-010', 'No borrar fotos que no son del store', 'Si no había foto, o era una URL externa cargada a mano, no se intenta borrar nada.', ['Simular un usuario sin foto y otro con una URL externa', 'Llamar a subirFoto'], 'del no se llama y la foto nueva se guarda igual.'),
    nuevo('TC-FOT-011', 'Falla el borrado de la foto anterior', 'Si el store no puede borrar la foto vieja, el usuario igual conserva su foto nueva.', ['Simular que del falla', 'Llamar a subirFoto'], 'Se devuelve la URL nueva sin error.', PROPAGA_ERROR),
    nuevo('TC-FOT-012', 'Falla el guardado en la base', 'Si no se puede guardar la URL, la foto recién subida se borra para no dejarla huérfana.', ['Simular que update falla', 'Llamar a subirFoto'], 'Lanza el error y del recibe la URL de la foto nueva.', { ...CENTRAL }),
    nuevo('TC-FOT-013', 'Falla la subida al store', 'Si el store falla, no se modifica la base.', ['Simular que put falla', 'Llamar a subirFoto'], 'Lanza el error sin actualizar la base ni borrar nada.', PROPAGA_ERROR),
    nuevo('TC-FOT-014', 'Subir foto de un usuario inexistente o desactivado', 'No se sube nada para un usuario o prestador que no existe o está desactivado.', ['Simular que no hay usuario, que está desactivado, o lo mismo para el perfil de prestador', 'Llamar a subirFoto'], 'Lanza 404 y no sube nada.'),
    nuevo('TC-FOT-015', 'Eliminar la foto', 'Se quita la foto del perfil y se borra del store.', ['Simular un usuario con una foto del store', 'Llamar a eliminarFoto'], 'El usuario queda con fotoPerfil null, del recibe la URL y se devuelve { fotoPerfil: null }.', CENTRAL),
    nuevo('TC-FOT-016', 'Eliminar una foto externa', 'Si la foto era una URL externa, solo se quita del perfil.', ['Simular un prestador con una URL externa', 'Llamar a eliminarFoto'], 'El prestador queda con fotoPerfil null y del no se llama.'),
    nuevo('TC-FOT-017', 'Eliminar sin tener foto', 'No hay nada que eliminar.', ['Simular un usuario sin foto', 'Llamar a eliminarFoto'], 'Lanza 404 "No tenés una foto de perfil" sin modificar nada.'),
    nuevo('TC-FOT-018', 'Eliminar la foto de un usuario desactivado', 'No se modifica a un usuario desactivado.', ['Simular un usuario desactivado', 'Llamar a eliminarFoto'], 'Lanza 404 y no actualiza.'),
    nuevo('TC-FOT-019', 'Reconocer las fotos del store', 'Solo se consideran propias las URL del dominio de Vercel Blob; no se confunden dominios parecidos ni textos que no son URL.', ['Llamar a esFotoDelStore con URL del store, URL externas, un dominio parecido, un texto y null'], 'Devuelve true solo para las URL del store.', SEGURIDAD),
  ]
);

const http = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Foto de perfil: API', ...PERFIL_FOTO, precondiciones: PRE_HTTP },
  [
    nuevo('TC-FOT-020', 'Foto de perfil sin token', 'Subir y eliminar la foto exigen estar logueado.', ['Llamar a PUT y DELETE /api/auth/me/foto sin token'], '401 sin llamar al servicio.', SEGURIDAD),
    nuevo('TC-FOT-021', 'Foto de perfil como administrador', 'Solo clientes y prestadores tienen foto de perfil.', ['Llamar a PUT y DELETE /api/auth/me/foto con un token de administrador'], '403 sin llamar al servicio.', SEGURIDAD),
    nuevo('TC-FOT-022', 'Subir la foto con el cuerpo crudo', 'Un cliente y un prestador pueden subir su foto enviando la imagen como cuerpo del pedido.', ['Llamar a PUT /api/auth/me/foto con un PNG y el Content-Type image/png'], '200 con la URL; el servicio recibe el id y el rol del token y la imagen completa.', CENTRAL),
    nuevo('TC-FOT-023', 'Imagen de más de 2 MB', 'Se rechaza una imagen que supera los 2 MB antes de procesarla.', ['Llamar a PUT /api/auth/me/foto con una imagen de más de 2 MB'], '413 sin llamar al servicio.', CENTRAL),
    nuevo('TC-FOT-024', 'JSON en lugar de la imagen', 'Si el cuerpo es JSON y no una imagen, se rechaza.', ['Llamar a PUT /api/auth/me/foto con un cuerpo JSON'], '400 sin llamar al servicio.'),
    nuevo('TC-FOT-025', 'Eliminar la foto por HTTP', 'Un cliente elimina su foto con DELETE /api/auth/me/foto.', ['Llamar a DELETE /api/auth/me/foto con un token de cliente'], '200 { fotoPerfil: null }; el servicio recibe el id y el rol del token.'),
  ]
);

module.exports = [...controlador, ...servicio, ...http];