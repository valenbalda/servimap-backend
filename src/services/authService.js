const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const env = require('../config/env');

const ROLES_PERMITIDOS = ['CLIENTE', 'PRESTADOR'];

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function registrarUsuario({ nombre, email, password, rol }) {
  if (!ROLES_PERMITIDOS.includes(rol)) {
    throw crearError('Rol inválido', 400);
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    throw crearError('El email ya está registrado', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nombre,
      email,
      passwordHash,
      rol,
      ...(rol === 'PRESTADOR' && { prestador: { create: {} } }),
    },
  });

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    fechaRegistro: usuario.fechaRegistro,
  };
}

async function iniciarSesion({ email, password }) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  const passwordValida =
    usuario && (await bcrypt.compare(password, usuario.passwordHash));

  if (!usuario || !passwordValida) {
    throw crearError('Email o contraseña incorrectos', 401);
  }

  if (!usuario.activo) {
    throw crearError('La cuenta está desactivada', 403);
  }

  const token = jwt.sign({ sub: usuario.id, rol: usuario.rol }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  };
}

module.exports = { registrarUsuario, iniciarSesion };