const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Album = require('../models/Album');
const { generateToken } = require('../utils/auth');

// Mock JWT token for admin authentication
const mockAdminToken = generateToken('60f1b9c8e3a5d82b4c8e7f1a');

describe('Album Controller Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    const url = `mongodb://127.0.0.1:27017/wedding_album_test`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up and close connection
    await Album.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up after each test
    await Album.deleteMany({});
  });

  describe('POST /api/albums - Create album', () => {
    it('should create album with valid data and return 201', async () => {
      const validAlbumData = {
        title: 'John & Jane Wedding',
        groomName: 'John Doe',
        brideName: 'Jane Smith',
        weddingDate: '2023-06-15',
        venue: 'Grand Hotel'
      };

      const res = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(validAlbumData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(validAlbumData.title);
      expect(res.body.data.groomName).toBe(validAlbumData.groomName);
      expect(res.body.data.brideName).toBe(validAlbumData.brideName);
      expect(res.body.data.weddingDate).toBeDefined();
      expect(res.body.data.shareCode).toBeDefined();
    });

    it('should return 400 when missing required fields', async () => {
      const invalidAlbumData = {
        title: 'John & Jane Wedding',
        // Missing groomName, brideName, weddingDate
        venue: 'Grand Hotel'
      };

      const res = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(invalidAlbumData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('required');
    });

    it('should handle duplicate shareCode and return 500 after max attempts', async () => {
      // Mock generateShareCode to always return the same code
      jest.mock('../utils/helpers', () => ({
        generateShareCode: () => 'duplicatecode'
      }));
      
      // First album creation
      const albumData1 = {
        title: 'First Wedding',
        groomName: 'John',
        brideName: 'Jane',
        weddingDate: '2023-06-15'
      };
      
      await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(albumData1);
      
      // Second album creation should fail due to duplicate shareCode
      const albumData2 = {
        title: 'Second Wedding',
        groomName: 'Mike',
        brideName: 'Sarah',
        weddingDate: '2023-07-15'
      };
      
      const res = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(albumData2);
      
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('unique share code');
    });
  });

  describe('GET /api/albums/:id - Get album', () => {
    it('should return album with valid ID and status 200', async () => {
      const albumData = {
        title: 'Test Wedding',
        groomName: 'Test Groom',
        brideName: 'Test Bride',
        weddingDate: '2023-06-15',
        venue: 'Test Venue'
      };

      const createdAlbum = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(albumData);

      const res = await request(app)
        .get(`/api/albums/${createdAlbum.body.data._id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(albumData.title);
    });

    it('should return 404 for invalid album ID', async () => {
      const invalidId = '60f1b9c8e3a5d82b4c8e7f00';
      
      const res = await request(app)
        .get(`/api/albums/${invalidId}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Album not found');
    });
  });

  describe('GET /api/albums/share/:code - Public access', () => {
    it('should return album with valid shareCode and status 200', async () => {
      const albumData = {
        title: 'Public Wedding',
        groomName: 'Public Groom',
        brideName: 'Public Bride',
        weddingDate: '2023-06-15',
        venue: 'Public Venue'
      };

      const createdAlbum = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(albumData);

      const res = await request(app)
        .get(`/api/albums/share/${createdAlbum.body.data.shareCode}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(albumData.title);
    });

    it('should return 404 for invalid shareCode', async () => {
      const res = await request(app)
        .get('/api/albums/share/invalidcode');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Album not found');
    });
  });

  describe('PUT /api/albums/:id - Update album', () => {
    it('should update album with valid data and return 200', async () => {
      const albumData = {
        title: 'Original Wedding',
        groomName: 'Original Groom',
        brideName: 'Original Bride',
        weddingDate: '2023-06-15',
        venue: 'Original Venue'
      };

      const createdAlbum = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(albumData);

      const updatedData = {
        title: 'Updated Wedding',
        groomName: 'Updated Groom',
        brideName: 'Updated Bride',
        weddingDate: '2023-07-15',
        venue: 'Updated Venue'
      };

      const res = await request(app)
        .put(`/api/albums/${createdAlbum.body.data._id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updatedData.title);
      expect(res.body.data.groomName).toBe(updatedData.groomName);
      expect(res.body.data.brideName).toBe(updatedData.brideName);
      expect(new Date(res.body.data.weddingDate).toISOString()).toBe(new Date(updatedData.weddingDate).toISOString());
    });

    it('should return 400 when missing required fields', async () => {
      const albumData = {
        title: 'Test Wedding',
        groomName: 'Test Groom',
        brideName: 'Test Bride',
        weddingDate: '2023-06-15'
      };

      const createdAlbum = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(albumData);

      const invalidUpdateData = {
        title: 'Updated Wedding',
        // Missing groomName, brideName, weddingDate
        venue: 'Updated Venue'
      };

      const res = await request(app)
        .put(`/api/albums/${createdAlbum.body.data._id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(invalidUpdateData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('required');
    });

    it('should return 404 for invalid album ID', async () => {
      const invalidId = '60f1b9c8e3a5d82b4c8e7f00';
      const updateData = {
        title: 'Updated Wedding',
        groomName: 'Updated Groom',
        brideName: 'Updated Bride',
        weddingDate: '2023-07-15'
      };
      
      const res = await request(app)
        .put(`/api/albums/${invalidId}`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Album not found');
    });
  });

  describe('DELETE /api/albums/:id - Delete album', () => {
    it('should delete album with valid ID and return 200', async () => {
      const albumData = {
        title: 'Delete Wedding',
        groomName: 'Delete Groom',
        brideName: 'Delete Bride',
        weddingDate: '2023-06-15'
      };

      const createdAlbum = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(albumData);

      const res = await request(app)
        .delete(`/api/albums/${createdAlbum.body.data._id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Album deleted successfully');

      // Verify album is actually deleted
      const getRes = await request(app)
        .get(`/api/albums/${createdAlbum.body.data._id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);
      
      expect(getRes.statusCode).toBe(404);
    });

    it('should return 404 for invalid album ID', async () => {
      const invalidId = '60f1b9c8e3a5d82b4c8e7f00';
      
      const res = await request(app)
        .delete(`/api/albums/${invalidId}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Album not found');
    });
  });
});