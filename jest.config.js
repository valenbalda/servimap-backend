// El reporter de Qase solo se activa con QASE_MODE=testops (o con "npm run test:qase").
// Así "npm test" local no depende de Qase ni de tener un token.
const modoQase =
  process.env.QASE_MODE || (process.env.npm_lifecycle_event === 'test:qase' ? 'testops' : 'off');

const reporters = ['default'];
if (modoQase === 'testops') {
  reporters.push(['jest-qase-reporter', { mode: 'testops' }]);
}

module.exports = {
  testEnvironment: 'node',
  reporters,
  // La cobertura mide solo el código de la app, no los helpers de tests/.
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/'],
  // Vincula cada test con su caso documentado (título, campos, suite y tags en Qase).
  setupFilesAfterEnv: ['<rootDir>/tests/qase/setupQase.js'],
};
