jest.mock('../src/services/authService', ()=> ({
  registrarUsuario: jest.fn(),
  iniciarSesion: jest.fn(),
  obtenerPerfil: jest.fn(),
  actualizarNombre: jest.fn(),
  cambiarPassword: jest.fn(),
}));

const authService = require('../src/services/authService');
const authController = require('../src/controllers/authController');
const { caso } = require('./qase/qase');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const bodyValido = {
  nombre: ' Ana ',
  dni: '12.345.678',
  email: ' Ana@Mail.com ',
  password: '12345678',
  rol: 'CLIENTE',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('register', () => {
  it(caso('TC-AUTH-001', 'responde 400 si falta algún dato'), async () => {
    const res = crearRes();

    await authController.register(
      { body: { ...bodyValido, nombre: '   ' } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error: 'Faltan datos obligatorios' });
    expect(authService.registrarUsuario).not.toHaveBeenCalled();
  });

  it(caso('TC-AUTH-002', 'responde 400 si falta el DNI'), async () => {
    const res = crearRes();
    const { dni, ...sinDni } = bodyValido;

    await authController.register({ body: sinDni }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Faltan datos obligatorios' });
    expect(authService.registrarUsuario).not.toHaveBeenCalled();
  });

  it(caso('TC-AUTH-003', 'responde 400 si un dato no es texto'),async () => {
    const res = crearRes();

    await authController.register(
      { body: { ...bodyValido, password: 12345678 } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.registrarUsuario).not.toHaveBeenCalled();
  });

  it(caso('TC-AUTH-004', 'responde 400 si el DNI llega como número y no como texto'), async () => {
    const res = crearRes();

    await authController.register(
      { body: { ...bodyValido, dni: 12345678 } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.registrarUsuario).not.toHaveBeenCalled();
  });

  it.each(['1234567a', '123456', '123456789', 'abcdefgh', '12-345-678'])(
    caso('TC-AUTH-005', 'responde 400 con el DNI inválido "%s"'),
    async (dni) => {
      const res = crearRes();

      await authController.register(
        { body: { ...bodyValido, dni } },
        res,
        jest.fn()
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'El DNI debe tener 7 u 8 números',
      });
      expect(authService.registrarUsuario).not.toHaveBeenCalled();
    }
  );

  it.each(['sin-arroba', 'a@b', 'a b@c.com', '@c.com'])(
    caso('TC-AUTH-006', 'responde 400 con el email inválido "%s"'),
    async (email) => {
      const res = crearRes();

      await authController.register(
        { body: { ...bodyValido, email } },
        res,
        jest.fn()
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email inválido' });
    }
  );

  it(caso('TC-AUTH-007', 'responde 400 si la contraseña tiene menos de 8 caracteres'), async () => {
    const res = crearRes();

    await authController.register(
      { body: { ...bodyValido, password: 'corta' } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'La contraseña debe tener al menos 8 caracteres',
    });
  });

  it(caso('TC-AUTH-008', 'registra con los datos limpios y responde 201'), async () => {
    authService.registrarUsuario.mockResolvedValue({ id: 'u1' });
    const res = crearRes();

    await authController.register({ body: bodyValido }, res, jest.fn());

    expect(authService.registrarUsuario).toHaveBeenCalledWith({
      nombre: 'Ana',
      dni: '12345678',
      email: 'ana@mail.com',
      password: '12345678',
      rol: 'CLIENTE',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({id: 'u1' });
  });

  it.each(['12.345.678', '12 345 678', '12345678'])(
    caso('TC-AUTH-009', 'guarda siempre el mismo DNI aunque se escriba como "%s"'),
    async (dni) => {
      authService.registrarUsuario.mockResolvedValue({ id: 'u1' });

      await authController.register(
        { body: { ...bodyValido, dni } },
        crearRes(),
        jest.fn()
      );

      expect(authService.registrarUsuario).toHaveBeenCalledWith(
        expect.objectContaining({ dni: '12345678' })
      );
    }
  );

  it(caso('TC-AUTH-010', 'acepta un DNI que empieza con 9'), async () => {
    authService.registrarUsuario.mockResolvedValue({ id: 'u1' });
    const res = crearRes();

    await authController.register(
      { body: { ...bodyValido, dni: '92.345.678' } },
      res,
      jest.fn()
    );

    expect(authService.registrarUsuario).toHaveBeenCalledWith(
      expect.objectContaining({ dni: '92345678' })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it(caso('TC-AUTH-011', 'pasa el error del servicio al manejador de errores'), async () => {
    const error = new Error('Ya existe una cuenta con ese DNI');
    authService.registrarUsuario.mockRejectedValue(error);
    const next = jest.fn();

    await authController.register({ body: bodyValido }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('login', () => {
  it(caso('TC-AUTH-012', 'responde 400 si falta el email o la contraseña'), async () => {
    const res = crearRes();

    await authController.login(
      { body: { email: 'ana@mail.com' } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error: 'Faltan datos obligatorios' });
    expect(authService.iniciarSesion).not.toHaveBeenCalled();
  });

  it(caso('TC-AUTH-013', 'inicia sesión con el email en minúsculas y devuelve el resultado'), async () => {
    authService.iniciarSesion.mockResolvedValue({ token: 'abc' });
    const res = crearRes();

    await authController.login(
      { body: { email: ' Ana@Mail.com ', password: '12345678' } },
      res,
      jest.fn()
    );

    expect(authService.iniciarSesion).toHaveBeenCalledWith({
      email: 'ana@mail.com',
      password: '12345678',
    });
    expect(res.json).toHaveBeenCalledWith({token: 'abc' });
  });

  it(caso('TC-AUTH-014', 'no pide el DNI para iniciar sesión'), async () => {
    authService.iniciarSesion.mockResolvedValue({ token: 'abc' });
    const res = crearRes();

    await authController.login(
      { body: { email: 'ana@mail.com', password: '12345678' } },
      res,
      jest.fn()
    );

    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(authService.iniciarSesion).toHaveBeenCalledTimes(1);
  });

  it(caso('TC-AUTH-015', 'pasa el error del servicio al manejador de errores'), async () => {
    const error = new Error('Email o contraseña incorrectos');
    authService.iniciarSesion.mockRejectedValue(error);
    const next = jest.fn();

    await authController.login(
      { body: { email: 'ana@mail.com', password: '12345678' } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('me', () => {
  it(caso('TC-AUTH-016', 'devuelve el perfil del usuario autenticado'), async () => {
    authService.obtenerPerfil.mockResolvedValue({ id: 'u1' });
    const res = crearRes();

    await authController.me({ usuario: { id: 'u1' } }, res, jest.fn());

    expect(authService.obtenerPerfil).toHaveBeenCalledWith('u1');
    expect(res.json).toHaveBeenCalledWith({id: 'u1' });
  });

  it(caso('TC-AUTH-017', 'pasa el error del servicio al manejador de errores'), async () => {
    const error = new Error('Usuario no encontrado');
    authService.obtenerPerfil.mockRejectedValue(error);
    const next = jest.fn();

    await authController.me({ usuario: { id: 'u1' } }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('actualizarMe', () => {
  it.each([
    ['falta', {}],
    ['está vacío', { nombre: '   ' }],
    ['no es texto', { nombre: 123 }],
  ])(caso('TC-AUTH-031', 'responde 400 si el nombre %s'), async (_, body) => {
    const res = crearRes();

    await authController.actualizarMe({ usuario: { id: 'u1' }, body }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.actualizarNombre).not.toHaveBeenCalled();
  });

  it(caso('TC-AUTH-032', 'responde 400 si el nombre supera los 100 caracteres'), async () => {
    const res = crearRes();

    await authController.actualizarMe(
      { usuario: { id: 'u1' }, body: { nombre: 'a'.repeat(101) } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.actualizarNombre).not.toHaveBeenCalled();
  });

  it(caso('TC-AUTH-033', 'edita solo el nombre del usuario del token e ignora dni, email y rol'), async () => {
    authService.actualizarNombre.mockResolvedValue({ id: 'u1', nombre: 'Ana Pérez' });
    const res = crearRes();

    await authController.actualizarMe(
      {
        usuario: { id: 'u1' },
        body: { nombre: '  Ana Pérez ', dni: '99999999', email: 'otro@mail.com', rol: 'ADMINISTRADOR' },
      },
      res,
      jest.fn()
    );

    expect(authService.actualizarNombre).toHaveBeenCalledWith('u1', 'Ana Pérez');
    expect(res.json).toHaveBeenCalledWith({ id: 'u1', nombre: 'Ana Pérez' });
  });

  it(caso('TC-AUTH-034', 'pasa el error del servicio al manejador de errores'), async () => {
    const error = new Error('Usuario no encontrado');
    authService.actualizarNombre.mockRejectedValue(error);
    const next = jest.fn();

    await authController.actualizarMe(
      { usuario: { id: 'u1' }, body: { nombre: 'Ana' } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('cambiarPassword', () => {
  const bodyValido = { passwordActual: 'clave-vieja-1', passwordNueva: 'clave-nueva-2' };

  it.each([
    ['sin la contraseña actual', { passwordNueva: 'clave-nueva-2' }],
    ['sin la contraseña nueva', { passwordActual: 'clave-vieja-1' }],
    ['con datos que no son texto', { passwordActual: 1, passwordNueva: 2 }],
  ])(caso('TC-AUTH-035', 'responde 400 %s'), async (_, body) => {
    const res = crearRes();

    await authController.cambiarPassword({ usuario: { id: 'u1' }, body }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.cambiarPassword).not.toHaveBeenCalled();
  });

  it(caso('TC-AUTH-036', 'responde 400 si la contraseña nueva tiene menos de 8 caracteres'), async () => {
    const res = crearRes();

    await authController.cambiarPassword(
      { usuario: { id: 'u1' }, body: { passwordActual: 'clave-vieja-1', passwordNueva: '1234567' } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.cambiarPassword).not.toHaveBeenCalled();
  });

  it(caso('TC-AUTH-037', 'responde 400 si la contraseña nueva es igual a la actual'), async () => {
    const res = crearRes();

    await authController.cambiarPassword(
      { usuario: { id: 'u1' }, body: { passwordActual: 'misma-clave-1', passwordNueva: 'misma-clave-1' } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.cambiarPassword).not.toHaveBeenCalled();
  });

  it(caso('TC-AUTH-038', 'cambia la contraseña del usuario del token y no devuelve datos de la clave'), async () => {
    authService.cambiarPassword.mockResolvedValue(undefined);
    const res = crearRes();

    await authController.cambiarPassword({ usuario: { id: 'u1' }, body: bodyValido }, res, jest.fn());

    expect(authService.cambiarPassword).toHaveBeenCalledWith('u1', bodyValido);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Contraseña actualizada' });
  });

  it(caso('TC-AUTH-039', 'pasa el error del servicio al manejador de errores'), async () => {
    const error = new Error('La contraseña actual es incorrecta');
    authService.cambiarPassword.mockRejectedValue(error);
    const next = jest.fn();

    await authController.cambiarPassword({ usuario: { id: 'u1' }, body: bodyValido }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
