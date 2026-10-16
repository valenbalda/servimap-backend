const { Router } = require('express');
const oficiosController = require('../controllers/oficiosController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/rolesMiddleware');

const router = Router();

router.get('/', oficiosController.listar);

router.get(
  '/todos',
  autenticar,
  autorizar('ADMINISTRADOR'),
  oficiosController.listarTodos
);
router.post('/', autenticar, autorizar('ADMINISTRADOR'), oficiosController.crear);
router.put(
  '/:id',
  autenticar,
  autorizar('ADMINISTRADOR'),
  oficiosController.actualizar
);
router.delete(
  '/:id',
  autenticar,
  autorizar('ADMINISTRADOR'),
  oficiosController.desactivar
);

module.exports = router;