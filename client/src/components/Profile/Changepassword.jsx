import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './HeaderProfile';
import axios from 'axios';
import config from '../../config';

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
        `${config.apiBaseUrl}/change-password`,
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
      <div className="flex h-[100vh] flex-col items-center justify-center bg-gray-900 text-gray-200 relative">
        <div className="card-wrapper min-h-[650px] w-[90%] max-w-[600px] mt-12">
          <div className="card-content flex items-center justify-center text-lg bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center px-6 space-y-8 w-full">
              <h1 className="text-4xl font-bold mb-8 text-[#ed5a2d]">Change Password</h1>
              
              {error && <p className="text-red-500 text-center w-full p-3 mb-4 bg-red-500/10 rounded-lg text-lg">{error}</p>}
              {success && <p className="text-green-500 text-center w-full p-3 mb-4 bg-green-500/10 rounded-lg text-lg">{success}</p>}

              <div className="w-full">
                <label className="block text-xl font-medium mb-3 text-gray-300">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md"
                />
              </div>

              <div className="w-full">
                <label className="block text-xl font-medium mb-3 text-gray-300">New Password</label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md"
                />
              </div>

              <div className="w-full">
                <label className="block text-xl font-medium mb-3 text-gray-300">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-lg bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 mt-6 bg-[#ed5a2d] rounded-lg text-xl font-semibold text-center transition text-white shadow-md hover:bg-[#d54a1d] active:scale-95 cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
