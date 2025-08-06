import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './HeaderProfile';
import { LoadingButton, LoadingOverlay } from '../common/LoadingSpinner';
import axios from 'axios';
import config from '../../config';
import { DESIGNATION_OPTIONS } from '../../config/designations';

// Add custom styles for the select dropdown
const selectStyles = `
  select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;
  }
  select option {
    background-color: #1f2937 !important;
    color: #e5e7eb !important;
    padding: 12px !important;
  }
  select option:hover,
  select option:focus,
  select option:active,
  select option:checked {
    background-color: #374151 !important;
    color: #e5e7eb !important;
  }
  select::-ms-expand {
    display: none;
  }
  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #e5e7eb;
  }
`;

const EditProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    designations: [], // Changed to array
    linkedin: '',
    github: '',
    instagram: '',
    phone: '',
    profilePhoto: '',
    projectPhoto: '',
    projectDescription: '',
    abstractDoc: '',
    projectTitle: ''
  });

  const [preview, setPreview] = useState({ profilePhoto: '', projectPhoto: '' });
  const [loading, setLoading] = useState(false);
  const [uploadState, setUploadState] = useState({
    profilePhoto: { loading: false, progress: 0, status: null, fileName: '' },
    projectPhoto: { loading: false, progress: 0, status: null, fileName: '' },
    abstractDoc: { loading: false, progress: 0, status: null, fileName: '' },
  });

  const [showUploadOverlay, setShowUploadOverlay] = useState(false);

  // Use centralized designations configuration
  const designations = DESIGNATION_OPTIONS;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/profile`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        
        const userData = response.data;
        
        // Handle designations array
        let userDesignations = ['Member']; // Default fallback
        if (userData.designations && Array.isArray(userData.designations)) {
          userDesignations = userData.designations;
        }

        setUserData({
          ...userData,
          designations: userDesignations
        });
        setPreview({
          profilePhoto: userData.profilePhoto || '',
          projectPhoto: userData.projectPhoto || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return <div className="text-gray-200 text-center py-20 bg-gray-900">Loading...</div>;
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle designation changes (for multi-select)
  const handleDesignationChange = (designation) => {
    const currentDesignations = userData.designations || [];
    const isSelected = currentDesignations.includes(designation);
    
    let newDesignations;
    if (isSelected) {
      // Remove designation (but ensure at least one remains)
      newDesignations = currentDesignations.filter(d => d !== designation);
      if (newDesignations.length === 0) {
        newDesignations = ['Member']; // Fallback to Member if all removed
      }
    } else {
      // Add designation (max 5 designations)
      if (currentDesignations.length < 5) {
        newDesignations = [...currentDesignations, designation];
      } else {
        alert('You can select maximum 5 designations');
        return;
      }
    }
    
    setUserData({ ...userData, designations: newDesignations });
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadState(prev => ({
      ...prev,
      [type]: { loading: true, progress: 0, status: null, fileName: file.name }
    }));

    setShowUploadOverlay(true);

    // File type validation
    const validImageTypes = ['image/jpeg', 'image/png', 'image/avif', 'image/svg+xml'];
    const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    // Common validations
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadState(prev => ({
        ...prev,
        [type]: { loading: false, progress: 0, status: { type: 'error', message: 'File size should not exceed 5MB' }, fileName: file.name }
      }));
      return;
    }

    // Type-specific validations
    if (type === 'profilePhoto' || type === 'projectPhoto') {
      if (!validImageTypes.includes(file.type)) {
        setUploadState(prev => ({
          ...prev,
          [type]: { loading: false, progress: 0, status: { type: 'error', message: 'Please upload a valid image (JPEG, PNG, AVIF, SVG)' }, fileName: file.name }
        }));
        return;
      }
    } else if (type === 'abstractDoc') {
      if (!validDocTypes.includes(file.type)) {
        setUploadState(prev => ({
          ...prev,
          [type]: { loading: false, progress: 0, status: { type: 'error', message: 'Please upload a valid document (PDF, DOC, DOCX)' }, fileName: file.name }
        }));
        return;
      }
    }



    const formData = new FormData();
    const fieldName = type === 'abstractDoc' ? 'document' : 'image';
    formData.append(fieldName, file);

    try {
      let endpoint = '';
      if (type === 'profilePhoto') endpoint = '/api/upload/profile';
      else if (type === 'projectPhoto') endpoint = '/api/upload/project';
      else if (type === 'abstractDoc') endpoint = '/api/upload/abstract';

      const response = await axios.post(`${config.apiBaseUrl}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('token')
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadState(prev => ({ ...prev, [type]: { ...prev[type], progress: progress } }));
        },
        timeout: 30000 // 30 seconds timeout
      });

      if (!response.data || !response.data.imageUrl) {
        throw new Error(response.data?.message || 'Upload failed: No image URL returned');
      }

      // Update both preview and userData with the new URL
      const newUrl = response.data.imageUrl;
      setPreview(prev => ({ ...prev, [type]: newUrl }));
      setUserData(prev => ({ 
        ...prev, 
        [type]: newUrl 
      }));
      
      setUploadState(prev => ({
        ...prev,
        [type]: { ...prev[type], loading: false, status: { type: 'success', message: 'Upload successful!' } }
      }));

      setShowUploadOverlay(false);

      setTimeout(() => {
        setUploadState(prev => ({ ...prev, [type]: { ...prev[type], status: null, fileName: file.name } }));
      }, 3000);
      
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      const errorMessage = error.response?.data?.message || error.message || `Failed to upload. Please try again.`;
      setUploadState(prev => ({
        ...prev,
        [type]: { ...prev[type], loading: false, status: { type: 'error', message: errorMessage } }
      }));

      setShowUploadOverlay(false);

      setTimeout(() => {
        setUploadState(prev => ({ ...prev, [type]: { ...prev[type], status: null } }));
      }, 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isUploading = Object.values(uploadState).some(state => state.loading);
    if (isUploading) {
      alert('Please wait for the file uploads to complete.');
      return;
    }

    setLoading(true);

    try {
      // Ensure we have the latest state values and handle empty strings properly
      const updateData = {
        name: userData.name || '',
        designations: userData.designations || ['Member'],
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        instagram: userData.instagram || '',
        phone: userData.phone || '',
        projectTitle: userData.projectTitle || '',
        projectDescription: userData.projectDescription || '',
        profilePhoto: userData.profilePhoto || '',
        projectPhoto: userData.projectPhoto || '',
        abstractDoc: userData.abstractDoc || ''
      };

      const response = await axios.post(`${config.apiBaseUrl}/edit-profile`, updateData, {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      
      // Clear the session storage cache to force fresh data load
      sessionStorage.removeItem('userData');
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{selectStyles}</style>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-200 py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md">
            <div className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#ed5a2d]">Edit Profile</h1>
              <form onSubmit={handleSubmit} className="space-y-6">


              {/* Profile Photo Section */}
              <div className="w-full">
                <div className="mb-2">
                  <label className="block text-lg font-medium text-gray-300 mb-1">Profile Photo</label>
                  <p className="text-xs text-gray-400">Accepted formats: JPG, PNG, SVG (Max 5MB)</p>
                </div>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <div className="relative">
                      <input
                        type="file"
                        id="profilePhoto"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.avif,.svg"
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                        disabled={uploadState.profilePhoto.loading || loading}
                      />
                      <label
                        htmlFor="profilePhoto"
                        className={`w-full text-left cursor-pointer px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition ${(uploadState.profilePhoto.loading || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}>
                        {uploadState.profilePhoto.fileName || 'Choose a file...'}
                      </label>
                      {uploadState.profilePhoto.loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                        </div>
                      )}
                    </div>
                    {uploadState.profilePhoto.progress > 0 && (
                      <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadState.profilePhoto.progress}%` }}></div>
                      </div>
                    )}
                    {uploadState.profilePhoto.status && uploadState.profilePhoto.status.message && (
                      <p className={`mt-2 text-sm ${uploadState.profilePhoto.status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                        {uploadState.profilePhoto.status.message}
                      </p>
                    )}
                  </div>
                  <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg ${uploadState.profilePhoto.loading ? 'animate-pulse' : ''}`}>
                    <img
                      src={preview.profilePhoto || config.defaultProfileImage}
                      alt="Profile Preview"
                      className={`w-full h-full object-cover transition-all duration-300 ${uploadState.profilePhoto.loading ? 'opacity-50' : 'opacity-100'}`}
                      onError={(e) => {
                        console.log("Profile preview image failed to load, using default");
                        e.target.src = config.defaultProfileImage;
                        e.target.onerror = null; // Prevents infinite loop
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Project Photo Section */}
              <div className="w-full">
                <div className="mb-2">
                  <label className="block text-lg font-medium text-gray-300 mb-1">Project Photo</label>
                  <p className="text-xs text-gray-400">Accepted formats: JPG, PNG, SVG (Max 5MB)</p>
                </div>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <div className="relative">
                      <input
                        type="file"
                        id="projectPhoto"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.avif,.svg"
                        onChange={(e) => handleFileChange(e, 'projectPhoto')}
                        disabled={uploadState.projectPhoto.loading || loading}
                      />
                      <label
                        htmlFor="projectPhoto"
                        className={`w-full text-left cursor-pointer px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition ${(uploadState.projectPhoto.loading || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}>
                        {uploadState.projectPhoto.fileName || 'Choose a file...'}
                      </label>
                      {uploadState.projectPhoto.loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                        </div>
                      )}
                    </div>
                    {uploadState.projectPhoto.progress > 0 && (
                      <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadState.projectPhoto.progress}%` }}></div>
                      </div>
                    )}
                    {uploadState.projectPhoto.status && uploadState.projectPhoto.status.message && (
                      <p className={`mt-2 text-sm ${uploadState.projectPhoto.status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                        {uploadState.projectPhoto.status.message}
                      </p>
                    )}
                  </div>
                  <div className={`relative w-48 h-32 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg ${uploadState.projectPhoto.loading ? 'animate-pulse' : ''}`}>
                    <img
                      src={preview.projectPhoto || config.defaultProjectImage}
                      alt="Project Preview"
                      className={`w-full h-full object-cover transition-all duration-300 ${uploadState.projectPhoto.loading ? 'opacity-50' : 'opacity-100'}`}
                      onError={(e) => {
                        console.log("Project preview image failed to load, using default");
                        e.target.src = config.defaultProjectImage;
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Abstract Document Upload */}
              <div className="w-full">
                <div className="mb-2">
                  <label className="block text-lg font-medium text-gray-300 mb-1">Abstract Document</label>
                  <p className="text-xs text-gray-400">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <div className="relative">
                      <input
                        type="file"
                        id="abstractDoc"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, 'abstractDoc')}
                        disabled={uploadState.abstractDoc.loading || loading}
                      />
                      <label
                        htmlFor="abstractDoc"
                        className={`w-full text-left cursor-pointer px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition ${(uploadState.abstractDoc.loading || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}>
                        {uploadState.abstractDoc.fileName || 'Choose a file...'}
                      </label>
                      {uploadState.abstractDoc.loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                        </div>
                      )}
                    </div>
                    {uploadState.abstractDoc.progress > 0 && (
                      <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadState.abstractDoc.progress}%` }}></div>
                      </div>
                    )}
                    {uploadState.abstractDoc.status && uploadState.abstractDoc.status.message && (
                      <p className={`mt-2 text-sm ${uploadState.abstractDoc.status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                        {uploadState.abstractDoc.status.message}
                      </p>
                    )}
                  </div>
                  <div className={`relative w-48 h-32 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg bg-gray-800 flex items-center justify-center ${uploadState.abstractDoc.loading ? 'opacity-50' : ''}`}>
                    <div className="text-center p-4">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-400">
                        {userData.abstractDoc ? 'Document Uploaded' : 'No Document'}
                      </p>
                    </div>
                    {uploadState.abstractDoc.loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                      </div>
                    )}
                    {userData.abstractDoc && !uploadState.abstractDoc.loading && (
                      <div className="absolute bottom-0 left-0 right-0 bg-green-600 bg-opacity-90 text-white text-xs text-center py-1">
                        Document Ready
                      </div>
                    )}
                  </div>
                </div>
                {userData.abstractDoc && (
                  <p className="mt-2 text-sm text-green-400 text-center">
                    Document uploaded successfully: {userData.abstractDoc.split('/').pop().substring(0, 20)}...
                  </p>
                )}
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    disabled={loading || Object.values(uploadState).some(state => state.loading)}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">
                    Designations
                    <span className="text-sm text-gray-400 ml-2">
                      (Select 1-5 designations)
                    </span>
                  </label>
                  <div className="border rounded-xl border-gray-600/50 bg-gray-700/30 backdrop-blur-sm p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {designations.map((designation, index) => {
                        const isSelected = userData.designations?.includes(designation);
                        return (
                          <label
                            key={index}
                            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                              isSelected 
                                ? 'bg-gradient-to-r from-[#ed5a2d]/20 to-[#ff6b3d]/20 border-2 border-[#ed5a2d] text-white shadow-lg shadow-[#ed5a2d]/20' 
                                : 'bg-gray-800/50 border-2 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'
                            } ${(loading || Object.values(uploadState).some(state => state.loading)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleDesignationChange(designation)}
                              disabled={loading || Object.values(uploadState).some(state => state.loading)}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-lg border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-[#ed5a2d] to-[#ff6b3d] border-[#ed5a2d] shadow-md' 
                                : 'border-gray-500 hover:border-gray-400'
                            }`}>
                              {isSelected && (
                                <svg className="w-4 h-4 text-white font-bold" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm font-semibold tracking-wide">{designation}</span>
                          </label>
                        );
                      })}
                    </div>
                    {userData.designations && userData.designations.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600/50 backdrop-blur-sm">
                        <p className="text-sm text-gray-400 mb-3 font-medium">Selected designations:</p>
                        <div className="flex flex-wrap gap-2">
                          {userData.designations.map((designation, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold tracking-wide 
                                       bg-gradient-to-r from-[#ed5a2d] to-[#ff6b3d] text-white 
                                       shadow-md hover:shadow-lg transition-all duration-200 
                                       border border-[#ed5a2d]/30 backdrop-blur-sm group"
                            >
                              {designation}
                              <button
                                type="button"
                                onClick={() => handleDesignationChange(designation)}
                                disabled={loading || Object.values(uploadState).some(state => state.loading)}
                                className="ml-2 w-4 h-4 rounded-full bg-white/20 text-white hover:bg-white/30 
                                         transition-all duration-200 flex items-center justify-center text-xs font-bold
                                         group-hover:scale-110"
                                title="Remove designation"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={userData.linkedin}
                    onChange={handleChange}
                    disabled={loading || Object.values(uploadState).some(state => state.loading)}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={userData.github}
                    onChange={handleChange}
                    disabled={loading || Object.values(uploadState).some(state => state.loading)}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={userData.instagram}
                    onChange={handleChange}
                    disabled={loading || Object.values(uploadState).some(state => state.loading)}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    disabled={loading || Object.values(uploadState).some(state => state.loading)}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xl font-medium mb-3 text-gray-300">Project Title</label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={userData.projectTitle}
                    onChange={handleChange}
                    disabled={loading || Object.values(uploadState).some(state => state.loading)}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xl font-medium mb-3 text-gray-300">Project Description</label>
                  <textarea
                    name="projectDescription"
                    value={userData.projectDescription}
                    onChange={handleChange}
                    rows="4"
                    disabled={loading || Object.values(uploadState).some(state => state.loading)}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                  ></textarea>
                </div>
              </div>

                <div className="pt-4 border-t border-gray-700 mt-8">
                <LoadingButton
                  type="submit"
                  loading={loading}
                  disabled={Object.values(uploadState).some(state => state.loading)}
                  loadingText="Saving your changes..."
                  size="lg"
                  className="w-full"
                >
                  Save Changes
                </LoadingButton>
              </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Upload Overlay */}
        <LoadingOverlay 
          show={showUploadOverlay} 
          text="Uploading your file..." 
        />
      </div>
    </>
  );
};

export default EditProfile;
