jest.mock('../src/services/authService', ()=> ({
  registrarUsuario: jest.fn(),
  iniciarSesion: jest.fn(),
  obtenerPerfil: jest.fn(),
}));

const authService = require('../src/services/authService');
const authController = require('../src/controllers/authController');

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
  it('responde 400 si falta algún dato', async () => {
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

  it('responde 400 si falta el DNI', async () => {
    const res = crearRes();
    const { dni, ...sinDni } = bodyValido;

    await authController.register({ body: sinDni }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Faltan datos obligatorios' });
    expect(authService.registrarUsuario).not.toHaveBeenCalled();
  });

  it('responde 400 si un dato no es texto',async () => {
    const res = crearRes();

    await authController.register(
      { body: { ...bodyValido, password: 12345678 } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.registrarUsuario).not.toHaveBeenCalled();
  });

  it('responde 400 si el DNI llega como número y no como texto', async () => {
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
    'responde 400 con el DNI inválido "%s"',
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
    'responde 400 con el email inválido "%s"',
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

  it('responde 400 si la contraseña tiene menos de 8 caracteres', async () => {
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

  it('registra con los datos limpios y responde 201', async () => {
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
    'guarda siempre el mismo DNI aunque se escriba como "%s"',
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

  it('acepta un DNI que empieza con 9', async () => {
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

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Ya existe una cuenta con ese DNI');
    authService.registrarUsuario.mockRejectedValue(error);
    const next = jest.fn();

    await authController.register({ body: bodyValido }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('login', () => {
  it('responde 400 si falta el DNI o la contraseña', async () => {
    const res = crearRes();

    await authController.login(
      { body: { dni: '12345678' } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({error: 'Faltan datos obligatorios' });
    expect(authService.iniciarSesion).not.toHaveBeenCalled();
  });

  it('responde 400 si el DNI no tiene 7 u 8 números', async () => {
    const res = crearRes();

    await authController.login(
      { body: { dni: '12ab', password: '12345678' } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El DNI debe tener 7 u 8 números',
    });
    expect(authService.iniciarSesion).not.toHaveBeenCalled();
  });

  it('inicia sesión con el DNI sin puntos y devuelve el resultado', async () => {
    authService.iniciarSesion.mockResolvedValue({ token: 'abc' });
    const res = crearRes();

    await authController.login(
      { body: { dni: ' 12.345.678 ', password: '12345678' } },
      res,
      jest.fn()
    );

    expect(authService.iniciarSesion).toHaveBeenCalledWith({
      dni: '12345678',
      password: '12345678',
    });
    expect(res.json).toHaveBeenCalledWith({token: 'abc' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('DNI o contraseña incorrectos');
    authService.iniciarSesion.mockRejectedValue(error);
    const next = jest.fn();

    await authController.login(
      { body: { dni: '12345678', password: '12345678' } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('me', () => {
  it('devuelve el perfil del usuario autenticado', async () => {
    authService.obtenerPerfil.mockResolvedValue({ id: 'u1' });
    const res = crearRes();

    await authController.me({ usuario: { id: 'u1' } }, res, jest.fn());

    expect(authService.obtenerPerfil).toHaveBeenCalledWith('u1');
    expect(res.json).toHaveBeenCalledWith({id: 'u1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Usuario no encontrado');
    authService.obtenerPerfil.mockRejectedValue(error);
    const next = jest.fn();

    await authController.me({ usuario: { id: 'u1' } }, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});