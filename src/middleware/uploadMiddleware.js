/**
 * @file uploadMiddleware.js
 * @description Multer configuration for handling agricultural image uploads (crop disease & pest identification).
 * Implements storage on local disk, 5MB file size limit, and mime-type sanitization.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directory target
const uploadDir = path.join(__dirname, '../../uploads/pests');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Unique filename: pest-[timestamp]-[random].[ext]
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `pest-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP crop images are allowed.'), false);
  }
};

const uploadPestImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes maximum
  },
  fileFilter,
});

module.exports = {
  uploadPestImage,
};
