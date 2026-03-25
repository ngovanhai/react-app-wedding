// Setup file for Jest tests
const mongoose = require('mongoose');

// Connect to test database before all tests
beforeAll(async () => {
  const url = `mongodb://127.0.0.1:27017/wedding_album_test`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Disconnect from database after all tests
afterAll(async () => {
  await mongoose.connection.close();
});