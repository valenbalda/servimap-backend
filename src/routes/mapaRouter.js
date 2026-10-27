const { Router } = require('express');
const mapaController = require('../controllers/mapaController');

const router = Router();

// Público: cualquiera puede ver los marcadores del mapa.
router.get('/', mapaController.listar);

module.exports = router;