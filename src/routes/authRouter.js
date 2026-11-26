const { Router } = require('express');
const authController = require('../controllers/authController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', autenticar, authController.me);
router.patch('/me', autenticar, authController.actualizarMe);
router.patch('/me/password', autenticar, authController.cambiarPassword);

module.exports = router;