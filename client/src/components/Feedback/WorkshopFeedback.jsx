import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config';
import './WorkshopFeedback.css';

const defaultFormState = {
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
          colors={['#ed5a2d', '#ff9f1c', '#ffffff', '#080514']}
        />
      )}

      <div className="feedback-container">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="submitted"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="thank-you-card"
            >
              <h2>Thank You!</h2>
              <p>{successMessage}</p>
              <p className="mt-4 text-gray-400">Your insights help us improve our workshops for future batches.</p>
              <div className='flex justify-center mt-10'>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="submit-button"
                    style={{ maxWidth: '280px' }}
                >
                    Submit another response
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="feedback-form" 
              onSubmit={handleSubmit}
            >
              <h1 className="form-title">Workshop Feedback 🤖</h1>
              <p className="form-subtitle">Help us improve the CORSIT learning experience</p>

              <div className="form-group">
                <span className="form-label">How would you rate the workshop?</span>
                <div className="star-rating">
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
                          className="hover:scale-125 transition-transform"
                      >
                        ★
                      </label>
                    </React.Fragment>
                  ))}
                </div>
                {errors.workshopRating && <p className="error-text">{errors.workshopRating}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Favorite Topic Covered</label>
                <input
                  type="text"
                  name="favoriteTopic"
                  className="form-input"
                  placeholder="e.g. Arduino basics, IoT, etc."
                  value={formData.favoriteTopic}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Feedback *</label>
                <textarea
                  name="feedbackText"
                  className="form-textarea"
                  placeholder="What did you think of the workshop sessions?"
                  value={formData.feedbackText}
                  onChange={handleFieldChange}
                />
                {errors.feedbackText && <p className="error-text">{errors.feedbackText}</p>}
              </div>

              <div className="form-group mb-12">
                <label className="form-label">Suggestions for improvement</label>
                <textarea
                  name="suggestions"
                  className="form-textarea"
                  placeholder="How can we make our next workshop even better?"
                  value={formData.suggestions}
                  onChange={handleFieldChange}
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="submit-button" 
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Send Feedback'}
              </motion.button>
              {errors.submit && <p className="error-text text-center mt-4">{errors.submit}</p>}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkshopFeedback;
