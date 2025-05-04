import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    usn: '',
    year: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Simple validation - check if fields are empty
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone should be 10 digits';
      isValid = false;
    }

    if (!formData.usn.trim()) {
      newErrors.usn = 'USN is required';
      isValid = false;
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setSuccessMessage('');

      try {
        const response = await axios.post('http://localhost:5000/workshop-register', formData);
        setSuccessMessage(response.data.message || 'Registration successful!');
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          usn: '',
          year: '',
        });
      } catch (error) {
        setErrors({
          submit: error.response?.data?.message || 'Registration failed. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-30 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 shadow-xl rounded-lg p-8 sm:p-10 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#ed5a2d]">Workshop Registration</h2>
          <p className="mt-2 text-gray-300">Fill out the form below to register for the workshop</p>
        </div>

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-md">
            <p className="text-red-500 text-center">{errors.submit}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-md">
            <p className="text-green-500 text-center">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-gray-700 text-gray-200 border ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-gray-700 text-gray-200 border ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-300 text-sm font-medium mb-2">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-gray-700 text-gray-200 border ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="usn" className="block text-gray-300 text-sm font-medium mb-2">
              USN
            </label>
            <input
              type="text"
              id="usn"
              name="usn"
              value={formData.usn}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-gray-700 text-gray-200 border ${
                errors.usn ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              placeholder="Enter your USN"
            />
            {errors.usn && <p className="mt-1 text-sm text-red-500">{errors.usn}</p>}
          </div>

          <div>
            <label htmlFor="year" className="block text-gray-300 text-sm font-medium mb-2">
              Year
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-gray-700 text-gray-200 border ${
                errors.year ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-full bg-[#ed5a2d] hover:bg-[#d54a1d] text-white font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 disabled:opacity-70 w-full sm:w-auto flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <ClipLoader size={20} color={"#ffffff"} loading={true} className="mr-2" />
                  Submitting...
                </>
              ) : (
                'Register Now'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
