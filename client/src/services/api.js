import axios from 'axios';
import config from '../config';

// Create an axios instance with default config
const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/api/register', userData);
    return response.data;
  },
  
  registerWithKey: async (userData) => {
    const response = await api.post('/api/signup-with-key', userData);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await api.put('/api/user/password', passwordData);
    return response.data;
  }
};

// User services
export const userService = {
  getProfile: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    // For file uploads, we need to use FormData
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(profileData).forEach(key => {
      if (key !== 'profilePhoto' && key !== 'projectPhoto' && key !== 'abstractDoc') {
        formData.append(key, profileData[key]);
      }
    });
    
    // Add files if they exist
    if (profileData.profilePhoto) {
      formData.append('profilePhoto', profileData.profilePhoto);
    }
    
    if (profileData.projectPhoto) {
      formData.append('projectPhoto', profileData.projectPhoto);
    }
    
    if (profileData.abstractDoc) {
      formData.append('abstractDoc', profileData.abstractDoc);
    }
    
    const response = await api.put('/api/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};

// Admin services
export const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },
  
  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/admin/user/${userId}`, userData);
    return response.data;
  }
};

export default {
  auth: authService,
  user: userService,
  admin: adminService
}; 