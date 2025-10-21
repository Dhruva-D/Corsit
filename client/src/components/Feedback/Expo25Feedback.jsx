import React, { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import axios from 'axios';
import config from '../../config';
import './Expo25Feedback.css';

const branchOptions = [
  'CSE Artificial Intelligence & Machine Learning Engineering',
  'Biotechnology',
  'Chemical Engineering',
  'Civil Engineering',
  'Computer Science & Engineering (CSE)',
  'Artificial Intelligence & Data Science (AIDS)',
  'Electrical & Electronics Engineering',
  'Electronics & Communication Engineering (ECE)',
  'Electronics & Instrumentation Engineering',
  'Electronics & Telecommunication Engineering (ETE)',
  'Industrial Engineering & Management',
  'Information Science & Engineering (ISE)',
  'Mechanical Engineering',
  'Other'
];

const howHeardOptions = [
  'Instagram',
  'Friends / Word of Mouth',
  'College Posters',
  'CORSIT Website',
  'Watsapp Groups',
  'Other'
];

const Expo25Feedback = () => {
  const [formData, setFormData] = useState({
    branch: '',
    eventRating: 0,
    favoriteProject: '',
    suggestions: '',
    howHeard: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const initialState = useMemo(() => ({
    branch: '',
    eventRating: 0,
    favoriteProject: '',
    suggestions: '',
    howHeard: ''
  }), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

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

  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitted]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingSelect = (value) => {
    setFormData((prev) => ({ ...prev, eventRating: value }));

    if (errors.eventRating) {
      setErrors((prev) => ({ ...prev, eventRating: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.branch) {
      newErrors.branch = 'Please select your branch';
    }

    if (formData.eventRating === 0) {
      newErrors.eventRating = 'Please rate the event';
    }

    const projectName = formData.favoriteProject.trim();
    if (!projectName) {
      newErrors.favoriteProject = 'Please tell us which project you liked most';
    } else if (projectName.length < 3) {
      newErrors.favoriteProject = 'Project name must be at least 3 characters';
    }

    if (!formData.howHeard) {
      newErrors.howHeard = 'Please let us know how you heard about RoboExpo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, submit: '' }));
    setSuccessMessage('');

    try {
      await axios.post(`${config.apiBaseUrl}/expo25-feedback`, formData);

      setSubmitted(true);
      setShowConfetti(true);
      setSuccessMessage('Thank you for your feedback! Your response has been recorded successfully.');
      setFormData(initialState);
      setErrors({});
    } catch (error) {
      console.error('Feedback submission error:', error);
      setErrors((prev) => ({
        ...prev,
        submit: error.response?.data?.message || 'Failed to submit feedback. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="feedback-loading-overlay">
          <div className="feedback-loading-card">
            <div className="feedback-loading-spinner" />
            <p className="feedback-loading-text">Submitting your feedback...</p>
            <p className="feedback-loading-subtext">Hang tight while we record your thoughts.</p>
          </div>
        </div>
      )}

      <div className="feedback-page">
        {showConfetti && windowSize.width > 0 && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={180}
            recycle={false}
            gravity={0.18}
            colors={['#8b5cf6', '#ffffff', '#22d3ee']}
          />
        )}

        <div className="feedback-container">
          {errors.submit && (
            <div className="feedback-alert feedback-alert--error">
              {errors.submit}
            </div>
          )}

          {submitted ? (
            <div className="thank-you-card">
              <h2>Thank You! 🙏</h2>
              <p>{successMessage}</p>
              <p>See you next year!</p>
            </div>
          ) : (
            <form className="feedback-form" onSubmit={handleSubmit} noValidate>
            <h1 className="form-title">RoboExpo 2025 Feedback ✨</h1>
            <p className="form-subtitle">Help us shape the future of robotics at CORSIT.</p>

            <div className="form-group">
              <label htmlFor="branch" className="form-label">Which branch are you from?</label>
              <select
                id="branch"
                name="branch"
                className={`form-select ${errors.branch ? 'form-select--error' : ''}`}
                value={formData.branch}
                onChange={handleFieldChange}
                required
              >
                <option value="">Select your branch...</option>
                {branchOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.branch && <p className="error-text">{errors.branch}</p>}
            </div>

            <div className="form-group">
              <span className="form-label">How would you rate the event?</span>
              <div className="star-rating">
                {[5, 4, 3, 2, 1].map((value) => (
                  <React.Fragment key={value}>
                    <input
                      type="radio"
                      id={`star-${value}`}
                      name="eventRating"
                      value={value}
                      checked={formData.eventRating === value}
                      onChange={() => handleRatingSelect(value)}
                    />
                    <label htmlFor={`star-${value}`} aria-label={`${value} star${value > 1 ? 's' : ''}`}>
                      ★
                    </label>
                  </React.Fragment>
                ))}
              </div>
              {errors.eventRating && <p className="error-text">{errors.eventRating}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="favoriteProject" className="form-label">Which project did you like the most?</label>
              <input
                type="text"
                id="favoriteProject"
                name="favoriteProject"
                className={`form-input ${errors.favoriteProject ? 'form-input--error' : ''}`}
                placeholder="e.g., Bluetooth Controlled Robot"
                value={formData.favoriteProject}
                onChange={handleFieldChange}
                required
              />
              {errors.favoriteProject && <p className="error-text">{errors.favoriteProject}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="suggestions" className="form-label">Any suggestions for next time? <span className="form-label__optional">(Optional)</span></label>
              <textarea
                id="suggestions"
                name="suggestions"
                className="form-textarea"
                rows="4"
                placeholder="What could we improve? What did you love?"
                value={formData.suggestions}
                onChange={handleFieldChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="howHeard" className="form-label">How did you hear about RoboExpo?</label>
              <select
                id="howHeard"
                name="howHeard"
                className={`form-select ${errors.howHeard ? 'form-select--error' : ''}`}
                value={formData.howHeard}
                onChange={handleFieldChange}
                required
              >
                <option value="">Select an option...</option>
                {howHeardOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.howHeard && <p className="error-text">{errors.howHeard}</p>}
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Submitting Feedback...' : 'Submit Feedback'}
            </button>
          </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Expo25Feedback;