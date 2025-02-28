import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Header from './HeaderProfile';
import axios from 'axios';

const EditProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    designation: '',
    linkedin: '',
    github: '',
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
        const response = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setUserData(response.data);
        setPreview({
          profilePhoto: response.data.profilePhoto ? `http://localhost:5000/${response.data.profilePhoto}` : '',
          projectPhoto: response.data.projectPhoto ? `http://localhost:5000/${response.data.projectPhoto}` : ''
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      setUserData({ ...userData, [name]: file });
      if (name === 'profilePhoto' || name === 'projectPhoto') {
        setPreview({ ...preview, [name]: URL.createObjectURL(file) });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    try {
      await axios.post('http://localhost:5000/edit-profile', formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <>
      <Header />
      <div className="h-fit bg-[#080514] text-white py-40 px-52">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-[#0b001056] p-8 rounded-xl border border-[rgba(173,216,230,0.8)] shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>
          <div className="flex flex-col gap-6">
            <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" className="input-field" required />
            <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" className="input-field" required disabled />
            
            <select name="designation" value={userData.designation} onChange={handleChange} className="input-field">
              <option value="" disabled>Select Designation</option>
              {designations.map((designation, index) => (
                <option key={index} value={designation}>{designation}</option>
              ))}
            </select>
            
            <input type="url" name="linkedin" value={userData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile" className="input-field" />
            <input type="url" name="github" value={userData.github} onChange={handleChange} placeholder="GitHub Profile" className="input-field" />
            
            <div className="section">
              <label className="text-lg font-semibold">Profile Photo:</label>
              <input type="file" name="profilePhoto" onChange={handleFileChange} className="input-file" />
              {preview.profilePhoto && <img src={preview.profilePhoto} alt="Profile" className="preview-image" />}
            </div>
            
            <div className="section">
              <label className="text-lg font-semibold">Project Photo:</label>
              <input type="file" name="projectPhoto" onChange={handleFileChange} className="input-file" />
              {preview.projectPhoto && <img src={preview.projectPhoto} alt="Project" className="preview-image" />}
            </div>

            <div className="section">
            <label className="text-lg font-semibold">Project Title:</label>
            <input type="text" name="projectTitle" value={userData.projectTitle} onChange={handleChange} placeholder="Project Title" className="input-field" required />
            </div>

            <div className="section">
            <label className="text-lg font-semibold">Project Description:</label>
            <textarea name="projectDescription" value={userData.projectDescription} onChange={handleChange} placeholder="Project Description" className="input-field" rows="4" />
            </div>
           
            <div className="section">
              <label className="text-lg font-semibold">Abstract Document (Only .doc format allowed):</label>
              <input type="file" name="abstractDoc" onChange={handleFileChange} className="input-file" accept=".doc,.docx" />
            </div>
            
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
          </div>
        </form>
      </div>
      <style jsx>{`
    .input-field, .input-file {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid rgba(173,216,230,0.8);
      background: #141026;
      color: white;
      font-size: 1rem;
    }
    .preview-image {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border-radius: 50%;
      margin-top: 10px;
      border: 2px solid rgba(173,216,230,0.8);
    }
    .section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `}</style>
    </>
  );
};

export default EditProfile;
