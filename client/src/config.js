/**
 * Global application configuration
 * Change values here to update throughout the application
 */

const config = {
  // API URLs
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://corsit-server.vercel.app' 
    : 'http://localhost:5000',
  
  // Other global configuration values can be added here
  defaultProfileImage: '/default_profile.png',
  defaultProjectImage: '/default_project.jpeg',
  
  // Theme colors
  colors: {
    primary: '#ed5a2d',
    primaryHover: '#ff6b3d',
    background: '#272829',
    darkBackground: '#080514',
  }
};

export default config; 