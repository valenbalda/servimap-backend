// Combina los valores comunes de un módulo con los de cada caso (el caso gana).
function definirCasos(base, casos) {
  return casos.map((c) => ({ ...base, ...c }));
}

// Forma corta para escribir un caso: los campos comunes salen de la base del módulo.
function nuevo(id, titulo, descripcion, pasos, esperado, extra = {}) {
  return { id, titulo, descripcion, pasos, esperado, ...extra };
}

// Valores comunes de los tests unitarios (sin base de datos real).
const BASE_UNITARIA = {
  capa: 'unitario',
  tipo: 'funcional',
  prioridad: 'media',
  severidad: 'normal',
  postcondiciones:
    'Sin efectos persistentes: no se usa base de datos real y los mocks se limpian antes de cada test.',
};

// Ajustes frecuentes de prioridad, severidad y tipo.
const CENTRAL = { prioridad: 'alta', severidad: 'mayor' };
const SEGURIDAD = { tipo: 'seguridad', prioridad: 'alta', severidad: 'critica' };
const PROPAGA_ERROR = { prioridad: 'baja', severidad: 'menor' };

module.exports = { definirCasos, nuevo, BASE_UNITARIA, CENTRAL, SEGURIDAD, PROPAGA_ERROR };
