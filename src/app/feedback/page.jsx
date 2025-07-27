"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [file, setFile] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load feedback history from local storage
  useEffect(() => {
    const savedFeedback = JSON.parse(localStorage.getItem("feedbackHistory")) || [];
    setFeedbackHistory(savedFeedback);
  }, []);

  // Save feedback history to local storage
  useEffect(() => {
    localStorage.setItem("feedbackHistory", JSON.stringify(feedbackHistory));
  }, [feedbackHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call or submission process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newFeedback = {
      id: Date.now(),
      feedback,
      rating,
      category: selectedCategory,
      file: file ? file.name : null,
      timestamp: new Date().toLocaleString(),
    };

    setFeedbackHistory([...feedbackHistory, newFeedback]);
    setShowConfirmation(true);
    setFeedback("");
    setRating(0);
    setFile(null);
    setIsSubmitting(false);
  };

  const handleClearFeedback = () => {
    setFeedback("");
    setRating(0);
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  // Star Rating Component
  const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
      <div className="d-flex">
        {stars.map((star) => (
          <span
            key={star}
            style={{
              cursor: "pointer",
              fontSize: "2rem",
              color: star <= rating ? "#ffc107" : "#e4e5e9",
              transition: "color 0.2s",
            }}
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onRatingChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className={`p-4 shadow-lg rounded ${darkMode ? "dark" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        maxWidth: "800px",
        margin: "auto",
        background: darkMode ? "#1e1e1e" : "#f8f9fa",
        color: darkMode ? "#ffffff" : "#000",
        border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "15px",
      }}
    >
      <h2 className="mb-4">📝 Feedback Form</h2>

      {/* Dark Mode Toggle */}
      <button
        className="btn btn-secondary mb-4"
        onClick={handleDarkModeToggle}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <form onSubmit={handleSubmit}>
        {/* Rating System */}
        <div className="mb-3">
          <label className="form-label">Rate your experience:</label>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>

        {/* Feedback Category */}
        <div className="mb-3">
          <label className="form-label">Category:</label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="General">General</option>
            <option value="Bug">Bug</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Compliment">Compliment</option>
          </select>
        </div>

        {/* Feedback Text */}
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="5"
            placeholder="Enter your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <small className="text-muted">
            {feedback.length}/500 characters
          </small>
        </div>

        {/* File Upload */}
        <div className="mb-3">
          <label className="form-label">Attach a file (optional):</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="ms-2">Submitting...</span>
              </>
            ) : (
              "Submit Feedback"
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClearFeedback}
            disabled={isSubmitting}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Feedback History */}
      <div className="mt-4">
        <h3>Feedback History</h3>
        <ul className="list-group">
          {feedbackHistory.map((item) => (
            <li key={item.id} className="list-group-item">
              <strong>{item.timestamp}</strong> - {item.feedback} (Rating: {item.rating}/5)
              {item.file && <div className="text-muted">Attachment: {item.file}</div>}
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Feedback Submitted</h5>
                <button type="button" className="btn-close" onClick={handleConfirmationClose}></button>
              </div>
              <div className="modal-body">
                Thank you for your feedback! We appreciate your input.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleConfirmationClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Features */}
      <div className="mt-4">
        <p className="text-muted">
          Your feedback helps us improve. Please share your thoughts!
        </p>
       
          
       
      </div>
    </motion.div>
  );
};

export default FeedbackPage;