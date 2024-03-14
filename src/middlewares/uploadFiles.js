const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'BoardgamesApi/users',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
  }
});
const boardgameStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'BoardgamesApi/boardgames',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
  }
});

const uploadUsers = multer({ storage: userStorage });
const uploadBoardgames = multer({ storage: boardgameStorage });

module.exports = { uploadBoardgames, uploadUsers };
