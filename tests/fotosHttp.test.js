jest.mock('../src/services/fotosService', () => ({
  subirFoto: jest.fn(),
  eliminarFoto: jest.fn(),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const env = require('../src/config/env');
const app = require('../src/app');
const fotosService = require('../src/services/fotosService');
const { caso } = require('./qase/qase');

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64)]);
const DOS_MB = 2 * 1024 * 1024;

function conToken(rol, id = 'u1') {
  return `Bearer ${jwt.sign({ sub: id, rol }, env.JWT_SECRET, { expiresIn: '1h' })}`;
}

beforeEach(() => {
  jest.clearAllMocks();
  fotosService.subirFoto.mockResolvedValue({ fotoPerfil: 'https://x/foto.png' });
  fotosService.eliminarFoto.mockResolvedValue({ fotoPerfil: null });
});

describe('foto de perfil por HTTP', () => {
  it.each([['put'], ['delete']])(caso('TC-FOT-020', '%s /api/auth/me/foto sin token responde 401'), async (metodo) => {
    const res = await request(app)[metodo]('/api/auth/me/foto');

    expect(res.status).toBe(401);
    expect(fotosService.subirFoto).not.toHaveBeenCalled();
    expect(fotosService.eliminarFoto).not.toHaveBeenCalled();
  });

  it.each([['put'], ['delete']])(
    caso('TC-FOT-021', '%s /api/auth/me/foto como administrador responde 403'),
    async (metodo) => {
      const res = await request(app)[metodo]('/api/auth/me/foto').set('Authorization', conToken('ADMINISTRADOR'));

      expect(res.status).toBe(403);
      expect(fotosService.subirFoto).not.toHaveBeenCalled();
      expect(fotosService.eliminarFoto).not.toHaveBeenCalled();
    }
  );

  it.each([['CLIENTE'], ['PRESTADOR']])(caso('TC-FOT-022', 'un %s sube su foto con el cuerpo crudo y recibe la URL'), async (rol) => {
    const res = await request(app)
      .put('/api/auth/me/foto')
      .set('Authorization', conToken(rol, 'u9'))
      .set('Content-Type', 'image/png')
      .send(PNG);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ fotoPerfil: 'https://x/foto.png' });
    expect(fotosService.subirFoto).toHaveBeenCalledWith('u9', rol, {
      buffer: expect.any(Buffer),
      tipo: 'image/png',
    });
    expect(fotosService.subirFoto.mock.calls[0][2].buffer.equals(PNG)).toBe(true);
  });

  it(caso('TC-FOT-023', 'responde 413 si la imagen pesa más de 2 MB'), async () => {
    const grande = Buffer.concat([PNG, Buffer.alloc(DOS_MB)]);

    const res = await request(app)
      .put('/api/auth/me/foto')
      .set('Authorization', conToken('CLIENTE'))
      .set('Content-Type', 'image/png')
      .send(grande);

    expect(res.status).toBe(413);
    expect(res.body).toEqual({ error: expect.any(String) });
    expect(fotosService.subirFoto).not.toHaveBeenCalled();
  });

  it(caso('TC-FOT-024', 'responde 400 si se envía JSON en lugar de la imagen'), async () => {
    const res = await request(app)
      .put('/api/auth/me/foto')
      .set('Authorization', conToken('CLIENTE'))
      .send({ foto: 'abc' });

    expect(res.status).toBe(400);
    expect(fotosService.subirFoto).not.toHaveBeenCalled();
  });

  it(caso('TC-FOT-025', 'un cliente elimina su foto'), async () => {
    const res = await request(app).delete('/api/auth/me/foto').set('Authorization', conToken('CLIENTE', 'u4'));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ fotoPerfil: null });
    expect(fotosService.eliminarFoto).toHaveBeenCalledWith('u4', 'CLIENTE');
  });
});