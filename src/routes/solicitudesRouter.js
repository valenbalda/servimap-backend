const { Router } = require('express');
const solicitudesController = require('../controllers/solicitudesController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/rolesMiddleware');

const router = Router();

router.post('/', autenticar, autorizar('CLIENTE'), solicitudesController.crear);
router.patch('/:id/aceptar', autenticar, autorizar('PRESTADOR'), solicitudesController.aceptar);
router.patch('/:id/rechazar', autenticar, autorizar('PRESTADOR'), solicitudesController.rechazar);
router.patch('/:id/finalizar', autenticar, autorizar('PRESTADOR'), solicitudesController.finalizar);
router.patch('/:id/cancelar', autenticar, autorizar('CLIENTE'), solicitudesController.cancelar);

module.exports = router;