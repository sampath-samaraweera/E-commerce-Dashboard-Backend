const cloudinary = require('../utils/cloudinaryConfig'); // Import Cloudinary configuration
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'techstore', // Optional - specify a folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Optional - restrict to specific formats
    resource_type: 'auto' // Automatically determine the resource type (image or video)
  }
});

// Initialize multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;