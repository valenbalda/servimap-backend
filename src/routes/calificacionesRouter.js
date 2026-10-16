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

module.exports = router;