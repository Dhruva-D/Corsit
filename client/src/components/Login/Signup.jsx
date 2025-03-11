import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
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

    try {
      const response = await axios.post(`${config.apiBaseUrl}/signup`, formData);
      setSuccess(response.data.message || 'Registration successful!');
      alert('Successfully registered! Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0d0f10] text-[#f7ffff] py-12 px-4 mt-22">
        <div className="max-w-[550px] mx-auto mb-8 card-wrapper min-h-[1000px] w-full">
          <div className="card-content flex items-center justify-center text-lg bg-[rgba(217,217,217,0.1)] p-8 rounded-3xl border border-slate-400 shadow-lg backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center px-6 space-y-8 w-full">
              <h1 className="text-4xl font-bold mb-5">SIGN UP</h1>
              
              {error && <p className="text-red-500 text-center w-full p-3 bg-red-500/10 rounded-lg">{error}</p>}
              {success && <p className="text-green-500 text-center w-full p-3 bg-green-500/10 rounded-lg">{success}</p>}

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-xl focus:bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md bg-transparent"
                />
              </div>

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-xl focus:bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md bg-transparent"
                />
              </div>

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-xl focus:bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md bg-transparent"
                />
              </div>

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-xl focus:bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md bg-transparent"
                />
              </div>

              <div className="w-full">
                <label className="block text-2xl font-medium mb-3">Secret Key</label>
                <input
                  type="password"
                  name="secretKey"
                  placeholder="Enter the secret key"
                  value={formData.secretKey}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border rounded-3xl border-slate-400 text-xl focus:bg-[rgba(217,217,217,0.1)] outline-none transition shadow-md bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 my-7 py-4 border-[0.25px] border-slate-400 rounded-4xl text-xl font-semibold text-center transition text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer bg-[rgba(209,213,219,0.1)]"
              >
                Sign Up
              </button>

              <p className="text-center text-gray-300">
                Already have an account?{' '}
                <NavLink to="/login" className="text-[#ed5a2d] hover:text-[#ff6b3d] font-bold">
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