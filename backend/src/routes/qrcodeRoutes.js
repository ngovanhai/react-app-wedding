const express = require('express');
const router = express.Router();
const qrcodeController = require('../controllers/qrcodeController');

router.post('/', qrcodeController.generate);
router.get('/album/:albumId', qrcodeController.getByAlbum);
router.post('/:qrId/scan', qrcodeController.scan);
router.delete('/:qrId', qrcodeController.deactivate);

module.exports = router;