import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './HeaderProfile';
import axios from 'axios';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        'https://corsit-backend.onrender.com/change-password',
        { oldPassword, newPassword },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      setSuccess(response.data.message);
      alert('Password updated successfully!');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <>
      <Header />
      <div className="h-fit bg-[#080514] text-white py-40 px-52">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-[#0b001056] p-8 rounded-xl border border-[rgba(173,216,230,0.8)] shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Change Password</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <div className="flex flex-col gap-6">
            <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="input-field" required />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" required />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" required />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Update Password</button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(173,216,230,0.8);
          background: #141026;
          color: white;
          font-size: 1rem;
        }
      `}</style>
    </>
  );
};

export default ChangePassword;
