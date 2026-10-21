const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;

    const datos = [nombre, email, password, rol];
    if (datos.some((dato) => typeof dato !== 'string' || !dato.trim())) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
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
    const { email, password } = req.body;

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

module.exports = { register, login, me };