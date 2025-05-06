require('dotenv').config();
const cloudinary = require('./config/cloudinary');
const fs = require('fs');
const path = require('path');

// Default image files paths (relative to this script)
const defaultProfilePath = path.join(__dirname, '../client/src/assets/default-profile.svg');
const defaultProjectPath = path.join(__dirname, '../client/src/assets/default-project.svg');

// Function to upload image to Cloudinary
async function uploadImage(filePath, publicId, folder) {
  try {
    console.log(`Uploading ${filePath} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: folder,
      overwrite: true,
      resource_type: 'image'
    });
    console.log(`Successfully uploaded to: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    throw error;
  }
}

// Main function to upload all default images
async function uploadDefaultImages() {
  try {
    // Upload default profile image
    await uploadImage(defaultProfilePath, 'default-profile', 'profile_uploads');
    
    // Upload default project image
    await uploadImage(defaultProjectPath, 'default-project', 'project_uploads');
    
    console.log('All default images uploaded successfully!');
  } catch (error) {
    console.error('Error uploading default images:', error);
  }
}

// Execute the upload
uploadDefaultImages(); 