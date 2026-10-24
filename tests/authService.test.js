jest.mock('../src/config/prisma', () => ({
  usuario: { findUnique: jest.fn(), create: jest.fn() },
}));

jest.mock('../src/config/env', () => ({
  JWT_SECRET: 'clave-de-prueba-solo-para-los-tests-0123456789',
  JWT_EXPIRES_IN: '1d',
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../src/config/prisma');
const authService = require('../src/services/authService');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('registrarUsuario', () => {
  const datos = {
    nombre: 'Ana',
    dni: '12345678',
    email: 'ana@mail.com',
    password: '12345678',
    rol: 'CLIENTE',
  };

  it('rechaza un rol que no es CLIENTE ni PRESTADOR', async () => {
    await expect(
      authService.registrarUsuario({ ...datos, rol: 'ADMINISTRADOR' })
    ).rejects.toMatchObject({ status: 400 });

    expect(prisma.usuario.create).not.toHaveBeenCalled();
  });

  it('rechaza un DNI ya registrado', async () => {
    prisma.usuario.findUnique.mockResolvedValueOnce({ id: 'u1' });

    await expect(authService.registrarUsuario(datos)).rejects.toMatchObject({
      status: 409,
      message: 'Ya existe una cuenta con ese DNI',
    });

    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { dni: '12345678' },
    });
    expect(prisma.usuario.create).not.toHaveBeenCalled();
  });

  it('rechaza un email ya registrado', async () => {
    prisma.usuario.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'u1' });

    await expect(authService.registrarUsuario(datos)).rejects.toMatchObject({
      status: 409,
      message: 'El email ya está registrado',
    });

    expect(prisma.usuario.create).not.toHaveBeenCalled();
  });

  it('crea un cliente con la contraseña hasheada y sin perfil de prestador', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);
    prisma.usuario.create.mockImplementation(async ({ data }) => ({
      id: 'u1',
      fechaRegistro: new Date(),
      ...data,
    }));

    const usuario = await authService.registrarUsuario(datos);

    const { data } = prisma.usuario.create.mock.calls[0][0];
    expect(data.dni).toBe('12345678');
    expect(data.passwordHash).not.toBe('12345678');
    expect(await bcrypt.compare('12345678', data.passwordHash)).toBe(true);
    expect(data.prestador).toBeUndefined();

    expect(usuario).not.toHaveProperty('passwordHash');
    expect(usuario).not.toHaveProperty('dni');
    expect(usuario).toMatchObject({
      id: 'u1',
      nombre: 'Ana',
      email: 'ana@mail.com',
      rol: 'CLIENTE',
    });
  });

  it('crea el perfil de prestador vacío al registrar un PRESTADOR', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);
    prisma.usuario.create.mockImplementation(async ({ data }) => ({
      id: 'u2',
      fechaRegistro: new Date(),
      ...data,
    }));

    await authService.registrarUsuario({ ...datos, rol: 'PRESTADOR' });

    const { data } = prisma.usuario.create.mock.calls[0][0];
    expect(data.prestador).toEqual({ create: {} });
  });
});

describe('iniciarSesion', () => {
  const passwordHash = bcrypt.hashSync('12345678', 4);
  const usuarioBase = {
    id: 'u1',
    nombre: 'Ana',
    dni: '12345678',
    email: 'ana@mail.com',
    passwordHash,
    rol: 'CLIENTE',
    activo: true,
  };
  const credenciales = {
    dni: '12345678',
    email: 'ana@mail.com',
    password: '12345678',
  };

  it('busca al usuario por DNI', async () => {
    prisma.usuario.findUnique.mockResolvedValue(usuarioBase);

    await authService.iniciarSesion(credenciales);

    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { dni: '12345678' },
    });
  });

  it('rechaza un DNI que no existe con 401', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    await expect(
      authService.iniciarSesion({ ...credenciales, dni: '87654321' })
    ).rejects.toMatchObject({
      status: 401,
      message: 'DNI, email o contraseña incorrectos',
    });
  });

  it('rechaza un email que no es el de esa cuenta, con el mismo mensaje', async () => {
    prisma.usuario.findUnique.mockResolvedValue(usuarioBase);

    await expect(
      authService.iniciarSesion({ ...credenciales, email: 'otro@mail.com' })
    ).rejects.toMatchObject({
      status: 401,
      message: 'DNI, email o contraseña incorrectos',
    });
  });

  it('rechaza una contraseña incorrecta con el mismo mensaje', async () => {
    prisma.usuario.findUnique.mockResolvedValue(usuarioBase);

    await expect(
      authService.iniciarSesion({ ...credenciales, password: 'otraClave1' })
    ).rejects.toMatchObject({
      status: 401,
      message: 'DNI, email o contraseña incorrectos',
    });
  });

  it('rechaza una cuenta desactivada con 403', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ ...usuarioBase, activo: false });

    await expect(authService.iniciarSesion(credenciales)).rejects.toMatchObject({
      status: 403,
    });
  });

  it('devuelve un token válido con el id y el rol, sin la contraseña ni el DNI', async () => {
    prisma.usuario.findUnique.mockResolvedValue(usuarioBase);

    const resultado = await authService.iniciarSesion(credenciales);

    const payload = jwt.verify(
      resultado.token,
      'clave-de-prueba-solo-para-los-tests-0123456789'
    );
    expect(payload.sub).toBe('u1');
    expect(payload.rol).toBe('CLIENTE');
    expect(payload).not.toHaveProperty('dni');
    expect(resultado.usuario).toEqual({
      id: 'u1',
      nombre: 'Ana',
      email: 'ana@mail.com',
      rol: 'CLIENTE',
    });
  });
});

describe('obtenerPerfil', () => {
  const usuarioBase = {
    id: 'u1',
    nombre: 'Ana',
    dni: '12345678',
    email: 'ana@mail.com',
    passwordHash: 'hash',
    rol: 'CLIENTE',
    activo: true,
    fechaRegistro: new Date(),
  };

  it('devuelve el perfil sin la contraseña ni el DNI', async () => {
    prisma.usuario.findUnique.mockResolvedValue(usuarioBase);

    const perfil = await authService.obtenerPerfil('u1');

    expect(perfil).not.toHaveProperty('passwordHash');
    expect(perfil).not.toHaveProperty('dni');
    expect(perfil).toMatchObject({ id: 'u1', email: 'ana@mail.com' });
  });

  it('lanza 404 si el usuario no existe', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    await expect(authService.obtenerPerfil('u1')).rejects.toMatchObject({
      status: 404,
    });
  });

  it('lanza 404 si el usuario está desactivado', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ ...usuarioBase, activo: false });

    await expect(authService.obtenerPerfil('u1')).rejects.toMatchObject({
      status: 404,
    });
  });
});