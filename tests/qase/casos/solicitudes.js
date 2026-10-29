const { definirCasos, nuevo, BASE_UNITARIA, CENTRAL, SEGURIDAD, PROPAGA_ERROR } = require('./definir');

const PRE_CTRL = 'Controlador de solicitudes con solicitudesService simulado; request y response simulados.';
const PRE_SRV = 'solicitudesService con Prisma simulado (sin base de datos real).';

const crear = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Solicitudes: alta (controlador)', rol: 'Cliente', rf: ['RF-09', 'RF-10'], precondiciones: PRE_CTRL },
  [
    nuevo('TC-SOL-001', 'prestadorId inválido', 'El prestador es obligatorio y tiene que ser texto.', ['Invocar crear con prestadorId ausente, espacios o numérico'], '400 sin llamar al servicio.'),
    nuevo('TC-SOL-002', 'oficioId inválido', 'El oficio es obligatorio y tiene que ser texto.', ['Invocar crear con oficioId ausente, espacios o numérico'], '400 sin llamar al servicio.'),
    nuevo('TC-SOL-003', 'Descripción inválida', 'La descripción es obligatoria y tiene que ser texto.', ['Invocar crear con descripción ausente, espacios o numérica'], '400 sin llamar al servicio.'),
    nuevo('TC-SOL-004', 'Descripción demasiado larga', 'La descripción puede tener hasta 1000 caracteres.', ['Invocar crear con 1001 caracteres'], '400 sin llamar al servicio.'),
    nuevo('TC-SOL-005', 'Dirección que no es texto', 'La dirección, si se manda, tiene que ser texto.', ['Invocar crear con dirección numérica'], '400 sin llamar al servicio.'),
    nuevo('TC-SOL-006', 'Contacto preferido que no es texto', 'El contacto preferido, si se manda, tiene que ser texto.', ['Invocar crear con contactoPreferido numérico'], '400 sin llamar al servicio.'),
    nuevo('TC-SOL-007', 'Pedido sin body', 'Un pedido sin cuerpo responde 400.', ['Invocar crear sin body'], '400 sin llamar al servicio.'),
    nuevo('TC-SOL-008', 'Alta de solicitud', 'Se crea la solicitud con los datos limpios y el cliente del token.', ['Invocar crear con datos válidos con espacios'], 'El servicio recibe el id del token y los datos limpios; se responde 201.', CENTRAL),
    nuevo('TC-SOL-009', 'Alta sin datos opcionales', 'Dirección y contacto preferido son opcionales.', ['Invocar crear sin dirección ni contacto'], '201 con esos campos undefined.'),
    nuevo('TC-SOL-010', 'Error en el alta', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar crearSolicitud', 'Invocar crear'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-SOL-011', 'Cambios de estado delegan en el servicio', 'Aceptar, rechazar, finalizar y cancelar delegan en el servicio con el usuario del token y el id.', ['Invocar cada acción con req.usuario y req.params.id'], 'El servicio correspondiente recibe (usuarioId, solicitudId) y se devuelve su resultado.', { rol: 'Cliente / Prestador', rf: ['RF-11', 'RF-12', 'RF-13'] }),
    nuevo('TC-SOL-012', 'Error en un cambio de estado', 'Un error del servicio en cada acción se pasa al manejador de errores.', ['Hacer fallar el servicio de la acción', 'Invocar la acción'], 'Se llama a next(error).', { ...PROPAGA_ERROR, rol: 'Cliente / Prestador', rf: ['RF-11', 'RF-12', 'RF-13'] }),
  ]
);

const listarCtrl = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Solicitudes: listado (controlador)', rol: 'Cliente / Prestador', rf: ['RF-14', 'RF-15'], precondiciones: PRE_CTRL },
  [
    nuevo('TC-SOL-013', 'Estado inválido', 'El filtro estado solo acepta los estados exactos en mayúsculas.', ['Invocar listar con "pendiente", "CUALQUIERA", vacío o varios estados'], '400 "El estado es inválido".'),
    nuevo('TC-SOL-014', 'Listado sin filtro', 'Sin filtro se delega con el usuario del token.', ['Invocar listar sin query'], 'El servicio recibe el usuario y { estado: undefined }.'),
    nuevo('TC-SOL-015', 'Estados válidos', 'Cada estado válido se pasa al servicio.', ['Invocar listar con cada estado'], 'El servicio recibe { estado }.'),
    nuevo('TC-SOL-016', 'Error en el listado', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar listarMisSolicitudes', 'Invocar listar'], 'Se llama a next(error).', PROPAGA_ERROR),
  ]
);

const crearSrv = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Solicitudes: alta (servicio)', rol: 'Cliente', rf: ['RF-09'], precondiciones: PRE_SRV },
  [
    nuevo('TC-SOL-017', 'Solicitud con el cliente logueado', 'La solicitud se crea con el cliente que la pide.', ['Simular prestador disponible con el oficio', 'Llamar a crearSolicitud'], 'prisma.solicitud.create recibe el clienteId y los datos.', { ...CENTRAL, rf: ['RF-09', 'RF-10'] }),
    nuevo('TC-SOL-018', 'Prestador inexistente', 'No se puede pedir a un prestador que no existe.', ['Simular que no existe', 'Llamar a crearSolicitud'], 'Lanza 404.'),
    nuevo('TC-SOL-019', 'Prestador inactivo', 'No se puede pedir a un prestador inactivo.', ['Simular activo = false', 'Llamar a crearSolicitud'], 'Lanza 404.'),
    nuevo('TC-SOL-020', 'Prestador no disponible', 'No se puede pedir a un prestador no disponible.', ['Simular disponible = false', 'Llamar a crearSolicitud'], 'Lanza 409.', CENTRAL),
    nuevo('TC-SOL-021', 'Oficio inexistente', 'El oficio tiene que existir.', ['Simular que el oficio no existe', 'Llamar a crearSolicitud'], 'Lanza 400.'),
    nuevo('TC-SOL-022', 'Oficio desactivado', 'El oficio tiene que estar activo.', ['Simular un oficio inactivo', 'Llamar a crearSolicitud'], 'Lanza 400.'),
    nuevo('TC-SOL-023', 'Oficio no ofrecido', 'El prestador tiene que ofrecer el oficio pedido.', ['Simular un prestador sin ese oficio', 'Llamar a crearSolicitud'], 'Lanza 400.', CENTRAL),
  ]
);

const listarSrv = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Solicitudes: listado (servicio)', rol: 'Cliente / Prestador', rf: ['RF-14', 'RF-15'], precondiciones: PRE_SRV },
  [
    nuevo('TC-SOL-024', 'Listado del cliente', 'El cliente ve solo sus solicitudes, de la más nueva a la más vieja.', ['Llamar a listarMisSolicitudes como CLIENTE'], 'La consulta filtra por clienteId y ordena por fecha descendente.', { ...SEGURIDAD, rol: 'Cliente', rf: ['RF-14'] }),
    nuevo('TC-SOL-025', 'Listado del prestador', 'El prestador ve las que le llegaron, buscando su perfil por usuarioId.', ['Llamar a listarMisSolicitudes como PRESTADOR'], 'Se busca el perfil por usuarioId y se filtra por prestadorId.', { ...SEGURIDAD, rol: 'Prestador', rf: ['RF-15'] }),
    nuevo('TC-SOL-026', 'Filtro por estado', 'Se filtra por estado cuando se pide.', ['Llamar a listarMisSolicitudes con { estado }'], 'La consulta incluye el estado.'),
    nuevo('TC-SOL-027', 'Marca de calificada', 'Solo se marca como calificada la que tiene calificación.', ['Simular una solicitud con calificación y otra sin', 'Llamar a listarMisSolicitudes'], 'calificada true solo en la que tiene calificación.', { rf: ['RF-14', 'RF-18'] }),
    nuevo('TC-SOL-028', 'Sin datos sensibles', 'El listado no devuelve datos sensibles de las personas.', ['Llamar a listarMisSolicitudes'], 'Cliente y prestador solo con id y nombre (sin email, DNI ni contraseña).', SEGURIDAD),
    nuevo('TC-SOL-029', 'Prestador inexistente', 'Lanza 404 si el perfil de prestador no existe.', ['Simular que no existe', 'Llamar a listarMisSolicitudes como PRESTADOR'], 'Lanza 404.', { rol: 'Prestador', rf: ['RF-15'] }),
    nuevo('TC-SOL-030', 'Prestador inactivo', 'Lanza 404 si el perfil de prestador está inactivo.', ['Simular activo = false', 'Llamar a listarMisSolicitudes como PRESTADOR'], 'Lanza 404.', { rol: 'Prestador', rf: ['RF-15'] }),
    nuevo('TC-SOL-031', 'Rol sin solicitudes', 'Un rol que no es cliente ni prestador recibe 403.', ['Llamar a listarMisSolicitudes como ADMINISTRADOR'], 'Lanza 403.', { ...SEGURIDAD, rol: 'Administrador' }),
  ]
);

const estados = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Solicitudes: estados (servicio)', rol: 'Prestador', rf: ['RF-11'], precondiciones: PRE_SRV },
  [
    nuevo('TC-SOL-032', 'Aceptar solicitud pendiente', 'El prestador dueño pasa la solicitud de PENDIENTE a ACEPTADA.', ['Simular solicitud PENDIENTE del prestador', 'Llamar a aceptarSolicitud'], 'Se actualiza a ACEPTADA.', CENTRAL),
    nuevo('TC-SOL-033', 'Aceptar solicitud inexistente', 'Lanza 404 si la solicitud no existe.', ['Simular que no existe', 'Llamar a aceptarSolicitud'], 'Lanza 404.'),
    nuevo('TC-SOL-034', 'Aceptar solicitud ajena', 'Un prestador no puede aceptar solicitudes de otro.', ['Simular solicitud de otro prestador', 'Llamar a aceptarSolicitud'], 'Lanza 403 y no actualiza.', SEGURIDAD),
    nuevo('TC-SOL-035', 'Usuario sin perfil de prestador', 'Sin perfil de prestador no se puede aceptar.', ['Simular que no hay perfil', 'Llamar a aceptarSolicitud'], 'Lanza 403.', SEGURIDAD),
    nuevo('TC-SOL-036', 'Aceptar solicitud no pendiente', 'Solo se puede responder una solicitud pendiente.', ['Simular solicitud ACEPTADA', 'Llamar a aceptarSolicitud'], 'Lanza 409.', CENTRAL),
    nuevo('TC-SOL-037', 'Rechazar solicitud pendiente', 'El prestador dueño pasa la solicitud de PENDIENTE a RECHAZADA.', ['Simular solicitud PENDIENTE del prestador', 'Llamar a rechazarSolicitud'], 'Se actualiza a RECHAZADA.', CENTRAL),
    nuevo('TC-SOL-038', 'Rechazar solicitud aceptada', 'No se puede rechazar una solicitud ya aceptada.', ['Simular solicitud ACEPTADA', 'Llamar a rechazarSolicitud'], 'Lanza 409.'),
    nuevo('TC-SOL-039', 'Cancelar solicitud pendiente', 'El cliente dueño cancela una solicitud pendiente.', ['Simular solicitud PENDIENTE del cliente', 'Llamar a cancelarSolicitud'], 'Se actualiza a CANCELADA.', { ...CENTRAL, rol: 'Cliente', rf: ['RF-12'] }),
    nuevo('TC-SOL-040', 'Cancelar solicitud aceptada', 'También se puede cancelar una solicitud aceptada.', ['Simular solicitud ACEPTADA del cliente', 'Llamar a cancelarSolicitud'], 'Se actualiza a CANCELADA.', { rol: 'Cliente', rf: ['RF-12'] }),
    nuevo('TC-SOL-041', 'Cancelar solicitud inexistente', 'Lanza 404 si la solicitud no existe.', ['Simular que no existe', 'Llamar a cancelarSolicitud'], 'Lanza 404.', { rol: 'Cliente', rf: ['RF-12'] }),
    nuevo('TC-SOL-042', 'Cancelar solicitud ajena', 'Un cliente no puede cancelar solicitudes de otro.', ['Simular solicitud de otro cliente', 'Llamar a cancelarSolicitud'], 'Lanza 403 y no actualiza.', { ...SEGURIDAD, rol: 'Cliente', rf: ['RF-12'] }),
    nuevo('TC-SOL-043', 'Cancelar solicitud finalizada', 'Una solicitud finalizada ya no se puede cancelar.', ['Simular solicitud FINALIZADA', 'Llamar a cancelarSolicitud'], 'Lanza 409.', { rol: 'Cliente', rf: ['RF-12'] }),
    nuevo('TC-SOL-044', 'Finalizar solicitud aceptada', 'El prestador dueño pasa la solicitud de ACEPTADA a FINALIZADA.', ['Simular solicitud ACEPTADA del prestador', 'Llamar a finalizarSolicitud'], 'Se actualiza a FINALIZADA.', { ...CENTRAL, rf: ['RF-13'] }),
    nuevo('TC-SOL-045', 'Finalizar solicitud inexistente', 'Lanza 404 si la solicitud no existe.', ['Simular que no existe', 'Llamar a finalizarSolicitud'], 'Lanza 404.', { rf: ['RF-13'] }),
    nuevo('TC-SOL-046', 'Finalizar solicitud ajena', 'Un prestador no puede finalizar solicitudes de otro.', ['Simular solicitud de otro prestador', 'Llamar a finalizarSolicitud'], 'Lanza 403.', { ...SEGURIDAD, rf: ['RF-13'] }),
    nuevo('TC-SOL-047', 'Finalizar sin perfil de prestador', 'Sin perfil de prestador no se puede finalizar.', ['Simular que no hay perfil', 'Llamar a finalizarSolicitud'], 'Lanza 403.', { ...SEGURIDAD, rf: ['RF-13'] }),
    nuevo('TC-SOL-048', 'Finalizar solicitud no aceptada', 'Solo se puede finalizar una solicitud ACEPTADA.', ['Simular solicitud PENDIENTE, RECHAZADA, CANCELADA o FINALIZADA', 'Llamar a finalizarSolicitud'], 'Lanza 409.', { ...CENTRAL, rf: ['RF-13'] }),
  ]
);

module.exports = [...crear, ...listarCtrl, ...crearSrv, ...listarSrv, ...estados];
