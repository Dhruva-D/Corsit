const express = require('express');
const router = express.Router();
const { uploadProfile, uploadPayment, uploadProject, uploadAbstract } = require('./storage');

// Test endpoint to check if routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Upload routes are working', timestamp: new Date() });
});

// Test Cloudinary connection
router.get('/test-cloudinary', async (req, res) => {
  try {
    const cloudinary = require('./cloudinary');
    const result = await cloudinary.api.ping();
    res.json({ success: true, message: 'Cloudinary connection successful', result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Cloudinary connection failed', 
      error: error.message 
    });
  }
});

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
router.post('/upload/profile', (req, res, next) => {
  uploadProfile.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      return res.status(500).json({ 
        success: false,
        message: 'File upload failed',
        error: err.message
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'No file uploaded or file is empty' 
        });
      }
      
      // Return the Cloudinary URL of the uploaded image
      return res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        imageUrl: req.file.path
      });
    } catch (error) {
      console.error('Error in profile upload route:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
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
router.post('/upload/abstract', (req, res, next) => {
  console.log('Abstract upload route hit');
  console.log('Request headers:', req.headers);
  
  // Add middleware to log incoming file information
  req.on('data', chunk => {
    console.log('Received chunk of size:', chunk.length);
  });
  
  uploadAbstract.single('document')(req, res, (err) => {
    console.log('Abstract multer processing complete');
    
    if (err) {
      console.error('Multer error in abstract upload:', {
        message: err.message,
        stack: err.stack,
        code: err.code
      });
      return res.status(500).json({ 
        success: false,
        message: 'Abstract document upload failed',
        error: err.message
      });
    }
    
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
      console.error('Error in abstract upload route:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
});

// Apply error handling middleware to all routes
router.use(handleUploadError);

module.exports = router; 