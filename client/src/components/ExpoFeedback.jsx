// src/components/ExpoFeedback.jsx

import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './ExpoFeedback.css';

const ExpoFeedback = () => {
  // --- State Management for Form Fields ---
  const [branch, setBranch] = useState("");
  const [rating, setRating] = useState(0);
  const [likedProject, setLikedProject] = useState("");
  const [howHeard, setHowHeard] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const branches = [
    "Select your branch...",
    "Artificial Intelligence & Machine Learning (AIML)",
    "Biotechnology",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Science & Business Systems",
    "Computer Science & Engineering (CSE)",
    "Computer Science & Engineering (Data Science)",
    "Electrical & Electronics Engineering",
    "Electronics & Communication Engineering (ECE)",
    "Electronics & Instrumentation Engineering",
    "Electronics & Telecommunication Engineering (ETE)",
    "Industrial Engineering & Management",
    "Information Science & Engineering (ISE)",
    "Mechanical Engineering",
    "Other"
  ];

  // --- The Validation and Submit Logic ---
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation Check
    if (!branch || rating === 0 || likedProject.trim() === "" || !howHeard) {
      alert("Please fill out all the required fields before submitting!");
      return;
    }

    // If validation passes, proceed
    setSubmitted(true);
    setShowConfetti(true);
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="feedback-container">
      {showConfetti && <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={150}
        recycle={false}
        gravity={0.15}
        colors={['#ed5a2d', '#FFFFFF', '#444']} // ✅ Changed purple shade to neutral grey
        onConfettiComplete={() => setShowConfetti(false)}
      />}

      {submitted ? (
        <div className="thank-you-card">
          <h2>Thank You! 🙏</h2>
          <p>Your feedback is invaluable and helps us make the next RoboExpo even better. We've received your submission.</p>
          {/* ✅ Changed "next year" text to "recruitments" */}
          <p>Hope to see you guys during recruitments!</p>
        </div>
      ) : (
        <form className="feedback-form" onSubmit={handleSubmit} noValidate>
          <h1 className="form-title">RoboExpo 2025 Feedback ✨</h1>
          <p className="form-subtitle">Help us shape the future of robotics at CORSIT.</p>

          <div className="form-group">
            <label htmlFor="branch-select" className="form-label">Which branch are you from?</label>
            <select
              id="branch-select"
              className="form-select"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            >
              <option value="">Select your branch...</option>
              {branches.slice(1).map((branchName, index) => (
                <option key={index} value={branchName}>{branchName}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">How would you rate the event?</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <React.Fragment key={starValue}>
                  <input
                    type="radio"
                    id={`star${starValue}`}
                    name="rating"
                    value={starValue}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    required
                  />
                  <label htmlFor={`star${starValue}`}>★</label>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="liked-project" className="form-label">Which project did you like the most?</label>
            <input
              type="text"
              id="liked-project"
              className="form-input"
              placeholder="e.g., Bluetooth Controlled Robot"
              value={likedProject}
              onChange={(e) => setLikedProject(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="suggestions" className="form-label">Any suggestions for next time? <span style={{color: '#888'}}>(Optional)</span></label>
            <textarea
              id="suggestions"
              className="form-textarea"
              rows="4"
              placeholder="What could we improve? What did you love?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">How did you hear about RoboExpo?</label>
            <select
              id="how-heard"
              className="form-select"
              value={howHeard}
              onChange={(e) => setHowHeard(e.target.value)}
              required
            >
              <option value="">Select an option...</option>
              <option>Instagram</option>
              <option>Friends / Word of Mouth</option>
              <option>College Posters</option>
              <option>CORSIT Website</option>
              <option>Other</option>
            </select>
          </div>

          <button type="submit" className="submit-button">Submit Feedback</button>
        </form>
      )}
    </div>
  );
};

export default ExpoFeedback;