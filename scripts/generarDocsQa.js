// Genera docs/qa/casos-de-prueba.md, docs/qa/casos-de-prueba.csv y docs/qa/trazabilidad.md
// a partir del catálogo (tests/qase/casos) y de los tests que lo referencian.
//
//   npm run docs:qa              → regenera los archivos
//   npm run docs:qa -- --check   → falla si están desactualizados o si hay casos sin test
//   npm run docs:qa -- --validate-csv [archivo]
//                                → valida que las celdas de pasos del CSV sean JSON válido
//                                  (por defecto, docs/qa/casos-de-prueba.csv)
const fs = require('node:fs');
const path = require('node:path');
const { codificarPasos, csvValor, validarCsvQase } = require('./csvQase');

const RAIZ = path.join(__dirname, '..');
const DIR_DOCS = path.join(RAIZ, 'docs', 'qa');

function informarValidacion(errores, origen) {
  if (errores.length) {
    console.error(`${origen} no cumple el formato de Qase:\n${errores.join('\n')}`);
    process.exit(1);
  }
}

// Modo validación: solo lee el CSV, sin regenerar nada.
const posValidar = process.argv.indexOf('--validate-csv');
if (posValidar !== -1) {
  const argumento = process.argv[posValidar + 1];
  const archivo = argumento && !argumento.startsWith('--')
    ? path.resolve(argumento)
    : path.join(DIR_DOCS, 'casos-de-prueba.csv');
  informarValidacion(validarCsvQase(fs.readFileSync(archivo, 'utf8')), path.relative(RAIZ, archivo));
  console.log(`${path.relative(RAIZ, archivo)}: formato de pasos válido.`);
  process.exit(0);
}

const { LISTA } = require('../tests/qase/casos');
const { REQUERIMIENTOS, PENDIENTES } = require('../tests/qase/requerimientos');
const {
  enLista,
  comportamiento,
  PRIORIDAD,
  SEVERIDAD,
  TIPO,
  CAPA,
} = require('../tests/qase/qase');
const qaseIds = require('../tests/qase/qase-ids.json');

const DIR_TESTS = path.join(RAIZ, 'tests');
const CHECK = process.argv.includes('--check');

// --- 1. Qué test referencia a cada caso ---------------------------------------

function archivosDeTest(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) return archivosDeTest(ruta);
    return entrada.name.endsWith('.test.js') ? [ruta] : [];
  });
}

const PATRON_CASO = /caso\(\s*'(TC-[A-Z-]+-\d{3})',\s*(['"`])((?:\\.|(?!\2).)*)\2/g;

const referencias = {};
for (const archivo of archivosDeTest(DIR_TESTS)) {
  const relativo = path.relative(RAIZ, archivo).split(path.sep).join('/');
  const contenido = fs.readFileSync(archivo, 'utf8');
  for (const [, id, , nombre] of contenido.matchAll(PATRON_CASO)) {
    (referencias[id] ||= []).push({ archivo: relativo, test: nombre.replace(/\\(.)/g, '$1') });
  }
}

const errores = [];
const ids = new Set(LISTA.map((c) => c.id));
for (const c of LISTA) {
  if (!referencias[c.id]) errores.push(`El caso ${c.id} no tiene ningún test que lo referencie.`);
}
for (const id of Object.keys(referencias)) {
  if (!ids.has(id)) errores.push(`Un test referencia ${id}, que no está en el catálogo.`);
}
if (errores.length) {
  console.error(errores.join('\n'));
  process.exit(1);
}

const casos = LISTA.map((c) => ({
  ...c,
  tests: referencias[c.id],
  qaseId: Number.isInteger(qaseIds[c.id]) ? qaseIds[c.id] : null,
}));

// --- 2. Utilidades de formato --------------------------------------------------

const ENCABEZADO =
  '<!-- Archivo generado con "npm run docs:qa" a partir de tests/qase/casos. No editar a mano. -->';

const celda = (texto) => String(texto ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
const rfTexto = (c) => (c.rf.length ? c.rf.join(', ') : 'Transversal');
const capaTexto = (c) => (c.capa === 'unitario' ? 'Unitario' : 'Integración');
const testsTexto = (c) => c.tests.map((t) => `\`${t.archivo}\` › ${t.test}`).join('<br>');

function tabla(columnas, filas) {
  return [
    `| ${columnas.join(' | ')} |`,
    `| ${columnas.map(() => '---').join(' | ')} |`,
    ...filas.map((fila) => `| ${fila.map(celda).join(' | ')} |`),
  ].join('\n');
}

// --- 3. casos-de-prueba.md -----------------------------------------------------

function generarMarkdownCasos() {
  const unitarios = casos.filter((c) => c.capa === 'unitario').length;
  const resumen = tabla(
    ['ID', 'Título', 'Capa', 'Módulo', 'Rol', 'RF', 'Prioridad', 'Severidad', 'Tipo', 'Automatizado', 'qaseId'],
    casos.map((c) => [
      `[${c.id}](#${c.id.toLowerCase()})`,
      c.titulo,
      capaTexto(c),
      c.modulo,
      c.rol,
      rfTexto(c),
      c.prioridad,
      c.severidad,
      c.tipo,
      'Sí',
      c.qaseId ?? '',
    ])
  );

  const detalle = casos
    .map((c) =>
      [
        `### ${c.id}`,
        '',
        `**${c.titulo}**`,
        '',
        tabla(
          ['Campo', 'Valor'],
          [
            ['Descripción', c.descripcion],
            ['Precondiciones', c.precondiciones],
            ['Pasos', enLista(c.pasos)],
            ['Resultado esperado', c.esperado],
            ['Postcondiciones', c.postcondiciones],
            ['Prioridad', c.prioridad],
            ['Severidad', c.severidad],
            ['Tipo', c.tipo],
            ['Capa', capaTexto(c)],
            ['Módulo', c.modulo],
            ['Rol', c.rol],
            ['Requerimiento', rfTexto(c)],
            ['Archivo y test', testsTexto(c)],
            ['Automatizado', 'Sí'],
            ['qaseId', c.qaseId ?? '(pendiente)'],
          ]
        ),
      ].join('\n')
    )
    .join('\n\n');

  return `${ENCABEZADO}

# Casos de prueba del backend

Total: **${casos.length} casos** (${unitarios} unitarios y ${casos.length - unitarios} de integración), todos automatizados.
Cada caso corresponde a un test real que lo referencia con \`caso('TC-...', nombre)\`.
Un \`it.each\` es un solo caso con varios juegos de datos: cada uno se reporta como un resultado del mismo caso.

La columna **qaseId** se completa cuando los casos existen en Qase (ver [README](README.md#3-vincular-los-ids-de-qase)).

## Resumen

${resumen}

## Detalle

${detalle}
`;
}

// --- 4. casos-de-prueba.csv (formato de importación de Qase) -------------------

const COLUMNAS_CSV = [
  'v2.id',
  'title',
  'description',
  'preconditions',
  'postconditions',
  'tags',
  'priority',
  'severity',
  'type',
  'behavior',
  'automation',
  'status',
  'is_flaky',
  'layer',
  'steps_type',
  'steps_actions',
  'steps_result',
  'steps_data',
  'milestone_id',
  'milestone',
  'suite_id',
  'suite_parent_id',
  'suite',
  'suite_without_cases',
  'parameters',
];

function generarCsv() {
  // Suites: "Unitarios" e "Integración" en la raíz, y un módulo por debajo de cada una.
  const suites = [];
  const idSuite = new Map();
  const agregarSuite = (nombre, padre) => {
    const clave = `${padre ?? ''}>${nombre}`;
    if (!idSuite.has(clave)) {
      idSuite.set(clave, suites.length + 1);
      suites.push({ id: suites.length + 1, nombre, padre });
    }
    return idSuite.get(clave);
  };
  const raiz = { unitario: agregarSuite('Unitarios', null), integracion: agregarSuite('Integración', null) };
  const suiteDeCaso = new Map(casos.map((c) => [c.id, agregarSuite(c.modulo, raiz[c.capa])]));

  const filas = suites.map((s) => {
    const fila = Object.fromEntries(COLUMNAS_CSV.map((col) => [col, '']));
    return { ...fila, suite_id: s.id, suite_parent_id: s.padre ?? '', suite: s.nombre, suite_without_cases: 1 };
  });

  for (const c of casos) {
    // El resultado esperado va en el último paso; los anteriores no tienen resultado propio.
    const resultados = c.pasos.map((_, i) => (i === c.pasos.length - 1 ? c.esperado : null));
    const descripcion = [
      `${c.id} — ${c.descripcion}`,
      `Rol: ${c.rol}. Requerimiento: ${rfTexto(c)}. Capa: ${capaTexto(c)}.`,
      `Test automatizado: ${c.tests.map((t) => `${t.archivo} › ${t.test}`).join(' | ')}`,
    ].join('\n\n');
    filas.push({
      'v2.id': c.qaseId ?? '',
      title: `${c.id} ${c.titulo}`,
      description: descripcion,
      preconditions: c.precondiciones,
      postconditions: c.postcondiciones,
      tags: [c.id, ...c.rf, `rol:${c.rol}`, `capa:${c.capa}`].join(','),
      priority: PRIORIDAD[c.prioridad],
      severity: SEVERIDAD[c.severidad],
      type: TIPO[c.tipo],
      behavior: comportamiento(c),
      automation: 'automated',
      status: 'actual',
      is_flaky: 'no',
      layer: CAPA[c.capa],
      steps_type: 'classic',
      steps_actions: codificarPasos(c.pasos),
      steps_result: codificarPasos(resultados),
      steps_data: '',
      milestone_id: '',
      milestone: '',
      suite_id: suiteDeCaso.get(c.id),
      suite_parent_id: '',
      suite: c.modulo,
      suite_without_cases: '',
      parameters: '',
    });
  }

  const lineas = [COLUMNAS_CSV.join(','), ...filas.map((f) => COLUMNAS_CSV.map((col) => csvValor(f[col])).join(','))];
  return `${lineas.join('\n')}\n`;
}

// --- 5. trazabilidad.md --------------------------------------------------------

function generarTrazabilidad() {
  const estado = (unit, integ, pendiente) => {
    if (!unit.length && !integ.length) return 'Pendiente';
    const base = unit.length && integ.length ? 'Cubierto' : unit.length ? 'Solo unitario' : 'Solo integración';
    return pendiente ? `${base} (con pendientes)` : base;
  };
  const enlaces = (lista) => lista.map((c) => `[${c.id}](casos-de-prueba.md#${c.id.toLowerCase()})`).join(', ');

  const filas = Object.entries(REQUERIMIENTOS).map(([rf, nombre]) => {
    const delRf = casos.filter((c) => c.rf.includes(rf));
    const unit = delRf.filter((c) => c.capa === 'unitario');
    const integ = delRf.filter((c) => c.capa === 'integracion');
    const pendiente = PENDIENTES.some((p) => p.rf.includes(rf));
    return [rf, nombre, String(unit.length), String(integ.length), estado(unit, integ, pendiente), enlaces(unit) || '—', enlaces(integ) || '—'];
  });

  const transversales = casos.filter((c) => c.rf.length === 0);
  const pendientes = tabla(
    ['Tema', 'RF', 'Detalle'],
    PENDIENTES.map((p) => [p.tema, p.rf.join(', ') || '—', p.detalle])
  );

  return `${ENCABEZADO}

# Matriz de trazabilidad

Requerimientos RF-01 a RF-23 contra los casos de prueba automatizados del backend.

- **Cubierto:** tiene casos unitarios y de integración.
- **Solo unitario / Solo integración:** cubierto en una sola capa.
- **(con pendientes):** hay algo del requerimiento que todavía no se prueba (ver la sección Pendientes).

${tabla(['RF', 'Requerimiento', 'Unit.', 'Integ.', 'Estado', 'Casos unitarios', 'Casos de integración'], filas)}

## Casos transversales (sin RF propio)

Health check, manejo de errores y respuestas genéricas: ${enlaces(transversales)}.

## Pendientes

Lo que todavía no tiene test automático en este repositorio. No se documentaron como casos porque no hay test que los respalde.

${pendientes}
`;
}

// --- 6. Escritura o verificación ----------------------------------------------

const archivos = {
  'casos-de-prueba.md': generarMarkdownCasos(),
  'casos-de-prueba.csv': generarCsv(),
  'trazabilidad.md': generarTrazabilidad(),
};

// El CSV se valida antes de escribirlo o compararlo, para no generar uno que Qase rechace.
informarValidacion(validarCsvQase(archivos['casos-de-prueba.csv']), 'El CSV generado');

const normalizar = (texto) => texto.replace(/\r\n/g, '\n');
let desactualizados = 0;
for (const [nombre, contenido] of Object.entries(archivos)) {
  const ruta = path.join(DIR_DOCS, nombre);
  if (CHECK) {
    const actual = fs.existsSync(ruta) ? normalizar(fs.readFileSync(ruta, 'utf8')) : null;
    if (actual !== contenido) {
      desactualizados += 1;
      console.error(`docs/qa/${nombre} está desactualizado. Corré "npm run docs:qa".`);
    }
  } else {
    fs.mkdirSync(DIR_DOCS, { recursive: true });
    fs.writeFileSync(ruta, contenido);
    console.log(`docs/qa/${nombre} generado.`);
  }
}

if (desactualizados) process.exit(1);
console.log(`${casos.length} casos documentados.`);
