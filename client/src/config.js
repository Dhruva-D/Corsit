/**
 * Global application configuration
 * Change values here to update throughout the application
 */

// Import default images as modules
import defaultProfileImage from './assets/default-profile.svg';
import defaultProjectImage from './assets/default-project.svg';

const config = {
  // API URLs
  // apiBaseUrl: 'https://corsit-qahn.onrender.com',
  apiBaseUrl: 'http://localhost:5002',
  
  // Default images
  defaultProfileImage: defaultProfileImage,
  defaultProjectImage: defaultProjectImage,
  
  // Default social media URLs
  defaultLinkedin: 'https://linkedin.com',
  defaultGithub: 'https://github.com',
  defaultInstagram: 'https://instagram.com',
  
  // Theme colors
  colors: {
    primary: '#ed5a2d',
    primaryHover: '#ff6b3d',
    background: '#272829',
    darkBackground: '#080514',
  }
};

export default config; 