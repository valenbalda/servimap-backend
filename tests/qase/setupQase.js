// Se carga antes de cada archivo de tests (jest.config.js → setupFilesAfterEnv).
// Antes de cada test le pasa a Qase los metadatos del caso vinculado. Sin el reporter
// activo no hace nada.
const { aplicarMetadatos } = require('./qase');

beforeEach(() => {
  aplicarMetadatos(expect.getState().currentTestName);
});
