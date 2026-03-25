// Controllers for the wedding photo album app

const albumController = require('./albumController');
const guestBookController = require('./guestBookController');
const { loveStoryController } = require('./loveStoryController');

module.exports = {
  albumController,
  guestBookController,
  loveStoryController
};