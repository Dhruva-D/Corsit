const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful:', result);
  } catch (error) {
    console.error('Cloudinary connection failed:', {
      message: error.message,
      http_code: error.http_code
    });
  }
};

// Test connection on startup
testCloudinaryConnection();

module.exports = cloudinary; 