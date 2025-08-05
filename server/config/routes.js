const express = require('express');
const router = express.Router();
const { uploadProfile, uploadPayment, uploadProject, uploadAbstract } = require('./storage');

// Error handling middleware for file uploads
const handleUploadError = (err, req, res, next) => {
  console.error('Upload Error:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    name: err.name,
    ...(err.response && { response: err.response.data })
  });
  
  if (err.message.includes('File too large')) {
    return res.status(413).json({ 
      success: false,
      message: 'File size is too large. Maximum size is 5MB.'
    });
  }
  
  if (err.message.includes('invalid file type')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Please upload a valid image or document.'
    });
  }
  
  if (err.message.includes('ECONNREFUSED')) {
    return res.status(503).json({
      success: false,
      message: 'Upload service is currently unavailable. Please try again later.'
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    message: 'Failed to process file upload',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
};

// Generic single file upload route for profile photos
router.post('/upload/profile', uploadProfile.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      console.log('No file received in upload/profile');
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded or file is empty' 
      });
    }
    
    console.log('File uploaded successfully:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });
    
    // Return the Cloudinary URL of the uploaded image
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      imageUrl: req.file.path
    });
  } catch (error) {
    console.error('Error in profile upload route:', error);
    next(error);
  }
});

// Generic single file upload route for payment screenshots
router.post('/upload/payment', uploadPayment.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the Cloudinary URL of the uploaded image
  return res.status(200).json({
    message: 'File uploaded successfully',
    imageUrl: req.file.path
  });
});

// Generic single file upload route for project photos
router.post('/upload/project', uploadProject.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the Cloudinary URL of the uploaded image
  return res.status(200).json({
    message: 'File uploaded successfully',
    imageUrl: req.file.path
  });
});

// Generic single file upload route for abstract documents
router.post('/upload/abstract', uploadAbstract.single('document'), (req, res, next) => {
  try {
    if (!req.file) {
      console.log('No file received in upload/abstract');
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded or file is empty' 
      });
    }
    
    console.log('Abstract document uploaded successfully:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });
    
    // Return the Cloudinary URL of the uploaded document
    return res.status(200).json({
      success: true,
      message: 'Abstract document uploaded successfully',
      imageUrl: req.file.path
    });
  } catch (error) {
    console.error('Error in abstract upload route:', {
      error: error.message,
      stack: error.stack,
      file: req.file
    });
    next(error);
  }
});

// Apply error handling middleware to all routes
router.use(handleUploadError);

module.exports = router; 