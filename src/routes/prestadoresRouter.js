const { Router } = require('express');
const prestadoresController = require('../controllers/prestadoresController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/rolesMiddleware');

const router = Router();

// Público: cualquiera puede buscar prestadores.
router.get('/', prestadoresController.listar);

// IMPORTANTE: las rutas '/me' (y más adelante '/mapa') van siempre ANTES de '/:id',
// si no, Express confunde "me" con un id.
router.get('/me', autenticar, autorizar('PRESTADOR'), prestadoresController.obtenerMiPerfil);
router.put('/me', autenticar, autorizar('PRESTADOR'), prestadoresController.actualizarMiPerfil);
router.put('/me/oficios', autenticar, autorizar('PRESTADOR'), prestadoresController.asignarMisOficios);
router.get('/me/calificaciones', autenticar, autorizar('PRESTADOR'), prestadoresController.misCalificaciones);

// Público: ficha de un prestador. Siempre al final de las rutas con GET.
router.get('/:id', prestadoresController.detalle);

module.exports = router;