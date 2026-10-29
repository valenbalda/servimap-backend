// Prepara el entorno de los tests de integración. Tiene que ser el PRIMER require de
// cada archivo de tests/integration, antes de cargar la app o Prisma.
//
// - Usa solo DATABASE_URL_TEST (nunca la base de producción).
// - Si DATABASE_URL_TEST no está definida, los tests se saltean con un aviso.
// - Si DATABASE_URL_TEST apunta a la misma base que DATABASE_URL, aborta.
require('dotenv').config({ quiet: true });

const urlTest = process.env.DATABASE_URL_TEST;
const urlPrincipal = process.env.DATABASE_URL;

// Identifica una base por servidor, puerto y nombre (sin usuario ni contraseña).
function identificarBase(url) {
  try {
    const { hostname, port, pathname } = new URL(url);
    return `${hostname.toLowerCase()}:${port || '5432'}/${pathname.replace(/^\//, '')}`;
  } catch {
    return null;
  }
}

function verificarQueNoEsProduccion() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Los tests de integración no se corren con NODE_ENV=production.');
  }
  const baseTest = identificarBase(urlTest);
  if (!baseTest) {
    throw new Error('DATABASE_URL_TEST no es una connection string de PostgreSQL válida.');
  }
  if (urlPrincipal && identificarBase(urlPrincipal) === baseTest) {
    throw new Error(
      'DATABASE_URL_TEST apunta a la misma base que DATABASE_URL. ' +
        'Los tests de integración borran datos: usá una base exclusiva para tests.'
    );
  }
}

const hayBaseDeTest = Boolean(urlTest);

if (hayBaseDeTest) {
  verificarQueNoEsProduccion();
  // Prisma (src/config/prisma.js) lee DATABASE_URL al crearse: se la redirige a la base de test.
  process.env.DATABASE_URL = urlTest;
  process.env.NODE_ENV = 'test';
}

let avisado = false;

// describe() que se saltea (con un aviso claro) si no hay base de test.
function describeConBase(nombre, fn) {
  if (hayBaseDeTest) {
    return describe(nombre, fn);
  }
  if (!avisado) {
    avisado = true;
    console.warn(
      'Tests de integración salteados: definí DATABASE_URL_TEST con una base PostgreSQL ' +
        'exclusiva para tests (ver docs/qa/README.md).'
    );
  }
  return describe.skip(nombre, fn);
}

module.exports = { describeConBase, hayBaseDeTest, identificarBase };
