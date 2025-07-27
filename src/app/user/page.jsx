"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState("english");
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [userInputCaptcha, setUserInputCaptcha] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [accountLocked, setAccountLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const router = useRouter();
  const cardRef = useRef(null);
  const backgroundRef = useRef(null);
  const countdownRef = useRef(null);

  // Background images
  const images = [
    "https://img.easemytrip.com/emthotel-1147435/70/na/s/39609337_85.jpg",
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/7c/29/40/grand-mercure-mysuru.jpg?w=1200&h=-1&s=1",
    "https://assets.minorhotels.com/image/upload/q_auto,f_auto,c_limit,w_1045/media/minor/anantara/images/anantara-jewel-bagh-jaipur-hotel/mhg/01_hotel-teaser/anantara_jewel-bagh_jaipur_hotel_teaser_01_880x620.jpg",
    "https://www.new-delhi-hotels.com/blog/wp-content/uploads/2012/12/hotel-Claridges-New-Delhi.jpg",
    "https://img.easemytrip.com/emthotel-1147435/70/na/s/39609337_85.jpg",
    "https://www.tourmyindia.com/blog//wp-content/uploads/2022/10/Best-Five-Star-Luxury-Hotels-in-Delhi.jpg",
    "https://imkarchitects.com/images/listen-align.jpg",
    "https://media.licdn.com/dms/image/v2/D4D12AQEbXJMi0yNKIA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1721908678479?e=2147483647&v=beta&t=G0MSmf9qQn_venB1tGcItpzAktgR5wUenJHxjcPKmO8",
  ];

  // Generate CAPTCHA
  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaValue(captcha);
    setCaptchaVerified(false);
  };

  // Background rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Animation on mount
  useEffect(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(backgroundRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "sine.inOut",
    });

    generateCaptcha();
  }, []);

  // Countdown timer for locked account
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (accountLocked) {
      setAccountLocked(false);
    }

    return () => clearTimeout(countdownRef.current);
  }, [countdown, accountLocked]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Tutorial steps
  const tutorialSteps = {
    english: [
      "Let's get you logged in.",
      "First, enter your email address here.",
      "Then type your password here. Click the eye to show/hide it.",
      "Select your role from this dropdown.",
      "Finally, click the login button to continue!",
    ],
    hindi: [
      "आइए आपको लॉग इन करवाते हैं।",
      "सबसे पहले, अपना ईमेल पता यहाँ दर्ज करें।",
      "फिर अपना पासवर्ड यहाँ टाइप करें। पासवर्ड दिखाने/छिपाने के लिए आंख पर क्लिक करें।",
      "इस ड्रॉपडाउन से अपनी भूमिका चुनें।",
      "अंत में, जारी रखने के लिए लॉगिन बटन पर क्लिक करें!",
    ],
  };

  const handleLoginSuccess = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    router.push("/login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (accountLocked) {
      setError(
        language === "english"
          ? `Account locked. Please try again in ${countdown} seconds.`
          : `खाता लॉक हो गया। कृपया ${countdown} सेकंड के बाद पुनः प्रयास करें।`
      );
      return;
    }

    if (!email || !password) {
      setError(
        language === "english"
          ? "Please enter valid credentials"
          : "कृपया वैध क्रेडेंशियल्स दर्ज करें"
      );
      return;
    }

    if (!captchaVerified) {
      setError(
        language === "english"
          ? "Please verify the CAPTCHA"
          : "कृपया CAPTCHA सत्यापित करें"
      );
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() < 0.3 && loginAttempts < 2) {
        throw new Error("Invalid credentials");
      }

      handleLoginSuccess();
      setLoginAttempts(0);
    } catch (err) {
      const attemptsLeft = 2 - loginAttempts;
      setLoginAttempts(loginAttempts + 1);
      
      if (loginAttempts >= 2) {
        setAccountLocked(true);
        setCountdown(30);
        setError(
          language === "english"
            ? "Too many attempts. Account locked for 30 seconds."
            : "बहुत अधिक प्रयास। खाता 30 सेकंड के लिए लॉक हो गया।"
        );
      } else {
        setError(
          language === "english"
            ? `Invalid credentials. ${attemptsLeft} attempts left.`
            : `गलत क्रेडेंशियल्स। ${attemptsLeft} प्रयास शेष।`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyCaptcha = () => {
    if (userInputCaptcha.toLowerCase() === captchaValue.toLowerCase()) {
      setCaptchaVerified(true);
      return true;
    } else {
      setError(
        language === "english"
          ? "CAPTCHA verification failed"
          : "CAPTCHA सत्यापन विफल"
      );
      generateCaptcha();
      return false;
    }
  };

  const startTutorial = () => {
    setShowTutorial(true);
    setCurrentTutorialStep(0);
  };

  const nextTutorialStep = () => {
    if (currentTutorialStep < tutorialSteps[language].length - 1) {
      setCurrentTutorialStep(currentTutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const speakSection = (section) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const messages = {
        english: {
          header: "Please enter your credentials to access your account.",
          email: "Email field. Please enter your registered email address here.",
          password: "Password field. Enter your password here. Click the eye icon to show or hide your password.",
          role: "Role selection. Choose your role from the dropdown - Student, Teacher, or Admin.",
          login: "Login button. Click here to submit your credentials and access your account.",
          forgot: "Forgot password link. Click here if you need to reset your password."
        },
        hindi: {
          header: "कृपया अपने खाते में प्रवेश करने के लिए अपनी जानकारी दर्ज करें।",
          email: "ईमेल फील्ड। कृपया अपना पंजीकृत ईमेल पता यहाँ दर्ज करें।",
          password: "पासवर्ड फील्ड। यहां अपना पासवर्ड दर्ज करें। पासवर्ड दिखाने या छिपाने के लिए आई आइकन पर क्लिक करें।",
          role: "भूमिका चयन। ड्रॉपडाउन से अपनी भूमिका चुनें - छात्र, शिक्षक या प्रशासक।",
          login: "लॉगिन बटन। अपनी जानकारी जमा करने और अपने खाते में प्रवेश करने के लिए यहां क्लिक करें।",
          forgot: "पासवर्ड भूल गए लिंक। यदि आपको अपना पासवर्ड रीसेट करने की आवश्यकता है तो यहां क्लिक करें।"
        }
      };

      const utterance = new SpeechSynthesisUtterance(messages[language][section]);
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = language === "hindi" ? "hi-IN" : "en-US";

      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "english" ? "hindi" : "english");
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      ref={backgroundRef}
      className={`d-flex align-items-center justify-content-center min-vh-100 position-relative overflow-hidden ${darkMode ? 'dark-mode' : ''}`}
      style={{
        backgroundImage: `url(${images[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1.5s ease-in-out",
      }}
    >
      {/* Celebration confetti effect */}
      {showCelebration && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="confetti"
              initial={{ y: -10, x: Math.random() * 20 - 10, opacity: 1 }}
              animate={{
                y: [0, 500],
                x: [0, Math.random() * 200 - 100],
                opacity: [1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random(),
                ease: "linear",
              }}
              style={{
                position: "absolute",
                width: 10 + Math.random() * 10,
                height: 10 + Math.random() * 10,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                top: 0,
                left: `${50 + (Math.random() * 50 - 25)}%`,
                zIndex: 1000,
              }}
            />
          ))}
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{language === "english" ? "Terms and Conditions" : "नियम और शर्तें"}</h3>
            <div className="modal-body">
              {language === "english" ? (
                <p>
                  By using this service, you agree to our terms of service and privacy policy. 
                  We collect necessary information to provide you with a personalized experience. 
                  Your data is securely stored and never shared with third parties without your consent.
                </p>
              ) : (
                <p>
                  इस सेवा का उपयोग करके, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत होते हैं।
                  हम आपको एक व्यक्तिगत अनुभव प्रदान करने के लिए आवश्यक जानकारी एकत्र करते हैं।
                  आपका डेटा सुरक्षित रूप से संग्रहीत किया जाता है और आपकी सहमति के बिना कभी भी तीसरे पक्ष के साथ साझा नहीं किया जाता है।
                </p>
              )}
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowTermsModal(false)}
            >
              {language === "english" ? "I Understand" : "मैं समझ गया"}
            </button>
          </div>
        </div>
      )}

      <motion.div
        ref={cardRef}
        className={`card p-4 shadow-lg rounded position-relative glass-morphism-enhanced ${darkMode ? 'dark-card' : ''}`}
        style={{ maxWidth: "450px", width: "90%", backdropFilter: "blur(10px)" }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Tutorial overlay */}
        {showTutorial && (
          <div className="tutorial-overlay">
            <div className="tutorial-content">
              <p>{tutorialSteps[language][currentTutorialStep]}</p>
              <button
                onClick={nextTutorialStep}
                className="btn btn-primary mt-3"
              >
                {currentTutorialStep < tutorialSteps[language].length - 1
                  ? (language === "english" ? "Next" : "अगला")
                  : (language === "english" ? "Got it!" : "समझ गया!")}
              </button>
            </div>
          </div>
        )}

        <div className="card-body">
          {/* Top Controls */}
          <div className="d-flex justify-content-end mb-3">
            <button
              onClick={toggleDarkMode}
              className="btn btn-sm btn-outline-secondary"
              aria-label={language === "english" ? "Toggle dark mode" : "डार्क मोड बदलें"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Header Section */}
          <div className="position-relative mb-4 text-center">
            <div className="d-flex justify-content-center align-items-center">
              <button
                onClick={() => {
                  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }}
                className={`btn btn-sm btn-danger ${!isSpeaking ? 'invisible' : ''}`}
                aria-label={language === "english" ? "Stop Speaking" : "बोलना बंद करें"}
              >
                <span className="speaking-animation">🔴</span> {language === "english" ? "Stop" : "रोकें"}
              </button>
            </div>
            <motion.p
              className="text-muted mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {language === "english"
                ? "Please login to continue your learning journey"
                : "अपनी सीखने की यात्रा जारी रखने के लिए कृपया लॉगिन करें"}
            </motion.p>
            <button
              className="speak-section-btn"
              onClick={() => speakSection("header")}
              aria-label={language === "english" ? "Speak instructions" : "निर्देश सुनें"}
            >
              🔊
            </button>
          </div>

          {error && (
            <motion.div
              className="alert alert-danger text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <motion.div
              className="mb-4 floating-label position-relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control floating-input"
                required
                placeholder=" "
                aria-label={language === "english" ? "Email" : "ईमेल"}
              />
              <label className="floating-label-text">
                {language === "english" ? "📧 Email Address" : "📧 ईमेल पता"}
              </label>
              <button
                className="speak-section-btn"
                onClick={() => speakSection("email")}
                aria-label={language === "english" ? "Speak email instructions" : "ईमेल निर्देश सुनें"}
              >
                🔊
              </button>
            </motion.div>

            {/* Password Field */}
            <motion.div
              className="mb-4 floating-label position-relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control floating-input"
                  required
                  placeholder=" "
                  aria-label={language === "english" ? "Password" : "पासवर्ड"}
                />
                <label className="floating-label-text">
                  {language === "english" ? "🔒 Password" : "🔒 पासवर्ड"}
                </label>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                  aria-label={language === "english" ? "Toggle password visibility" : "पासवर्ड दृश्यता बदलें"}
                >
                  {showPassword ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ type: "spring" }}
                    >
                      🙈
                    </motion.span>
                  ) : (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ type: "spring" }}
                    >
                      👁️
                    </motion.span>
                  )}
                </button>
              </div>
              <button
                className="speak-section-btn"
                onClick={() => speakSection("password")}
                aria-label={language === "english" ? "Speak password instructions" : "पासवर्ड निर्देश सुनें"}
              >
                🔊
              </button>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              className="mb-4 position-relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="form-label">
                {language === "english" ? "👤 Select Your Role" : "👤 अपनी भूमिका चुनें"}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select role-select"
                aria-label={language === "english" ? "Select role" : "भूमिका चुनें"}
              >
                <option value="student">
                  {language === "english" ? "🎓 Student" : "🎓 छात्र"}
                </option>
                <option value="teacher">
                  {language === "english" ? "👨‍🏫 Teacher" : "👨‍🏫 शिक्षक"}
                </option>
                <option value="admin">
                  {language === "english" ? "🏢 Admin" : "🏢 प्रशासक"}
                </option>
              </select>
              <button
                className="speak-section-btn"
                onClick={() => speakSection("role")}
                aria-label={language === "english" ? "Speak role instructions" : "भूमिका निर्देश सुनें"}
              >
                🔊
              </button>
            </motion.div>

            {/* CAPTCHA Verification */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="d-flex align-items-center mb-2">
                <label className="form-label me-2 mb-0">
                  {language === "english" ? "🔢 CAPTCHA:" : "🔢 कैप्चा:"}
                </label>
                <div className="captcha-display bg-light p-2 rounded flex-grow-1 text-center fw-bold">
                  {captchaValue}
                </div>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={generateCaptcha}
                  aria-label={language === "english" ? "Refresh CAPTCHA" : "कैप्चा रिफ्रेश करें"}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  value={userInputCaptcha}
                  onChange={(e) => setUserInputCaptcha(e.target.value)}
                  className="form-control"
                  placeholder={language === "english" ? "Enter CAPTCHA" : "कैप्चा दर्ज करें"}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={verifyCaptcha}
                >
                  {language === "english" ? "Verify" : "सत्यापित करें"}
                </button>
              </div>
              {captchaVerified && (
                <div className="text-success mt-1">
                  <i className="bi bi-check-circle-fill me-1"></i>
                  {language === "english" ? "CAPTCHA verified" : "कैप्चा सत्यापित"}
                </div>
              )}
            </motion.div>

           









            {/* Remember Me & Forgot Password */}
            <motion.div
              className="d-flex justify-content-between mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  {language === "english" ? "Remember me" : "मुझे याद रखें"}
                </label>
              </div>
              <Link
                href="/forget"
                className="text-primary text-decoration-none"
                onMouseEnter={(e) => e.target.classList.add("text-decoration-underline")}
                onMouseLeave={(e) => e.target.classList.remove("text-decoration-underline")}
              >
                {language === "english" ? "Forgot Password?" : "पासवर्ड भूल गए?"}
              </Link>
            </motion.div>

            {/* Login Button */}
            <motion.div
              className="position-relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                type="submit"
                className="btn btn-primary w-100 btn-gradient animated-border py-3"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 5px 15px rgba(0, 0, 255, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || accountLocked}
                aria-label={language === "english" ? "Login button" : "लॉगिन बटन"}
              >
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">
                        {language === "english" ? "Loading..." : "लोड हो रहा है..."}
                      </span>
                    </div>
                    {language === "english" ? "Logging in..." : "लॉगिन हो रहा है..."}
                  </div>
                ) : accountLocked ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="me-2">
                      {language === "english" ? `🔒 Locked (${countdown}s)` : `🔒 लॉक (${countdown}s)`}
                    </span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="me-2">
                      {language === "english" ? "🚀 Login" : "🚀 लॉग इन"}
                    </span>
                  </div>
                )}
              </motion.button>
              <button
                className="speak-section-btn"
                onClick={() => speakSection("login")}
                aria-label={language === "english" ? "Speak login instructions" : "लॉगिन निर्देश सुनें"}
              >
                🔊
              </button>
            </motion.div>
          </form>

          {/* Sign Up Link */}
          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="mb-0">
              {language === "english"
                ? "Don't have an account? "
                : "खाता नहीं है? "}
              <Link
                href="/signup-now"
                className="text-primary fw-bold text-decoration-none"
                onMouseEnter={(e) => e.target.classList.add("text-decoration-underline")}
                onMouseLeave={(e) => e.target.classList.remove("text-decoration-underline")}
              >
                {language === "english" ? "Sign up now" : "अभी साइन अप करें"}
              </Link>
            </p>
          </motion.div>

          {/* Bottom Controls */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <button
              onClick={() => setShowTermsModal(true)}
              className="btn btn-sm btn-link text-muted"
            >
              {language === "english" ? "Terms & Conditions" : "नियम और शर्तें"}
            </button>
            
            <div className="d-flex">
              <button
                onClick={startTutorial}
                className="btn btn-sm btn-outline-info me-2"
                aria-label={language === "english" ? "Show tutorial" : "ट्यूटोरियल दिखाएं"}
              >
                {language === "english" ? "❓ Help" : "❓ सहायता"}
              </button>
              <button
                onClick={toggleLanguage}
                className="btn btn-sm btn-outline-primary"
                aria-label={`Switch to ${language === "english" ? "Hindi" : "English"}`}
              >
                {language === "english" ? "हिंदी" : "English"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .glass-morphism-enhanced {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
        }
        
        .dark-mode {
          filter: brightness(0.8);
        }
        
        .dark-card {
          background: rgba(30, 30, 30, 0.8) !important;
          color: white;
        }
        
        .dark-card .text-muted {
          color: #aaa !important;
        }
        
        .dark-card .form-control, 
        .dark-card .form-select,
        .dark-card .captcha-display {
          background-color: rgba(50, 50, 50, 0.8);
          color: white;
          border-color: #444;
        }
        
        .dark-card .form-control:focus, 
        .dark-card .form-select:focus {
          background-color: rgba(70, 70, 70, 0.8);
          color: white;
          border-color: #666;
          box-shadow: 0 0 0 0.25rem rgba(100, 100, 100, 0.25);
        }
        
        .text-gradient {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
        }
        
        .btn-gradient {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          border: none;
          color: white;
          font-weight: 600;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }
        
        .btn-gradient:after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 200%;
          height: 200%;
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(30deg);
          transition: all 0.3s;
        }
        
        .btn-gradient:hover:after {
          left: 100%;
        }
        
        .animated-border {
          position: relative;
        }
        
        .animated-border:before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          z-index: -1;
          background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
          background-size: 400%;
          border-radius: inherit;
          opacity: 0;
          transition: 0.5s;
        }
        
        .animated-border:hover:before {
          opacity: 1;
          animation: animate-border 8s linear infinite;
        }
        
        @keyframes animate-border {
          0% { background-position: 0 0; }
          50% { background-position: 300% 0; }
          100% { background-position: 0 0; }
        }
        
        .floating-label {
          position: relative;
        }
        
        .floating-input {
          padding-top: 1.5rem;
          padding-bottom: 0.5rem;
        }
        
        .floating-label-text {
          position: absolute;
          top: 0;
          left: 0;
          padding: 0.375rem 0.75rem;
          margin: 0.5rem 0;
          color: #6c757d;
          transition: all 0.2s;
          pointer-events: none;
        }
        
        .dark-card .floating-label-text {
          color: #aaa;
        }
        
        .floating-input:focus + .floating-label-text,
        .floating-input:not(:placeholder-shown) + .floating-label-text {
          transform: translateY(-0.5rem) translateX(0.5rem);
          font-size: 0.75rem;
          color: #6a11cb;
          background: white;
          padding: 0 0.5rem;
          border-radius: 0.25rem;
        }
        
        .dark-card .floating-input:focus + .floating-label-text,
        .dark-card .floating-input:not(:placeholder-shown) + .floating-label-text {
          color: #9d4edd;
          background: #333;
        }
        
        .role-select {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #ced4da;
          transition: all 0.3s;
        }
        
        .role-select:focus {
          border-color: #6a11cb;
          box-shadow: 0 0 0 0.25rem rgba(106, 17, 203, 0.25);
        }
        
        .speak-section-btn {
          position: absolute;
          right: 0;
          top: 0;
          background: rgba(255, 255, 255, 0.7);
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6a11cb;
          font-size: 0.8rem;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.2s ease;
          padding: 0;
        }
        
        .dark-card .speak-section-btn {
          background: rgba(50, 50, 50, 0.7);
          color: #9d4edd;
        }
        
        .speak-section-btn:hover {
          opacity: 1;
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.9);
        }
        
        .speaking-animation {
          display: inline-block;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .tutorial-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
        }
        
        .tutorial-content {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          max-width: 80%;
          text-align: center;
        }
        
        .dark-card .tutorial-content {
          background: #333;
          color: white;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .dark-mode .modal-content {
          background: #333;
          color: white;
        }
        
        .modal-body {
          margin: 1rem 0;
          padding: 1rem 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }
        
        .dark-mode .modal-body {
          border-color: #555;
        }
      `}</style>
    </div>
  );
}