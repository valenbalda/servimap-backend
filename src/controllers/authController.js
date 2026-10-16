const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;

    const datos = [nombre, email, password, rol];
    if (datos.some((dato) => typeof dato !== 'string' || !dato.trim())) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
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

module.exports = { register };
