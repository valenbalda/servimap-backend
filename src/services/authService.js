const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

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

module.exports = { registrarUsuario };
