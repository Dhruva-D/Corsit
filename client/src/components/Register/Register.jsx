import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    usn: '',
    year: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.usn || !formData.year) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${config.apiBaseUrl}/workshop-register`, formData);
      setSuccess(response.data.message || 'Registration successful!');
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        usn: '',
        year: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#272928]">
      <div className="w-full max-w-lg bg-[#232323] border-2 border-orange-500 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-white mb-6 text-center">Register for Workshop</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg">
            <p className="text-green-500 text-center">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 px-4 text-lg border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#272928]"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-4 text-lg border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#272928]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300">Phone No</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 px-4 text-lg border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#272928]"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300">USN</label>
            <input
              type="text"
              name="usn"
              value={formData.usn}
              onChange={handleChange}
              className="w-full h-12 px-4 text-lg border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#272928]"
              placeholder="Enter your USN"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full h-12 px-4 text-lg border border-gray-600 bg-[#272928] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-10 h-12 bg-orange-500 text-white text-lg font-semibold rounded-md cursor-pointer transition duration-300 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
