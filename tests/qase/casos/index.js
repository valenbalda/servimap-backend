// Catálogo de casos de prueba: única fuente de verdad para Qase y para docs/qa/.
// Cada caso corresponde a un test real que lo referencia con caso('TC-...', nombre).
// La documentación se regenera con: npm run docs:qa

const CAMPOS_OBLIGATORIOS = [
  'id',
  'titulo',
  'descripcion',
  'precondiciones',
  'pasos',
  'esperado',
  'postcondiciones',
  'prioridad',
  'severidad',
  'tipo',
  'capa',
  'modulo',
  'rol',
  'rf',
];

const VALORES = {
  prioridad: ['alta', 'media', 'baja'],
  severidad: ['bloqueante', 'critica', 'mayor', 'normal', 'menor', 'trivial'],
  tipo: ['funcional', 'integracion', 'seguridad'],
  capa: ['unitario', 'integracion'],
};

// rf puede ser una lista vacía: son los casos transversales (no funcionales), sin RF propio.
function validar(c) {
  for (const campo of CAMPOS_OBLIGATORIOS) {
    const valor = c[campo];
    const vacio = valor === undefined || valor === '' || (campo !== 'rf' && Array.isArray(valor) && valor.length === 0);
    if (vacio) {
      throw new Error(`El caso ${c.id || '(sin id)'} no tiene el campo ${campo}`);
    }
  }
  if (!Array.isArray(c.rf) || !Array.isArray(c.pasos)) {
    throw new Error(`El caso ${c.id}: rf y pasos tienen que ser listas`);
  }
  for (const [campo, permitidos] of Object.entries(VALORES)) {
    if (!permitidos.includes(c[campo])) {
      throw new Error(`El caso ${c.id} tiene ${campo}="${c[campo]}" (permitidos: ${permitidos})`);
    }
  }
  for (const rf of c.rf) {
    if (!/^RF-(0[1-9]|1\d|2[0-3])$/.test(rf)) {
      throw new Error(`El caso ${c.id} tiene un requerimiento inválido: ${rf}`);
    }
  }
}

const MODULOS = [
  require('./sistema'),
  require('./seguridad'),
  require('./auth'),
  require('./oficios'),
  require('./prestadores'),
  require('./mapa'),
  require('./solicitudes'),
  require('./calificaciones'),
  require('./integracion'),
];

const LISTA = MODULOS.flat();
const CASOS = {};
for (const c of LISTA) {
  validar(c);
  if (CASOS[c.id]) {
    throw new Error(`El caso ${c.id} está repetido`);
  }
  CASOS[c.id] = c;
}

module.exports = { CASOS, LISTA, VALORES };
