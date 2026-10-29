const { definirCasos, nuevo, BASE_UNITARIA, CENTRAL, SEGURIDAD, PROPAGA_ERROR } = require('./definir');

const PRE_CTRL = 'Controlador del mapa con mapaService simulado; request y response simulados.';
const PRE_SRV = 'mapaService con Prisma simulado (sin base de datos real).';

module.exports = definirCasos(
  { ...BASE_UNITARIA, modulo: 'Mapa', rol: 'Visitante', rf: ['RF-05'] },
  [
    nuevo('TC-MAPA-001', 'oficioId inválido', 'El filtro oficioId tiene que ser un texto no vacío.', ['Invocar listar con oficioId vacío, espacios o una lista'], '400 sin llamar al servicio.', { precondiciones: PRE_CTRL, rf: ['RF-05', 'RF-06'] }),
    nuevo('TC-MAPA-002', 'Mapa sin filtro', 'Sin filtro se piden todos los marcadores.', ['Invocar listar sin query'], 'El servicio recibe { oficioId: undefined } y se devuelve su resultado.', { precondiciones: PRE_CTRL }),
    nuevo('TC-MAPA-003', 'oficioId sin espacios', 'El oficioId llega al servicio sin espacios.', ['Invocar listar con oficioId " o1 "'], 'El servicio recibe { oficioId: "o1" }.', { precondiciones: PRE_CTRL, rf: ['RF-05', 'RF-06'] }),
    nuevo('TC-MAPA-004', 'Error en el mapa', 'Un error del servicio se pasa al manejador de errores.', ['Hacer fallar listarMarcadores', 'Invocar listar'], 'Se llama a next(error).', { precondiciones: PRE_CTRL, ...PROPAGA_ERROR }),
    nuevo('TC-MAPA-005', 'Marcadores del mapa', 'Cada marcador tiene ubicación aproximada, oficio principal y promedio.', ['Simular prestadores y promedios', 'Llamar a listarMarcadores'], 'Devuelve id, nombre, latitud/longitud con 2 decimales, oficioPrincipal y promedio redondeado.', { precondiciones: PRE_SRV, ...SEGURIDAD, rf: ['RF-05', 'RF-19'] }),
    nuevo('TC-MAPA-006', 'Solo prestadores visibles', 'Solo se muestran prestadores activos, disponibles, con usuario activo y coordenadas.', ['Llamar a listarMarcadores'], 'La consulta filtra activo, disponible, usuario.activo y coordenadas no nulas.', { precondiciones: PRE_SRV, ...CENTRAL }),
    nuevo('TC-MAPA-007', 'Filtro por oficio', 'Con oficioId solo se muestran los que ofrecen ese oficio.', ['Llamar a listarMarcadores({ oficioId })'], 'La consulta filtra por ese oficio activo.', { precondiciones: PRE_SRV, rf: ['RF-05', 'RF-06'] }),
    nuevo('TC-MAPA-008', 'Promedio sin calificaciones', 'Un prestador sin calificaciones tiene promedio null.', ['Simular promedios vacíos', 'Llamar a listarMarcadores'], 'promedio null.', { precondiciones: PRE_SRV, rf: ['RF-05', 'RF-19'] }),
    nuevo('TC-MAPA-009', 'Promedios solo de los encontrados', 'Los promedios se piden en una sola consulta para los prestadores encontrados.', ['Llamar a listarMarcadores'], 'groupBy se llama con los ids de los prestadores devueltos.', { precondiciones: PRE_SRV }),
    nuevo('TC-MAPA-010', 'Mapa vacío', 'Sin prestadores no se consultan los promedios.', ['Simular que no hay prestadores', 'Llamar a listarMarcadores'], 'Devuelve [] y no llama a groupBy.', { precondiciones: PRE_SRV }),
  ]
);
