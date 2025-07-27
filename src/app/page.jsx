 "use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "bootstrap/dist/css/bootstrap.min.css";

// Constants for better maintainability
const TUTORIAL_STEPS = {
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

const SPEECH_MESSAGES = {
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

const ROLES = [
  { value: "student", emoji: "🎓", label: { english: "Student", hindi: "छात्र" } },
  { value: "teacher", emoji: "👨‍🏫", label: { english: "Teacher", hindi: "शिक्षक" } },
  { value: "admin", emoji: "🏢", label: { english: "Admin", hindi: "प्रशासक" } }
];

const LOCKOUT_DURATION = 30; // seconds

export default function Login() {
  // State management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
    userInputCaptcha: ""
  });
  
  const [uiState, setUiState] = useState({
    error: "",
    loading: false,
    showPassword: false,
    isSpeaking: false,
    language: "english",
    showTutorial: false,
    currentTutorialStep: 0,
    showCelebration: false,
    darkMode: false,
    showTermsModal: false,
    captchaVerified: false,
    captchaValue: "",
    loginAttempts: 0,
    accountLocked: false,
    countdown: 0
  });

  const router = useRouter();
  const cardRef = useRef(null);
  const threeContainerRef = useRef(null);
  const countdownRef = useRef(null);
  const animationRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const particlesRef = useRef(null);

  // Memoized functions
  const generateCaptcha = useCallback(() => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setUiState(prev => ({ ...prev, captchaValue: captcha, captchaVerified: false }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setUiState(prev => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return { ...prev, language: prev.language === "english" ? "hindi" : "english", isSpeaking: false };
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setUiState(prev => {
      const newDarkMode = !prev.darkMode;
      if (sceneRef.current && particlesRef.current) {
        if (newDarkMode) {
          sceneRef.current.background = new THREE.Color(0x111111);
          particlesRef.current.material.color.setRGB(0.2, 0.2, 0.2);
        } else {
          sceneRef.current.background = null;
          particlesRef.current.material.color.setRGB(0.8, 0.8, 0.8);
        }
      }
      return { ...prev, darkMode: newDarkMode };
    });
  }, []);

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  // Three.js initialization
  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Renderer with better defaults
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    threeContainerRef.current.appendChild(renderer.domElement);

    // Optimized controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Efficient lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Shared materials for better performance
    const materials = {
      phong: new THREE.MeshPhongMaterial({ 
        shininess: 100,
        transparent: true,
        opacity: 0.8
      }),
      particle: new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      })
    };

    // Create floating objects with instanced geometry
    const colors = [0x3498db, 0xe74c3c, 0x2ecc71, 0xf1c40f, 0x9b59b6];
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1.2),
      new THREE.TetrahedronGeometry(1.5),
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16)
    ];

    const objects = [];
    for (let i = 0; i < 15; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const material = materials.phong.clone();
      material.color.setHex(color);
      
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 40
      );
      mesh.userData = { speed: Math.random() * 0.02 + 0.01 };
      scene.add(mesh);
      objects.push(mesh);
    }

    // Optimized particle system
    const particleCount = 800; // Reduced for better performance
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 200;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 200;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 200;

      particleColors[i3] = Math.random() * 0.2 + 0.8;
      particleColors[i3 + 1] = Math.random() * 0.2 + 0.8;
      particleColors[i3 + 2] = Math.random() * 0.2 + 0.8;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleSystem = new THREE.Points(particles, materials.particle);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // Animation loop with optimizations
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      
      // Update objects in a single loop
      objects.forEach(obj => {
        obj.rotation.x += obj.userData.speed * 0.5;
        obj.rotation.y += obj.userData.speed;
        obj.position.y += Math.sin(time + obj.position.x) * 0.01;
      });

      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.0005;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Responsive handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Generate initial CAPTCHA
    generateCaptcha();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      // Dispose of Three.js resources
      renderer.dispose();
      geometries.forEach(geo => geo.dispose());
      Object.values(materials).forEach(mat => mat.dispose());
    };
  }, [generateCaptcha]);

  // Countdown timer for locked account
  useEffect(() => {
    if (uiState.countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setUiState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    } else if (uiState.accountLocked) {
      setUiState(prev => ({ ...prev, accountLocked: false }));
    }

    return () => clearTimeout(countdownRef.current);
  }, [uiState.countdown, uiState.accountLocked]);

  const handleLoginSuccess = useCallback(() => {
    setUiState(prev => ({ ...prev, showCelebration: true }));
    setTimeout(() => setUiState(prev => ({ ...prev, showCelebration: false })), 3000);
    router.push("/login");
  }, [router]);

  const verifyCaptcha = useCallback(() => {
    if (formData.userInputCaptcha.toLowerCase() === uiState.captchaValue.toLowerCase()) {
      setUiState(prev => ({ ...prev, captchaVerified: true }));
      return true;
    } else {
      setUiState(prev => ({
        ...prev,
        error: prev.language === "english" 
          ? "CAPTCHA verification failed" 
          : "CAPTCHA सत्यापन विफल"
      }));
      generateCaptcha();
      return false;
    }
  }, [formData.userInputCaptcha, uiState.captchaValue, uiState.language, generateCaptcha]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, error: "", loading: true }));
    
    if (uiState.accountLocked) {
      setUiState(prev => ({
        ...prev,
        error: prev.language === "english"
          ? `Account locked. Please try again in ${prev.countdown} seconds.`
          : `खाता लॉक हो गया। कृपया ${prev.countdown} सेकंड के बाद पुनः प्रयास करें।`,
        loading: false
      }));
      return;
    }

    // Validation checks
    if (!formData.email || !formData.password) {
      setUiState(prev => ({
        ...prev,
        error: prev.language === "english"
          ? "Please enter valid credentials"
          : "कृपया वैध क्रेडेंशियल्स दर्ज करें",
        loading: false
      }));
      return;
    }

    if (!uiState.captchaVerified && !verifyCaptcha()) {
      setUiState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() < 0.3 && uiState.loginAttempts < 2) {
        throw new Error("Invalid credentials");
      }

      handleLoginSuccess();
      setUiState(prev => ({ ...prev, loginAttempts: 0 }));
    } catch (err) {
      const attemptsLeft = 2 - uiState.loginAttempts;
      
      if (uiState.loginAttempts >= 2) {
        setUiState(prev => ({
          ...prev,
          accountLocked: true,
          countdown: LOCKOUT_DURATION,
          error: prev.language === "english"
            ? "Too many attempts. Account locked for 30 seconds."
            : "बहुत अधिक प्रयास। खाता 30 सेकंड के लिए लॉक हो गया।"
        }));
      } else {
        setUiState(prev => ({
          ...prev,
          error: prev.language === "english"
            ? `Invalid credentials. ${attemptsLeft} attempts left.`
            : `गलत क्रेडेंशियल्स। ${attemptsLeft} प्रयास शेष।`,
          loginAttempts: prev.loginAttempts + 1
        }));
      }
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  }, [formData, uiState, verifyCaptcha, handleLoginSuccess]);

  const startTutorial = useCallback(() => {
    setUiState(prev => ({ ...prev, showTutorial: true, currentTutorialStep: 0 }));
  }, []);

  const nextTutorialStep = useCallback(() => {
    setUiState(prev => {
      if (prev.currentTutorialStep < TUTORIAL_STEPS[prev.language].length - 1) {
        return { ...prev, currentTutorialStep: prev.currentTutorialStep + 1 };
      } else {
        return { ...prev, showTutorial: false };
      }
    });
  }, []);

  const speakSection = useCallback((section) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setUiState(prev => ({ ...prev, isSpeaking: true }));

      const utterance = new SpeechSynthesisUtterance(SPEECH_MESSAGES[uiState.language][section]);
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = uiState.language === "hindi" ? "hi-IN" : "en-US";

      utterance.onend = () => setUiState(prev => ({ ...prev, isSpeaking: false }));
      window.speechSynthesis.speak(utterance);
    }
  }, [uiState.language]);

  const toggleTermsModal = useCallback(() => {
    setUiState(prev => ({ ...prev, showTermsModal: !prev.showTermsModal }));
  }, []);

  // Memoized components for better performance
  const Confetti = useCallback(() => (
    <AnimatePresence>
      {uiState.showCelebration && (
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
    </AnimatePresence>
  ), [uiState.showCelebration]);

  const TermsModal = useCallback(() => (
    <AnimatePresence>
      {uiState.showTermsModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`modal-content ${uiState.darkMode ? 'dark-mode' : ''}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h3>{uiState.language === "english" ? "Terms and Conditions" : "नियम और शर्तें"}</h3>
            <div className="modal-body">
              {uiState.language === "english" ? (
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
              onClick={toggleTermsModal}
            >
              {uiState.language === "english" ? "I Understand" : "मैं समझ गया"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [uiState.showTermsModal, uiState.language, uiState.darkMode, toggleTermsModal]);

  const TutorialOverlay = useCallback(() => (
    <AnimatePresence>
      {uiState.showTutorial && (
        <motion.div
          className="tutorial-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`tutorial-content ${uiState.darkMode ? 'dark-mode' : ''}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <p>{TUTORIAL_STEPS[uiState.language][uiState.currentTutorialStep]}</p>
            <button
              onClick={nextTutorialStep}
              className="btn btn-primary mt-3"
            >
              {uiState.currentTutorialStep < TUTORIAL_STEPS[uiState.language].length - 1
                ? (uiState.language === "english" ? "Next" : "अगला")
                : (uiState.language === "english" ? "Got it!" : "समझ गया!")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [uiState.showTutorial, uiState.currentTutorialStep, uiState.language, uiState.darkMode, nextTutorialStep]);

  return (
    <div className={`min-vh-100 position-relative overflow-hidden ${uiState.darkMode ? 'dark-mode' : ''}`}>
      {/* Three.js Container */}
      <div 
        ref={threeContainerRef} 
        className="position-fixed top-0 left-0 w-100 h-100 z-0"
      />

      {/* Celebration confetti effect */}
      <Confetti />

      {/* Terms and Conditions Modal */}
      <TermsModal />

      <div className="d-flex align-items-center justify-content-center min-vh-100 position-relative">
        <motion.div
          ref={cardRef}
          className={`card p-4 shadow-lg rounded position-relative glass-morphism-enhanced ${uiState.darkMode ? 'dark-card' : ''}`}
          style={{ maxWidth: "450px", width: "90%", backdropFilter: "blur(10px)" }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {/* Tutorial overlay */}
          <TutorialOverlay />

          <div className="card-body">
            {/* Top Controls */}
            <div className="d-flex justify-content-end mb-3">
              <button
                onClick={toggleDarkMode}
                className="btn btn-sm btn-outline-secondary"
                aria-label={uiState.language === "english" ? "Toggle dark mode" : "डार्क मोड बदलें"}
              >
                {uiState.darkMode ? "☀️" : "🌙"}
              </button>
            </div>

            {/* Header Section */}
            <div className="position-relative mb-4 text-center">
              <div className="d-flex justify-content-center align-items-center">
                <button
                  onClick={() => {
                    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                    setUiState(prev => ({ ...prev, isSpeaking: false }));
                  }}
                  className={`btn btn-sm btn-danger ${!uiState.isSpeaking ? 'invisible' : ''}`}
                  aria-label={uiState.language === "english" ? "Stop Speaking" : "बोलना बंद करें"}
                >
                  <span className="speaking-animation">🔴</span> {uiState.language === "english" ? "Stop" : "रोकें"}
                </button>
              </div>
              <motion.p
                className="text-muted mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {uiState.language === "english"
                  ? "Please login to continue your learning journey"
                  : "अपनी सीखने की यात्रा जारी रखने के लिए कृपया लॉगिन करें"}
              </motion.p>
              <button
                className="speak-section-btn"
                onClick={() => speakSection("header")}
                aria-label={uiState.language === "english" ? "Speak instructions" : "निर्देश सुनें"}
              >
                🔊
              </button>
            </div>

            {uiState.error && (
              <motion.div
                className="alert alert-danger text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {uiState.error}
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
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="form-control floating-input"
                  required
                  placeholder=" "
                  aria-label={uiState.language === "english" ? "Email" : "ईमेल"}
                />
                <label className="floating-label-text">
                  {uiState.language === "english" ? "📧 Email Address" : "📧 ईमेल पता"}
                </label>
                <button
                  className="speak-section-btn"
                  onClick={() => speakSection("email")}
                  aria-label={uiState.language === "english" ? "Speak email instructions" : "ईमेल निर्देश सुनें"}
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
                    type={uiState.showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    className="form-control floating-input"
                    required
                    placeholder=" "
                    aria-label={uiState.language === "english" ? "Password" : "पासवर्ड"}
                  />
                  <label className="floating-label-text">
                    {uiState.language === "english" ? "🔒 Password" : "🔒 पासवर्ड"}
                  </label>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                    aria-label={uiState.language === "english" ? "Toggle password visibility" : "पासवर्ड दृश्यता बदलें"}
                  >
                    {uiState.showPassword ? (
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
                  aria-label={uiState.language === "english" ? "Speak password instructions" : "पासवर्ड निर्देश सुनें"}
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
                  {uiState.language === "english" ? "👤 Select Your Role" : "👤 अपनी भूमिका चुनें"}
                </label>
                <select
                  value={formData.role}
                  onChange={handleInputChange("role")}
                  className="form-select role-select"
                  aria-label={uiState.language === "english" ? "Select role" : "भूमिका चुनें"}
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.emoji} {role.label[uiState.language]}
                    </option>
                  ))}
                </select>
                <button
                  className="speak-section-btn"
                  onClick={() => speakSection("role")}
                  aria-label={uiState.language === "english" ? "Speak role instructions" : "भूमिका निर्देश सुनें"}
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
                    {uiState.language === "english" ? "🔢 CAPTCHA:" : "🔢 कैप्चा:"}
                  </label>
                  <div className="captcha-display bg-light p-2 rounded flex-grow-1 text-center fw-bold">
                    {uiState.captchaValue}
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary ms-2"
                    onClick={generateCaptcha}
                    aria-label={uiState.language === "english" ? "Refresh CAPTCHA" : "कैप्चा रिफ्रेश करें"}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    value={formData.userInputCaptcha}
                    onChange={handleInputChange("userInputCaptcha")}
                    className="form-control"
                    placeholder={uiState.language === "english" ? "Enter CAPTCHA" : "कैप्चा दर्ज करें"}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={verifyCaptcha}
                  >
                    {uiState.language === "english" ? "Verify" : "सत्यापित करें"}
                  </button>
                </div>
                {uiState.captchaVerified && (
                  <div className="text-success mt-1">
                    <i className="bi bi-check-circle-fill me-1"></i>
                    {uiState.language === "english" ? "CAPTCHA verified" : "कैप्चा सत्यापित"}
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
                    {uiState.language === "english" ? "Remember me" : "मुझे याद रखें"}
                  </label>
                </div>
                <Link
                  href="/forget"
                  className="text-primary text-decoration-none"
                  onMouseEnter={(e) => e.target.classList.add("text-decoration-underline")}
                  onMouseLeave={(e) => e.target.classList.remove("text-decoration-underline")}
                >
                  {uiState.language === "english" ? "Forgot Password?" : "पासवर्ड भूल गए?"}
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
                  disabled={uiState.loading || uiState.accountLocked}
                  aria-label={uiState.language === "english" ? "Login button" : "लॉगिन बटन"}
                >
                  {uiState.loading ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">
                          {uiState.language === "english" ? "Loading..." : "लोड हो रहा है..."}
                        </span>
                      </div>
                      {uiState.language === "english" ? "Logging in..." : "लॉगिन हो रहा है..."}
                    </div>
                  ) : uiState.accountLocked ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="me-2">
                        {uiState.language === "english" ? `🔒 Locked (${uiState.countdown}s)` : `🔒 लॉक (${uiState.countdown}s)`}
                      </span>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="me-2">
                        {uiState.language === "english" ? "🚀 Login" : "🚀 लॉग इन"}
                      </span>
                    </div>
                  )}
                </motion.button>
                <button
                  className="speak-section-btn"
                  onClick={() => speakSection("login")}
                  aria-label={uiState.language === "english" ? "Speak login instructions" : "लॉगिन निर्देश सुनें"}
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
                {uiState.language === "english"
                  ? "Don't have an account? "
                  : "खाता नहीं है? "}
                <Link
                  href="/signup-now"
                  className="text-primary fw-bold text-decoration-none"
                  onMouseEnter={(e) => e.target.classList.add("text-decoration-underline")}
                  onMouseLeave={(e) => e.target.classList.remove("text-decoration-underline")}
                >
                  {uiState.language === "english" ? "Sign up now" : "अभी साइन अप करें"}
                </Link>
              </p>
            </motion.div>

            {/* Bottom Controls */}
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <button
                onClick={toggleTermsModal}
                className="btn btn-sm btn-link text-muted"
              >
                {uiState.language === "english" ? "Terms & Conditions" : "नियम और शर्तें"}
              </button>
              
              <div className="d-flex">
                <button
                  onClick={startTutorial}
                  className="btn btn-sm btn-outline-info me-2"
                  aria-label={uiState.language === "english" ? "Show tutorial" : "ट्यूटोरियल दिखाएं"}
                >
                  {uiState.language === "english" ? "❓ Help" : "❓ सहायता"}
                </button>
                <button
                  onClick={toggleLanguage}
                  className="btn btn-sm btn-outline-primary"
                  aria-label={`Switch to ${uiState.language === "english" ? "Hindi" : "English"}`}
                >
                  {uiState.language === "english" ? "हिंदी" : "English"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .glass-morphism-enhanced {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
        }
        
        .dark-mode {
          background-color: #121212;
          color: #e0e0e0;
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