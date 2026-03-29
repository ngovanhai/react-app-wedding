const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../utils/auth');
const albumController = require('../controllers/albumController');

// Public routes (must be before dynamic /:id to avoid shadowing)
router.get('/share/:code', albumController.getAlbumByShareCode);

// Admin routes (require authentication)
router.post('/', verifyJWT, albumController.createAlbum);
router.get('/:id', verifyJWT, albumController.getAlbumById);
router.put('/:id', verifyJWT, albumController.updateAlbum);
router.delete('/:id', verifyJWT, albumController.deleteAlbum);

module.exports = router;