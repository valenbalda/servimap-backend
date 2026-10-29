const { definirCasos, nuevo, BASE_UNITARIA, CENTRAL, SEGURIDAD, PROPAGA_ERROR } = require('./definir');

const PRE_CTRL = 'Controlador de calificaciones con calificacionesService simulado; request y response simulados.';
const PRE_SRV = 'calificacionesService con Prisma simulado (sin base de datos real).';

const controlador = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Calificaciones: controlador', rol: 'Cliente', rf: ['RF-16'], precondiciones: PRE_CTRL },
  [
    nuevo('TC-CAL-001', 'Solicitud inválida', 'La solicitud a calificar es obligatoria y tiene que ser texto.', ['Invocar crear con solicitudId ausente, espacios o numérico'], '400 sin llamar al servicio.'),
    nuevo('TC-CAL-002', 'Puntaje inválido', 'El puntaje tiene que ser un entero entre 1 y 5.', ['Invocar crear con 0, 6, 3.5, "4" o sin puntaje'], '400 sin llamar al servicio.', CENTRAL),
    nuevo('TC-CAL-003', 'Comentario inválido al calificar', 'El comentario, si se manda, tiene que ser texto de hasta 500 caracteres.', ['Invocar crear con un comentario numérico o de 501 caracteres'], '400 sin llamar al servicio.'),
    nuevo('TC-CAL-004', 'Calificar con datos limpios', 'Se crea la calificación con el cliente del token y el comentario sin espacios.', ['Invocar crear con datos válidos'], 'El servicio recibe clienteId, solicitudId, puntaje y comentario limpio; se responde 201.', CENTRAL),
    nuevo('TC-CAL-005', 'Calificar sin comentario', 'El comentario es opcional.', ['Invocar crear sin comentario'], '201 con comentario undefined.'),
    nuevo('TC-CAL-006', 'Error al calificar', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar crearCalificacion', 'Invocar crear'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-CAL-007', 'Comentario inválido al editar', 'Al editar, el comentario es obligatorio, no vacío y de hasta 500 caracteres.', ['Invocar editarComentario sin comentario, con espacios o con 501 caracteres'], '400 sin llamar al servicio.'),
    nuevo('TC-CAL-008', 'Editar comentario', 'Se edita el comentario con el texto limpio.', ['Invocar editarComentario con un comentario válido'], 'El servicio recibe clienteId, calificacionId y el comentario limpio.'),
    nuevo('TC-CAL-009', 'Error al editar el comentario', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar editarComentario', 'Invocar editarComentario'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-CAL-010', 'Reputación del prestador', 'Devuelve la reputación del prestador pedido.', ['Invocar reputacion con req.params.prestadorId'], 'Se devuelve el resultado del servicio.', { rol: 'Visitante', rf: ['RF-19', 'RF-20'] }),
    nuevo('TC-CAL-011', 'Error en la reputación', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar obtenerReputacion', 'Invocar reputacion'], 'Se llama a next(error).', { ...PROPAGA_ERROR, rol: 'Visitante', rf: ['RF-19', 'RF-20'] }),
    nuevo('TC-CAL-012', 'Calificaciones públicas del prestador', 'Devuelve las calificaciones públicas de un prestador.', ['Invocar listarPorPrestador'], 'Se devuelve el resultado del servicio.', { rol: 'Visitante', rf: ['RF-08', 'RF-21'] }),
    nuevo('TC-CAL-013', 'Error en las calificaciones públicas', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar listarCalificacionesPrestador', 'Invocar listarPorPrestador'], 'Se llama a next(error).', { ...PROPAGA_ERROR, rol: 'Visitante', rf: ['RF-08', 'RF-21'] }),
    nuevo('TC-CAL-014', 'Todas las calificaciones', 'El administrador obtiene todas las calificaciones.', ['Invocar listarTodas'], 'Se devuelve el resultado del servicio.', { rol: 'Administrador', rf: ['RF-23'] }),
    nuevo('TC-CAL-015', 'Error en el listado completo', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar listarTodasLasCalificaciones', 'Invocar listarTodas'], 'Se llama a next(error).', { ...PROPAGA_ERROR, rol: 'Administrador', rf: ['RF-23'] }),
    nuevo('TC-CAL-016', 'Motivo de moderación inválido', 'El motivo es obligatorio, no vacío y de hasta 200 caracteres.', ['Invocar moderar sin motivo, con espacios o con 201 caracteres'], '400 sin llamar al servicio.', { rol: 'Administrador', rf: ['RF-23'] }),
    nuevo('TC-CAL-017', 'Moderar calificación', 'Se modera la calificación con el motivo limpio.', ['Invocar moderar con un motivo válido'], 'El servicio recibe el id y el motivo limpio.', { ...CENTRAL, rol: 'Administrador', rf: ['RF-23'] }),
    nuevo('TC-CAL-018', 'Error al moderar', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar moderarCalificacion', 'Invocar moderar'], 'Se llama a next(error).', { ...PROPAGA_ERROR, rol: 'Administrador', rf: ['RF-23'] }),
  ]
);

const servicio = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Calificaciones: servicio', rol: 'Cliente', rf: ['RF-16'], precondiciones: PRE_SRV },
  [
    nuevo('TC-CAL-019', 'Calificar solicitud inexistente', 'Lanza 404 si la solicitud no existe.', ['Simular que no existe', 'Llamar a crearCalificacion'], 'Lanza 404.'),
    nuevo('TC-CAL-020', 'Calificar solicitud ajena', 'Un cliente solo califica sus propias solicitudes.', ['Simular solicitud de otro cliente', 'Llamar a crearCalificacion'], 'Lanza 403 y no crea.', SEGURIDAD),
    nuevo('TC-CAL-021', 'Calificar solicitud no finalizada', 'Solo se califica una solicitud FINALIZADA.', ['Simular solicitud ACEPTADA', 'Llamar a crearCalificacion'], 'Lanza 409 y no crea.', { ...CENTRAL, rf: ['RF-17'] }),
    nuevo('TC-CAL-022', 'Solicitud ya calificada', 'Una solicitud se califica una sola vez.', ['Simular solicitud con calificación', 'Llamar a crearCalificacion'], 'Lanza 409 y no crea.', { ...CENTRAL, rf: ['RF-18'] }),
    nuevo('TC-CAL-023', 'Crear calificación', 'La calificación se guarda con el prestador de la solicitud.', ['Simular solicitud FINALIZADA sin calificación', 'Llamar a crearCalificacion'], 'prisma.calificacion.create recibe el prestadorId de la solicitud.', CENTRAL),
    nuevo('TC-CAL-024', 'Editar calificación inexistente', 'Lanza 404 si la calificación no existe.', ['Simular que no existe', 'Llamar a editarComentario'], 'Lanza 404.'),
    nuevo('TC-CAL-025', 'Editar calificación ajena', 'Un cliente solo edita sus propias calificaciones.', ['Simular calificación de otro cliente', 'Llamar a editarComentario'], 'Lanza 403 y no actualiza.', SEGURIDAD),
    nuevo('TC-CAL-026', 'Editar calificación moderada', 'No se puede editar una calificación moderada.', ['Simular calificación moderada', 'Llamar a editarComentario'], 'Lanza 409 y no actualiza.', { rf: ['RF-16', 'RF-23'] }),
    nuevo('TC-CAL-027', 'Editar comentario propio', 'Se actualiza el comentario de la propia calificación.', ['Simular calificación propia no moderada', 'Llamar a editarComentario'], 'Se llama a update con el comentario nuevo.'),
    nuevo('TC-CAL-028', 'Reputación de prestador inexistente', 'Lanza 404 si el prestador no existe.', ['Simular que no existe', 'Llamar a obtenerReputacion'], 'Lanza 404.', { rol: 'Visitante', rf: ['RF-19', 'RF-20'] }),
    nuevo('TC-CAL-029', 'Promedio y servicios finalizados', 'El promedio se redondea a un decimal y se cuentan los servicios finalizados.', ['Simular promedio, cantidad y solicitudes finalizadas', 'Llamar a obtenerReputacion'], 'Devuelve promedio con un decimal, totalCalificaciones y serviciosFinalizados.', { ...CENTRAL, rol: 'Visitante', rf: ['RF-19', 'RF-20'] }),
    nuevo('TC-CAL-030', 'Reputación sin calificaciones', 'Sin calificaciones el promedio es null.', ['Simular promedio null', 'Llamar a obtenerReputacion'], 'promedio null.', { rol: 'Visitante', rf: ['RF-19'] }),
    nuevo('TC-CAL-031', 'Calificaciones de prestador inexistente', 'Lanza 404 si el prestador no existe.', ['Simular que no existe', 'Llamar a listarCalificacionesPrestador'], 'Lanza 404.', { rol: 'Visitante', rf: ['RF-21'] }),
    nuevo('TC-CAL-032', 'Calificaciones públicas sin moderadas', 'Solo se listan las no moderadas, las más nuevas primero.', ['Llamar a listarCalificacionesPrestador'], 'La consulta filtra moderada = false y ordena por fecha descendente.', { ...CENTRAL, rol: 'Visitante', rf: ['RF-21', 'RF-23'] }),
    nuevo('TC-CAL-033', 'Todas las calificaciones con moderadas', 'El listado completo incluye las moderadas.', ['Llamar a listarTodasLasCalificaciones'], 'La consulta no filtra por moderada.', { rol: 'Administrador', rf: ['RF-23'] }),
    nuevo('TC-CAL-034', 'Moderar calificación inexistente', 'Lanza 404 si la calificación no existe.', ['Simular que no existe', 'Llamar a moderarCalificacion'], 'Lanza 404.', { rol: 'Administrador', rf: ['RF-23'] }),
    nuevo('TC-CAL-035', 'Moderar dos veces', 'No se puede moderar una calificación ya moderada.', ['Simular calificación moderada', 'Llamar a moderarCalificacion'], 'Lanza 409.', { rol: 'Administrador', rf: ['RF-23'] }),
    nuevo('TC-CAL-036', 'Registro de la moderación', 'Se marca como moderada con fecha y motivo, sin borrar el comentario.', ['Llamar a moderarCalificacion con un motivo'], 'update recibe moderada true, fechaModeracion y motivoModeracion.', { ...CENTRAL, rol: 'Administrador', rf: ['RF-23'] }),
  ]
);

module.exports = [...controlador, ...servicio];
