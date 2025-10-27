import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { LoadingOverlay } from '../common/LoadingSpinner';

const yearOptions = [
  '1st Year',
  '2nd Year'
];

const Recruitments25 = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    usn: '',
    branch: '',
    year: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
      return;
    }

    if (name === 'usn') {
      setFormData((prev) => ({ ...prev, usn: value.toUpperCase() }));
      if (errors.usn) setErrors((prev) => ({ ...prev, usn: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      validationErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      validationErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!formData.usn.trim()) {
      validationErrors.usn = 'USN is required';
    }

    if (!formData.branch.trim()) {
      validationErrors.branch = 'Branch is required';
    }

    if (!formData.year.trim()) {
      validationErrors.year = 'Academic year is required';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await axios.post(`${config.apiBaseUrl}/recruitments-2025`, {
        ...formData
      });

      setSuccessMessage('🎉 Application received! We will reach out for next steps.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        usn: '',
        branch: '',
        year: ''
      });
      setErrors({});

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application. Please try again.';
      setErrors((prev) => ({ ...prev, submit: message }));
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    isSubmitting ||
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.phone.trim() ||
    !formData.usn.trim() ||
  !formData.branch.trim() ||
  !formData.year.trim();

  return (
    <div className="min-h-screen bg-gray-1100 relative">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed5a2d] mb-4"></div>
            <p className="text-white text-lg">Submitting your application...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we process your application</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-32 max-w-none">
        <div className="w-full max-w-2xl mx-auto bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8 lg:p-10 border border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ed5a2d]">Corsit Recruitments 2025</h2>
           
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
                <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
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
                <label htmlFor="usn" className="block text-gray-300 text-sm font-medium mb-2">USN *</label>
                <input
                  id="usn"
                  name="usn"
                  type="text"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-gray-300 text-sm font-medium mb-2">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                      e.preventDefault();
                    }
                  }}
                  maxLength="10"
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
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">Email ID *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your SIT email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="branch" className="block text-gray-300 text-sm font-medium mb-2">Branch *</label>
                <input
                  id="branch"
                  name="branch"
                  type="text"
                  value={formData.branch}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border ${
                    errors.branch ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200`}
                  placeholder="e.g., Computer Science"
                />
                {errors.branch && <p className="mt-1 text-sm text-red-500">{errors.branch}</p>}
              </div>

              <div>
                <label htmlFor="year" className="block text-gray-300 text-sm font-medium mb-2">Academic Year *</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border ${
                    errors.year ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200`}
                >
                  <option value="">Select your academic year</option>
                  {yearOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full py-4 px-6 rounded-md text-white font-semibold text-lg transition-all duration-200 transform ${
                isSubmitDisabled
                  ? 'bg-gray-600 cursor-not-allowed opacity-60'
                  : 'bg-[#ed5a2d] hover:bg-[#d54a1d] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">* All fields are required</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recruitments25;
