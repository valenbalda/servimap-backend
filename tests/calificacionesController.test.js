jest.mock('../src/services/calificacionesService', () => ({
  crearCalificacion: jest.fn(),
  editarComentario: jest.fn(),
  obtenerReputacion: jest.fn(),
  listarCalificacionesPrestador: jest.fn(),
  listarTodasLasCalificaciones: jest.fn(),
  moderarCalificacion: jest.fn(),
}));

const calificacionesService = require('../src/services/calificacionesService');
const calificacionesController = require('../src/controllers/calificacionesController');

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const usuario = { id: 'u1' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('crear', () => {
  it.each([undefined, '   ', 5])(
    'responde 400 si la solicitud es %p',
    async (solicitudId) => {
      const res = crearRes();

      await calificacionesController.crear(
        { usuario, body: { solicitudId, puntaje: 5 } },
        res,
        jest.fn()
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'La solicitud es obligatoria' });
      expect(calificacionesService.crearCalificacion).not.toHaveBeenCalled();
    }
  );

  it.each([0, 6, 3.5, '4', undefined])(
    'responde 400 con el puntaje %p',
    async (puntaje) => {
      const res = crearRes();

      await calificacionesController.crear(
        { usuario, body: { solicitudId: 's1', puntaje } },
        res,
        jest.fn()
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'El puntaje debe ser un número entero entre 1 y 5',
      });
      expect(calificacionesService.crearCalificacion).not.toHaveBeenCalled();
    }
  );

  it.each([
    ['no es texto', 123],
    ['es demasiado largo', 'a'.repeat(501)],
  ])('responde 400 si el comentario %s', async (_descripcion, comentario) => {
    const res = crearRes();

    await calificacionesController.crear(
      { usuario, body: { solicitudId: 's1', puntaje: 5, comentario } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El comentario debe ser texto de hasta 500 caracteres',
    });
    expect(calificacionesService.crearCalificacion).not.toHaveBeenCalled();
  });

  it('crea la calificación con los datos limpios y responde 201', async () => {
    calificacionesService.crearCalificacion.mockResolvedValue({ id: 'c1' });
    const res = crearRes();

    await calificacionesController.crear(
      {
        usuario,
        body: { solicitudId: ' s1 ', puntaje: 5, comentario: ' Muy bien ' },
      },
      res,
      jest.fn()
    );

    expect(calificacionesService.crearCalificacion).toHaveBeenCalledWith({
      clienteId: 'u1',
      solicitudId: 's1',
      puntaje: 5,
      comentario: 'Muy bien',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 'c1' });
  });

  it('permite calificar sin comentario', async () => {
    calificacionesService.crearCalificacion.mockResolvedValue({ id: 'c1' });

    await calificacionesController.crear(
      { usuario, body: { solicitudId: 's1', puntaje: 4 } },
      crearRes(),
      jest.fn()
    );

    expect(calificacionesService.crearCalificacion).toHaveBeenCalledWith({
      clienteId: 'u1',
      solicitudId: 's1',
      puntaje: 4,
      comentario: undefined,
    });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Esta solicitud ya fue calificada');
    calificacionesService.crearCalificacion.mockRejectedValue(error);
    const next = jest.fn();

    await calificacionesController.crear(
      { usuario, body: { solicitudId: 's1', puntaje: 5 } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('editarComentario', () => {
  it.each([
    ['falta', undefined],
    ['son solo espacios', '   '],
    ['es demasiado largo', 'a'.repeat(501)],
  ])('responde 400 si el comentario %s', async (_descripcion, comentario) => {
    const res = crearRes();

    await calificacionesController.editarComentario(
      { usuario, params: { id: 'c1' }, body: { comentario } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El comentario es obligatorio y puede tener hasta 500 caracteres',
    });
    expect(calificacionesService.editarComentario).not.toHaveBeenCalled();
  });

  it('edita el comentario con los datos limpios', async () => {
    calificacionesService.editarComentario.mockResolvedValue({ id: 'c1' });
    const res = crearRes();

    await calificacionesController.editarComentario(
      { usuario, params: { id: 'c1' }, body: { comentario: ' Nuevo ' } },
      res,
      jest.fn()
    );

    expect(calificacionesService.editarComentario).toHaveBeenCalledWith({
      clienteId: 'u1',
      calificacionId: 'c1',
      comentario: 'Nuevo',
    });
    expect(res.json).toHaveBeenCalledWith({ id: 'c1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Calificación no encontrada');
    calificacionesService.editarComentario.mockRejectedValue(error);
    const next = jest.fn();

    await calificacionesController.editarComentario(
      { usuario, params: { id: 'c1' }, body: { comentario: 'Nuevo' } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('reputacion', () => {
  it('devuelve la reputación del prestador', async () => {
    calificacionesService.obtenerReputacion.mockResolvedValue({ promedio: 4.5 });
    const res = crearRes();

    await calificacionesController.reputacion(
      { params: { prestadorId: 'p1' } },
      res,
      jest.fn()
    );

    expect(calificacionesService.obtenerReputacion).toHaveBeenCalledWith('p1');
    expect(res.json).toHaveBeenCalledWith({ promedio: 4.5 });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Prestador no encontrado');
    calificacionesService.obtenerReputacion.mockRejectedValue(error);
    const next = jest.fn();

    await calificacionesController.reputacion(
      { params: { prestadorId: 'p1' } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('listarPorPrestador', () => {
  it('devuelve las calificaciones públicas del prestador', async () => {
    calificacionesService.listarCalificacionesPrestador.mockResolvedValue([
      { id: 'c1' },
    ]);
    const res = crearRes();

    await calificacionesController.listarPorPrestador(
      { params: { prestadorId: 'p1' } },
      res,
      jest.fn()
    );

    expect(
      calificacionesService.listarCalificacionesPrestador
    ).toHaveBeenCalledWith('p1');
    expect(res.json).toHaveBeenCalledWith([{ id: 'c1' }]);
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('Prestador no encontrado');
    calificacionesService.listarCalificacionesPrestador.mockRejectedValue(error);
    const next = jest.fn();

    await calificacionesController.listarPorPrestador(
      { params: { prestadorId: 'p1' } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('listarTodas', () => {
  it('devuelve todas las calificaciones', async () => {
    calificacionesService.listarTodasLasCalificaciones.mockResolvedValue([
      { id: 'c1' },
      { id: 'c2' },
    ]);
    const res = crearRes();

    await calificacionesController.listarTodas({}, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith([{ id: 'c1' }, { id: 'c2' }]);
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('falla');
    calificacionesService.listarTodasLasCalificaciones.mockRejectedValue(error);
    const next = jest.fn();

    await calificacionesController.listarTodas({}, crearRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('moderar', () => {
  it.each([
    ['falta', undefined],
    ['son solo espacios', '   '],
    ['es demasiado largo', 'a'.repeat(201)],
  ])('responde 400 si el motivo %s', async (_descripcion, motivo) => {
    const res = crearRes();

    await calificacionesController.moderar(
      { params: { id: 'c1' }, body: { motivo } },
      res,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'El motivo es obligatorio y puede tener hasta 200 caracteres',
    });
    expect(calificacionesService.moderarCalificacion).not.toHaveBeenCalled();
  });

  it('modera la calificación con el motivo limpio', async () => {
    calificacionesService.moderarCalificacion.mockResolvedValue({ id: 'c1' });
    const res = crearRes();

    await calificacionesController.moderar(
      { params: { id: 'c1' }, body: { motivo: ' Spam ' } },
      res,
      jest.fn()
    );

    expect(calificacionesService.moderarCalificacion).toHaveBeenCalledWith(
      'c1',
      'Spam'
    );
    expect(res.json).toHaveBeenCalledWith({ id: 'c1' });
  });

  it('pasa el error del servicio al manejador de errores', async () => {
    const error = new Error('La calificación ya fue moderada');
    calificacionesService.moderarCalificacion.mockRejectedValue(error);
    const next = jest.fn();

    await calificacionesController.moderar(
      { params: { id: 'c1' }, body: { motivo: 'Spam' } },
      crearRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
