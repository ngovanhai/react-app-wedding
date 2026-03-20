// Routes for the wedding photo album app

const express = require('express');
const router = express.Router();
const { albumController, guestBookController } = require('../controllers');

// Album routes
router.post('/albums', albumController.createAlbum);
router.get('/albums/:shareCode', albumController.getAlbum);
router.put('/albums/:albumId', albumController.updateAlbum);
router.post('/albums/:albumId/photos', albumController.addPhotos);

// Guest book routes
router.post('/guestbook/:albumShareCode', guestBookController.addEntry);
router.get('/guestbook/:albumShareCode', guestBookController.getEntries);

module.exports = router;