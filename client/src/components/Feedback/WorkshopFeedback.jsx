import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import axios from 'axios';
import config from '../../config';
import './WorkshopFeedback.css';

const defaultFormState = {
  name: '',
  email: '',
  workshopRating: 0,
  feedbackText: '',
  favoriteTopic: '',
  suggestions: ''
};

const WorkshopFeedback = () => {
  const [formData, setFormData] = useState({ ...defaultFormState });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingSelect = (value) => {
    setFormData((prev) => ({ ...prev, workshopRating: value }));
    if (errors.workshopRating) {
      setErrors((prev) => ({ ...prev, workshopRating: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.workshopRating === 0) {
      newErrors.workshopRating = 'Please rate the workshop';
    }
    if (!formData.feedbackText.trim()) {
      newErrors.feedbackText = 'Please provide some feedback';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axios.post(`${config.apiBaseUrl}/workshop-feedback`, formData);
      setSubmitted(true);
      setShowConfetti(true);
      setSuccessMessage('Thank you for your valuable feedback!');
      setFormData({ ...defaultFormState });
    } catch (error) {
      console.error('Feedback submission error:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to submit feedback.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="feedback-page">
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={150}
          recycle={false}
          colors={['#ed5a2d', '#ff9f1c', '#ffffff']}
        />
      )}

      <div className="feedback-container">
        {submitted ? (
          <div className="thank-you-card">
            <h2>Thank You!</h2>
            <p>{successMessage}</p>
            <p className="mt-4">Your insights help us improve our workshops.</p>
            <button 
                onClick={() => setSubmitted(false)}
                className="recruitments-button mt-6"
                style={{ background: '#ed5a2d', border: 'none', padding: '10px 20px', borderRadius: '5px', color: 'white', cursor: 'pointer' }}
            >
                Submit another response
            </button>
          </div>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <h1 className="form-title text-3xl font-bold mb-2">Workshop Feedback 🤖</h1>
            <p className="form-subtitle text-gray-400 mb-8">Tell us about your experience in the CORSIT workshop.</p>

            <div className="form-group mb-6">
              <label className="form-label">Full Name (Optional)</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleFieldChange}
              />
            </div>

            <div className="form-group mb-6">
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleFieldChange}
              />
            </div>

            <div className="form-group mb-6">
              <span className="form-label">How would you rate the workshop?</span>
              <div className="star-rating flex flex-row-reverse justify-end gap-2 mt-2">
                {[5, 4, 3, 2, 1].map((value) => (
                  <React.Fragment key={value}>
                    <input
                      type="radio"
                      id={`star-${value}`}
                      name="workshopRating"
                      value={value}
                      className="hidden"
                      checked={formData.workshopRating === value}
                      onChange={() => handleRatingSelect(value)}
                    />
                    <label 
                        htmlFor={`star-${value}`} 
                        className={`text-3xl cursor-pointer ${formData.workshopRating >= value ? 'text-[#ed5a2d]' : 'text-gray-600'} hover:text-[#ed5a2d] transition-colors`}
                    >
                      ★
                    </label>
                  </React.Fragment>
                ))}
              </div>
              {errors.workshopRating && <p className="error-text text-red-500 text-sm mt-1">{errors.workshopRating}</p>}
            </div>

            <div className="form-group mb-6">
              <label className="form-label">What was your favorite topic covered?</label>
              <input
                type="text"
                name="favoriteTopic"
                className="form-input"
                placeholder="e.g. Arduino basics, IoT, etc."
                value={formData.favoriteTopic}
                onChange={handleFieldChange}
              />
            </div>

            <div className="form-group mb-6">
              <label className="form-label">Your Feedback *</label>
              <textarea
                name="feedbackText"
                className="form-textarea w-full p-3 rounded bg-[#1a1625] border border-gray-700 focus:border-[#ed5a2d] outline-none"
                rows="4"
                placeholder="What did you think of the workshop?"
                value={formData.feedbackText}
                onChange={handleFieldChange}
              />
              {errors.feedbackText && <p className="error-text text-red-500 text-sm mt-1">{errors.feedbackText}</p>}
            </div>

            <div className="form-group mb-8">
              <label className="form-label">Any suggestions for improvement? (Optional)</label>
              <textarea
                name="suggestions"
                className="form-textarea w-full p-3 rounded bg-[#1a1625] border border-gray-700 focus:border-[#ed5a2d] outline-none"
                rows="3"
                placeholder="How can we make it better?"
                value={formData.suggestions}
                onChange={handleFieldChange}
              />
            </div>

            <button type="submit" className="submit-button w-full py-3 bg-[#ed5a2d] text-white font-bold rounded hover:bg-[#ff6b3d] transition-colors" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </button>
            {errors.submit && <p className="error-text text-red-500 text-center mt-4">{errors.submit}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default WorkshopFeedback;
