const express = require('express');
const router = express.Router();
const pixelController = require('../controllers/pixelController');

// Rota para adicionar um pixel
router.post('/add-pixel', pixelController.addPixel);

// Rota para enviar um evento de conversão
router.post('/send-event', pixelController.sendEvent);

// Rota para listar pixels
router.get('/list', pixelController.getPixels);

module.exports = router;
