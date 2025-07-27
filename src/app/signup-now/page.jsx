'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function Signup() {
  const [language, setLanguage] = useState('english');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const router = useRouter();
  const speechSynth = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    speechSynth.current = window.speechSynthesis;
    return () => {
      if (speechSynth.current) {
        speechSynth.current.cancel();
      }
    };
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const speak = (text) => {
    if (speechSynth.current) {
      speechSynth.current.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = language === 'english' ? 'en-IN' : 'hi-IN';
      speech.rate = 0.9;
      speech.volume = 1;
      speech.pitch = 1;
      speechSynth.current.speak(speech);
    }
  };

  const translations = {
    english: {
      title: "Create Your Account",
      description: "Join our community today",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      otp: "OTP",
      password: "Password",
      confirmPassword: "Confirm Password",
      passwordHint: "At least 6 characters",
      submit: "Get Started",
      submitting: "Creating Account...",
      loginPrompt: "Already have an account?",
      loginLink: "Sign In",
      sendOtp: "Send OTP",
      resendOtp: "Resend OTP",
      verifyOtp: "Verify OTP",
      otpSent: "OTP sent to your phone",
      otpCountdown: "Resend in",
      seconds: "seconds",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Email is invalid",
      phoneRequired: "Phone is required",
      phoneInvalid: "Phone must be 10 digits",
      otpRequired: "OTP is required",
      otpInvalid: "OTP must be 6 digits",
      passwordRequired: "Password is required",
      passwordLength: "Password must be at least 6 characters",
      passwordMatch: "Passwords do not match",
      signupFailed: "Signup failed. Please try again.",
      nameHelp: "What should we call you?",
      emailHelp: "We'll never share your email",
      phoneHelp: "We'll send verification code",
      otpHelp: "Enter 6-digit code",
      passwordHelp: "Make it strong and secure",
      confirmHelp: "Re-enter your password",
      formInstructions: "Signup form instructions",
      otpInstructions: "OTP verification instructions"
    },
    hindi: {
      title: "अपना खाता बनाएं",
      description: "आज ही हमारे समुदाय से जुड़ें",
      name: "पूरा नाम",
      email: "ईमेल पता",
      phone: "फोन नंबर",
      otp: "ओटीपी",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      passwordHint: "कम से कम 6 अक्षर",
      submit: "शुरू करें",
      submitting: "खाता बनाया जा रहा है...",
      loginPrompt: "क्या आपके पास पहले से एक खाता है?",
      loginLink: "साइन इन",
      sendOtp: "OTP भेजें",
      resendOtp: "OTP पुनः भेजें",
      verifyOtp: "OTP सत्यापित करें",
      otpSent: "आपके फोन पर OTP भेजा गया",
      otpCountdown: "पुनः भेजें",
      seconds: "सेकंड",
      nameRequired: "नाम आवश्यक है",
      emailRequired: "ईमेल आवश्यक है",
      emailInvalid: "ईमेल अमान्य है",
      phoneRequired: "फोन आवश्यक है",
      phoneInvalid: "फोन 10 अंकों का होना चाहिए",
      otpRequired: "OTP आवश्यक है",
      otpInvalid: "OTP 6 अंकों का होना चाहिए",
      passwordRequired: "पासवर्ड आवश्यक है",
      passwordLength: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
      passwordMatch: "पासवर्ड मेल नहीं खाते",
      signupFailed: "साइनअप विफल। कृपया पुनः प्रयास करें।",
      nameHelp: "हम आपको क्या कहकर बुलाएं?",
      emailHelp: "हम आपका ईमेल कभी साझा नहीं करेंगे",
      phoneHelp: "हम सत्यापन कोड भेजेंगे",
      otpHelp: "6-अंकीय कोड दर्ज करें",
      passwordHelp: "इसे मजबूत और सुरक्षित बनाएं",
      confirmHelp: "अपना पासवर्ड फिर से दर्ज करें",
      formInstructions: "साइनअप फॉर्म निर्देश",
      otpInstructions: "OTP सत्यापन निर्देश"
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = t.nameRequired;
    if (!formData.email) {
      newErrors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.emailInvalid;
    }
    if (!formData.phone) {
      newErrors.phone = t.phoneRequired;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t.phoneInvalid;
    }
    if (showOtpField && !formData.otp) {
      newErrors.otp = t.otpRequired;
    } else if (showOtpField && !/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = t.otpInvalid;
    }
    if (!formData.password) {
      newErrors.password = t.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = t.passwordLength;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMatch;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      if (!showOtpField) {
        handleSendOtp();
        setShowOtpField(true);
      } else {
        setIsSubmitting(true);
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          router.push('/login');
        } catch (error) {
          console.error('Signup error:', error);
          setErrors(prev => ({ ...prev, form: t.signupFailed }));
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleSendOtp = () => {
    const otp = generateOtp();
    setFormData(prev => ({ ...prev, otp: '' }));
    setOtpSent(true);
    setOtpCountdown(30);
    
    alert(
      language === 'english'
        ? `Demo OTP: ${otp}\n\nIn a real app, this would be sent via SMS to ${formData.phone}`
        : `डेमो OTP: ${otp}\n\nवास्तविक ऐप में, यह ${formData.phone} पर एसएमएस के माध्यम से भेजा जाएगा`
    );
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'hindi' : 'english');
  };

  const speakSection = (sectionText) => {
    speak(sectionText);
  };

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
      </Head>

      <div className="min-vh-100 d-flex align-items-center bg-gradient">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <div className="card shadow-lg border-0 overflow-hidden">
                <div className="row g-0">
                  {/* Left Side - Illustration */}
                  <div className="col-md-6 d-none d-md-block gradient-sidebar">
                    <div className="d-flex flex-column h-100 p-4 justify-content-between">
                      <div className="text-white">
                        <button 
                          onClick={toggleLanguage}
                          className="btn btn-sm btn-outline-light mb-3"
                        >
                          {language === 'english' ? 'हिंदी' : 'English'}
                        </button>
                        <h2 className="fw-bold">{t.title}</h2>
                        <p>{t.description}</p>
                      </div>
                      <div className="text-center">
                        <img 
                          src="https://illustrations.popsy.co/amber/digital-nomad.svg" 
                          alt="Signup Illustration"
                          className="img-fluid illustration"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Form */}
                  <div className="col-md-6">
                    <div className="card-body p-4 p-md-5">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold text-primary">
                          {language === 'english' ? 'Sign Up' : 'साइन अप'}
                          {showOtpField && ` - ${t.verifyOtp}`}
                        </h3>
                        <button 
                          onClick={() => speakSection(showOtpField ? t.otpInstructions : t.formInstructions)}
                          className="btn p-0 border-0 bg-transparent"
                        >
                          <img 
                            src="https://cdn-icons-png.flaticon.com/128/2058/2058142.png" 
                            alt="Speaker Assistant"
                            width={40}
                            height={40}
                            className="speaker-icon"
                          />
                        </button>
                      </div>
                      
                      {errors.form && (
                        <div className="alert alert-danger" role="alert">
                          {errors.form}
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmit} noValidate>
                        {!showOtpField ? (
                          <>
                            {/* Name Section */}
                            <div className="mb-4 position-relative">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label htmlFor="name" className="form-label fw-bold text-muted">{t.name}</label>
                                <button 
                                  type="button"
                                  onClick={() => speakSection(`${t.name}: ${t.nameHelp}`)}
                                  className="btn p-0 border-0 bg-transparent"
                                >
                                  <img 
                                    src="https://cdn-icons-png.flaticon.com/128/2058/2058142.png" 
                                    alt="Speak field"
                                    width={24}
                                    height={24}
                                    className="speaker-icon-sm"
                                  />
                                </button>
                              </div>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <i className="fas fa-user text-primary"></i>
                                </span>
                                <input
                                  type="text"
                                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  placeholder={language === 'english' ? 'Your full name' : 'आपका पूरा नाम'}
                                />
                              </div>
                              {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                            </div>
                            
                            {/* Email Section */}
                            <div className="mb-4 position-relative">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label htmlFor="email" className="form-label fw-bold text-muted">{t.email}</label>
                                <button 
                                  type="button"
                                  onClick={() => speakSection(`${t.email}: ${t.emailHelp}`)}
                                  className="btn p-0 border-0 bg-transparent"
                                >
                                  <img 
                                    src="https://cdn-icons-png.flaticon.com/128/2058/2058142.png" 
                                    alt="Speak field"
                                    width={24}
                                    height={24}
                                    className="speaker-icon-sm"
                                  />
                                </button>
                              </div>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <i className="fas fa-envelope text-primary"></i>
                                </span>
                                <input
                                  type="email"
                                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder={language === 'english' ? 'your@email.com' : 'आपका@ईमेल.कॉम'}
                                />
                              </div>
                              {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                            </div>
                            
                            {/* Phone Section */}
                            <div className="mb-4 position-relative">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label htmlFor="phone" className="form-label fw-bold text-muted">{t.phone}</label>
                                <button 
                                  type="button"
                                  onClick={() => speakSection(`${t.phone}: ${t.phoneHelp}`)}
                                  className="btn p-0 border-0 bg-transparent"
                                >
                                  <img 
                                    src="https://cdn-icons-png.flaticon.com/128/2058/2058142.png" 
                                    alt="Speak field"
                                    width={24}
                                    height={24}
                                    className="speaker-icon-sm"
                                  />
                                </button>
                              </div>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <i className="fas fa-phone text-primary"></i>
                                </span>
                                <input
                                  type="tel"
                                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                  id="phone"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  placeholder={language === 'english' ? '9876543210' : '९८७६५४३२१०'}
                                  maxLength="10"
                                />
                              </div>
                              {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                            </div>
                            
                            {/* Password Section */}
                            <div className="mb-4 position-relative">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label htmlFor="password" className="form-label fw-bold text-muted">{t.password}</label>
                                <button 
                                  type="button"
                                  onClick={() => speakSection(`${t.password}: ${t.passwordHelp}`)}
                                  className="btn p-0 border-0 bg-transparent"
                                >
                                  <img 
                                    src="https://cdn-icons-png.flaticon.com/128/2058/2058142.png" 
                                    alt="Speak field"
                                    width={24}
                                    height={24}
                                    className="speaker-icon-sm"
                                  />
                                </button>
                              </div>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <i className="fas fa-lock text-primary"></i>
                                </span>
                                <input
                                  type="password"
                                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                  id="password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  placeholder={language === 'english' ? '••••••••' : '••••••••'}
                                />
                              </div>
                              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                              <small className="text-muted">{t.passwordHint}</small>
                            </div>
                            
                            {/* Confirm Password Section */}
                            <div className="mb-4 position-relative">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label htmlFor="confirmPassword" className="form-label fw-bold text-muted">{t.confirmPassword}</label>
                                <button 
                                  type="button"
                                  onClick={() => speakSection(`${t.confirmPassword}: ${t.confirmHelp}`)}
                                  className="btn p-0 border-0 bg-transparent"
                                >
                                  <img 
                                    src="https://cdn-icons-png.flaticon.com/128/2058/2058142.png" 
                                    alt="Speak field"
                                    width={24}
                                    height={24}
                                    className="speaker-icon-sm"
                                  />
                                </button>
                              </div>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <i className="fas fa-lock text-primary"></i>
                                </span>
                                <input
                                  type="password"
                                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  placeholder={language === 'english' ? '••••••••' : '••••••••'}
                                />
                              </div>
                              {errors.confirmPassword && (
                                <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* OTP Section */}
                            <div className="mb-4 position-relative">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label htmlFor="otp" className="form-label fw-bold text-muted">{t.otp}</label>
                                <button 
                                  type="button"
                                  onClick={() => speakSection(`${t.otp}: ${t.otpHelp}`)}
                                  className="btn p-0 border-0 bg-transparent"
                                >
                                  <img 
                                    src="https://cdn-icons-png.flaticon.com/128/2058/2058142.png" 
                                    alt="Speak field"
                                    width={24}
                                    height={24}
                                    className="speaker-icon-sm"
                                  />
                                </button>
                              </div>
                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <i className="fas fa-mobile-alt text-primary"></i>
                                </span>
                                <input
                                  type="tel"
                                  className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
                                  id="otp"
                                  name="otp"
                                  value={formData.otp}
                                  onChange={handleChange}
                                  placeholder={language === 'english' ? '123456' : '१२३४५६'}
                                  maxLength="6"
                                />
                              </div>
                              {errors.otp && <div className="invalid-feedback d-block">{errors.otp}</div>}
                              <div className="mt-2">
                                {otpCountdown > 0 ? (
                                  <small className="text-muted">
                                    {t.otpCountdown}: {otpCountdown} {t.seconds}
                                  </small>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="btn btn-link p-0 text-primary"
                                  >
                                    <i className="fas fa-redo me-1"></i>
                                    {otpSent ? t.resendOtp : t.sendOtp}
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {otpSent && (
                              <div className="alert alert-info mb-4 position-relative">
                                <i className="fas fa-info-circle me-2"></i>
                                {t.otpSent}
                                <button 
                                  type="button"
                                  onClick={() => speakSection(t.otpSent)}
                                  className="btn p-0 border-0 bg-transparent position-absolute end-0 me-2"
                                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                                >
                                  <img 
                                    src="https://cdn-icons-png.flaticon.com/128/2058/2058142.png" 
                                    alt="Speak alert"
                                    width={20}
                                    height={20}
                                    className="speaker-icon-xs"
                                  />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                        
                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="btn btn-primary w-100 py-3 fw-bold mt-3 submit-btn"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              {t.submitting}
                            </>
                          ) : showOtpField ? (
                            <>
                              <i className="fas fa-check-circle me-2"></i>
                              {t.verifyOtp}
                            </>
                          ) : (
                            <>
                              <i className="fas fa-rocket me-2"></i>
                              {t.submit}
                            </>
                          )}
                        </button>
                        
                        {showOtpField && (
                          <button
                            type="button"
                            onClick={() => setShowOtpField(false)}
                            className="btn btn-outline-secondary w-100 mt-2"
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            {language === 'english' ? 'Back' : 'वापस'}
                          </button>
                        )}
                      </form>
                      
                      <div className="text-center mt-4 position-relative">
                        <p className="text-muted mb-0">
                          {t.loginPrompt}{' '}
                          <a 
                            href="/login" 
                            className="text-decoration-none fw-bold text-primary"
                          >
                            {t.loginLink}
                          </a>
                        </p>
                        <button 
                          type="button"
                          onClick={() => speakSection(`${t.loginPrompt} ${t.loginLink}`)}
                          className="btn p-0 border-0 bg-transparent position-absolute end-0"
                          style={{ top: '50%', transform: 'translateY(-50%)' }}
                        >
                          <img 
                            src="https://cdn-icons-png.flaticon.com/128/2058/2058142.png" 
                            alt="Speak login prompt"
                            width={20}
                            height={20}
                            className="speaker-icon-xs"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .bg-gradient {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .gradient-sidebar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }
        
        .card {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .form-control {
          border-radius: 6px;
          padding: 10px 15px;
          border: 1px solid #e0e0e0;
          transition: all 0.3s ease;
        }
        
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }
        
        .input-group-text {
          border-radius: 6px 0 0 6px;
          background-color: #f8f9fa;
          border-right: none;
          transition: all 0.3s ease;
        }
        
        .input-group:focus-within .input-group-text {
          background-color: #e9ecef;
        }
        
        .illustration {
          max-height: 250px;
          object-fit: contain;
        }
        
        .speaker-icon {
          transition: transform 0.2s ease;
        }
        
        .speaker-icon-sm {
          transition: transform 0.2s ease;
        }
        
        .speaker-icon-xs {
          transition: transform 0.2s ease;
        }
        
        .speaker-icon:hover,
        .speaker-icon-sm:hover,
        .speaker-icon-xs:hover {
          transform: scale(1.1);
        }
        
        .submit-btn {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 14px rgba(102, 126, 234, 0.3);
        }
        
        .submit-btn:active {
          transform: translateY(0);
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .submit-btn:hover {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </>
  );
}