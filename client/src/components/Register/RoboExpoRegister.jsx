import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { LoadingOverlay } from '../common/LoadingSpinner';

const RoboExpoRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    usn: '',
    branch: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow digits for phone field
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData({ ...formData, [name]: limitedDigits });
    } else if (name === 'usn') {
      // Convert USN to uppercase automatically
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
      isValid = false;
    }

    // Email validation with more comprehensive regex
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation - must be exactly 10 digits
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
      isValid = false;
    }

    // USN validation
    if (!formData.usn.trim()) {
      newErrors.usn = 'USN is required';
      isValid = false;
    } else if (formData.usn.trim().length < 3) {
      newErrors.usn = 'USN must be at least 3 characters long';
      isValid = false;
    }

    // Branch validation - required but can be any text
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch is required';
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
        const response = await axios.post(`${config.apiBaseUrl}/roboexpo-register`, formData);
        
        setSuccessMessage('🎉 Registration successful! We will contact you soon with further details.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          usn: '',
          branch: ''
        });
        
        // Clear any previous errors
        setErrors({});
        
        // Scroll to top to show success message after a small delay
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
        
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({
          submit: error.response?.data?.message || 'Registration failed. Please try again later.',
        });
        
        // Scroll to top to show error message
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
        
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-1100 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed5a2d] mb-4"></div>
            <p className="text-white text-lg">Registering for RoboExpo...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we process your registration</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-32 max-w-none">
        <div className="w-full max-w-2xl mx-auto bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8 lg:p-10 border border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ed5a2d]">RoboExpo Registration</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-300">Join us for an amazing robotics exhibition experience!</p>
          </div>

        {errors.submit && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500 rounded-md">
            <p className="text-red-500 text-center text-sm sm:text-base">{errors.submit}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-500/10 border border-green-500 rounded-md">
            <p className="text-green-500 text-center text-sm sm:text-base">{successMessage}</p>
          </div>
        )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="usn" className="block text-gray-300 text-sm font-medium mb-2">
                  USN *
                </label>
                <input
                  type="text"
                  id="usn"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border ${
                    errors.usn ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your USN"
                />
                {errors.usn && <p className="mt-1 text-sm text-red-500">{errors.usn}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-300 text-sm font-medium mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Only allow numeric characters
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
                pattern="[0-9]{10}"
                maxLength="10"
                inputMode="numeric"
                className={`w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200`}
                placeholder="10-digit phone number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              <p className="mt-1 text-xs text-gray-400">
                Enter a 10-digit number without spaces or special characters 
                {formData.phone && (
                  <span className={`ml-2 ${formData.phone.length === 10 ? 'text-green-400' : 'text-yellow-400'}`}>
                    ({formData.phone.length}/10)
                  </span>
                )}
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                Email ID *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="branch" className="block text-gray-300 text-sm font-medium mb-2">
                Branch *
              </label>
              <input
                type="text"
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border ${
                  errors.branch ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200`}
                placeholder="Enter your branch (e.g., Computer Science Engineering)"
              />
              {errors.branch && <p className="mt-1 text-sm text-red-500">{errors.branch}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.usn.trim() || !formData.branch.trim()}
              className={`w-full py-4 px-6 rounded-md text-white font-semibold text-lg transition-all duration-200 transform ${
                isLoading || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.usn.trim() || !formData.branch.trim()
                  ? 'bg-gray-600 cursor-not-allowed opacity-60'
                  : 'bg-[#ed5a2d] hover:bg-[#d54a1d] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {isLoading ? 'Registering...' : 'Register for RoboExpo'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              * All fields are required
            </p>
            
            <div className="mt-4">
              <a
                href="/"
                className="text-[#ed5a2d] hover:text-[#ff6b3d] text-sm font-medium transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoboExpoRegister;