import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

const Expo25Feedback = () => {
  const [formData, setFormData] = useState({
    eventRating: 0,
    favoriteProject: '',
    suggestions: ''
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
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, eventRating: rating });
    if (errors.eventRating) {
      setErrors({ ...errors, eventRating: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Event rating validation
    if (formData.eventRating === 0) {
      newErrors.eventRating = 'Please provide an event rating';
      isValid = false;
    }

    // Favorite project validation
    if (!formData.favoriteProject.trim()) {
      newErrors.favoriteProject = 'Please mention your favorite project';
      isValid = false;
    } else if (formData.favoriteProject.trim().length < 3) {
      newErrors.favoriteProject = 'Project name must be at least 3 characters long';
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
        const response = await axios.post(`${config.apiBaseUrl}/expo25-feedback`, formData);
        
        setSuccessMessage('🎉 Thank you for your feedback! Your response has been recorded successfully.');
        
        // Reset form
        setFormData({
          eventRating: 0,
          favoriteProject: '',
          suggestions: ''
        });
        
        // Clear any previous errors
        setErrors({});
        
        // Scroll to top to show success message after a small delay
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
        
      } catch (error) {
        console.error('Feedback submission error:', error);
        setErrors({
          submit: error.response?.data?.message || 'Failed to submit feedback. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(i)}
          className={`text-3xl sm:text-4xl transition-all duration-200 hover:scale-110 ${
            i <= formData.eventRating
              ? 'text-[#ed5a2d] hover:text-[#ff6b3d]'
              : 'text-gray-400 hover:text-[#ed5a2d]'
          }`}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#272928] py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#ed5a2d] mb-4">
              Expo25 Feedback
            </h1>
            <p className="text-gray-300 text-lg">
              We'd love to hear your thoughts about the event!
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-md">
              <p className="text-red-500 text-center text-sm sm:text-base">{errors.submit}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-md">
              <p className="text-green-500 text-center text-sm sm:text-base">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Rating */}
            <div>
              <label className="block text-gray-300 text-lg font-medium mb-4 text-center">
                How would you rate the event overall? *
              </label>
              <div className="flex justify-center space-x-2 mb-2">
                {renderStars()}
              </div>
              <div className="text-center text-sm text-gray-400 mb-2">
                {formData.eventRating > 0 && (
                  <span className="text-[#ed5a2d] font-medium">
                    {formData.eventRating} out of 5 stars
                  </span>
                )}
              </div>
              {errors.eventRating && (
                <p className="text-red-500 text-sm text-center">{errors.eventRating}</p>
              )}
            </div>

            {/* Favorite Project */}
            <div>
              <label htmlFor="favoriteProject" className="block text-gray-300 text-lg font-medium mb-3">
                Which project did you like the most? *
              </label>
              <input
                type="text"
                id="favoriteProject"
                name="favoriteProject"
                value={formData.favoriteProject}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border ${
                  errors.favoriteProject ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200`}
                placeholder="Enter the name of your favorite project"
              />
              {errors.favoriteProject && (
                <p className="mt-2 text-sm text-red-500">{errors.favoriteProject}</p>
              )}
            </div>

            {/* Suggestions */}
            <div>
              <label htmlFor="suggestions" className="block text-gray-300 text-lg font-medium mb-3">
                Any suggestions for improvement? (Optional)
              </label>
              <textarea
                id="suggestions"
                name="suggestions"
                value={formData.suggestions}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 text-base rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ed5a2d] focus:border-transparent transition-all duration-200 resize-vertical"
                placeholder="Share your thoughts and suggestions..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-md text-white font-semibold text-lg transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed opacity-60'
                  : 'bg-[#ed5a2d] hover:bg-[#d54a1d] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transform'
              }`}
            >
              {isLoading ? 'Submitting Feedback...' : 'Submit Feedback'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              * Required fields
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

export default Expo25Feedback;