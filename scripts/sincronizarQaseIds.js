// Completa tests/qase/qase-ids.json con los IDs numéricos que Qase les asignó a los casos.
//
// 1. En Qase: Repository → Export → CSV (después de importar docs/qa/casos-de-prueba.csv).
// 2. npm run qase:ids -- ruta/al/export.csv
// 3. npm run docs:qa   (actualiza la columna qaseId de la documentación)
//
// Cada caso se reconoce por su ID propio (TC-...), que va al principio del título y en los tags.
const fs = require('node:fs');
const path = require('node:path');
const { CASOS } = require('../tests/qase/casos');
const { leerCsv } = require('./csvQase');

const RUTA_IDS = path.join(__dirname, '..', 'tests', 'qase', 'qase-ids.json');
const PATRON_TC = /\bTC-[A-Z]+(?:-[A-Z]+)*-\d{3}\b/;

const archivo = process.argv[2];
if (!archivo) {
  console.error('Uso: npm run qase:ids -- ruta/al/export.csv');
  process.exit(1);
}

const [encabezado, ...filas] = leerCsv(fs.readFileSync(archivo, 'utf8'));
const columna = (nombre) => encabezado.indexOf(nombre);
const colId = columna('v2.id') >= 0 ? columna('v2.id') : columna('id');
const colTitulo = columna('title');
const colTags = columna('tags');
if (colId < 0 || colTitulo < 0) {
  console.error('El CSV no tiene las columnas "v2.id" (o "id") y "title".');
  process.exit(1);
}

const ids = JSON.parse(fs.readFileSync(RUTA_IDS, 'utf8'));
let asignados = 0;
for (const fila of filas) {
  const qaseId = Number(fila[colId]);
  const encontrado = PATRON_TC.exec(fila[colTitulo] || '') || PATRON_TC.exec(fila[colTags] || '');
  if (!Number.isInteger(qaseId) || qaseId <= 0 || !encontrado || !CASOS[encontrado[0]]) continue;
  ids[encontrado[0]] = qaseId;
  asignados += 1;
}

const ordenados = Object.fromEntries(Object.entries(ids).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(RUTA_IDS, `${JSON.stringify(ordenados, null, 2)}\n`);
const faltan = Object.keys(CASOS).filter((id) => !Number.isInteger(ordenados[id]));
console.log(`${asignados} casos vinculados. Sin ID de Qase: ${faltan.length}.`);
if (faltan.length) console.log(faltan.join(', '));
