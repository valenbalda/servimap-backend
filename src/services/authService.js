const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const env = require('../config/env');

const ROLES_PERMITIDOS = new Set(['CLIENTE', 'PRESTADOR']);

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function registrarUsuario({ nombre, dni, email, password, rol }) {
  if (!ROLES_PERMITIDOS.has(rol)) {
    throw crearError('Rol inválido', 400);
  }

  // El DNI es único: una persona no puede tener dos cuentas.
  const dniExistente = await prisma.usuario.findUnique({ where: { dni } });
  if (dniExistente) {
    throw crearError('Ya existe una cuenta con ese DNI', 409);
  }

  const existente = await prisma.usuario.findUnique({ where:{ email } });
  if (existente) {
    throw crearError('El email ya está registrado', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nombre,
      dni,
      email,
      passwordHash,
      rol,
      ...(rol === 'PRESTADOR' && { prestador: { create: {} }}),
    },
  });

  return {
    id: usuario.id,
    numero: usuario.numero,
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

  const token = jwt.sign({ sub: usuario.id, rol: usuario.rol}, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      numero: usuario.numero,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  };
}

// El perfil es el único lugar donde se devuelve el DNI, y solo a su dueño
// (el id sale del token, nunca de un dato que mande el usuario).
function armarPerfil(usuario) {
  return {
    id: usuario.id,
    numero: usuario.numero,
    nombre: usuario.nombre,
    dni: usuario.dni,
    email: usuario.email,
    rol: usuario.rol,
    fechaRegistro: usuario.fechaRegistro,
  };
}

async function buscarUsuarioActivo(usuarioId) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });

  if (!usuario?.activo) {
    throw crearError('Usuario no encontrado', 404);
  }

  return usuario;
}

async function obtenerPerfil(usuarioId) {
  return armarPerfil(await buscarUsuarioActivo(usuarioId));
}

// Solo se puede editar el nombre. El DNI, el email y el rol no se tocan desde acá.
async function actualizarNombre(usuarioId, nombre) {
  await buscarUsuarioActivo(usuarioId);

  const usuario = await prisma.usuario.update({
    where: { id: usuarioId },
    data: { nombre },
  });

  return armarPerfil(usuario);
}

// Pide la contraseña actual, guarda la nueva hasheada y no devuelve ningún dato de la clave.
async function cambiarPassword(usuarioId, { passwordActual, passwordNueva }) {
  const usuario = await buscarUsuarioActivo(usuarioId);

  const actualValida = await bcrypt.compare(passwordActual, usuario.passwordHash);
  if (!actualValida) {
    throw crearError('La contraseña actual es incorrecta', 400);
  }

  const passwordHash = await bcrypt.hash(passwordNueva, 10);
  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { passwordHash },
  });
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  actualizarNombre,
  cambiarPassword,
};