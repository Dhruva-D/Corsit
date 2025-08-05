import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './HeaderProfile';
import axios from 'axios';
import config from '../../config';

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
    designation: '',
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

  const designations = [
    "First Year", "Second Year", "Third Year", "Fourth Year",
    "Digital Lead", "Photoshop Lead", "Tech Lead",
    "Android Dev Lead", "Web Dev Lead", "Treasurer",
    "Vice-Chairman", "Chairman"
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/profile`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setUserData(response.data);
        setPreview({
          profilePhoto: response.data.profilePhoto || '',
          projectPhoto: response.data.projectPhoto || ''
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

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // File type validation
    const validImageTypes = ['image/jpeg', 'image/png', 'image/avif'];
    const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    // Common validations
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadStatus({
        type: 'error',
        message: 'File size should not exceed 5MB'
      });
      return;
    }

    // Type-specific validations
    if (type === 'profilePhoto' || type === 'projectPhoto') {
      if (!validImageTypes.includes(file.type)) {
        setUploadStatus({
          type: 'error',
          message: 'Please upload a valid image (JPEG, PNG, AVIF)'
        });
        return;
      }
    } else if (type === 'abstractDoc') {
      const fileType = file.type.toLowerCase();
      if (!validDocTypes.some(t => fileType.includes(t.split('/').pop().split('.').shift()))) {
        setUploadStatus({
          type: 'error',
          message: 'Please upload a valid document (PDF, DOC, DOCX)'
        });
        return;
      }
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      let endpoint = '';
      if (type === 'profilePhoto') endpoint = '/upload/profile';
      else if (type === 'projectPhoto') endpoint = '/upload/project';
      else if (type === 'abstractDoc') endpoint = '/upload/abstract';

      const response = await axios.post(`${config.apiBaseUrl}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(progress);
        },
        timeout: 30000 // 30 seconds timeout
      });

      if (!response.data || !response.data.imageUrl) {
        throw new Error(response.data?.message || 'Upload failed: No image URL returned');
      }

      setUserData(prev => ({
        ...prev,
        [type]: response.data.imageUrl
      }));

      // Show success message
      setUploadStatus({
        type: 'success',
        message: `${type === 'profilePhoto' ? 'Profile photo' : type === 'projectPhoto' ? 'Project photo' : 'Abstract document'} uploaded successfully!`
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadStatus(null), 3000);
      
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         `Failed to upload ${type === 'profilePhoto' ? 'profile photo' : type === 'projectPhoto' ? 'project photo' : 'abstract document'}. Please try again.`;
      
      setUploadStatus({
        type: 'error',
        message: errorMessage
      });
      
      // Clear error message after 5 seconds
      setTimeout(() => setUploadStatus(null), 5000);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // We're now sending only the form data, as images are already uploaded to Cloudinary
      const updateData = {
        name: userData.name,
        designation: userData.designation,
        linkedin: userData.linkedin,
        github: userData.github,
        instagram: userData.instagram,
        phone: userData.phone,
        projectTitle: userData.projectTitle,
        projectDescription: userData.projectDescription,
        profilePhoto: userData.profilePhoto,
        projectPhoto: userData.projectPhoto,
        abstractDoc: userData.abstractDoc
      };

      await axios.post(`${config.apiBaseUrl}/edit-profile`, updateData, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      
      // Clear the session storage cache to force fresh data load
      sessionStorage.removeItem('userData');
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{selectStyles}</style>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-200 py-29 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md">
            <div className="p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#ed5a2d]">Edit Profile</h1>
              <form onSubmit={handleSubmit} className="space-y-6">


              {/* Profile Photo Section */}
              <div className="w-full">
                <div className="mb-2">
                  <label className="block text-lg font-medium text-gray-300 mb-1">Profile Photo</label>
                  <p className="text-xs text-gray-400">Accepted formats: JPG, PNG (Max 5MB)</p>
                </div>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                  <div className="flex-1 w-full relative">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.avif"
                      onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      className={`w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 ${loading ? 'opacity-50 cursor-not-allowed' : 'file:bg-gray-600 hover:file:bg-gray-500 file:cursor-pointer'} file:text-gray-200`}
                      disabled={loading}
                      title="Upload your profile photo (JPG, PNG, AVIF, max 5MB)"
                    />
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                      </div>
                    )}
                  </div>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg">
                    <img
                      src={preview.profilePhoto || config.defaultProfileImage}
                      alt="Profile Preview"
                      className={`w-full h-full object-cover transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}
                      onError={(e) => {
                        console.log("Profile preview image failed to load, using default");
                        e.target.src = config.defaultProfileImage;
                        e.target.onerror = null; // Prevents infinite loop
                      }}
                    />
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Photo Section */}
              <div className="w-full">
                <div className="mb-2">
                  <label className="block text-lg font-medium text-gray-300 mb-1">Project Photo</label>
                  <p className="text-xs text-gray-400">Accepted formats: JPG, PNG (Max 5MB)</p>
                </div>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                  <div className="flex-1 w-full relative">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.avif"
                      onChange={(e) => handleFileChange(e, 'projectPhoto')}
                      className={`w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 ${loading ? 'opacity-50 cursor-not-allowed' : 'file:bg-gray-600 hover:file:bg-gray-500 file:cursor-pointer'} file:text-gray-200`}
                      disabled={loading}
                      title="Upload your project photo (JPG, PNG, AVIF, max 5MB)"
                    />
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                      </div>
                    )}
                  </div>
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
                    <img
                      src={preview.projectPhoto || config.defaultProjectImage}
                      alt="Project Preview"
                      className={`w-full h-full object-cover transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}
                      onError={(e) => {
                        console.log("Project preview image failed to load, using default");
                        e.target.src = config.defaultProjectImage;
                        e.target.onerror = null;
                      }}
                    />
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                      </div>
                    )}
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
                  <div className="flex-1 w-full relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'abstractDoc')}
                      className={`w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 ${loading ? 'opacity-50 cursor-not-allowed' : 'file:bg-gray-600 hover:file:bg-gray-500 file:cursor-pointer'} file:text-gray-200`}
                      disabled={loading}
                      title="Upload your abstract document (PDF, DOC, DOCX, max 5MB)"
                    />
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                      </div>
                    )}
                  </div>
                  <div className={`relative w-48 h-32 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg bg-gray-800 flex items-center justify-center ${loading ? 'opacity-50' : ''}`}>
                    <div className="text-center p-4">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-400">
                        {userData.abstractDoc ? 'Document Uploaded' : 'No Document'}
                      </p>
                    </div>
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ed5a2d]"></div>
                      </div>
                    )}
                    {userData.abstractDoc && !loading && (
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
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d]"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">Designation</label>
                  <select
                    name="designation"
                    value={userData.designation}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] appearance-none"
                  >
                    <option value="" className="bg-gray-700 text-gray-200">Select Designation</option>
                    {designations.map((designation, index) => (
                      <option
                        key={index}
                        value={designation}
                        className="bg-gray-700 text-gray-200"
                      >
                        {designation}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={userData.linkedin}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d]"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={userData.github}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d]"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={userData.instagram}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d]"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3 text-gray-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xl font-medium mb-3 text-gray-300">Project Title</label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={userData.projectTitle}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xl font-medium mb-3 text-gray-300">Project Description</label>
                  <textarea
                    name="projectDescription"
                    value={userData.projectDescription}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d]"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-[#ed5a2d] hover:bg-[#ff6b3d] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
