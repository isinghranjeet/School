"use client"; // Add this line at the top

import { useState, useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

// Reusable Components
const CategoryCard = ({ category, activeCategory, quizInProgress, onClick, link }) => (
  <motion.div
    className="col-lg-3 col-md-6 mb-4"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div
      className={`card bg-light text-dark shadow-sm border-0 ${quizInProgress ? "opacity-50" : ""}`}
      onClick={onClick}
      style={{
        cursor: quizInProgress ? "not-allowed" : "pointer",
        border: activeCategory === category ? "2px solid #0d6efd" : "none",
      }}
      aria-disabled={quizInProgress}
    >
      <div className="card-body text-center">
        <h5 className="card-title">{category}</h5>
        {link ? (
          <Link href={link} passHref>
            <button className="btn btn-primary btn-gradient" disabled={quizInProgress}>
              Start {category} Exam
            </button>
          </Link>
        ) : (
          <button className="btn btn-primary btn-gradient" disabled={quizInProgress}>
            Start {category} Quiz
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

const QuestionCard = ({ question, userAnswers, submitted, handleAnswer, hintsUsed, useHint }) => {
  const [listening, setListening] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Function to speak the question and options
  const speakQuestion = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = `${question.question}. Options: ${question.options.join(", ")}`;
    window.speechSynthesis.speak(speech);
  };

  // Function to listen to the user's spoken answer
  const listenToAnswer = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const spokenAnswer = event.results[0][0].transcript.trim().toLowerCase();
      setListening(false);

      // Match the spoken answer with the options
      const matchedOption = question.options.find(
        (option) => option.toLowerCase() === spokenAnswer
      );

      if (matchedOption) {
        setSelectedOption(matchedOption);
      } else {
        alert("No matching option found. Please try again.");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      alert("Error recognizing speech. Please try again.");
    };
  };

  // Function to confirm the selected answer
  const confirmAnswer = () => {
    if (selectedOption) {
      handleAnswer(question.id, selectedOption);
      setSelectedOption(null); // Reset selected option
    } else {
      alert("Please select an option before marking the answer.");
    }
  };

  return (
    <motion.div
      className="col-lg-8 mb-4 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card p-4 bg-white text-dark shadow-sm border-0">
        <h5 className="mb-4">{question.question}</h5>
        {question.options.map((option, index) => (
          <div key={option} className="form-check mb-3">
            <input
              type="radio"
              className="form-check-input"
              name={`q-${question.id}`}
              value={option}
              disabled={submitted}
              onChange={() => setSelectedOption(option)}
              checked={selectedOption === option}
              aria-label={`Option: ${option}`}
            />
            <label className="form-check-label">
              <strong>{String.fromCharCode(65 + index)}.</strong> {option}
            </label>
          </div>
        ))}
        {submitted && (
          question.answer === userAnswers[question.id] ? (
            <p className="text-success">✔ Correct</p>
          ) : (
            <p className="text-danger">✖ Incorrect (Answer: {question.answer})</p>
          )
        )}
        <div className="d-flex gap-2 mt-4">
          <button
            className="btn btn-sm btn-info btn-gradient"
            onClick={() => useHint(question.id)}
            disabled={hintsUsed[question.id]}
          >
            Use Hint
          </button>
          <button
            className="btn btn-sm btn-secondary btn-gradient"
            onClick={speakQuestion}
            disabled={submitted}
          >
            Speak Question
          </button>
          <button
            className="btn btn-sm btn-warning btn-gradient"
            onClick={listenToAnswer}
            disabled={submitted || listening}
          >
            {listening ? "Listening..." : "Speak Answer"}
          </button>
          <button
            className="btn btn-sm btn-success btn-gradient"
            onClick={confirmAnswer}
            disabled={submitted || !selectedOption}
          >
            Mark Answer
          </button>
        </div>
        {hintsUsed[question.id] && <p className="text-muted mt-2">Hint: {hintsUsed[question.id]} is incorrect.</p>}
      </div>
    </motion.div>
  );
};

const ReviewSection = ({ questions, userAnswers, score, resetQuiz }) => {
  return (
    <div className="review-section">
      <h2 className="text-center mb-4">Quiz Review</h2>
      <div className="row">
        {questions.map((question, index) => (
          <div key={question.id} className="col-lg-8 mb-4 mx-auto">
            <div className="card p-4 bg-white text-dark shadow-sm border-0">
              <h5 className="mb-4">{question.question}</h5>
              {question.options.map((option, idx) => (
                <div key={option} className="form-check mb-3">
                  <input
                    type="radio"
                    className="form-check-input"
                    name={`q-${question.id}`}
                    value={option}
                    disabled
                    checked={userAnswers[question.id] === option}
                    aria-label={`Option: ${option}`}
                  />
                  <label className="form-check-label">
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
                  </label>
                </div>
              ))}
              {question.answer === userAnswers[question.id] ? (
                <p className="text-success">✔ Correct</p>
              ) : (
                <p className="text-danger">✖ Incorrect (Correct Answer: {question.answer})</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <h3 className="text-gradient">Your Score: {score}</h3>
        <button className="btn btn-warning btn-gradient mt-3" onClick={resetQuiz}>
          Back to Quiz
        </button>
      </div>
    </div>
  );
};

export default function OnlineExam() {
  const [categories, setCategories] = useState(["Math", "Science", "History", "English", "Coding"]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [biometricAuthenticated, setBiometricAuthenticated] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("");
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30); // 30 seconds per question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [hintsUsed, setHintsUsed] = useState({});
  const [usedQuestionIds, setUsedQuestionIds] = useState([]); // Track used question IDs
  const [isFacialRecognitionLoading, setIsFacialRecognitionLoading] = useState(false); // Loading state for facial recognition
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0); // Track current question index in review mode

  // Timer for 10 minutes
  useEffect(() => {
    if (timeLeft > 0 && !submitted && activeCategory) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit(); // Automatically submit when time is up
    }
  }, [timeLeft, submitted, activeCategory]);

  useEffect(() => {
    if (questionTimeLeft > 0 && !submitted && activeCategory) {
      const timer = setTimeout(() => setQuestionTimeLeft(questionTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questionTimeLeft === 0) {
      handleAnswer(questions[currentQuestionIndex]?.id, "");
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTimeLeft(30);
    }
  }, [questionTimeLeft, submitted, activeCategory]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((error) => {
        console.error("Failed to enter fullscreen mode:", error);
        alert("Failed to enter fullscreen mode. Please allow permissions.");
      });
    } else if (elem.mozRequestFullScreen) { // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
      elem.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      alert("You have switched tabs. Please return to the quiz.");
      handleSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        alert("Please return to fullscreen mode to continue the quiz.");
        enterFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const fetchQuestions = (category) => {
    if (activeCategory === category || quizInProgress) return;

    if (activeCategory) {
      resetQuiz();
    }

    setLoading(true);
    setActiveCategory(category);
    setQuizInProgress(true);

    // Enter fullscreen mode
    enterFullscreen();

    setTimeout(() => {
      const questionsData = {
        Math: [
          { id: uuidv4(), question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
          { id: uuidv4(), question: "What is 5 * 3?", options: ["15", "10", "20", "25"], answer: "15" },
          { id: uuidv4(), question: "What is 9 / 3?", options: ["1", "2", "3", "4"], answer: "3" },
          { id: uuidv4(), question: "What is 7 - 2?", options: ["3", "4", "5", "6"], answer: "5" },
          { id: uuidv4(), question: "What is 6 + 7?", options: ["11", "12", "13", "14"], answer: "13" },
          { id: uuidv4(), question: "What is 8 * 2?", options: ["14", "16", "18", "20"], answer: "16" },
        ],
        Science: [
          { id: uuidv4(), question: "What planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
          { id: uuidv4(), question: "What is H2O?", options: ["Hydrogen", "Oxygen", "Water", "Helium"], answer: "Water" },
          { id: uuidv4(), question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], answer: "Carbon Dioxide" },
          { id: uuidv4(), question: "What force keeps us on the ground?", options: ["Magnetism", "Gravity", "Friction", "Inertia"], answer: "Gravity" },
          { id: uuidv4(), question: "What is the boiling point of water?", options: ["50°C", "100°C", "150°C", "200°C"], answer: "100°C" },
          { id: uuidv4(), question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Fe", "Cu"], answer: "Au" },
        ],
        History: [
          { id: uuidv4(), question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"], answer: "George Washington" },
          { id: uuidv4(), question: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: "1945" },
          { id: uuidv4(), question: "Who wrote the Declaration of Independence?", options: ["Benjamin Franklin", "Thomas Jefferson", "John Adams", "James Madison"], answer: "Thomas Jefferson" },
          { id: uuidv4(), question: "Which ancient civilization built the pyramids?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], answer: "Egyptians" },
          { id: uuidv4(), question: "What year did the American Civil War start?", options: ["1859", "1861", "1863", "1865"], answer: "1861" },
          { id: uuidv4(), question: "Who discovered America?", options: ["Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan", "James Cook"], answer: "Christopher Columbus" },
        ],
        English: [
          { id: uuidv4(), question: "What is the antonym of 'happy'?", options: ["Sad", "Angry", "Excited", "Bored"], answer: "Sad" },
          { id: uuidv4(), question: "Which is a noun?", options: ["Run", "Jump", "House", "Quickly"], answer: "House" },
          { id: uuidv4(), question: "What is the plural of 'mouse'?", options: ["Mouses", "Mice", "Mousees", "Mousies"], answer: "Mice" },
          { id: uuidv4(), question: "Which word is an adjective?", options: ["Dog", "Beautiful", "Run", "Speak"], answer: "Beautiful" },
          { id: uuidv4(), question: "Which word is a verb?", options: ["Quickly", "Table", "Jump", "Soft"], answer: "Jump" },
          { id: uuidv4(), question: "What is the past tense of 'run'?", options: ["Ran", "Running", "Runs", "Runned"], answer: "Ran" },
        ],
      };

      const categoryQuestions = questionsData[category] || [];
      setQuestions(categoryQuestions);
      setUsedQuestionIds([]); // Reset used question IDs
      setLoading(false);
    }, 1000);
  };

  const handleAnswer = (questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTimeLeft(30);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) {
        newScore += 10;
      }
    });
    setScore(newScore);
    setSubmitted(true);
    setQuizInProgress(false);
    setReviewMode(true); // Enable review mode
    if (newScore === questions.length * 10) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    // Do not exit fullscreen mode on submit
  };

  const resetQuiz = () => {
    setQuestions([]);
    setUserAnswers({});
    setSubmitted(false);
    setTimeLeft(600);
    setScore(0);
    setShowConfetti(false);
    setActiveCategory("");
    setQuizInProgress(false);
    setCurrentQuestionIndex(0);
    setQuestionTimeLeft(30);
    setReviewMode(false);
    setHintsUsed({});
    setUsedQuestionIds([]); // Reset used question IDs
    setReviewQuestionIndex(0); // Reset review question index

    // Exit fullscreen mode
    exitFullscreen();
  };

  const startCamera = async () => {
    if (!window.isSecureContext) {
      alert("Camera access requires a secure context (HTTPS).");
      throw new Error("Insecure context");
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraStatus("Camera started. Please look into the camera.");
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraStatus("Failed to access camera. Please allow camera permissions.");
      throw error;
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setCameraStatus("");
    }
  };

  const authenticateWithCamera = async () => {
    try {
      await startCamera();
      setBiometricAuthenticated(false);
      setCameraStatus("Looking for face...");
      setIsFacialRecognitionLoading(true); // Start loading
      setTimeout(() => {
        const isAuthenticated = Math.random() > 0.5; // Simulate success/failure
        if (isAuthenticated) {
          setBiometricAuthenticated(true);
          setCameraStatus("Facial recognition successful!");
        } else {
          setCameraStatus("Facial recognition failed. Please try again.");
        }
        stopCamera();
        setIsFacialRecognitionLoading(false); // Stop loading
      }, 3000); // Simulate a 3-second delay for facial recognition
    } catch (error) {
      console.error("Facial recognition error:", error);
      setCameraStatus("Failed to access camera. Please allow permissions and try again.");
      stopCamera();
      setIsFacialRecognitionLoading(false); // Stop loading
    }
  };

  const useHint = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && !hintsUsed[questionId]) {
      const incorrectOptions = question.options.filter((opt) => opt !== question.answer);
      const randomIncorrectOption = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
      setHintsUsed((prev) => ({ ...prev, [questionId]: randomIncorrectOption }));
    }
  };

  const handlePreviousQuestion = () => {
    setReviewQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextQuestion = () => {
    setReviewQuestionIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
  };

  return (
    <>
      {showConfetti && <Confetti />}

      <nav className="navbar navbar-expand-lg navbar-dark bg-gradient-primary shadow-sm fixed-top">
        <div className="container">
          <a className="navbar-brand fw-bold text-white fs-4" href="#">Online Exam</a>
        </div>
      </nav>

      {/* Timer Display in Top-Right Corner */}
      {quizInProgress && (
        <div className="timer-display">
          <h3 className="text-muted">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</h3>
        </div>
      )}

      <div className="container mt-5 pt-5">
        {!quizInProgress && !reviewMode && (
          <>
            <h1 className="fw-bold text-center my-4 text-gradient">Online Exam</h1>
            <h3 className="text-center text-muted">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</h3>
            <h4 className="text-center text-muted">Score: {score}</h4>
          </>
        )}

        {!biometricAuthenticated && !quizInProgress && !reviewMode && (
          <div className="text-center my-4">
            <button
              className="btn btn-primary btn-gradient"
              onClick={authenticateWithCamera}
              disabled={cameraStream || isFacialRecognitionLoading}
            >
              {cameraStream ? "Authenticating..." : "Verify ID Card"}
            </button>

            {cameraStream && (
              <div className="mt-3 text-center">
                <div className="camera-preview">
                  <video
                    autoPlay
                    ref={(video) => {
                      if (video) video.srcObject = cameraStream;
                    }}
                    className="camera-video"
                  />
                  {isFacialRecognitionLoading && (
                    <div className="camera-loading">
                      <span className="spinner-border text-light"></span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-muted">{cameraStatus}</p>
                <button
                  className="btn btn-danger mt-2"
                  onClick={stopCamera}
                  aria-label="Cancel Camera"
                >
                  Cancel
                </button>
              </div>
            )}

            {cameraStatus && !cameraStream && (
              <div className="mt-3">
                <p className="text-danger">{cameraStatus}</p>
                <button
                  className="btn btn-warning"
                  onClick={authenticateWithCamera}
                  aria-label="Retry Authentication"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}

        {biometricAuthenticated && !quizInProgress && !reviewMode && (
          <div className="row mt-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                category={category}
                activeCategory={activeCategory}
                quizInProgress={quizInProgress}
                onClick={() => !quizInProgress && fetchQuestions(category)}
                link={category === "Coding" ? "/coding" : null}
              />
            ))}
          </div>
        )}

        {quizInProgress && !reviewMode && (
          <div className="row mt-4">
            {loading ? (
              <div className="text-center w-100 my-5">
                <span className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></span>
              </div>
            ) : questions.length > 0 ? (
              !submitted ? (
                <QuestionCard
                  key={questions[currentQuestionIndex].id}
                  question={questions[currentQuestionIndex]}
                  userAnswers={userAnswers}
                  submitted={submitted}
                  handleAnswer={handleAnswer}
                  hintsUsed={hintsUsed}
                  useHint={useHint}
                />
              ) : (
                <div className="col-lg-8 mb-4 mx-auto">
                  <div className="card p-4 bg-white text-dark shadow-sm border-0">
                    <h5 className="mb-4">{questions[reviewQuestionIndex].question}</h5>
                    {questions[reviewQuestionIndex].options.map((option, index) => (
                      <div key={option} className="form-check mb-3">
                        <input
                          type="radio"
                          className="form-check-input"
                          name={`q-${questions[reviewQuestionIndex].id}`}
                          value={option}
                          disabled
                          checked={userAnswers[questions[reviewQuestionIndex].id] === option}
                          aria-label={`Option: ${option}`}
                        />
                        <label className="form-check-label">
                          <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                        </label>
                      </div>
                    ))}
                    {questions[reviewQuestionIndex].answer === userAnswers[questions[reviewQuestionIndex].id] ? (
                      <p className="text-success">✔ Correct</p>
                    ) : (
                      <p className="text-danger">✖ Incorrect (Answer: {questions[reviewQuestionIndex].answer})</p>
                    )}
                    <div className="d-flex gap-2 mt-4">
                      <button
                        className="btn btn-sm btn-secondary btn-gradient"
                        onClick={handlePreviousQuestion}
                        disabled={reviewQuestionIndex === 0}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-sm btn-secondary btn-gradient"
                        onClick={handleNextQuestion}
                        disabled={reviewQuestionIndex === questions.length - 1}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <p className="text-center">No questions available.</p>
            )}
          </div>
        )}

        {reviewMode && (
          <ReviewSection
            questions={questions}
            userAnswers={userAnswers}
            score={score}
            resetQuiz={resetQuiz}
          />
        )}

        {biometricAuthenticated && !submitted && questions.length > 0 && !reviewMode && (
          <button className="btn btn-success btn-gradient w-100 my-4" onClick={handleSubmit}>
            Submit Answers
          </button>
        )}
      </div>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(45deg, #0d6efd, #6610f2);
        }
        .btn-gradient {
          background: linear-gradient(45deg, #0d6efd, #6610f2);
          border: none;
          color: white;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-gradient:hover {
          background: linear-gradient(45deg, #6610f2, #0d6efd);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .text-gradient {
          background: linear-gradient(45deg, #0d6efd, #6610f2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .camera-preview {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #0d6efd;
        }
        .camera-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .camera-loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
        }
        .timer-display {
          position: fixed;
          top: 50px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          padding: 10px 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }
      `}</style>
    </>
  );
}