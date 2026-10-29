const { definirCasos, nuevo, BASE_UNITARIA, CENTRAL, SEGURIDAD, PROPAGA_ERROR } = require('./definir');

const PRE_CTRL = 'Controlador de prestadores con prestadoresService simulado; request y response simulados.';
const PRE_SRV = 'prestadoresService con Prisma (y calificacionesService cuando corresponde) simulados, sin base de datos real.';

const perfilControlador = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Prestadores: perfil (controlador)', rol: 'Prestador', rf: ['RF-03', 'RF-04'], precondiciones: PRE_CTRL },
  [
    nuevo('TC-PRE-001', 'Consultar perfil propio', 'Devuelve el perfil del prestador autenticado.', ['Invocar obtenerMiPerfil con req.usuario'], 'El servicio recibe el id del token y se devuelve el perfil.', { rf: ['RF-03'] }),
    nuevo('TC-PRE-002', 'Error al consultar el perfil', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar obtenerMiPerfil', 'Invocar obtenerMiPerfil'], 'Se llama a next(error).', { ...PROPAGA_ERROR, rf: ['RF-03'] }),
    nuevo('TC-PRE-003', 'Campos de texto que no son texto', 'Descripción, foto, zona, teléfono, WhatsApp y email de contacto tienen que ser texto.', ['Invocar actualizarMiPerfil con cada campo numérico'], '400 "El campo <campo> debe ser texto" sin llamar al servicio.'),
    nuevo('TC-PRE-004', 'Email de contacto sin arroba', 'El email de contacto tiene que tener arroba.', ['Invocar actualizarMiPerfil con emailContacto "sin-arroba"'], '400 "El email de contacto es inválido".'),
    nuevo('TC-PRE-005', 'Ubicación, precios o disponibilidad inválidos', 'Latitud, longitud, precios y disponible se validan por tipo y rango.', ['Invocar actualizarMiPerfil con cada dato fuera de rango o de otro tipo'], '400 con el mensaje de cada validación, sin llamar al servicio.'),
    nuevo('TC-PRE-006', 'Edición sin datos', 'Hay que mandar al menos un campo editable.', ['Invocar actualizarMiPerfil sin cuerpo o con cuerpo vacío'], '400 "No hay datos para actualizar".'),
    nuevo('TC-PRE-007', 'Edición con datos limpios', 'Se actualiza con los datos sin espacios y se ignoran los campos no editables.', ['Invocar actualizarMiPerfil con campos válidos y otros no permitidos'], 'El servicio recibe solo los campos permitidos y limpios.', SEGURIDAD),
    nuevo('TC-PRE-008', 'Error al editar el perfil', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar actualizarMiPerfil', 'Invocar actualizarMiPerfil'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-PRE-009', 'Lista de oficios inválida', 'oficioIds tiene que ser una lista de identificadores de texto.', ['Invocar asignarMisOficios sin cuerpo, sin oficioIds, con un texto o con números'], '400 sin llamar al servicio.', { rf: ['RF-04'] }),
    nuevo('TC-PRE-010', 'Asignar oficios', 'Se asignan los oficios con los identificadores sin espacios.', ['Invocar asignarMisOficios con ids con espacios'], 'El servicio recibe el id del token y los ids limpios.', { ...CENTRAL, rf: ['RF-04'] }),
    nuevo('TC-PRE-011', 'Error al asignar oficios', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar asignarMisOficios', 'Invocar asignarMisOficios'], 'Se llama a next(error).', { ...PROPAGA_ERROR, rf: ['RF-04'] }),
  ]
);

const busquedaControlador = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Prestadores: búsqueda (controlador)', rol: 'Visitante', rf: ['RF-06', 'RF-07'], precondiciones: PRE_CTRL },
  [
    nuevo('TC-PRE-012', 'Filtros de búsqueda inválidos', 'Se validan oficioId, q, lat/lng, radioKm, calificacionMin y limit.', ['Invocar listar con cada consulta inválida'], '400 con el mensaje de cada filtro, sin llamar al servicio.'),
    nuevo('TC-PRE-013', 'Búsqueda sin filtros', 'Sin filtros se busca con la consulta vacía.', ['Invocar listar sin query'], 'El servicio recibe {} y se devuelve su resultado.'),
    nuevo('TC-PRE-014', 'Filtros convertidos', 'Los filtros llegan al servicio convertidos a número y sin espacios.', ['Invocar listar con todos los filtros como texto'], 'El servicio recibe números y textos limpios.', CENTRAL),
    nuevo('TC-PRE-015', 'Error en la búsqueda', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar listarPrestadores', 'Invocar listar'], 'Se llama a next(error).', PROPAGA_ERROR),
  ]
);

const validaciones = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Prestadores: validaciones', rol: 'Prestador', rf: ['RF-04'], precondiciones: PRE_CTRL },
  [
    nuevo('TC-PRE-016', 'Descripción profesional vacía', 'La descripción profesional no puede quedar vacía.', ['Invocar actualizarMiPerfil con descripción vacía o solo espacios'], '400 sin llamar al servicio.'),
    nuevo('TC-PRE-017', 'Teléfono o WhatsApp inválido', 'Teléfono y WhatsApp tienen que tener formato telefónico.', ['Invocar actualizarMiPerfil con cada valor inválido'], '400 "El teléfono es inválido" / "El WhatsApp es inválido".'),
    nuevo('TC-PRE-018', 'Teléfonos válidos', 'Se aceptan teléfonos con +, espacios y guiones.', ['Invocar actualizarMiPerfil con cada teléfono válido'], 'Se llama al servicio con el teléfono.'),
    nuevo('TC-PRE-019', 'Descripción con texto', 'Una descripción válida se guarda sin espacios sobrantes.', ['Invocar actualizarMiPerfil con descripción con espacios'], 'El servicio recibe la descripción limpia.'),
    nuevo('TC-PRE-020', 'Filtro disponible inválido', 'El filtro disponible solo acepta "true" o "false".', ['Invocar listar con disponible "si", "1", "TRUE" o vacío'], '400 sin llamar al servicio.', { rol: 'Visitante', rf: ['RF-07'] }),
    nuevo('TC-PRE-021', 'Filtro disponible válido', '"true" y "false" se convierten a booleano.', ['Invocar listar con disponible "true" o "false"'], 'El servicio recibe { disponible: true/false }.', { rol: 'Visitante', rf: ['RF-07'] }),
    nuevo('TC-PRE-022', 'Sin filtro de disponibilidad', 'Sin el parámetro no se manda filtro de disponibilidad.', ['Invocar listar sin disponible'], 'El servicio recibe {}.', { rol: 'Visitante', rf: ['RF-07'] }),
  ]
);

const servicioPerfil = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Prestadores: perfil (servicio)', rol: 'Prestador', rf: ['RF-03'], precondiciones: PRE_SRV },
  [
    nuevo('TC-PRE-023', 'Perfil con nombre, email y oficios', 'obtenerMiPerfil arma el perfil con los datos del usuario y sus oficios.', ['Simular el prestador con usuario y oficios', 'Llamar a obtenerMiPerfil'], 'Devuelve nombre, email y oficios.'),
    nuevo('TC-PRE-024', 'Prestador inexistente', 'obtenerMiPerfil lanza 404 si no hay perfil.', ['Simular que no existe', 'Llamar a obtenerMiPerfil'], 'Lanza 404.'),
    nuevo('TC-PRE-025', 'Prestador inactivo', 'obtenerMiPerfil lanza 404 si el perfil está inactivo.', ['Simular un prestador con activo = false', 'Llamar a obtenerMiPerfil'], 'Lanza 404.'),
    nuevo('TC-PRE-026', 'Actualizar perfil', 'actualizarMiPerfil guarda los datos y devuelve el perfil nuevo.', ['Llamar a actualizarMiPerfil con datos válidos'], 'Se llama a prisma.prestador.update y se devuelve el perfil formateado.', { ...CENTRAL, rf: ['RF-03', 'RF-04'] }),
    nuevo('TC-PRE-027', 'Precio mínimo mayor al máximo guardado', 'Si solo llega el mínimo, se compara con el máximo ya guardado.', ['Simular precioMax guardado', 'Llamar a actualizarMiPerfil con un precioMin mayor'], 'Lanza 400 y no actualiza.', { rf: ['RF-04'] }),
  ]
);

const servicioOficios = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Prestadores: oficios (servicio)', rol: 'Prestador', rf: ['RF-04'], precondiciones: PRE_SRV },
  [
    nuevo('TC-PRE-028', 'Reemplazar oficios', 'Se borran los oficios anteriores y se crean los nuevos en una transacción.', ['Llamar a asignarMisOficios con oficios activos'], 'Se ejecuta la transacción deleteMany + createMany y se devuelve el perfil.', CENTRAL),
    nuevo('TC-PRE-029', 'Oficio inexistente o desactivado', 'No se asignan oficios que no existen o están desactivados.', ['Simular que falta algún oficio activo', 'Llamar a asignarMisOficios'], 'Lanza 400 y no ejecuta la transacción.'),
    nuevo('TC-PRE-030', 'Ids repetidos', 'Un id repetido cuenta una sola vez.', ['Llamar a asignarMisOficios con un id repetido'], 'Se valida y se crea una sola relación por oficio.'),
    nuevo('TC-PRE-031', 'Lista vacía', 'Con una lista vacía el prestador queda sin oficios.', ['Llamar a asignarMisOficios con []'], 'Se borran los oficios anteriores y el perfil devuelto no tiene oficios.'),
    nuevo('TC-PRE-032', 'Prestador inexistente', 'asignarMisOficios lanza 404 si no hay perfil.', ['Simular que no existe', 'Llamar a asignarMisOficios'], 'Lanza 404.'),
  ]
);

const servicioBusqueda = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Prestadores: búsqueda (servicio)', rol: 'Visitante', rf: ['RF-07'], precondiciones: PRE_SRV },
  [
    nuevo('TC-PRE-033', 'Resumen público con reputación', 'El listado devuelve el resumen público con reputación, sin contacto ni oficios desactivados.', ['Simular prestadores y reputación', 'Llamar a listarPrestadores'], 'Sin teléfono/email, sin oficios inactivos y con { promedio, totalCalificaciones, serviciosFinalizados }.', { ...CENTRAL, rf: ['RF-07', 'RF-19', 'RF-20'] }),
    nuevo('TC-PRE-034', 'Filtro por oficio', 'Se filtra por el oficio pedido.', ['Llamar a listarPrestadores({ oficioId })'], 'La consulta filtra por ese oficio activo.', { rf: ['RF-06'] }),
    nuevo('TC-PRE-035', 'Búsqueda por texto', 'Se busca por nombre, zona u oficio sin distinguir mayúsculas.', ['Llamar a listarPrestadores({ q })'], 'La consulta usa OR con contains insensitive.', CENTRAL),
    nuevo('TC-PRE-036', 'Filtro por distancia', 'Con lat/lng se filtra por radio y se ordena del más cerca al más lejos.', ['Simular prestadores a distintas distancias', 'Llamar a listarPrestadores con lat, lng y radioKm'], 'Solo los que están dentro del radio, ordenados por distanciaKm.', { ...CENTRAL, rf: ['RF-06'] }),
    nuevo('TC-PRE-037', 'Calificación mínima', 'Se filtra por promedio mínimo y se excluye a quienes no tienen calificaciones.', ['Llamar a listarPrestadores({ calificacionMin })'], 'Solo los que tienen promedio ≥ al mínimo.', { rf: ['RF-07', 'RF-19'] }),
    nuevo('TC-PRE-038', 'Límite de resultados', 'Se respeta limit y la reputación se calcula solo de los devueltos.', ['Llamar a listarPrestadores({ limit })'], 'Devuelve como máximo limit y consulta la reputación solo de esos.'),
    nuevo('TC-PRE-039', 'Promedio sin calificaciones', 'Un prestador sin calificaciones tiene promedio null.', ['Simular reputación sin calificaciones', 'Llamar a listarPrestadores'], 'reputacion.promedio es null.', { rf: ['RF-19'] }),
    nuevo('TC-PRE-040', 'Sin filtro de disponibilidad', 'Si no se pide, no se filtra por disponibilidad.', ['Llamar a listarPrestadores sin disponible'], 'La consulta no incluye disponible.'),
    nuevo('TC-PRE-041', 'Filtro de disponibilidad', 'Con disponible true/false se filtra por ese valor.', ['Llamar a listarPrestadores con disponible'], 'La consulta incluye { disponible }.'),
    nuevo('TC-PRE-042', 'Coordenadas aproximadas en el listado', 'El listado devuelve la ubicación redondeada a 2 decimales.', ['Simular un prestador con coordenadas exactas', 'Llamar a listarPrestadores'], 'Latitud y longitud con 2 decimales.', SEGURIDAD),
    nuevo('TC-PRE-043', 'Coordenadas aproximadas en la ficha', 'La ficha pública devuelve la ubicación redondeada a 2 decimales.', ['Llamar a obtenerDetallePrestador'], 'Latitud y longitud con 2 decimales.', { ...SEGURIDAD, rf: ['RF-08'] }),
    nuevo('TC-PRE-044', 'Coordenada exacta en el perfil propio', 'El prestador sigue viendo su coordenada exacta.', ['Llamar a obtenerMiPerfil'], 'Latitud y longitud sin redondear.', { rol: 'Prestador', rf: ['RF-03'] }),
    nuevo('TC-PRE-045', 'Prestador sin coordenadas', 'Sin coordenadas se devuelven como null.', ['Simular un prestador sin ubicación', 'Llamar a listarPrestadores'], 'latitud y longitud null.'),
    nuevo('TC-PRE-046', 'Distancia con la coordenada aproximada', 'La distancia se calcula con la ubicación pública y no con la exacta.', ['Llamar a listarPrestadores con lat y lng'], 'Dos prestadores a ~500 m que se redondean al mismo punto tienen la misma distanciaKm.', { ...SEGURIDAD, rf: ['RF-06'] }),
  ]
);

const ficha = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Prestadores: ficha', rol: 'Visitante', rf: ['RF-08'], precondiciones: PRE_SRV },
  [
    nuevo('TC-PRE-047', 'Ficha completa', 'La ficha incluye contacto, reputación y comentarios.', ['Simular prestador, reputación y comentarios', 'Llamar a obtenerDetallePrestador'], 'Devuelve teléfono, WhatsApp, email de contacto, reputación y comentarios.', { ...CENTRAL, rf: ['RF-08', 'RF-19', 'RF-20', 'RF-21'] }),
    nuevo('TC-PRE-048', 'Sin datos internos', 'La ficha no expone datos internos ni el email de la cuenta.', ['Llamar a obtenerDetallePrestador'], 'No incluye email, usuarioId ni activo, y la reputación no repite prestadorId.', SEGURIDAD),
    nuevo('TC-PRE-049', 'Solo prestadores activos', 'Solo se busca un prestador activo con usuario activo.', ['Llamar a obtenerDetallePrestador'], 'La consulta filtra activo y usuario.activo.'),
    nuevo('TC-PRE-050', 'Ficha sin calificaciones', 'Sin calificaciones: promedio null y sin comentarios.', ['Simular reputación vacía', 'Llamar a obtenerDetallePrestador'], 'promedio null y comentarios [].', { rf: ['RF-08', 'RF-19'] }),
    nuevo('TC-PRE-051', 'Ficha no disponible', 'Lanza 404 si el prestador no existe, está inactivo o su usuario está desactivado.', ['Simular que la consulta no encuentra al prestador', 'Llamar a obtenerDetallePrestador'], 'Lanza 404.'),
    nuevo('TC-PRE-052', 'Controlador de la ficha', 'El controlador delega en el servicio con el id de la URL.', ['Invocar detalle con req.params.id'], 'Se devuelve la ficha del servicio.', { precondiciones: PRE_CTRL }),
    nuevo('TC-PRE-053', 'Error en la ficha', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar obtenerDetallePrestador', 'Invocar detalle'], 'Se llama a next(error).', { ...PROPAGA_ERROR, precondiciones: PRE_CTRL }),
  ]
);

const misCalificaciones = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Prestadores: calificaciones recibidas', rol: 'Prestador', rf: ['RF-21'], precondiciones: PRE_SRV },
  [
    nuevo('TC-PRE-054', 'Calificaciones del prestador del token', 'Se busca al prestador por el usuario del token y se devuelven sus calificaciones.', ['Llamar a listarMisCalificaciones(usuarioId)'], 'Se consulta por usuarioId y se devuelven las calificaciones públicas.', CENTRAL),
    nuevo('TC-PRE-055', 'Sin calificaciones recibidas', 'Si no recibió calificaciones se devuelve una lista vacía.', ['Simular listado vacío', 'Llamar a listarMisCalificaciones'], 'Devuelve [].'),
    nuevo('TC-PRE-056', 'Perfil inexistente o inactivo', 'Lanza 404 si el perfil no existe o está inactivo.', ['Simular perfil null o inactivo', 'Llamar a listarMisCalificaciones'], 'Lanza 404.'),
    nuevo('TC-PRE-057', 'Controlador de calificaciones recibidas', 'Devuelve las calificaciones del prestador autenticado.', ['Invocar misCalificaciones con req.usuario'], 'El servicio recibe el id del token y se devuelve su resultado.', { precondiciones: PRE_CTRL }),
    nuevo('TC-PRE-058', 'Error en calificaciones recibidas', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar listarMisCalificaciones', 'Invocar misCalificaciones'], 'Se llama a next(error).', { ...PROPAGA_ERROR, precondiciones: PRE_CTRL }),
  ]
);

module.exports = [
  ...perfilControlador,
  ...busquedaControlador,
  ...validaciones,
  ...servicioPerfil,
  ...servicioOficios,
  ...servicioBusqueda,
  ...ficha,
  ...misCalificaciones,
];
