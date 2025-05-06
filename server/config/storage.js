const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Configure Cloudinary storage
const storageProfiles = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Configure storage for payment screenshots
const storagePayments = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'payment_screenshots',
    allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Configure storage for project photos
const storageProjects = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'project_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

// Configure storage for abstract documents
const storageAbstracts = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'abstract_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    resource_type: 'auto'
  }
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