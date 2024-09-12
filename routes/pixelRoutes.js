const express = require('express');
const router = express.Router();
const pixelController = require('../controllers/pixelController');

router.post('/add-pixel', pixelController.addPixel);

router.post('/send-event', pixelController.sendEvent);

router.get('/list', pixelController.getPixels);

module.exports = router;
