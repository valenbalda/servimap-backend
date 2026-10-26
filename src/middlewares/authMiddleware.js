const jwt = require('jsonwebtoken');
const env = require('../config/env');

function autenticar(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    req.usuario = { id: payload.sub, rol: payload.rol };
    next();
  } catch {
    // No se propaga el error: cualquier fallo de jwt.verify (firma inválida,
    // token mal formado o vencido) significa que el cliente no está autenticado,
    // así que se responde directamente con 401 en lugar de pasarlo a next().
    return res.status(401).json({ error: 'Token inválido o vencido' });
  }
}

module.exports = { autenticar };