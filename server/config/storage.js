const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
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
  const params = {
    folder: options.folder,
    allowed_formats: options.allowed_formats,
    resource_type: options.resource_type || 'image',
  };

  if (options.transformation) {
    params.transformation = options.transformation;
  }

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: params,
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
  resource_type: 'raw' // Use 'raw' for non-image files
});

// Custom file filter for abstract documents
const abstractFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false); // Reject file
  }
};

// Create multer upload instances
const uploadProfile = multer({ storage: storageProfiles });
const uploadPayment = multer({ storage: storagePayments });
const uploadProject = multer({ storage: storageProjects });
const uploadAbstract = multer({ storage: storageAbstracts, fileFilter: abstractFileFilter });

module.exports = {
  uploadProfile,
  uploadPayment,
  uploadProject,
  uploadAbstract
}; 