const { Router } = require('express');
const calificacionesController = require('../controllers/calificacionesController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/rolesMiddleware');

const router = Router();

router.post(
  '/',
  autenticar,
  autorizar('CLIENTE'),
  calificacionesController.crear
);

router.get(
  '/prestador/:prestadorId/reputacion',
  calificacionesController.reputacion
);
router.get(
  '/prestador/:prestadorId',
  calificacionesController.listarPorPrestador
);

module.exports = router;