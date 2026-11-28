jest.mock('@vercel/blob', () => ({
  put: jest.fn(),
  del: jest.fn(),
}));

jest.mock('../src/config/prisma', () => ({
  usuario: { findUnique: jest.fn(), update: jest.fn() },
  prestador: { findUnique: jest.fn(), update: jest.fn() },
}));

const { put, del } = require('@vercel/blob');
const prisma = require('../src/config/prisma');
const fotosService = require('../src/services/fotosService');
const { caso } = require('./qase/qase');

const URL_ANTERIOR = 'https://abc123.public.blob.vercel-storage.com/fotos-perfil/u1-viejo.jpg';
const URL_NUEVA = 'https://abc123.public.blob.vercel-storage.com/fotos-perfil/u1-nuevo.png';
const URL_EXTERNA = 'https://mi-sitio.com/fotos/yo.jpg';
const imagen = { buffer: Buffer.from('contenido-de-la-imagen'), tipo: 'image/png' };

beforeEach(() => {
  jest.clearAllMocks();
  put.mockResolvedValue({ url: URL_NUEVA });
  del.mockResolvedValue(undefined);
  prisma.usuario.findUnique.mockResolvedValue({ fotoPerfil: null, activo: true });
  prisma.prestador.findUnique.mockResolvedValue({ fotoPerfil: null, activo: true });
});

describe('subirFoto', () => {
  it(caso('TC-FOT-007', 'sube la imagen al store y guarda la URL en el usuario cliente'), async () => {
    const resultado = await fotosService.subirFoto('u1', 'CLIENTE', imagen);

    expect(put).toHaveBeenCalledWith('fotos-perfil/u1.png', imagen.buffer, {
      access: 'public',
      contentType: 'image/png',
      addRandomSuffix: true,
    });
    expect(prisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { fotoPerfil: URL_NUEVA },
    });
    expect(prisma.prestador.update).not.toHaveBeenCalled();
    expect(resultado).toEqual({ fotoPerfil: URL_NUEVA });
  });

  it(caso('TC-FOT-008', 'guarda la URL en el perfil cuando es un prestador'), async () => {
    const resultado = await fotosService.subirFoto('u2', 'PRESTADOR', {
      buffer: Buffer.from('x'),
      tipo: 'image/jpeg',
    });

    expect(put).toHaveBeenCalledWith('fotos-perfil/u2.jpg', expect.any(Buffer), expect.any(Object));
    expect(prisma.prestador.update).toHaveBeenCalledWith({
      where: { usuarioId: 'u2' },
      data: { fotoPerfil: URL_NUEVA },
    });
    expect(prisma.usuario.update).not.toHaveBeenCalled();
    expect(resultado).toEqual({ fotoPerfil: URL_NUEVA });
  });

  it(caso('TC-FOT-009', 'al reemplazar la foto borra la anterior del store'), async () => {
    prisma.usuario.findUnique.mockResolvedValue({ fotoPerfil: URL_ANTERIOR, activo: true });

    await fotosService.subirFoto('u1', 'CLIENTE', imagen);

    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith(URL_ANTERIOR);
  });

  it.each([
    ['no tenía foto', null],
    ['tenía una URL externa', URL_EXTERNA],
  ])(caso('TC-FOT-010', 'no borra nada del store si %s'), async (_, fotoAnterior) => {
    prisma.usuario.findUnique.mockResolvedValue({ fotoPerfil: fotoAnterior, activo: true });

    await fotosService.subirFoto('u1', 'CLIENTE', imagen);

    expect(del).not.toHaveBeenCalled();
    expect(prisma.usuario.update).toHaveBeenCalled();
  });

  it(caso('TC-FOT-011', 'responde bien aunque falle el borrado de la foto anterior'), async () => {
    const consola = jest.spyOn(console, 'error').mockImplementation(() => {});
    prisma.usuario.findUnique.mockResolvedValue({ fotoPerfil: URL_ANTERIOR, activo: true });
    del.mockRejectedValue(new Error('store caído'));

    await expect(fotosService.subirFoto('u1', 'CLIENTE', imagen)).resolves.toEqual({
      fotoPerfil: URL_NUEVA,
    });

    consola.mockRestore();
  });

  it(caso('TC-FOT-012', 'si falla el guardado en la base, borra la foto recién subida'), async () => {
    prisma.usuario.update.mockRejectedValueOnce(new Error('base caída'));

    await expect(fotosService.subirFoto('u1', 'CLIENTE', imagen)).rejects.toThrow('base caída');

    expect(del).toHaveBeenCalledWith(URL_NUEVA);
  });

  it(caso('TC-FOT-013', 'si falla la subida al store, no toca la base'), async () => {
    put.mockRejectedValue(new Error('store caído'));

    await expect(fotosService.subirFoto('u1', 'CLIENTE', imagen)).rejects.toThrow('store caído');

    expect(prisma.usuario.update).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });

  it.each([
    ['usuario inexistente', 'CLIENTE', 'usuario', null],
    ['usuario desactivado', 'CLIENTE', 'usuario', { fotoPerfil: null, activo: false }],
    ['perfil de prestador inexistente', 'PRESTADOR', 'prestador', null],
    ['perfil de prestador desactivado', 'PRESTADOR', 'prestador', { fotoPerfil: null, activo: false }],
  ])(caso('TC-FOT-014', 'lanza 404 con %s y no sube nada'), async (_, rol, tabla, encontrado) => {
    prisma[tabla].findUnique.mockResolvedValue(encontrado);

    await expect(fotosService.subirFoto('u1', rol, imagen)).rejects.toMatchObject({ status: 404 });

    expect(put).not.toHaveBeenCalled();
  });
});

describe('eliminarFoto', () => {
  it(caso('TC-FOT-015', 'quita la foto del perfil y la borra del store'), async () => {
    prisma.usuario.findUnique.mockResolvedValue({ fotoPerfil: URL_ANTERIOR, activo: true });

    const resultado = await fotosService.eliminarFoto('u1', 'CLIENTE');

    expect(prisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { fotoPerfil: null },
    });
    expect(del).toHaveBeenCalledWith(URL_ANTERIOR);
    expect(resultado).toEqual({ fotoPerfil: null });
  });

  it(caso('TC-FOT-016', 'si la foto era una URL externa, solo la quita del perfil'), async () => {
    prisma.prestador.findUnique.mockResolvedValue({ fotoPerfil: URL_EXTERNA, activo: true });

    await fotosService.eliminarFoto('u2', 'PRESTADOR');

    expect(prisma.prestador.update).toHaveBeenCalledWith({
      where: { usuarioId: 'u2' },
      data: { fotoPerfil: null },
    });
    expect(del).not.toHaveBeenCalled();
  });

  it(caso('TC-FOT-017', 'lanza 404 si no tiene foto de perfil'), async () => {
    await expect(fotosService.eliminarFoto('u1', 'CLIENTE')).rejects.toMatchObject({
      status: 404,
      message: 'No tenés una foto de perfil',
    });

    expect(prisma.usuario.update).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });

  it(caso('TC-FOT-018', 'lanza 404 si el usuario no existe o está desactivado'), async () => {
    prisma.usuario.findUnique.mockResolvedValue({ fotoPerfil: URL_ANTERIOR, activo: false });

    await expect(fotosService.eliminarFoto('u1', 'CLIENTE')).rejects.toMatchObject({ status: 404 });

    expect(prisma.usuario.update).not.toHaveBeenCalled();
  });
});

describe('esFotoDelStore', () => {
  it.each([
    [URL_ANTERIOR, true],
    [URL_EXTERNA, false],
    ['https://blob.vercel-storage.com.otro-sitio.com/a.jpg', false],
    ['no-es-una-url', false],
    [null, false],
  ])(caso('TC-FOT-019', 'reconoce si %s es una foto del store'), (url, esperado) => {
    expect(fotosService.esFotoDelStore(url)).toBe(esperado);
  });
});