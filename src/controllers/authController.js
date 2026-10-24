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
    const { dni, password } = req.body || {};

    if (
      typeof dni !== 'string' ||
      typeof password !== 'string' ||
      !dni.trim() ||
      !password
    ) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const dniNormalizado = normalizarDni(dni);
    if (!dniValido(dniNormalizado)) {
      return res
        .status(400)
        .json({ error: 'El DNI debe tener 7 u 8 números' });
    }

    const resultado = await authService.iniciarSesion({
      dni: dniNormalizado,
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

module.exports = { register, login, me };