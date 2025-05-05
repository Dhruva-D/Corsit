import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import QRImage from '../../assets/QR.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    usn: '',
    year: '',
    utr_number: '',
    payment_status: 'Unpaid',
    payNow: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    setPaymentScreenshot(e.target.files[0]);
    // Clear error for payment screenshot when user uploads a file
    if (errors.payment_screenshot) {
      setErrors({ ...errors, payment_screenshot: '' });
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

    // Payment validation if "Pay Now" is selected
    if (formData.payNow) {
      if (!formData.utr_number.trim()) {
        newErrors.utr_number = 'UTR number is required';
        isValid = false;
      }
      
      if (!paymentScreenshot) {
        newErrors.payment_screenshot = 'Payment screenshot is required';
        isValid = false;
      }
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
        // Create form data for file upload
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('email', formData.email);
        submitData.append('phone', formData.phone);
        submitData.append('usn', formData.usn);
        submitData.append('year', formData.year);
        submitData.append('payment_status', formData.payNow ? 'Paid' : 'Unpaid');
        
        if (formData.payNow) {
          submitData.append('utr_number', formData.utr_number);
          submitData.append('payment_screenshot', paymentScreenshot);
        }

        const response = await axios.post('http://localhost:5000/workshop-register', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setSuccessMessage(response.data.message || 'Registration successful!');
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          usn: '',
          year: '',
          utr_number: '',
          payment_status: 'Unpaid',
          payNow: false,
        });
        setPaymentScreenshot(null);
      } catch (error) {
        setErrors({
          submit: error.response?.data?.message || 'Registration failed. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Check if register button should be enabled
  const isRegisterButtonEnabled = !formData.payNow || (formData.utr_number && paymentScreenshot);

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

          {/* Payment Toggle Switch */}
          <div className="flex items-center mt-6">
            <label htmlFor="payNow" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="payNow"
                  name="payNow"
                  checked={formData.payNow}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`block w-14 h-8 rounded-full ${formData.payNow ? 'bg-[#ed5a2d]' : 'bg-gray-600'} transition-colors duration-300`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${formData.payNow ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-gray-300 font-medium">
                Proceed to Payment Now?
              </div>
            </label>
          </div>

          {/* Payment Section (conditional) */}
          {formData.payNow && (
            <div className="mt-6 p-5 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-xl font-semibold text-[#ed5a2d] mb-4">Payment Details</h3>
              
              <div className="flex flex-col md:flex-row gap-6 mb-4">
                <div className="flex-1">
                  <p className="text-gray-300 mb-4">Please scan the QR to complete the payment.</p>
                  
                  <div className="bg-white p-3 rounded-lg shadow-md inline-block mb-4">
                    <img 
                      src={QRImage} 
                      alt="Payment QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label htmlFor="utr_number" className="block text-gray-300 text-sm font-medium mb-2">
                      UTR Number
                    </label>
                    <input
                      type="text"
                      id="utr_number"
                      name="utr_number"
                      value={formData.utr_number}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                        errors.utr_number ? 'border-red-500' : 'border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                      placeholder="Enter UTR number"
                    />
                    {errors.utr_number && <p className="mt-1 text-sm text-red-500">{errors.utr_number}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="payment_screenshot" className="block text-gray-300 text-sm font-medium mb-2">
                      Upload Payment Screenshot
                    </label>
                    <input
                      type="file"
                      id="payment_screenshot"
                      name="payment_screenshot"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                        errors.payment_screenshot ? 'border-red-500' : 'border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0 file:text-sm file:font-semibold
                      file:bg-[#ed5a2d] file:text-white
                      hover:file:bg-[#d54a1d]`}
                    />
                    {errors.payment_screenshot && (
                      <p className="mt-1 text-sm text-red-500">{errors.payment_screenshot}</p>
                    )}
                    {paymentScreenshot && (
                      <p className="mt-1 text-sm text-green-500">
                        File selected: {paymentScreenshot.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading || !isRegisterButtonEnabled}
              className={`px-8 py-3 rounded-full ${
                isRegisterButtonEnabled 
                  ? 'bg-[#ed5a2d] hover:bg-[#d54a1d]' 
                  : 'bg-gray-600 cursor-not-allowed'
              } text-white font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 disabled:opacity-70 w-full sm:w-auto flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <ClipLoader size={20} color={"#ffffff"} loading={true} className="mr-2" />
                  Submitting...
                </>
              ) : formData.payNow ? (
                'Pay Now & Register'
              ) : (
                'Pay Later & Register'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
