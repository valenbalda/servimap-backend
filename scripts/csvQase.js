// Utilidades para el CSV de Qase (formato V2, origen "Qase.io" en el import).
//
// En V2 cada paso va en su propia línea, numerado en secuencia, y su contenido va
// JSON-encoded (entre comillas dobles, con las comillas y saltos de línea escapados):
//   1. "Hacer el pedido"
//   2. "Revisar la respuesta"
// Acciones, resultados y datos se emparejan por el número de paso; un paso puede no
// tener resultado o datos.

const COLUMNAS_PASOS = ['steps_actions', 'steps_result', 'steps_data'];

// Codifica una lista de pasos. Las posiciones vacías (o null) se omiten, conservando el número.
function codificarPasos(textos) {
  return textos
    .map((texto, i) => (texto ? `${i + 1}. ${JSON.stringify(texto)}` : null))
    .filter(Boolean)
    .join('\n');
}

function csvValor(valor) {
  const texto = String(valor ?? '');
  return /[",\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

// Parser de CSV con soporte para comillas, comas y saltos de línea dentro de los campos.
function leerCsv(texto) {
  const filas = [];
  let fila = [];
  let campo = '';
  let entreComillas = false;
  const contenido = texto.replace(/^﻿/, '');
  for (let i = 0; i < contenido.length; i += 1) {
    const ch = contenido[i];
    if (entreComillas) {
      if (ch === '"' && contenido[i + 1] === '"') {
        campo += '"';
        i += 1;
      } else if (ch === '"') {
        entreComillas = false;
      } else {
        campo += ch;
      }
    } else if (ch === '"') {
      entreComillas = true;
    } else if (ch === ',') {
      fila.push(campo);
      campo = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && contenido[i + 1] === '\n') i += 1;
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = '';
    } else {
      campo += ch;
    }
  }
  if (campo || fila.length) {
    fila.push(campo);
    filas.push(fila);
  }
  return filas;
}

// Revisa una celda de pasos. Devuelve la lista de números de paso o lanza un error.
function validarCeldaPasos(celda, { obligatoria }) {
  if (celda === '') {
    if (obligatoria) throw new Error('está vacía');
    return [];
  }
  const numeros = [];
  for (const linea of celda.split(/\r?\n/)) {
    const partes = /^(\d+)\. (.*)$/.exec(linea);
    if (!partes) throw new Error(`la línea "${linea}" no tiene el formato N. "texto"`);
    const [, numero, contenido] = partes;
    let valor;
    try {
      valor = JSON.parse(contenido);
    } catch {
      throw new Error(`el paso ${numero} no es JSON válido (${contenido})`);
    }
    if (typeof valor !== 'string' || !valor.trim()) {
      throw new Error(`el paso ${numero} tiene que ser un texto JSON no vacío`);
    }
    numeros.push(Number(numero));
  }
  return numeros;
}

// Valida todas las filas del CSV. Las filas se numeran como en Qase (el encabezado es la fila 1).
function validarCsvQase(texto) {
  const [encabezado, ...filas] = leerCsv(texto);
  const errores = [];
  const indice = Object.fromEntries(encabezado.map((col, i) => [col, i]));

  for (const col of COLUMNAS_PASOS) {
    if (indice[col] === undefined) errores.push(`Falta la columna "${col}".`);
  }
  if (errores.length) return errores;

  filas.forEach((fila, i) => {
    const numeroFila = i + 2;
    if (fila.length !== encabezado.length) {
      errores.push(`Fila ${numeroFila}: tiene ${fila.length} columnas y el encabezado ${encabezado.length}.`);
      return;
    }
    const esSuite = fila[indice.suite_without_cases] === '1';
    if (esSuite) {
      for (const col of COLUMNAS_PASOS) {
        if (fila[indice[col]]) errores.push(`Fila ${numeroFila}, columna "${col}": una suite no lleva pasos.`);
      }
      return;
    }

    let acciones = [];
    try {
      acciones = validarCeldaPasos(fila[indice.steps_actions], { obligatoria: false });
      const esperados = acciones.map((_, n) => n + 1);
      if (acciones.join() !== esperados.join()) {
        throw new Error(`los pasos tienen que ir numerados 1, 2, 3... (vino ${acciones.join(', ')})`);
      }
    } catch (error) {
      errores.push(`Fila ${numeroFila}, columna "steps_actions": ${error.message}.`);
      return;
    }

    for (const col of ['steps_result', 'steps_data']) {
      try {
        const numeros = validarCeldaPasos(fila[indice[col]], { obligatoria: false });
        const sinAccion = numeros.filter((n) => !acciones.includes(n));
        if (sinAccion.length) throw new Error(`el paso ${sinAccion[0]} no tiene una acción con ese número`);
      } catch (error) {
        errores.push(`Fila ${numeroFila}, columna "${col}": ${error.message}.`);
      }
    }
  });

  return errores;
}

module.exports = { COLUMNAS_PASOS, codificarPasos, csvValor, leerCsv, validarCsvQase };
