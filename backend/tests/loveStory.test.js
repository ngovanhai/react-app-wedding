const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');

// Connect to test database
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wedding-test');
});

// Clear database before tests
beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// Disconnect after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Love Story API', () => {
  let albumId;
  let authToken;
  
  // Create an album first
  beforeEach(async () => {
    const albumRes = await request(app)
      .post('/api/albums')
      .send({
        title: 'Test Wedding',
        brideName: 'Jane',
        groomName: 'John',
        weddingDate: '2023-06-15',
        venue: 'Test Venue'
      });
    
    albumId = albumRes.body.album.id;
    
    // Register and login to get auth token
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginRes.body.token;
  });

  test('GET /api/love-story/:albumId should return 404 for non-existent love story', async () => {
    const res = await request(app).get(`/api/love-story/${albumId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.loveStory).toBeNull();
  });

  test('POST /api/love-story should create a new love story (admin only)', async () => {
    const res = await request(app)
      .post('/api/love-story')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        albumId: albumId,
        coupleName: 'Jane & John',
        storyIntroduction: 'Our love story began in college...'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.loveStory).toBeDefined();
    expect(res.body.loveStory.coupleName).toBe('Jane & John');
  });

  test('POST /api/love-story should return 409 if love story already exists', async () => {
    // Create first love story
    await request(app)
      .post('/api/love-story')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        albumId: albumId,
        coupleName: 'Jane & John',
        storyIntroduction: 'Our love story began in college...'
      });
    
    // Try to create again
    const res = await request(app)
      .post('/api/love-story')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        albumId: albumId,
        coupleName: 'Jane & John',
        storyIntroduction: 'Another story...'
      });
    
    expect(res.statusCode).toBe(409);
  });

  test('PUT /api/love-story/:albumId should update love story (admin only)', async () => {
    // Create love story first
    await request(app)
      .post('/api/love-story')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        albumId: albumId,
        coupleName: 'Jane & John',
        storyIntroduction: 'Our love story began in college...'
      });
    
    // Update love story
    const res = await request(app)
      .put(`/api/love-story/${albumId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        coupleName: 'Jane Doe & John Smith',
        storyIntroduction: 'Updated love story...'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.loveStory.coupleName).toBe('Jane Doe & John Smith');
  });

  test('POST /api/love-story/:albumId/events should add timeline event (admin only)', async () => {
    // Create love story first
    await request(app)
      .post('/api/love-story')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        albumId: albumId,
        coupleName: 'Jane & John'
      });
    
    // Add timeline event
    const res = await request(app)
      .post(`/api/love-story/${albumId}/events`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'First Meeting',
        description: 'We met at university',
        date: '2020-01-15',
        order: 0
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.loveStory.timeline).toHaveLength(1);
    expect(res.body.loveStory.timeline[0].title).toBe('First Meeting');
  });

  test('PUT /api/love-story/:albumId/events/:eventId should update timeline event (admin only)', async () => {
    // Create love story with event
    const createRes = await request(app)
      .post('/api/love-story')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        albumId: albumId,
        coupleName: 'Jane & John',
        timeline: [{
          title: 'First Meeting',
          description: 'We met at university',
          date: '2020-01-15'
        }]
      });
    
    const eventId = createRes.body.loveStory.timeline[0]._id;
    
    // Update timeline event
    const res = await request(app)
      .put(`/api/love-story/${albumId}/events/${eventId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated First Meeting',
        description: 'We met at coffee shop'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.loveStory.timeline[0].title).toBe('Updated First Meeting');
  });

  test('DELETE /api/love-story/:albumId/events/:eventId should delete timeline event (admin only)', async () => {
    // Create love story with event
    const createRes = await request(app)
      .post('/api/love-story')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        albumId: albumId,
        coupleName: 'Jane & John',
        timeline: [{
          title: 'First Meeting',
          description: 'We met at university',
          date: '2020-01-15'
        }]
      });
    
    const eventId = createRes.body.loveStory.timeline[0]._id;
    
    // Delete timeline event
    const res = await request(app)
      .delete(`/api/love-story/${albumId}/events/${eventId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toBe(200);
  });
});