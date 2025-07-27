"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [hoverEffects, setHoverEffects] = useState([]);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const router = useRouter();

  // Track time on page
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
      
      // Show motivational tooltip after 10 seconds
      if (timeOnPage === 10) {
        setTooltipContent("You're doing great! Just a few more steps to secure your account.");
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeOnPage]);

  // Add floating interactive elements based on interactions
  useEffect(() => {
    if (interactionCount > 0 && interactionCount % 3 === 0) {
      const newEffect = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        color: `rgba(${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, 0.3)`,
        size: Math.random() * 30 + 20
      };
      setHoverEffects(prev => [...prev, newEffect]);
      
      // Remove after animation
      setTimeout(() => {
        setHoverEffects(prev => prev.filter(e => e.id !== newEffect.id));
      }, 3000);
    }
  }, [interactionCount]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    setInteractionCount(prev => prev + 1);

    // Enhanced email validation with more specific feedback
    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("This doesn't look like a valid email. Please check and try again.");
      setLoading(false);
      return;
    }

    try {
      // Multi-step process with engaging animations
      setStep(2);
      setTimeout(() => {
        setInteractionCount(prev => prev + 1);
        setStep(3);
        setTimeout(() => {
          setInteractionCount(prev => prev + 1);
          setMessage("Password reset link has been sent to your email!");
          setShowConfetti(true);
          setStep(4);
          
          // Increased delay to 15 seconds before redirect
          setTimeout(() => {
            setInteractionCount(prev => prev + 1);
            router.push("/login");
          }, 15000);
        }, 2000);
      }, 2000);
    } catch (err) {
      setError("We encountered an issue. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-center mb-4 text-gradient">Reset Your Password</h2>
            <p className="text-muted text-center mb-4">
              Enter your email and we'll send you a link to reset your password
            </p>
            
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4 floating-label">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setInteractionCount(prev => prev + 0.5);
                  }}
                  className="form-control"
                  required
                  placeholder=" "
                  onFocus={() => {
                    setInteractionCount(prev => prev + 1);
                    setTooltipContent("Enter the email you used to register");
                    setShowTooltip(true);
                    setTimeout(() => setShowTooltip(false), 3000);
                  }}
                />
                <label>Email Address</label>
                <div className="form-text">We'll never share your email with anyone else.</div>
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary w-100 btn-gradient"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                onMouseEnter={() => setInteractionCount(prev => prev + 0.3)}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <motion.span 
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Send Reset Link
                  </motion.span>
                )}
              </motion.button>
            </form>

            <div className="text-center mt-4">
              <p className="mb-2">Remember your password?</p>
              <Link 
                href="/user" 
                className="text-primary fw-bold hover-underline"
                onMouseEnter={() => {
                  setInteractionCount(prev => prev + 1);
                  setTooltipContent("Great memory! Click here to login");
                  setShowTooltip(true);
                }}
                onMouseLeave={() => setShowTooltip(false)}
              >
                Back to Login
              </Link>
            </div>
          </>
        );
      case 2:
        return (
          <div className="text-center py-4">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="spinner-border text-primary mb-3"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </motion.div>
            <h3 className="mb-3">Looking up your account</h3>
            <p className="text-muted">Verifying your email address...</p>
            <div className="progress mt-4">
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                style={{ width: "35%" }}
                aria-valuenow="35" 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-4">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 6, repeat: Infinity }
              }}
              className="spinner-border text-primary mb-3"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </motion.div>
            <h3 className="mb-3">Preparing your reset link</h3>
            <p className="text-muted">Almost done...</p>
            <div className="progress mt-4">
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                style={{ width: "75%" }}
                aria-valuenow="75" 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
            <motion.p 
              className="text-muted small mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Crafting a secure link just for you...
            </motion.p>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#28a745" className="bi bi-check-circle mb-3" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            </motion.div>
            <h3 className="mb-3">Success!</h3>
            <p className="mb-4">We've sent a password reset link to your email.</p>
            <div className="progress mb-3">
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                style={{ width: "100%" }}
                aria-valuenow="100" 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
            <motion.p 
              className="text-muted small"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              chek your mail {15 - Math.floor(timeOnPage)} seconds...
            </motion.p>
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="small">While you wait, check out these security tips:</p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="security-tip"
                >
                  🔒 Use a strong password
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="security-tip"
                >
                  🔑 Enable 2FA
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="security-tip"
                >
                  🛡️ Update regularly
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="security-tip"
                >
                  📧 Beware of phishing
                </motion.div>
              </div>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 position-relative overflow-hidden">
      {/* Solid background color */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" />
      
      {/* Interactive floating elements */}
      {hoverEffects.map(effect => (
        <motion.div
          key={effect.id}
          className="position-absolute interactive-element"
          initial={{ 
            opacity: 0,
            x: `${effect.x}%`,
            y: `${effect.y}%`,
            scale: 0
          }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            y: [`${effect.y}%`, `${effect.y - 10}%`]
          }}
          transition={{ 
            duration: 3,
            ease: "easeOut"
          }}
          style={{
            width: `${effect.size}px`,
            height: `${effect.size}px`,
            background: effect.color,
            borderRadius: '50%',
            filter: 'blur(5px)',
            zIndex: 0
          }}
        />
      ))}
      
      {/* Time-based motivational tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="position-absolute tooltip-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tooltipContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <motion.div
        className="card p-4 shadow-lg rounded w-100 position-relative"
        style={{ maxWidth: "450px", backgroundColor: "white" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ 
          scale: 1.005,
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="card-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step > 1 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step < 4 ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="confetti"
              initial={{ 
                opacity: 0,
                y: -10,
                x: Math.random() * 100 - 50
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, Math.random() * 300 + 100],
                x: Math.random() * 400 - 200,
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 3,
                delay: Math.random() * 0.5,
                ease: "linear"
              }}
              style={{
                background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                position: 'absolute',
                borderRadius: Math.random() > 0.5 ? '50%' : '0'
              }}
            />
          ))}
        </div>
      )}

      <style jsx global>{`
        :root {
          --primary-gradient: linear-gradient(135deg, #6a11cb, #2575fc);
          --secondary-gradient: linear-gradient(135deg, #2575fc, #6a11cb);
        }
        
        body {
          background-color: #f8f9fa;
          overflow-x: hidden;
        }
        
        .floating-label {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .floating-label input {
          padding-top: 1.8rem;
          padding-bottom: 0.8rem;
          border: 1px solid #ced4da;
          border-radius: 8px;
        }
        
        .floating-label input:focus {
          border-color: #6a11cb;
          box-shadow: 0 0 0 0.25rem rgba(106, 17, 203, 0.25);
        }
        
        .floating-label label {
          position: absolute;
          top: 1rem;
          left: 1rem;
          transition: all 0.2s ease;
          pointer-events: none;
          color: #6c757d;
        }
        
        .floating-label input:focus ~ label,
        .floating-label input:not(:placeholder-shown) ~ label {
          top: 0.4rem;
          font-size: 0.75rem;
          color: #6a11cb;
        }
        
        .btn-gradient {
          background: var(--primary-gradient);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn-gradient:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--secondary-gradient);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .btn-gradient:hover:after {
          opacity: 1;
        }
        
        .btn-gradient span {
          position: relative;
          z-index: 1;
        }
        
        .text-gradient {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
        }
        
        .hover-underline {
          position: relative;
          display: inline-block;
        }
        
        .hover-underline:after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: currentColor;
          transition: width 0.3s ease;
        }
        
        .hover-underline:hover:after {
          width: 100%;
        }
        
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
        }
        
        .form-text {
          color: #6c757d !important;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }
        
        .security-tip {
          background: #f8f9fa;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: default;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }
        
        .tooltip-box {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 0.9rem;
          max-width: 250px;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 15px;
          z-index: 10;
        }
        
        .tooltip-box:after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
        }
      `}</style>
    </div>
  );
}