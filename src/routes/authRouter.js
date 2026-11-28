const express = require('express');
const authController = require('../controllers/authController');
const fotosController = require('../controllers/fotosController');
const { autenticar } = require('../middlewares/authMiddleware');
const { autorizar } = require('../middlewares/rolesMiddleware');

const router = express.Router();

// La imagen viaja cruda en el cuerpo del pedido (no como JSON). Solo se lee si el
// Content-Type es de una imagen permitida y pesa hasta 2 MB; si pesa más, responde 413.
const leerImagen = express.raw({
  type: fotosController.TIPOS_PERMITIDOS,
  limit: fotosController.TAMANIO_MAXIMO,
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', autenticar, authController.me);
router.patch('/me', autenticar, authController.actualizarMe);
router.patch('/me/password', autenticar, authController.cambiarPassword);

// Foto de perfil de clientes y prestadores. Primero se controla quién es y recién
// después se lee la imagen, para no procesar archivos de quien no tiene permiso.
router.put('/me/foto', autenticar, autorizar('CLIENTE', 'PRESTADOR'), leerImagen, fotosController.subir);
router.delete('/me/foto', autenticar, autorizar('CLIENTE', 'PRESTADOR'), fotosController.eliminar);

module.exports = router;