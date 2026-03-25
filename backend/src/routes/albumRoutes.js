const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../utils/auth');
const albumController = require('../controllers/albumController');

// Admin routes (require authentication)
router.post('/', verifyJWT, albumController.createAlbum);
router.get('/:id', verifyJWT, albumController.getAlbumById);
router.put('/:id', verifyJWT, albumController.updateAlbum);
router.delete('/:id', verifyJWT, albumController.deleteAlbum);

// Public routes
router.get('/share/:code', albumController.getAlbumByShareCode);

module.exports = router;