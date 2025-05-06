const express = require('express');
const router = express.Router();
const { uploadProfile, uploadPayment, uploadProject, uploadAbstract } = require('./storage');

// Generic single file upload route for profile photos
router.post('/upload/profile', uploadProfile.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the Cloudinary URL of the uploaded image
  return res.status(200).json({
    message: 'File uploaded successfully',
    imageUrl: req.file.path
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
router.post('/upload/abstract', uploadAbstract.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the Cloudinary URL of the uploaded image
  return res.status(200).json({
    message: 'File uploaded successfully',
    imageUrl: req.file.path
  });
});

module.exports = router; 