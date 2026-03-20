// Controllers for the wedding photo album app

const { albumService, guestBookService } = require('../services');

// Album controllers
const albumController = {
  // Create new album
  async createAlbum(req, res) {
    try {
      const { title, brideName, groomName, weddingDate, venue, template } = req.body;
      
      // Validate required fields
      if (!title || !brideName || !groomName || !weddingDate || !venue) {
        return res.status(400).json({
          error: 'Missing required fields: title, brideName, groomName, weddingDate, venue'
        });
      }
      
      const albumData = {
        title,
        brideName,
        groomName,
        weddingDate: new Date(weddingDate),
        venue,
        template: template || 'template1'
      };
      
      const album = await albumService.createAlbum(albumData);
      
      res.status(201).json({
        message: 'Album created successfully',
        album: {
          id: album._id,
          shareCode: album.shareCode
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get album by share code
  async getAlbum(req, res) {
    try {
      const { shareCode } = req.params;
      
      const album = await albumService.getAlbumByShareCode(shareCode);
      
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      
      res.status(200).json({ album });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add photos to album
  async addPhotos(req, res) {
    try {
      const { albumId } = req.params;
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      const photos = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        path: `/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }));
      
      const updatedAlbum = await albumService.addPhotosToAlbum(albumId, photos);
      
      res.status(200).json({
        message: 'Photos added successfully',
        album: updatedAlbum
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update album info
  async updateAlbum(req, res) {
    try {
      const { albumId } = req.params;
      const updateData = req.body;
      
      const album = await albumService.updateAlbumInfo(albumId, updateData);
      
      res.status(200).json({
        message: 'Album updated successfully',
        album
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Guest book controllers
const guestBookController = {
  // Add guest book entry
  async addEntry(req, res) {
    try {
      const { albumShareCode } = req.params;
      const { name, message, email } = req.body;
      
      // First get the album by share code to get the album ID
      const album = await albumService.getAlbumByShareCode(albumShareCode);
      
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      
      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }
      
      const entry = await guestBookService.addEntry(album._id, { name, message, email });
      
      res.status(201).json({
        message: 'Guest book entry added successfully',
        entry
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get guest book entries
  async getEntries(req, res) {
    try {
      const { albumShareCode } = req.params;
      
      // First get the album by share code to get the album ID
      const album = await albumService.getAlbumByShareCode(albumShareCode);
      
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      
      const entries = await guestBookService.getEntries(album._id);
      
      res.status(200).json({
        entries
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  albumController,
  guestBookController
};