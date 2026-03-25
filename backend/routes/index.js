const express = require('express');
const router = express.Router();

const templateRoutes = require('./../src/routes/templateRoutes');
const qrcodeRoutes = require('./../src/routes/qrcodeRoutes');
const livewallRoutes = require('./../src/routes/livewallRoutes');

router.use('/templates', templateRoutes);
router.use('/qrcode', qrcodeRoutes);
router.use('/livewall', livewallRoutes);

module.exports = router;