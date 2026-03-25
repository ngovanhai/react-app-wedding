const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Album = require('../models/Album');
const GuestBook = require('../models/GuestBook');
const { generateToken } = require('../utils/auth');

// Mock JWT token for admin authentication
const mockAdminToken = generateToken('60f1b9c8e3a5d82b4c8e7f1a');

describe('GuestBook Controller Tests', () => {
  let testAlbumId;
  
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
    await GuestBook.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create a test album before each test
    const albumData = {
      title: 'Test Wedding',
      groomName: 'Test Groom',
      brideName: 'Test Bride',
      weddingDate: '2023-06-15',
      venue: 'Test Venue',
      shareCode: 'testcode'
    };
    
    const album = new Album(albumData);
    const savedAlbum = await album.save();
    testAlbumId = savedAlbum._id;
  });

  afterEach(async () => {
    // Clean up after each test
    await Album.deleteMany({});
    await GuestBook.deleteMany({});
  });

  describe('GET /api/albums/:id/guests', () => {
    it('should return guests for valid album ID with status 200', async () => {
      // Create some guest entries
      const guest1 = new GuestBook({
        albumId: testAlbumId,
        guestName: 'Alice Johnson',
        message: 'Congratulations!'
      });
      
      const guest2 = new GuestBook({
        albumId: testAlbumId,
        guestName: 'Bob Smith',
        message: 'Wishing you happiness!'
      });
      
      await guest1.save();
      await guest2.save();
      
      const res = await request(app)
        .get(`/api/albums/${testAlbumId}/guests`);
        
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].guestName).toBe('Bob Smith'); // Should be sorted by createdAt DESC
      expect(res.body.data[1].guestName).toBe('Alice Johnson');
    });

    it('should return 404 for invalid album ID', async () => {
      const invalidId = '60f1b9c8e3a5d82b4c8e7f00';
      
      const res = await request(app)
        .get(`/api/albums/${invalidId}/guests`);
        
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Album not found');
    });
  });

  describe('POST /api/albums/:id/guests', () => {
    it('should create guest message with valid data and return 201', async () => {
      const validGuestData = {
        guestName: 'Charlie Brown',
        message: 'Best wishes for your special day!',
        photoUrl: 'https://example.com/photo.jpg'
      };
      
      const res = await request(app)
        .post(`/api/albums/${testAlbumId}/guests`)
        .send(validGuestData);
        
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.guestName).toBe(validGuestData.guestName);
      expect(res.body.data.message).toBe(validGuestData.message);
      expect(res.body.data.photoUrl).toBe(validGuestData.photoUrl);
      expect(res.body.data.albumId).toBe(testAlbumId.toString());
    });

    it('should return 400 when missing required fields', async () => {
      const invalidGuestData = {
        guestName: 'Charlie Brown'
        // Missing message
      };
      
      const res = await request(app)
        .post(`/api/albums/${testAlbumId}/guests`)
        .send(invalidGuestData);
        
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('required');
    });

    it('should return 404 for invalid album ID', async () => {
      const invalidId = '60f1b9c8e3a5d82b4c8e7f00';
      const guestData = {
        guestName: 'Charlie Brown',
        message: 'Best wishes!'
      };
      
      const res = await request(app)
        .post(`/api/albums/${invalidId}/guests`)
        .send(guestData);
        
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Album not found');
    });
  });

  describe('DELETE /api/albums/:id/guests/:gid', () => {
    it('should delete guest message with valid IDs and return 200', async () => {
      const guestData = {
        albumId: testAlbumId,
        guestName: 'Delete Me',
        message: 'This will be deleted'
      };
      
      const guest = new GuestBook(guestData);
      const savedGuest = await guest.save();
      
      const res = await request(app)
        .delete(`/api/albums/${testAlbumId}/guests/${savedGuest._id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);
        
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Guest message deleted successfully');
      
      // Verify guest is actually deleted
      const getRes = await request(app)
        .get(`/api/albums/${testAlbumId}/guests`);
        
      expect(getRes.body.data.length).toBe(0);
    });

    it('should return 404 for invalid guest message ID', async () => {
      const invalidGid = '60f1b9c8e3a5d82b4c8e7f00';
      
      const res = await request(app)
        .delete(`/api/albums/${testAlbumId}/guests/${invalidGid}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);
        
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Guest message not found');
    });

    it('should return 400 for wrong album ID', async () => {
      const guestData = {
        albumId: testAlbumId,
        guestName: 'Wrong Album Test',
        message: 'This should fail'
      };
      
      const guest = new GuestBook(guestData);
      const savedGuest = await guest.save();
      
      // Create another album
      const otherAlbumData = {
        title: 'Other Wedding',
        groomName: 'Other Groom',
        brideName: 'Other Bride',
        weddingDate: '2023-07-15',
        shareCode: 'othercode'
      };
      
      const otherAlbum = new Album(otherAlbumData);
      const savedOtherAlbum = await otherAlbum.save();
      
      // Try to delete guest from wrong album
      const res = await request(app)
        .delete(`/api/albums/${savedOtherAlbum._id}/guests/${savedGuest._id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);
        
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('does not belong to this album');
    });
  });
});