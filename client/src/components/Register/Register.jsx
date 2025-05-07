import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import QRImage from '../../assets/QR.jpg';
import config from '../../config';

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
    payment_screenshot: '',
    
    // Fields for additional team members
    member2_name: '',
    member2_email: '',
    member2_phone: '',
    member2_usn: '',
    member2_year: '',
    
    member3_name: '',
    member3_email: '',
    member3_phone: '',
    member3_usn: '',
    member3_year: '',
    
    member4_name: '',
    member4_email: '',
    member4_phone: '',
    member4_usn: '',
    member4_year: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // State to track which additional members are shown
  const [showMember2, setShowMember2] = useState(false);
  const [showMember3, setShowMember3] = useState(false);
  const [showMember4, setShowMember4] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'phone') {
      // Only allow digits for phone field
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData({ ...formData, [name]: limitedDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set local file reference for validation
    setPaymentScreenshot(file);
    // Create preview URL
    setPreviewUrl(URL.createObjectURL(file));

    // Clear error for payment screenshot when user uploads a file
    if (errors.payment_screenshot) {
      setErrors({ ...errors, payment_screenshot: '' });
    }

    // Upload to Cloudinary immediately
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      setIsLoading(true);
      const response = await axios.post(
        `${config.apiBaseUrl}/api/upload/payment`, 
        uploadFormData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Store the Cloudinary URL
      setFormData({ ...formData, payment_screenshot: response.data.imageUrl });
    } catch (error) {
      console.error('Error uploading payment screenshot:', error);
      setErrors({
        ...errors,
        payment_screenshot: 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsLoading(false);
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
    
    // Validate member 2 fields if shown
    if (showMember2) {
      if (!formData.member2_name.trim()) {
        newErrors.member2_name = 'Name is required';
        isValid = false;
      }
      
      if (!formData.member2_email.trim()) {
        newErrors.member2_email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.member2_email)) {
        newErrors.member2_email = 'Email is invalid';
        isValid = false;
      }
      
      if (!formData.member2_phone.trim()) {
        newErrors.member2_phone = 'Phone is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.member2_phone)) {
        newErrors.member2_phone = 'Phone should be 10 digits';
        isValid = false;
      }
      
      if (!formData.member2_usn.trim()) {
        newErrors.member2_usn = 'USN is required';
        isValid = false;
      }
      
      if (!formData.member2_year.trim()) {
        newErrors.member2_year = 'Year is required';
        isValid = false;
      }
    }
    
    // Validate member 3 fields if shown
    if (showMember3) {
      if (!formData.member3_name.trim()) {
        newErrors.member3_name = 'Name is required';
        isValid = false;
      }
      
      if (!formData.member3_email.trim()) {
        newErrors.member3_email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.member3_email)) {
        newErrors.member3_email = 'Email is invalid';
        isValid = false;
      }
      
      if (!formData.member3_phone.trim()) {
        newErrors.member3_phone = 'Phone is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.member3_phone)) {
        newErrors.member3_phone = 'Phone should be 10 digits';
        isValid = false;
      }
      
      if (!formData.member3_usn.trim()) {
        newErrors.member3_usn = 'USN is required';
        isValid = false;
      }
      
      if (!formData.member3_year.trim()) {
        newErrors.member3_year = 'Year is required';
        isValid = false;
      }
    }
    
    // Validate member 4 fields if shown
    if (showMember4) {
      if (!formData.member4_name.trim()) {
        newErrors.member4_name = 'Name is required';
        isValid = false;
      }
      
      if (!formData.member4_email.trim()) {
        newErrors.member4_email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.member4_email)) {
        newErrors.member4_email = 'Email is invalid';
        isValid = false;
      }
      
      if (!formData.member4_phone.trim()) {
        newErrors.member4_phone = 'Phone is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.member4_phone)) {
        newErrors.member4_phone = 'Phone should be 10 digits';
        isValid = false;
      }
      
      if (!formData.member4_usn.trim()) {
        newErrors.member4_usn = 'USN is required';
        isValid = false;
      }
      
      if (!formData.member4_year.trim()) {
        newErrors.member4_year = 'Year is required';
        isValid = false;
      }
    }

    // Payment validation if "Pay Now" is selected
    if (formData.payNow) {
      if (!formData.utr_number.trim()) {
        newErrors.utr_number = 'UTR number is required';
        isValid = false;
      }
      
      if (!formData.payment_screenshot) {
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
        // Calculate members count
        let members_count = 1; // Always include the main registrant
        if (showMember2) members_count++;
        if (showMember3) members_count++;
        if (showMember4) members_count++;
        
        // We already have the Cloudinary URL, no need to upload the file again
        const submitData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          usn: formData.usn,
          year: formData.year,
          payment_status: formData.payNow ? 'Paid' : 'Unpaid',
          utr_number: formData.payNow ? formData.utr_number : '',
          payment_screenshot: formData.payNow ? formData.payment_screenshot : '',
          
          // Include team member data if they're displayed
          member2_name: showMember2 ? formData.member2_name : '',
          member2_email: showMember2 ? formData.member2_email : '',
          member2_phone: showMember2 ? formData.member2_phone : '',
          member2_usn: showMember2 ? formData.member2_usn : '',
          member2_year: showMember2 ? formData.member2_year : '',
          
          member3_name: showMember3 ? formData.member3_name : '',
          member3_email: showMember3 ? formData.member3_email : '',
          member3_phone: showMember3 ? formData.member3_phone : '',
          member3_usn: showMember3 ? formData.member3_usn : '',
          member3_year: showMember3 ? formData.member3_year : '',
          
          member4_name: showMember4 ? formData.member4_name : '',
          member4_email: showMember4 ? formData.member4_email : '',
          member4_phone: showMember4 ? formData.member4_phone : '',
          member4_usn: showMember4 ? formData.member4_usn : '',
          member4_year: showMember4 ? formData.member4_year : ''
        };

        const response = await axios.post(`${config.apiBaseUrl}/workshop-register`, submitData);
        
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
          payment_screenshot: '',
          
          // Reset team member fields
          member2_name: '',
          member2_email: '',
          member2_phone: '',
          member2_usn: '',
          member2_year: '',
          
          member3_name: '',
          member3_email: '',
          member3_phone: '',
          member3_usn: '',
          member3_year: '',
          
          member4_name: '',
          member4_email: '',
          member4_phone: '',
          member4_usn: '',
          member4_year: ''
        });
        
        // Reset team member visibility
        setShowMember2(false);
        setShowMember3(false);
        setShowMember4(false);
        
        setPaymentScreenshot(null);
        setPreviewUrl('');
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
  const isRegisterButtonEnabled = !formData.payNow || (formData.utr_number && formData.payment_screenshot);

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
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              maxLength="10"
              inputMode="numeric"
              className={`w-full px-4 py-3 rounded-md bg-gray-700 text-gray-200 border ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              placeholder="10-digit phone number"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            <p className="mt-1 text-xs text-gray-400">Enter a 10-digit number without spaces or special characters</p>
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
          
          {/* Team registration heading */}
          <div className="mt-8 mb-4">
            <h3 className="text-xl font-semibold text-[#ed5a2d] mb-2">Team Registration</h3>
            <p className="text-gray-300 mb-4">You can register with up to 4 team members in total.</p>
            
            {/* Member 1 completed - show add 2nd member button */}
            {!showMember2 && (
              <button
                type="button"
                onClick={() => setShowMember2(true)}
                className="w-full mt-2 py-2 px-4 bg-[#ed5a2d] hover:bg-[#d54a1d] text-white rounded-md transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Add 2nd Team Member
              </button>
            )}
          </div>

          {/* Member 2 Fields */}
          {showMember2 && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Team Member 2</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="member2_name" className="block text-gray-300 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="member2_name"
                    name="member2_name"
                    value={formData.member2_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member2_name ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="Enter member's name"
                  />
                  {errors.member2_name && <p className="mt-1 text-sm text-red-500">{errors.member2_name}</p>}
                </div>
                
                <div>
                  <label htmlFor="member2_email" className="block text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="member2_email"
                    name="member2_email"
                    value={formData.member2_email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member2_email ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="Enter member's email"
                  />
                  {errors.member2_email && <p className="mt-1 text-sm text-red-500">{errors.member2_email}</p>}
                </div>
                
                <div>
                  <label htmlFor="member2_phone" className="block text-gray-300 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="member2_phone"
                    name="member2_phone"
                    value={formData.member2_phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    inputMode="numeric"
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member2_phone ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="10-digit phone number"
                  />
                  {errors.member2_phone && <p className="mt-1 text-sm text-red-500">{errors.member2_phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="member2_usn" className="block text-gray-300 text-sm font-medium mb-2">
                    USN
                  </label>
                  <input
                    type="text"
                    id="member2_usn"
                    name="member2_usn"
                    value={formData.member2_usn}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member2_usn ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="Enter member's USN"
                  />
                  {errors.member2_usn && <p className="mt-1 text-sm text-red-500">{errors.member2_usn}</p>}
                </div>
                
                <div>
                  <label htmlFor="member2_year" className="block text-gray-300 text-sm font-medium mb-2">
                    Year
                  </label>
                  <select
                    id="member2_year"
                    name="member2_year"
                    value={formData.member2_year}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member2_year ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  {errors.member2_year && <p className="mt-1 text-sm text-red-500">{errors.member2_year}</p>}
                </div>
                
                <div className="pt-2">
                  {!showMember3 && (
                    <button
                      type="button"
                      onClick={() => setShowMember3(true)}
                      className="w-full py-2 px-4 bg-[#ed5a2d] hover:bg-[#d54a1d] text-white rounded-md transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Add 3rd Team Member
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Member 3 Fields */}
          {showMember3 && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Team Member 3</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="member3_name" className="block text-gray-300 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="member3_name"
                    name="member3_name"
                    value={formData.member3_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member3_name ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="Enter member's name"
                  />
                  {errors.member3_name && <p className="mt-1 text-sm text-red-500">{errors.member3_name}</p>}
                </div>
                
                <div>
                  <label htmlFor="member3_email" className="block text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="member3_email"
                    name="member3_email"
                    value={formData.member3_email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member3_email ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="Enter member's email"
                  />
                  {errors.member3_email && <p className="mt-1 text-sm text-red-500">{errors.member3_email}</p>}
                </div>
                
                <div>
                  <label htmlFor="member3_phone" className="block text-gray-300 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="member3_phone"
                    name="member3_phone"
                    value={formData.member3_phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    inputMode="numeric"
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member3_phone ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="10-digit phone number"
                  />
                  {errors.member3_phone && <p className="mt-1 text-sm text-red-500">{errors.member3_phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="member3_usn" className="block text-gray-300 text-sm font-medium mb-2">
                    USN
                  </label>
                  <input
                    type="text"
                    id="member3_usn"
                    name="member3_usn"
                    value={formData.member3_usn}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member3_usn ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="Enter member's USN"
                  />
                  {errors.member3_usn && <p className="mt-1 text-sm text-red-500">{errors.member3_usn}</p>}
                </div>
                
                <div>
                  <label htmlFor="member3_year" className="block text-gray-300 text-sm font-medium mb-2">
                    Year
                  </label>
                  <select
                    id="member3_year"
                    name="member3_year"
                    value={formData.member3_year}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member3_year ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  {errors.member3_year && <p className="mt-1 text-sm text-red-500">{errors.member3_year}</p>}
                </div>
                
                <div className="pt-2">
                  {!showMember4 && (
                    <button
                      type="button"
                      onClick={() => setShowMember4(true)}
                      className="w-full py-2 px-4 bg-[#ed5a2d] hover:bg-[#d54a1d] text-white rounded-md transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Add 4th Team Member
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Member 4 Fields */}
          {showMember4 && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Team Member 4</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="member4_name" className="block text-gray-300 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="member4_name"
                    name="member4_name"
                    value={formData.member4_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member4_name ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="Enter member's name"
                  />
                  {errors.member4_name && <p className="mt-1 text-sm text-red-500">{errors.member4_name}</p>}
                </div>
                
                <div>
                  <label htmlFor="member4_email" className="block text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="member4_email"
                    name="member4_email"
                    value={formData.member4_email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member4_email ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="Enter member's email"
                  />
                  {errors.member4_email && <p className="mt-1 text-sm text-red-500">{errors.member4_email}</p>}
                </div>
                
                <div>
                  <label htmlFor="member4_phone" className="block text-gray-300 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="member4_phone"
                    name="member4_phone"
                    value={formData.member4_phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    inputMode="numeric"
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member4_phone ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="10-digit phone number"
                  />
                  {errors.member4_phone && <p className="mt-1 text-sm text-red-500">{errors.member4_phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="member4_usn" className="block text-gray-300 text-sm font-medium mb-2">
                    USN
                  </label>
                  <input
                    type="text"
                    id="member4_usn"
                    name="member4_usn"
                    value={formData.member4_usn}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member4_usn ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    placeholder="Enter member's USN"
                  />
                  {errors.member4_usn && <p className="mt-1 text-sm text-red-500">{errors.member4_usn}</p>}
                </div>
                
                <div>
                  <label htmlFor="member4_year" className="block text-gray-300 text-sm font-medium mb-2">
                    Year
                  </label>
                  <select
                    id="member4_year"
                    name="member4_year"
                    value={formData.member4_year}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-md bg-gray-800 text-gray-200 border ${
                      errors.member4_year ? 'border-red-500' : 'border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  {errors.member4_year && <p className="mt-1 text-sm text-red-500">{errors.member4_year}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Payment section - Conditionally displayed */}
          <div className="mt-6">
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

            {formData.payNow && (
              <div className="mt-4 p-5 bg-gray-700 rounded-lg border border-gray-600 space-y-6">
                <div className="flex flex-col items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#ed5a2d] mb-4">Payment Details</h3>
                  <div className="p-4 bg-white rounded-md w-56 h-56 flex items-center justify-center mb-3">
                    <img src={QRImage} alt="Payment QR Code" className="max-w-full max-h-full" />
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="text-lg font-semibold text-gray-200 mb-1">Component Price: ₹1,600/-</p>
                    <p className="text-sm text-gray-400">Please transfer the above amount to proceed with registration</p>
                  </div>
                  
                  <p className="text-xs text-gray-400 text-center">
                    Please save a screenshot of your payment for verification
                  </p>
                </div>

                <div>
                  <label htmlFor="utr_number" className="block text-gray-300 text-sm font-medium mb-2">
                    UTR Number / Transaction ID
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
                    placeholder="Enter transaction reference number"
                  />
                  {errors.utr_number && (
                    <p className="mt-1 text-sm text-red-500">{errors.utr_number}</p>
                  )}
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
                    disabled={isLoading}
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
                  
                  {isLoading && (
                    <div className="mt-2 flex items-center">
                      <ClipLoader size={16} color="#ed5a2d" />
                      <span className="ml-2 text-sm text-gray-400">Uploading image...</span>
                    </div>
                  )}
                  
                  {previewUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-green-500">
                        Payment screenshot uploaded successfully
                      </p>
                      <div className="mt-2 w-full max-h-40 overflow-hidden rounded-md border border-gray-600">
                        <img src={previewUrl} alt="Payment screenshot preview" className="w-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading || !isRegisterButtonEnabled}
              className={`w-full py-3 px-6 rounded-md text-white font-semibold transition-all ${
                isLoading || !isRegisterButtonEnabled
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#ed5a2d] hover:bg-[#d54a1d] active:transform active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ClipLoader size={18} color="#ffffff" />
                  <span className="ml-2">Registering...</span>
                </div>
              ) : (
                'Register for Workshop'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;