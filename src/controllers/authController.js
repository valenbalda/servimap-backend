const authService = require('../services/authService');

// El DNI puede venir escrito con puntos o espacios (12.345.678). Los sacamos
// para guardarlo siempre igual: solo números.
function normalizarDni(dni) {
  return dni.replace(/[.\s]/g, '');
}

// Un DNI argentino tiene 7 u 8 dígitos y nada más.
function dniValido(dni) {
  return /^\d{7,8}$/.test(dni);
}

async function register(req, res, next) {
  try {
    const { nombre, dni, email, password, rol } = req.body || {};

    const datos = [nombre, dni, email, password, rol];
    if (datos.some((dato) => typeof dato !== 'string' || !dato.trim())) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const dniNormalizado = normalizarDni(dni);
    if (!dniValido(dniNormalizado)) {
      return res
        .status(400)
        .json({ error: 'El DNI debe tener 7 u 8 números' });
    }

    if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const usuario = await authService.registrarUsuario({
      nombre: nombre.trim(),
      dni: dniNormalizado,
      email: email.trim().toLowerCase(),
      password,
      rol,
    });

    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const resultado = await authService.iniciarSesion({
      email: email.trim().toLowerCase(),
      password,
    });

    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const usuario = await authService.obtenerPerfil(req.usuario.id);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

const NOMBRE_MAX = 100;
const PASSWORD_MIN = 8;

// Solo se acepta el nombre: si mandan dni, email o rol, se ignoran.
async function actualizarMe(req, res, next) {
  try {
    const { nombre } = req.body || {};

    if (typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    if (nombre.trim().length > NOMBRE_MAX) {
      return res
        .status(400)
        .json({ error: `El nombre no puede superar los ${NOMBRE_MAX} caracteres` });
    }

    const usuario = await authService.actualizarNombre(req.usuario.id, nombre.trim());
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function cambiarPassword(req, res, next) {
  try {
    const { passwordActual, passwordNueva } = req.body || {};

    if (
      typeof passwordActual !== 'string' ||
      typeof passwordNueva !== 'string' ||
      !passwordActual ||
      !passwordNueva
    ) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    if (passwordNueva.length < PASSWORD_MIN) {
      return res
        .status(400)
        .json({ error: 'La contraseña nueva debe tener al menos 8 caracteres' });
    }

    if (passwordNueva === passwordActual) {
      return res
        .status(400)
        .json({ error: 'La contraseña nueva debe ser distinta de la actual' });
    }

    await authService.cambiarPassword(req.usuario.id, { passwordActual, passwordNueva });
    res.json({ mensaje: 'Contraseña actualizada' });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, me, actualizarMe, cambiarPassword };