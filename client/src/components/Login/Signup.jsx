import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
import { LoadingButton } from '../common/LoadingSpinner';
import config from '../../config';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.secretKey) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${config.apiBaseUrl}/signup`, formData);
      setSuccess(response.data.message || 'Registration successful!');
      alert('Successfully registered! Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-4 mt-22">
        <div className="max-w-[550px] mx-auto mb-8 card-wrapper min-h-[1000px] w-full">
          <div className="card-content flex items-center justify-center text-lg bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-md">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center px-6 space-y-8 w-full">
              <h1 className="text-4xl font-bold mb-5 text-[#ed5a2d]">SIGN UP</h1>
              
              {error && <p className="text-red-500 text-center w-full p-3 bg-red-500/10 rounded-lg">{error}</p>}
              {success && <p className="text-green-500 text-center w-full p-3 bg-green-500/10 rounded-lg">{success}</p>}

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3 text-gray-300">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-xl bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3 text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-xl bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3 text-gray-300">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-xl bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3 text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-xl bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3 text-gray-300">Secret Key</label>
                <input
                  type="password"
                  name="secretKey"
                  placeholder="Enter the secret key"
                  value={formData.secretKey}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-5 py-3 border rounded-lg border-gray-600 text-xl bg-gray-700 outline-none transition focus:ring-2 focus:ring-[#ed5a2d] shadow-md input-focus-animation disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <LoadingButton
                type="submit"
                loading={isLoading}
                loadingText="Creating your account..."
                size="lg"
                className="w-full my-7"
              >
                Sign Up
              </LoadingButton>

              <p className="text-center text-gray-400">
                Already have an account?{' '}
                <NavLink to="/login" onClick={() => window.scrollTo(0, 0)} className="text-[#ed5a2d] hover:text-[#ff6b3d] font-bold">
                  Login here
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup; 