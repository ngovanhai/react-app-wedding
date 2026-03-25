// Controllers for the wedding photo album app

const albumController = require('../controllers/albumController');
const guestBookController = require('../controllers/guestBookController');
const { loveStoryController } = require('./loveStoryController');

module.exports = {
  albumController,
  guestBookController,
  loveStoryController
};