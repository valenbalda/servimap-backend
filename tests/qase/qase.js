// Vinculación de los tests con los casos de prueba documentados en Qase.
//
// Uso en un test:
//   const { caso } = require('./qase/qase');
//   it(caso('TC-AUTH-001', 'responde 400 si falta algún dato'), async () => { ... });
//
// Mientras el caso no tenga ID numérico en Qase (tests/qase/qase-ids.json), el nombre
// del test solo lleva el ID propio entre corchetes. Cuando lo tiene, se agrega además la
// marca "(Qase ID: N)" que el reporter usa para vincular el resultado con el caso.
const { qase } = require('jest-qase-reporter/jest');
const { CASOS } = require('./casos');
const qaseIds = require('./qase-ids.json');

const PATRON_ID = /\[(TC-[A-Z]+(?:-[A-Z]+)*-\d{3})\]/;

// Valores de la documentación (en español) → slugs que espera Qase.
const PRIORIDAD = { alta: 'high', media: 'medium', baja: 'low' };
const SEVERIDAD = {
  bloqueante: 'blocker',
  critica: 'critical',
  mayor: 'major',
  normal: 'normal',
  menor: 'minor',
  trivial: 'trivial',
};
const TIPO = { funcional: 'functional', integracion: 'integration', seguridad: 'security' };
const CAPA = { unitario: 'unit', integracion: 'api' };

function caso(id, nombre) {
  if (!CASOS[id]) {
    throw new Error(`El caso ${id} no está documentado en tests/qase/casos`);
  }
  const titulo = `${nombre} [${id}]`;
  const qaseId = qaseIds[id];
  return Number.isInteger(qaseId) ? qase(qaseId, titulo) : titulo;
}

// Negativo si el resultado esperado es un error (4xx o una excepción); si no, positivo.
function comportamiento(c) {
  return /\b(4\d\d|Lanza)\b/.test(c.esperado) ? 'negative' : 'positive';
}

function enLista(pasos) {
  return pasos.map((paso, i) => `${i + 1}. ${paso}`).join('\n');
}

// Arma los campos de sistema de Qase a partir del caso documentado.
function camposQase(c) {
  return {
    description: `${c.descripcion}\n\nPasos:\n${enLista(c.pasos)}\n\nResultado esperado: ${c.esperado}`,
    preconditions: c.precondiciones,
    postconditions: c.postcondiciones,
    severity: SEVERIDAD[c.severidad],
    priority: PRIORIDAD[c.prioridad],
    type: TIPO[c.tipo],
    layer: CAPA[c.capa],
    behavior: comportamiento(c),
  };
}

function tagsQase(c) {
  return [c.id, ...c.rf, `rol:${c.rol}`, `capa:${c.capa}`, `modulo:${c.modulo}`];
}

// Se llama antes de cada test (tests/qase/setupQase.js). Si el reporter de Qase no está
// activo (global.Qase no existe) no hace nada, así los tests corren igual sin Qase.
function aplicarMetadatos(nombreDelTest) {
  if (!global.Qase || !nombreDelTest) return;

  const encontrado = PATRON_ID.exec(nombreDelTest);
  if (!encontrado) return;

  const c = CASOS[encontrado[1]];
  qase.title(`${c.id} ${c.titulo}`);
  qase.suite(`${c.capa === 'unitario' ? 'Unitarios' : 'Integración'}\t${c.modulo}`);
  qase.fields(camposQase(c));
  qase.tags(...tagsQase(c));
}

module.exports = {
  caso,
  aplicarMetadatos,
  camposQase,
  tagsQase,
  comportamiento,
  enLista,
  PATRON_ID,
  PRIORIDAD,
  SEVERIDAD,
  TIPO,
  CAPA,
};
