const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Verify Cloudinary configuration
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '***' : 'MISSING',
  api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('ERROR: Missing required Cloudinary environment variables');
}

// Error handling wrapper for Cloudinary storage
const createCloudinaryStorage = (options) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: options.folder,
      allowed_formats: options.allowed_formats,
      transformation: options.transformation,
      resource_type: options.resource_type || 'image'
    }
  });

  // Add error handling to the storage engine
  const _handleFile = storage._handleFile.bind(storage);
  storage._handleFile = function (req, file, cb) {
    console.log(`Uploading file to ${options.folder}:`, {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    _handleFile(req, file, (err, result) => {
      if (err) {
        console.error('Cloudinary upload error:', {
          folder: options.folder,
          error: err.message,
          stack: err.stack
        });
        return cb(err);
      }
      console.log('Upload successful:', {
        folder: options.folder,
        path: result.path,
        size: result.size
      });
      cb(null, result);
    });
  };

  return storage;
};

// Configure Cloudinary storage with error handling
const storageProfiles = createCloudinaryStorage({
  folder: 'profile_uploads',
  allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});

// Configure storage for payment screenshots
const storagePayments = createCloudinaryStorage({
  folder: 'payment_screenshots',
  allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
  transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
});

// Configure storage for project photos
const storageProjects = createCloudinaryStorage({
  folder: 'project_uploads',
  allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
  transformation: [{ width: 800, height: 800, crop: 'limit' }]
});

// Configure storage for abstract documents
const storageAbstracts = createCloudinaryStorage({
  folder: 'abstract_uploads',
  allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  resource_type: 'auto'
});

// Create multer upload instances
const uploadProfile = multer({ storage: storageProfiles });
const uploadPayment = multer({ storage: storagePayments });
const uploadProject = multer({ storage: storageProjects });
const uploadAbstract = multer({ storage: storageAbstracts });

module.exports = {
  uploadProfile,
  uploadPayment,
  uploadProject,
  uploadAbstract
}; 