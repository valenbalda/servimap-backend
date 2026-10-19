const { Router } = require('express');
const solicitudesController = require('../controllers/solicitudesController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/rolesMiddleware');

const router = Router();

router.post('/', autenticar, autorizar('CLIENTE'), solicitudesController.crear);

module.exports = router;