const { Router } = require('express');
const prestadoresController = require('../controllers/prestadoresController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/rolesMiddleware');

const router = Router();

// IMPORTANTE: las rutas '/me' van siempre ANTES de cualquier '/:id',
// si no, Express confunde "me" con un id.
router.get('/me', autenticar, autorizar('PRESTADOR'), prestadoresController.obtenerMiPerfil);
router.put('/me', autenticar, autorizar('PRESTADOR'), prestadoresController.actualizarMiPerfil);

module.exports = router;