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
    background-color: #272829 !important;
    color: #f7ffff !important;
    padding: 12px !important;
  }
  select option:hover,
  select option:focus,
  select option:active,
  select option:checked {
    background-color: #1a1b1c !important;
    color: #f7ffff !important;
  }
  select::-ms-expand {
    display: none;
  }
  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #f7ffff;
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
          profilePhoto: response.data.profilePhoto ? `${config.apiBaseUrl}/${response.data.profilePhoto}` : '',
          projectPhoto: response.data.projectPhoto ? `${config.apiBaseUrl}/${response.data.projectPhoto}` : ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, [field]: file });
      setPreview({ ...preview, [field]: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append text fields
    formData.append('name', userData.name);
    formData.append('designation', userData.designation);
    formData.append('linkedin', userData.linkedin);
    formData.append('github', userData.github);
    formData.append('instagram', userData.instagram);
    formData.append('phone', userData.phone);
    formData.append('projectTitle', userData.projectTitle);
    formData.append('projectDescription', userData.projectDescription);

    // Append files if they exist
    if (userData.profilePhoto instanceof File) {
      formData.append('profilePhoto', userData.profilePhoto);
    }
    if (userData.projectPhoto instanceof File) {
      formData.append('projectPhoto', userData.projectPhoto);
    }
    if (userData.abstractDoc instanceof File) {
      formData.append('abstractDoc', userData.abstractDoc);
    }

    try {
      await axios.post(`${config.apiBaseUrl}/edit-profile`, formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      // Clear the session storage cache to force fresh data load
      sessionStorage.removeItem('userData');
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <>
      <style>{selectStyles}</style>
      <Header />
      <div className="min-h-screen bg-[#272829] text-[#f7ffff] py-12 px-4 mt-22">
        <div className="max-w-[750px] mx-auto mb-8 card-wrapper min-h-[2000px] md:min-h-[1500px] w-full">
          <div className="card-content flex items-center justify-center text-lg bg-[rgba(217,217,217,0.1)] p-8 rounded-3xl border border-slate-400 shadow-lg backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center px-6 space-y-8 w-full">
              <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>

              {/* Profile Photo Section */}
              <div className="w-full">
                <label className="block text-xl text-center font-medium mb-3">Profile Photo</label>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] file:mr-4 file:py-2 file:px-4 file:rounded-3xl file:border-0 file:bg-[rgba(217,217,217,0.2)] file:text-white hover:file:bg-[rgba(217,217,217,0.3)] file:cursor-pointer"
                    />
                  </div>
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-400 shadow-lg">
                    <img
                      src={preview.profilePhoto || (userData.profilePhoto ? `${config.apiBaseUrl}/${userData.profilePhoto}` : config.defaultProfileImage)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = config.defaultProfileImage)}
                    />
                  </div>
                </div>
              </div>


              {/* Project Photo Section */}
              <div className="w-full">
                <label className="block text-xl text-center font-medium mb-3">Project Photo</label>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'projectPhoto')}
                      className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] file:mr-4 file:py-2 file:px-4 file:rounded-3xl file:border-0 file:bg-[rgba(217,217,217,0.2)] file:text-white hover:file:bg-[rgba(217,217,217,0.3)] file:cursor-pointer"
                    />
                  </div>
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-400 shadow-lg">
                    <img
                      src={preview.projectPhoto || (userData.projectPhoto ? `${config.apiBaseUrl}/${userData.projectPhoto}` : config.defaultProjectImage)}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = config.defaultProjectImage)}
                    />
                  </div>
                </div>
              </div>


              {/* Text Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div>
                  <label className="block text-xl font-medium mb-3">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] focus:border-slate-300 focus:bg-[rgba(217,217,217,0.15)]"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3">Designation</label>
                  <select
                    name="designation"
                    value={userData.designation}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] focus:border-slate-300 focus:bg-[rgba(217,217,217,0.15)] appearance-none"
                  >
                    <option value="" className="bg-[#272829] text-[#f7ffff]">Select Designation</option>
                    {designations.map((designation, index) => (
                      <option
                        key={index}
                        value={designation}
                        className="bg-[#272829] text-[#f7ffff]"
                      >
                        {designation}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={userData.linkedin}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] focus:border-slate-300 focus:bg-[rgba(217,217,217,0.15)]"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3">GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={userData.github}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] focus:border-slate-300 focus:bg-[rgba(217,217,217,0.15)]"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3">Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={userData.instagram}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] focus:border-slate-300 focus:bg-[rgba(217,217,217,0.15)]"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] focus:border-slate-300 focus:bg-[rgba(217,217,217,0.15)]"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="w-full space-y-6">
                <div>
                  <label className="block text-xl font-medium mb-3">Project Title</label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={userData.projectTitle}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] focus:border-slate-300 focus:bg-[rgba(217,217,217,0.15)]"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3">Project Description</label>
                  <textarea
                    name="projectDescription"
                    value={userData.projectDescription}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] focus:border-slate-300 focus:bg-[rgba(217,217,217,0.15)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium mb-3">Abstract Document</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'abstractDoc')}
                    className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-lg bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md text-[#f7ffff] file:mr-4 file:py-2 file:px-4 file:rounded-3xl file:border-0 file:bg-[rgba(217,217,217,0.2)] file:text-white hover:file:bg-[rgba(217,217,217,0.3)] file:cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 mt-6 border border-slate-400 rounded-3xl text-xl font-semibold text-center transition text-[#f7ffff] shadow-md hover:scale-105 active:scale-95 cursor-pointer bg-[rgba(217,217,217,0.1)] hover:bg-[rgba(217,217,217,0.15)]"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
