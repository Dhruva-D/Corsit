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

// Simple Cloudinary storage for profile photos (including SVG)
const storageProfiles = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Handle SVG files as raw resource type
    if (file.mimetype === 'image/svg+xml') {
      return {
        folder: 'profile_uploads',
        resource_type: 'raw',
        format: 'svg'
      };
    }
    // Handle regular images
    return {
      folder: 'profile_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    };
  }
});

// Simple Cloudinary storage for payment screenshots (including SVG)
const storagePayments = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Handle SVG files as raw resource type
    if (file.mimetype === 'image/svg+xml') {
      return {
        folder: 'payment_screenshots',
        resource_type: 'raw',
        format: 'svg'
      };
    }
    // Handle regular images
    return {
      folder: 'payment_screenshots',
      allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    };
  }
});

// Simple Cloudinary storage for project photos (including SVG)
const storageProjects = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Handle SVG files as raw resource type
    if (file.mimetype === 'image/svg+xml') {
      return {
        folder: 'project_uploads',
        resource_type: 'raw',
        format: 'svg'
      };
    }
    // Handle regular images
    return {
      folder: 'project_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'avif'],
      transformation: [{ width: 800, height: 800, crop: 'limit' }]
    };
  }
});

// Simple Cloudinary storage for abstract documents
const storageAbstracts = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // For raw resources, we don't use allowed_formats
    // Cloudinary determines format from file extension
    return {
      folder: 'abstract_uploads',
      resource_type: 'raw',
      public_id: `document_${Date.now()}`
    };
  }
});

// Create multer upload instances
const uploadProfile = multer({ 
  storage: storageProfiles,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadPayment = multer({ 
  storage: storagePayments,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadProject = multer({ 
  storage: storageProjects,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadAbstract = multer({ 
  storage: storageAbstracts,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log('Abstract file filter - File details:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Accept PDF, DOC, and DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      console.log('File type accepted:', file.mimetype);
      cb(null, true);
    } else {
      console.log('File type rejected:', file.mimetype);
      cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF, DOC, and DOCX files are allowed.`), false);
    }
  }
});

module.exports = {
  uploadProfile,
  uploadPayment,
  uploadProject,
  uploadAbstract
}; 