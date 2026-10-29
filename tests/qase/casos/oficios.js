const { definirCasos, nuevo, BASE_UNITARIA, CENTRAL, PROPAGA_ERROR } = require('./definir');

const PRE_CTRL = 'Controlador de oficios con oficiosService simulado; request y response simulados.';
const PRE_SRV = 'oficiosService con Prisma simulado (sin base de datos real).';

const controlador = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Oficios: controlador', rol: 'Administrador', rf: ['RF-22'], precondiciones: PRE_CTRL },
  [
    nuevo('TC-OFI-001', 'Listado público de oficios', 'El listado público devuelve los oficios activos.', ['Invocar listar'], 'Se pide el listado sin inactivos y se devuelve el resultado.', { rol: 'Visitante', rf: ['RF-22', 'RF-04'] }),
    nuevo('TC-OFI-002', 'Error en el listado público', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar listarOficios', 'Invocar listar'], 'Se llama a next(error).', { ...PROPAGA_ERROR, rol: 'Visitante' }),
    nuevo('TC-OFI-003', 'Listado completo para el administrador', 'El administrador ve también los oficios inactivos.', ['Invocar listarTodos'], 'Se pide el listado con inactivos.'),
    nuevo('TC-OFI-004', 'Error en el listado completo', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar listarOficios', 'Invocar listarTodos'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-OFI-005', 'Alta con nombre inválido', 'El nombre es obligatorio y tiene que ser texto no vacío.', ['Invocar crear con nombre ausente, vacío o numérico'], '400 sin llamar al servicio.'),
    nuevo('TC-OFI-006', 'Alta con categoría inválida', 'La categoría, si se manda, tiene que ser texto.', ['Invocar crear con categoría numérica'], '400 sin llamar al servicio.'),
    nuevo('TC-OFI-007', 'Alta de oficio', 'Se crea el oficio con nombre y categoría sin espacios sobrantes.', ['Invocar crear con datos válidos con espacios'], 'El servicio recibe los datos limpios y se responde 201.', CENTRAL),
    nuevo('TC-OFI-008', 'Alta sin categoría', 'La categoría es opcional.', ['Invocar crear solo con nombre'], '201 con categoría undefined.'),
    nuevo('TC-OFI-009', 'Error en el alta', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar crearOficio', 'Invocar crear'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-OFI-010', 'Edición con nombre inválido', 'Si se manda nombre, tiene que ser texto no vacío.', ['Invocar actualizar con nombre vacío, espacios o numérico'], '400 sin llamar al servicio.'),
    nuevo('TC-OFI-011', 'Edición con categoría inválida', 'Si se manda categoría, tiene que ser texto.', ['Invocar actualizar con categoría numérica'], '400 sin llamar al servicio.'),
    nuevo('TC-OFI-012', 'Edición sin datos', 'Hay que mandar al menos nombre o categoría.', ['Invocar actualizar con cuerpo vacío'], '400 "No hay datos para actualizar".'),
    nuevo('TC-OFI-013', 'Edición de oficio', 'Se actualiza el oficio con los datos limpios.', ['Invocar actualizar con datos válidos'], 'El servicio recibe el id y los datos limpios; se devuelve el oficio.', CENTRAL),
    nuevo('TC-OFI-014', 'Error en la edición', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar actualizarOficio', 'Invocar actualizar'], 'Se llama a next(error).', PROPAGA_ERROR),
    nuevo('TC-OFI-015', 'Cambio de estado con valor inválido', 'El campo activo tiene que ser booleano.', ['Invocar cambiarEstado con "true", 1 o sin valor'], '400 sin llamar al servicio.'),
    nuevo('TC-OFI-016', 'Activar o desactivar oficio', 'Se cambia el estado del oficio.', ['Invocar cambiarEstado con activo booleano'], 'El servicio recibe el id y el estado; se devuelve el oficio.', CENTRAL),
    nuevo('TC-OFI-017', 'Error al cambiar el estado', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar cambiarEstadoOficio', 'Invocar cambiarEstado'], 'Se llama a next(error).', PROPAGA_ERROR),
  ]
);

const servicio = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Oficios: servicio', rol: 'Administrador', rf: ['RF-22'], precondiciones: PRE_SRV },
  [
    nuevo('TC-OFI-018', 'Solo activos por defecto', 'listarOficios devuelve solo los activos si no se pide lo contrario.', ['Llamar a listarOficios()'], 'Consulta con where { activo: true } ordenado por nombre.', { rol: 'Visitante' }),
    nuevo('TC-OFI-019', 'Incluir inactivos', 'Con incluirInactivos se devuelven todos.', ['Llamar a listarOficios({ incluirInactivos: true })'], 'Consulta sin filtro de activo.'),
    nuevo('TC-OFI-020', 'Nombre duplicado en el alta', 'No se crea un oficio con un nombre existente.', ['Simular un oficio con ese nombre', 'Llamar a crearOficio'], 'Lanza 409 y no crea.', CENTRAL),
    nuevo('TC-OFI-021', 'Alta con nombre libre', 'Se crea el oficio si el nombre está libre.', ['Llamar a crearOficio con un nombre nuevo'], 'Se llama a prisma.oficio.create con los datos.', CENTRAL),
    nuevo('TC-OFI-022', 'Editar oficio inexistente', 'actualizarOficio lanza 404 si el oficio no existe.', ['Simular que no existe', 'Llamar a actualizarOficio'], 'Lanza 404.'),
    nuevo('TC-OFI-023', 'Nombre duplicado en la edición', 'No se puede usar el nombre de otro oficio.', ['Simular otro oficio con el nombre nuevo', 'Llamar a actualizarOficio'], 'Lanza 409 y no actualiza.'),
    nuevo('TC-OFI-024', 'Mismo nombre sin buscar duplicados', 'Si el nombre no cambia, no se buscan duplicados.', ['Llamar a actualizarOficio con el mismo nombre'], 'Solo se busca el oficio por id (una consulta) y se actualiza.'),
    nuevo('TC-OFI-025', 'Edición con nombre nuevo', 'Se actualiza el oficio con un nombre disponible.', ['Llamar a actualizarOficio con un nombre libre'], 'Se llama a prisma.oficio.update.'),
    nuevo('TC-OFI-026', 'Cambiar estado de oficio inexistente', 'cambiarEstadoOficio lanza 404 si no existe.', ['Simular que no existe', 'Llamar a cambiarEstadoOficio'], 'Lanza 404.'),
    nuevo('TC-OFI-027', 'Desactivar sin borrar', 'Desactivar un oficio actualiza activo = false y no lo borra.', ['Llamar a cambiarEstadoOficio(id, false)'], 'Se llama a update con { activo: false } (no hay borrado) y se devuelve el oficio inactivo.', CENTRAL),
  ]
);

module.exports = [...controlador, ...servicio];
