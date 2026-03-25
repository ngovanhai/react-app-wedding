// Models for the wedding photo album app
// Re-export all models from individual files

const Album = require('./Album');
const GuestBook = require('./GuestBook');
const GuestBookEntry = require('./GuestBook');
const LiveWall = require('./LiveWall');
const LoveStory = require('./LoveStory');
const QRCode = require('./QRCode');
const User = require('./User');

module.exports = {
  Album,
  GuestBook,
  GuestBookEntry,
  LiveWall,
  LoveStory,
  QRCode,
  User
};
