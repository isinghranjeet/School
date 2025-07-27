"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Settings, FileText, BookOpen, Menu, Bell, LogOut, Camera, Edit, 
  Clock, Calendar, Award, Bookmark, Clipboard, Download, Sun, Moon, 
  ChevronDown, ChevronUp, Search, BarChart2, PieChart as PieChartIcon,
  Mail, MessageSquare, Video, File, Home, Database, Code, Cloud, Cpu, 
  Smartphone, Globe, Shield, Wifi, Battery, HardDrive, Server, Activity,
  CreditCard, Youtube, Github
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, ScatterChart, Scatter
} from "recharts";
import Image from "next/image";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f97316', '#10b981'];

const LoginPage = () => {
  // State Management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ 
    Math: 85, Science: 90, History: 75, English: 80,
    Programming: 88, DBMS: 92, Algorithms: 78, Networking: 82 
  });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New course available", read: false, time: "10 min ago", icon: "📚", type: "academic" },
    { id: 2, text: "Assignment deadline tomorrow", read: false, time: "1 hour ago", icon: "📝", type: "assignment" },
    { id: 3, text: "Campus event: Tech Symposium", read: false, time: "2 days ago", icon: "🎪", type: "event" },
    { id: 4, text: "Your grade has been updated", read: true, time: "3 days ago", icon: "📊", type: "grade" }
  ]);
  const [profilePic, setProfilePic] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [screenTime, setScreenTime] = useState(0);
  const [activeTime, setActiveTime] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState({
    name: "Ranjeet Singh",
    email: "rsinghranjeet7428@gmail.com",
    bio: "Passionate about learning and exploring new technologies! Currently specializing in Cloud Computing and Machine Learning.",
    department: "Information Technology",
    semester: "4th",
    uid: "23BET10068",
    attendance: "92%",
    cgpa: "8.42",
    joinDate: "August 2022",
    advisor: "Dr. Parveen Taygi",
    courses: 6,
    credits: 24
  });
  const [courses, setCourses] = useState([
    { code: "CSE401", name: "Advanced DBMS", instructor: "Dr. Shweta Agarwal ", schedule: "Mon/Wed 10-11:30", room: "CS-202" },
    { code: "CSE402", name: "MATH", instructor: "Dr. Parveen Tayagi", schedule: "Tue/Thu 2-3:30", room: "AI-101" },
    { code: "CSE403", name: "Cloud Computing", instructor: "Dr. Kapil", schedule: "Mon/Fri 1-2:30", room: "CL-304" },
    { code: "CSE404", name: "java", instructor: "Dr. Navjot Kaur", schedule: "Wed/Fri 11-12:30", room: "DS-105" }
  ]);
  const [grades, setGrades] = useState([
    { code: "CSE401", name: "Advanced DBMS", marks: 88, grade: "A", credits: 4, status: "Completed" },
    { code: "CSE402", name: "math", marks: 92, grade: "A+", credits: 4, status: "Completed" },
    { code: "CSE403", name: "Cloud Computing", marks: 85, grade: "A", credits: 3, status: "Completed" },
    { code: "CSE404", name: "java", marks: 78, grade: "B+", credits: 3, status: "Completed" }
  ]);
  const [attendance, setAttendance] = useState([
    { subject: "DBMS", present: 18, absent: 2, percentage: "90%" },
    { subject: "Math", present: 19, absent: 1, percentage: "95%" },
    { subject: "Cloud", present: 17, absent: 3, percentage: "85%" },
    { subject: "java", present: 20, absent: 0, percentage: "100%" }
  ]);
  const [events, setEvents] = useState([
    { title: "Tech Symposium", date: "15 May", time: "10:00 AM", location: "Auditorium" },
    { title: "Career Fair", date: "22 May", time: "9:00 AM", location: "Sports Complex" },
    { title: "Hackathon", date: "29 May", time: "12:00 PM", location: "CS Department" }
  ]);
  const [resources, setResources] = useState([
    { name: "DBMS Textbook", type: "pdf", course: "CSE401", size: "12MB" },
    { name: "math Slides", type: "ppt", course: "CSE402", size: "8MB" },
    { name: "Cloud Tutorial", type: "video", course: "CSE403", size: "45MB" }
  ]);
  const [messages, setMessages] = useState([
    { sender: "Dr. Shweta Agarwal", text: "About your DBMS project submission...", time: "2h ago", read: false },
    { sender: "Library", text: "Your requested book is available", time: "1d ago", read: true }
  ]);
  const [activeSemester, setActiveSemester] = useState("4");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfileData, setTempProfileData] = useState({});
  const [screenTimeGoal, setScreenTimeGoal] = useState(120); // 2 hours
  const [productivityScore, setProductivityScore] = useState(78);
  const [showScreenTimeModal, setShowScreenTimeModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [activeChart, setActiveChart] = useState("bar");
  const [themeColor, setThemeColor] = useState("#6366f1");

  const fileInputRef = useRef(null);
  const router = useRouter();

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");

// Add this function to your component (inside the LoginPage component, before the return statement)
const downloadMarksheet = () => {
  // Create CSV content
  const csvContent = [
    "Subject Code,Subject Name,Marks Obtained,Maximum Marks,Grade",
    ...grades.map(grade => `${grade.code},${grade.name},${grade.marks},100,${grade.grade}`)
  ].join("\n");

  // Create a Blob with the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `marksheet_semester_${activeSemester}.csv`;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Show success notification
  toast.success("Marksheet downloaded successfully!");
};

// Update the Export button in the Grades section to use this function:
// Replace the existing Export button with this one
<button 
  className="btn btn-primary"
  onClick={downloadMarksheet}
>
  <Download size={18} className="me-1" /> Download Marksheet
</button>








  // Time Tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setScreenTime(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Active Time Tracking
  const handleOnActive = useCallback(() => {
    setActiveTime(prev => prev + 1);
  }, []);

  const handleOnIdle = useCallback(() => {
    toast.info("You've been idle for a while. Keep exploring your dashboard!");
  }, []);

 
  // Dark Mode Toggle
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Initialize
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    setTempProfileData(profileData);
    
    // Simulate loading data
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Handlers
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("userToken");
      router.push("/user");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target.result);
        toast.success("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
    toast.info("All notifications marked as read");
  };

  const startEditProfile = () => {
    setIsEditingProfile(true);
    setTempProfileData(profileData);
  };

  const saveProfile = () => {
    setProfileData(tempProfileData);
    setIsEditingProfile(false);
    toast.success("Profile updated successfully!");
  };

  const cancelEditProfile = () => {
    setIsEditingProfile(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setTempProfileData(prev => ({...prev, [name]: value}));
  };

  const submitFeedback = () => {
    // In a real app, you would send this to your backend
    console.log("Feedback submitted:", feedback);
    setFeedback("");
    setShowFeedbackModal(false);
    toast.success("Thank you for your feedback!");
  };

  // Data Processing
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  const menuItems = [
    { name: "dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { name: "courses", icon: <BookOpen size={20} />, label: "Courses" },
    { name: "grades", icon: <Award size={20} />, label: "Grades" },
    { name: "attendance", icon: <Clipboard size={20} />, label: "Attendance" },
    { name: "resources", icon: <Database size={20} />, label: "Resources" },
    { name: "messages", icon: <Mail size={20} />, label: "Messages", badge: unreadMessages },
    { name: "settings", icon: <Settings size={20} />, label: "Settings" },
    // Added new navigation links
    { name: "exam", icon: <FileText size={20} />, label: "Exam" },
    { name: "payment", icon: <CreditCard size={20} />, label: "Payment" },
    { name: "library", icon: <Bookmark size={20} />, label: "Library" },
    { name: "feedback", icon: <MessageSquare size={20} />, label: "Feedback" },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const pieData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));

  const radarData = [
    { subject: 'Math', A: data.Math, fullMark: 100 },
    { subject: 'Science', A: data.Science, fullMark: 100 },
    { subject: 'History', A: data.History, fullMark: 100 },
    { subject: 'English', A: data.English, fullMark: 100 },
    { subject: 'Programming', A: data.Programming, fullMark: 100 },
    { subject: 'DBMS', A: data.DBMS, fullMark: 100 },
  ];

  const semesterGPA = [
    { semester: '1', gpa: 7.8 },
    { semester: '2', gpa: 8.2 },
    { semester: '3', gpa: 8.5 },
    { semester: '4', gpa: 8.4 },
  ];

  const productivityData = [
    { day: 'Mon', score: 70 },
    { day: 'Tue', score: 85 },
    { day: 'Wed', score: 65 },
    { day: 'Thu', score: 90 },
    { day: 'Fri', score: 80 },
    { day: 'Sat', score: 60 },
    { day: 'Sun', score: 50 },
  ];

  const themeColors = [
    { name: "Indigo", value: "#6366f1" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Fuchsia", value: "#d946ef" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Emerald", value: "#10b981" },
  ];

  return (
    <div className={`d-flex vh-100 ${darkMode ? "bg-dark text-white" : "bg-light"}`}>
      {/* Toast Notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />

      {/* Sidebar */}
      <motion.div 
        className={`d-flex flex-column p-3 ${darkMode ? "bg-dark" : "bg-primary"} text-white`}
        style={{ width: sidebarOpen ? "280px" : "80px", transition: "width 0.3s" }}
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {sidebarOpen && (
            <div className="d-flex align-items-center">
              <Image
                src="/cu-logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-circle me-2"
              />
              <h4 className="mb-0">CU Dashboard</h4>
            </div>
          )}
          <button 
            className="btn btn-link text-white p-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {sidebarOpen && (
          <div className="mb-4 position-relative">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="position-absolute start-0 top-50 translate-middle-y ms-3" />
          </div>
        )}

        <div className="flex-grow-1 overflow-auto">
          <ul className="nav nav-pills flex-column">
            {filteredMenuItems.map((item) => (
              <motion.li 
                className="nav-item mb-2" 
                key={item.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  className={`nav-link w-100 text-start d-flex align-items-center ${activeTab === item.name ? "active bg-white text-primary" : "text-white"}`}
                  onClick={() => setActiveTab(item.name)}
                >
                  <span className="me-3">{item.icon}</span>
                  {sidebarOpen && (
                    <>
                      <span className="flex-grow-1">{item.label}</span>
                      {item.badge && (
                        <span className="badge bg-danger rounded-pill">{item.badge}</span>
                      )}
                    </>
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <div className="d-flex flex-column gap-2 mb-3">
            <button 
              className="btn btn-warning position-relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
                markAllAsRead();
              }}
            >
              <Bell size={18} className="me-1" />
              {sidebarOpen && (
                <>
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadNotifications}
                    </span>
                  )}
                </>
              )}
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleLogout}
            >
              <LogOut size={18} className="me-1" />
              {sidebarOpen && "Logout"}
            </button>
          </div>
          {sidebarOpen && (
            <div className="d-flex justify-content-between text-white-50 small">
              <span>Screen Time:</span>
              <span><Clock size={14} className="me-1" /> {formatTime(screenTime)}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-grow-1 overflow-auto p-4">
        {/* Top Navigation */}
        <div className={`d-flex justify-content-between align-items-center mb-4 p-3 rounded ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
          <h3 className="mb-0 text-capitalize">
            {activeTab === "dashboard" && "Student Dashboard"}
            {activeTab === "courses" && "My Courses"}
            {activeTab === "grades" && "Grades & Performance"}
            {activeTab === "attendance" && "Attendance Records"}
            {activeTab === "resources" && "Learning Resources"}
            {activeTab === "messages" && "Messages"}
            {activeTab === "settings" && "Settings"}
            {activeTab === "exam" && "Examination"}
            {activeTab === "payment" && "Payment Portal"}
            {activeTab === "library" && "Library Resources"}
            {activeTab === "feedback" && "Feedback System"}
          </h3>
          <div className="d-flex align-items-center gap-3">
            <button 
              className={`btn ${darkMode ? "btn-dark" : "btn-light"} rounded-circle p-2`}
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={18} />
            </button>
            <div className="position-relative">
              <button 
                className="btn p-0"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img
                  src={profilePic || "https://media.licdn.com/dms/image/v2/D5603AQGDt02qOvcBMA/profile-displayphoto-shrink_200_200/B56ZUh8ITVHEAk-/0/1740031169550?e=1748476800&v=beta&t=FfgFhNGwozPFtuOjo_C1BaBDPnRNv_LS1g3hI4DpfY0"}
                  alt="Profile"
                  className="rounded-circle border border-2 border-primary"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              </button>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`position-absolute end-0 mt-2 ${darkMode ? "bg-dark" : "bg-white"} rounded shadow-lg`}
                    style={{ width: "200px", zIndex: 1000 }}
                  >
                    <div className="p-3 border-bottom">
                      <h6 className="mb-0">{profileData.name}</h6>
                      <small className="text-muted">{profileData.email}</small>
                    </div>
                    <div className="p-2">
                      <button 
                        className="btn btn-sm w-100 text-start"
                        onClick={() => {
                          setActiveTab("settings");
                          setShowProfileMenu(false);
                        }}
                      >
                        <Settings size={16} className="me-2" /> Settings
                      </button>
                      <button 
                        className="btn btn-sm w-100 text-start"
                        onClick={() => {
                          setShowScreenTimeModal(true);
                          setShowProfileMenu(false);
                        }}
                      >
                        <Clock size={16} className="me-2" /> Screen Time
                      </button>
                      <button 
                        className="btn btn-sm w-100 text-start"
                        onClick={() => {
                          setShowFeedbackModal(true);
                          setShowProfileMenu(false);
                        }}
                      >
                        <MessageSquare size={16} className="me-2" /> Feedback
                      </button>
                    </div>
                    <div className="p-2 border-top">
                      <button 
                        className="btn btn-sm w-100 text-start text-danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="me-2" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="darkModeToggle"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <label className="form-check-label" htmlFor="darkModeToggle">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              </label>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-4 ${darkMode ? "bg-dark" : "bg-white"} p-3 rounded shadow-sm`}
            >
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search across dashboard..."
                />
                <button className="btn btn-primary">Search</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="container-fluid">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`card mb-4 ${darkMode ? "bg-dark" : "bg-white"} shadow`}
            >
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2 text-center mb-3 mb-md-0">
                    <div className="position-relative d-inline-block">
                      <img
                        src={profilePic || "https://media.licdn.com/dms/image/v2/D5603AQGDt02qOvcBMA/profile-displayphoto-shrink_200_200/B56ZUh8ITVHEAk-/0/1740031169550?e=1748476800&v=beta&t=FfgFhNGwozPFtuOjo_C1BaBDPnRNv_LS1g3hI4DpfY0"}
                        alt="Profile"
                        className="rounded-circle border border-3 border-primary"
                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                      />
                      <button 
                        className="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Camera size={16} />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleProfilePicChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-7">
                    <h2 className="mb-1">Welcome back, {profileData.name}!</h2>
                    <p className="text-muted mb-2">{profileData.email}</p>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className={`badge ${darkMode ? "bg-primary bg-opacity-25" : "bg-primary bg-opacity-10"} text-primary`}>
                        {profileData.department}
                      </span>
                      <span className={`badge ${darkMode ? "bg-success bg-opacity-25" : "bg-success bg-opacity-10"} text-success`}>
                        Semester {profileData.semester}
                      </span>
                      <span className={`badge ${darkMode ? "bg-info bg-opacity-25" : "bg-info bg-opacity-10"} text-info`}>
                        UID: {profileData.uid}
                      </span>
                      <span className={`badge ${darkMode ? "bg-warning bg-opacity-25" : "bg-warning bg-opacity-10"} text-warning`}>
                        Advisor: {profileData.advisor}
                      </span>
                    </div>
                    <div className="progress mb-2" style={{ height: "6px" }}>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: "70%" }}
                        aria-valuenow={70}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <small className="text-muted">Profile 70% complete</small>
                  </div>
                  <div className="col-md-3 text-md-end mt-3 mt-md-0">
                    <button 
                      className="btn btn-primary me-2"
                      onClick={startEditProfile}
                    >
                      <Edit size={16} className="me-1" /> Edit Profile
                    </button>
                    <button 
                      className={`btn ${darkMode ? "btn-outline-light" : "btn-outline-dark"}`}
                      onClick={() => setActiveTab("settings")}
                    >
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>








            

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-6 col-lg-3 mb-3">
                <motion.div 
                  className={`card h-100 border-primary border-opacity-25 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}
                  whileHover={{ y: -5 }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Current CGPA</h6>
                        <h3 className="mb-0">{profileData.cgpa}</h3>
                        <small className="text-muted">Out of 10.0</small>
                      </div>
                      <div className={`p-3 rounded ${darkMode ? "bg-primary bg-opacity-25" : "bg-primary bg-opacity-10"}`}>
                        <Award size={24} className="text-primary" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <motion.div 
                  className={`card h-100 border-success border-opacity-25 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}
                  whileHover={{ y: -5 }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Attendance</h6>
                        <h3 className="mb-0">{profileData.attendance}</h3>
                        <small className="text-muted">Overall</small>
                      </div>
                      <div className={`p-3 rounded ${darkMode ? "bg-success bg-opacity-25" : "bg-success bg-opacity-10"}`}>
                        <Clipboard size={24} className="text-success" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <motion.div 
                  className={`card h-100 border-info border-opacity-25 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}
                  whileHover={{ y: -5 }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Active Courses</h6>
                        <h3 className="mb-0">{profileData.courses}</h3>
                        <small className="text-muted">{profileData.credits} Credits</small>
                      </div>
                      <div className={`p-3 rounded ${darkMode ? "bg-info bg-opacity-25" : "bg-info bg-opacity-10"}`}>
                        <BookOpen size={24} className="text-info" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <motion.div 
                  className={`card h-100 border-warning border-opacity-25 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}
                  whileHover={{ y: -5 }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Productivity</h6>
                        <h3 className="mb-0">{productivityScore}</h3>
                        <small className="text-muted">Weekly Score</small>
                      </div>
                      <div className={`p-3 rounded ${darkMode ? "bg-warning bg-opacity-25" : "bg-warning bg-opacity-10"}`}>
                        <Activity size={24} className="text-warning" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="row">
              {/* Performance Charts */}
              <div className="col-lg-8 mb-4">
                <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Performance Overview</h5>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className={`btn ${activeChart === "bar" ? "btn-primary" : darkMode ? "btn-dark" : "btn-light"}`}
                        onClick={() => setActiveChart("bar")}
                      >
                        <BarChart2 size={16} className="me-1" /> Bar
                      </button>
                      <button 
                        className={`btn ${activeChart === "line" ? "btn-primary" : darkMode ? "btn-dark" : "btn-light"}`}
                        onClick={() => setActiveChart("line")}
                      >
                        <PieChartIcon size={16} className="me-1" /> Line
                      </button>
                      <button 
                        className={`btn ${activeChart === "radar" ? "btn-primary" : darkMode ? "btn-dark" : "btn-light"}`}
                        onClick={() => setActiveChart("radar")}
                      >
                        <Globe size={16} className="me-1" /> Radar
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        {activeChart === "bar" ? (
                          <BarChart
                            data={Object.entries(data).map(([subject, marks]) => ({
                              subject,
                              marks,
                            }))}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#495057" : "#e9ecef"} />
                            <XAxis 
                              dataKey="subject" 
                              stroke={darkMode ? "#dee2e6" : "#495057"} 
                            />
                            <YAxis 
                              stroke={darkMode ? "#dee2e6" : "#495057"} 
                              domain={[0, 100]} 
                            />
                            <Tooltip 
                              contentStyle={
                                darkMode 
                                  ? { backgroundColor: "#212529", borderColor: "#495057" } 
                                  : { backgroundColor: "#fff", borderColor: "#dee2e6" }
                              }
                            />
                            <Legend />
                            <Bar 
                              dataKey="marks" 
                              name="Marks Obtained" 
                              fill={themeColor}
                              radius={[4, 4, 0, 0]} 
                            />
                          </BarChart>
                        ) : activeChart === "line" ? (
                          <LineChart
                            data={Object.entries(data).map(([subject, marks]) => ({
                              subject,
                              marks,
                            }))}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#495057" : "#e9ecef"} />
                            <XAxis 
                              dataKey="subject" 
                              stroke={darkMode ? "#dee2e6" : "#495057"} 
                            />
                            <YAxis 
                              stroke={darkMode ? "#dee2e6" : "#495057"} 
                              domain={[0, 100]} 
                            />
                            <Tooltip 
                              contentStyle={
                                darkMode 
                                  ? { backgroundColor: "#212529", borderColor: "#495057" } 
                                  : { backgroundColor: "#fff", borderColor: "#dee2e6" }
                              }
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="marks" 
                              name="Marks Obtained" 
                              stroke={themeColor}
                              strokeWidth={2}
                              dot={{ r: 4, fill: themeColor }}
                              activeDot={{ r: 6, fill: themeColor }}
                            />
                          </LineChart>
                        ) : (
                          <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            data={radarData}
                          >
                            <PolarGrid stroke={darkMode ? "#495057" : "#e9ecef"} />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              stroke={darkMode ? "#dee2e6" : "#495057"} 
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]} 
                              stroke={darkMode ? "#dee2e6" : "#495057"} 
                            />
                            <Tooltip 
                              contentStyle={
                                darkMode 
                                  ? { backgroundColor: "#212529", borderColor: "#495057" } 
                                  : { backgroundColor: "#fff", borderColor: "#dee2e6" }
                              }
                            />
                            <Radar
                              name="Performance"
                              dataKey="A"
                              stroke={themeColor}
                              fill={themeColor}
                              fillOpacity={0.6}
                            />
                          </RadarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="col-lg-4 mb-4">
                <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                  <div className="card-header">
                    <h5 className="mb-0">Subject Breakdown</h5>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={
                              darkMode 
                                ? { backgroundColor: "#212529", borderColor: "#495057" } 
                                : { backgroundColor: "#fff", borderColor: "#dee2e6" }
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Recent Activity */}
              <div className="col-lg-6 mb-4">
                <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Activity</h5>
                    <button className="btn btn-sm btn-link">View All</button>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {[
                        { 
                          title: "Math Assignment Submitted", 
                          desc: "You submitted the weekly math assignment", 
                          time: "2 hours ago", 
                          icon: "📝",
                          color: "primary"
                        },
                        { 
                          title: "DBMS Lecture Completed", 
                          desc: "You attended the DBMS lecture", 
                          time: "1 day ago", 
                          icon: "🎓",
                          color: "info"
                        },
                        { 
                          title: "Java Project Graded", 
                          desc: "Your Java project received 95/100", 
                          time: "3 days ago", 
                          icon: "💯",
                          color: "success"
                        },
                        { 
                          title: "University Event", 
                          desc: "Tech fest registration starts tomorrow", 
                          time: "1 week ago", 
                          icon: "🎉",
                          color: "warning"
                        },
                      ].map((activity, index) => (
                        <motion.div 
                          key={index}
                          className={`list-group-item list-group-item-action ${darkMode ? "bg-dark" : ""}`}
                          whileHover={{ backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}
                        >
                          <div className="d-flex align-items-start">
                            <span className={`badge bg-${activity.color} bg-opacity-10 text-${activity.color} me-3 p-2 rounded`}>
                              {activity.icon}
                            </span>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{activity.title}</h6>
                              <p className="mb-1 small text-muted">{activity.desc}</p>
                            </div>
                            <small className="text-muted">{activity.time}</small>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="col-lg-6 mb-4">
                <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Upcoming Deadlines</h5>
                    <button className="btn btn-sm btn-link">View All</button>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {[
                        { 
                          title: "Math Assignment", 
                          desc: "Chapter 5 Exercises", 
                          date: "Due tomorrow", 
                          priority: "high",
                          icon: "🧮"
                        },
                        { 
                          title: "DBMS Project", 
                          desc: "Database Design", 
                          date: "Due in 3 days", 
                          priority: "medium",
                          icon: "💾"
                        },
                        { 
                          title: "Java Lab", 
                          desc: "Exception Handling", 
                          date: "Due next week", 
                          priority: "low",
                          icon: "☕"
                        },
                        { 
                          title: "Web Tech Quiz", 
                          desc: "React Fundamentals", 
                          date: "Due in 2 weeks", 
                          priority: "medium",
                          icon: "🌐"
                        },
                      ].map((deadline, index) => (
                        <motion.div 
                          key={index}
                          className={`list-group-item list-group-item-action ${darkMode ? "bg-dark" : ""}`}
                          whileHover={{ backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}
                        >
                          <div className="d-flex align-items-start">
                            <span className="badge bg-light text-dark me-3 p-2 rounded">
                              {deadline.icon}
                            </span>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between">
                                <h6 className="mb-1">{deadline.title}</h6>
                                <span className={`badge bg-${
                                  deadline.priority === "high" 
                                    ? "danger" 
                                    : deadline.priority === "medium" 
                                      ? "warning" 
                                      : "success"
                                }`}>
                                  {deadline.priority}
                                </span>
                              </div>
                              <p className="mb-1 small text-muted">{deadline.desc}</p>
                              <small className="text-muted">
                                <Calendar size={14} className="me-1" />
                                {deadline.date}
                              </small>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Productivity Trends */}
              <div className="col-lg-6 mb-4">
                <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                  <div className="card-header">
                    <h5 className="mb-0">Productivity Trends</h5>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "250px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={productivityData}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#495057" : "#e9ecef"} />
                          <XAxis 
                            dataKey="day" 
                            stroke={darkMode ? "#dee2e6" : "#495057"} 
                          />
                          <YAxis 
                            stroke={darkMode ? "#dee2e6" : "#495057"} 
                            domain={[0, 100]} 
                          />
                          <Tooltip 
                            contentStyle={
                              darkMode 
                                ? { backgroundColor: "#212529", borderColor: "#495057" } 
                                : { backgroundColor: "#fff", borderColor: "#dee2e6" }
                            }
                          />
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            name="Productivity" 
                            stroke={themeColor}
                            fill={themeColor}
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="col-lg-6 mb-4">
                <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                  <div className="card-header">
                    <h5 className="mb-0">Upcoming Events</h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      {events.map((event, index) => (
                        <motion.div 
                          key={index}
                          className={`list-group-item list-group-item-action ${darkMode ? "bg-dark" : ""}`}
                          whileHover={{ backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{event.title}</h6>
                              <small className="text-muted">{event.location}</small>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold">{event.date}</div>
                              <small className="text-muted">{event.time}</small>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}




        {/* Grades Tab */}
        {activeTab === "grades" && (
          <div className="container-fluid">
            <div className="row mb-4">
              <div className="col-12">
                <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow`}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Academic Records</h4>
                    <div className="d-flex gap-2">
                      <select 
                        className={`form-select ${darkMode ? "bg-dark text-white" : ""}`}
                        value={activeSemester}
                        onChange={(e) => setActiveSemester(e.target.value)}
                      >
                        <option value="4">Semester 4</option>
                        <option value="3">Semester 3</option>
                        <option value="2">Semester 2</option>
                        <option value="1">Semester 1</option>
                      </select>
                      <button className="btn btn-primary">
                        <Download size={18} className="me-1" /> Export
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className={`table ${darkMode ? "table-dark" : ""}`}>
                        <thead>
                          <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Credits</th>
                            <th>Marks</th>
                            <th>Grade</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grades.map((course, index) => (
                            <tr key={index}>
                              <td>{course.code}</td>
                              <td>{course.name}</td>
                              <td>{course.credits}</td>
                              <td>
                                <div className="progress" style={{ height: "6px" }}>
                                  <div 
                                    className={`progress-bar ${
                                      course.marks >= 90 
                                        ? "bg-success" 
                                        : course.marks >= 80 
                                          ? "bg-primary" 
                                          : "bg-warning"
                                    }`} 
                                    style={{ width: `${course.marks}%` }}
                                  ></div>
                                </div>
                                <small>{course.marks}/100</small>
                              </td>
                              <td>
                                <span className={`badge ${
                                  course.grade === "A+" 
                                    ? "bg-success" 
                                    : course.grade === "A" 
                                      ? "bg-primary" 
                                      : course.grade === "B+" 
                                        ? "bg-info" 
                                        : "bg-warning"
                                }`}>
                                  {course.grade}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${
                                  course.status === "Completed" 
                                    ? "bg-success" 
                                    : "bg-warning"
                                }`}>
                                  {course.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>






{/* Grades Tab */}
{activeTab === "grades" && (
  <div className="container-fluid">
    <div className="row mb-4">
      <div className="col-12">
        <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow`}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Academic Records</h4>
            <div className="d-flex gap-2">
              <select 
                className={`form-select ${darkMode ? "bg-dark text-white" : ""}`}
                value={activeSemester}
                onChange={(e) => setActiveSemester(e.target.value)}
              >
                <option value="4">Semester 4</option>
                <option value="3">Semester 3</option>
                <option value="2">Semester 2</option>
                <option value="1">Semester 1</option>
              </select>
              <button 
                className="btn btn-primary"
                onClick={downloadMarksheet}
              >
                <Download size={18} className="me-1" /> Download Marksheet
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className={`table ${darkMode ? "table-dark" : ""}`}>
                {/* ... rest of the table code remains the same ... */}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ... rest of the grades section remains the same ... */}
  </div>
)}









            <div className="row">
              <div className="col-md-6 mb-4">
                <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                  <div className="card-header">
                    <h5 className="mb-0">GPA Trend</h5>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={semesterGPA}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#495057" : "#e9ecef"} />
                          <XAxis 
                            dataKey="semester" 
                            stroke={darkMode ? "#dee2e6" : "#495057"} 
                          />
                          <YAxis 
                            stroke={darkMode ? "#dee2e6" : "#495057"} 
                            domain={[0, 10]} 
                          />
                          <Tooltip 
                            contentStyle={
                              darkMode 
                                ? { backgroundColor: "#212529", borderColor: "#495057" } 
                                : { backgroundColor: "#fff", borderColor: "#dee2e6" }
                            }
                          />
                          <Line 
                            type="monotone" 
                            dataKey="gpa" 
                            name="GPA" 
                            stroke={themeColor}
                            strokeWidth={2}
                            dot={{ r: 4, fill: themeColor }}
                            activeDot={{ r: 6, fill: themeColor }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                  <div className="card-header">
                    <h5 className="mb-0">Grade Distribution</h5>
                  </div>
                  <div className="card-body">
                    <div style={{ height: "300px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "A+", value: 2 },
                              { name: "A", value: 2 },
                              { name: "A-", value: 1 },
                              { name: "B+", value: 1 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#3b82f6" />
                            <Cell fill="#8b5cf6" />
                            <Cell fill="#f59e0b" />
                          </Pie>
                          <Tooltip 
                            contentStyle={
                              darkMode 
                                ? { backgroundColor: "#212529", borderColor: "#495057" } 
                                : { backgroundColor: "#fff", borderColor: "#dee2e6" }
                            }
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Marks Tab */}
        {activeTab === "marks" && (
          <motion.div
            className="p-4 shadow-lg rounded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              maxWidth: "800px",
              margin: "auto",
              background: darkMode ? "#333" : "#fff",
              color: darkMode ? "#fff" : "#000",
            }}
          >
            <h2 className="mb-3">📊 Marks View</h2>

            {/* Marks Table */}
            <div className="table-responsive">
              <table className="table table-striped" style={{ color: darkMode ? "#fff" : "#000" }}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data).map(([subject, marks]) => (
                    <tr key={subject}>
                      <td>{subject}</td>
                      <td>{marks}</td>
                      <td>{marks >= 90 ? "A+" : marks >= 80 ? "A" : marks >= 70 ? "B" : "C"}</td>
                      <td>
                        <div className="progress" style={{ height: "10px" }}>
                          <div
                            className="progress-bar bg-info"
                            role="progressbar"
                            style={{ width: `${marks}%` }}
                            aria-valuenow={marks}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Performance Chart */}
            <h4 className="mt-4">Performance Analysis</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(data).map(([subject, marks]) => ({
                  subject,
                  marks,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="marks" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>

            {/* Colorful Marksheet Download Section */}
            <div
              className="marksheet p-4 mt-4 shadow-lg rounded text-center"
              style={{
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                color: "#fff",
                border: "1px solid #ddd",
                borderRadius: "15px",
                padding: "20px",
              }}
            >
              <h2 className="mb-4" style={{ fontSize: "2rem", fontWeight: "bold" }}>
                🎓 Chandigarh University
              </h2>
              <h3 className="mb-4" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                📜 Statement of Marks
              </h3>

              {/* Student Details */}
              <div className="mb-4" style={{ textAlign: "left" }}>
                <p><strong>Name:</strong> Ranjeet Kumar</p>
                <p><strong>U.I.D:</strong> 23BET10068</p>
                <p><strong>Program:</strong> Bachelor of Information Technology (I.T)</p>
                <p><strong>Semester:</strong> 4th</p>
              </div>

              {/* Marks Table */}
              <table className="table table-bordered" style={{ background: "#fff", color: "#000", borderRadius: "10px" }}>
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Marks Obtained</th>
                    <th>Maximum Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: "CSE101", name: "Mathematics", marks: 85, maxMarks: 100 },
                    { code: "CSE102", name: "Physics", marks: 90, maxMarks: 100 },
                    { code: "CSE103", name: "Chemistry", marks: 75, maxMarks: 100 },
                    { code: "CSE104", name: "Programming", marks: 80, maxMarks: 100 },
                    { code: "CSE105", name: "Database Systems", marks: 88, maxMarks: 100 },
                    { code: "CSE106", name: "Operating Systems", marks: 92, maxMarks: 100 },
                    { code: "CSE107", name: "Data Structures", marks: 78, maxMarks: 100 },
                    { code: "CSE108", name: "Algorithms", marks: 85, maxMarks: 100 },
                    { code: "CSE109", name: "Networking", marks: 82, maxMarks: 100 },
                    { code: "CSE110", name: "Artificial Intelligence", marks: 89, maxMarks: 100 },
                  ].map((subject, index) => (
                    <tr key={index}>
                      <td>{subject.code}</td>
                      <td>{subject.name}</td>
                      <td>{subject.marks}</td>
                      <td>{subject.maxMarks}</td>
                      <td>{subject.marks >= 90 ? "A+" : subject.marks >= 80 ? "A" : subject.marks >= 70 ? "B" : "C"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="mt-4" style={{ textAlign: "left" }}>
                <p><strong>Total Marks Obtained:</strong> 844</p>
                <p><strong>Maximum Marks:</strong> 1000</p>
                <p><strong>Percentage:</strong> 84.4%</p>
                <p><strong>Result:</strong> Pass</p>
              </div>

              {/* Download Button */}
              <button
                className="btn btn-light mt-3"
                style={{
                  background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                  color: "#000",
                  border: "none",
                  padding: "10px 20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "25px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                }}
                onClick={() => {
                  // Convert data to CSV format
                  const csvContent =
                    "Subject Code,Subject Name,Marks Obtained,Maximum Marks,Grade\n" +
                    [
                      { code: "CSE101", name: "Mathematics", marks: 85, maxMarks: 100 },
                      { code: "CSE102", name: "Physics", marks: 90, maxMarks: 100 },
                      { code: "CSE103", name: "Chemistry", marks: 75, maxMarks: 100 },
                      { code: "CSE104", name: "Programming", marks: 80, maxMarks: 100 },
                      { code: "CSE105", name: "Database Systems", marks: 88, maxMarks: 100 },
                      { code: "CSE106", name: "Operating Systems", marks: 92, maxMarks: 100 },
                      { code: "CSE107", name: "Data Structures", marks: 78, maxMarks: 100 },
                      { code: "CSE108", name: "Algorithms", marks: 85, maxMarks: 100 },
                      { code: "CSE109", name: "Networking", marks: 82, maxMarks: 100 },
                      { code: "CSE110", name: "Artificial Intelligence", marks: 89, maxMarks: 100 },
                    ]
                      .map((subject) => {
                        const grade = subject.marks >= 90 ? "A+" : subject.marks >= 80 ? "A" : subject.marks >= 70 ? "B" : "C";
                        return `${subject.code},${subject.name},${subject.marks},${subject.maxMarks},${grade}`;
                      })
                      .join("\n");

                  // Create a Blob with the CSV data
                  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

                  // Create a link element to trigger the download
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = "marksheet.csv";
                  link.style.display = "none";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                📄 Download Marksheet
              </button>
            </div>
          </motion.div>
        )}









        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="container-fluid">
            <div className="row mb-4">
              <div className="col-12">
                <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow`}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">My Courses - Semester {activeSemester}</h4>
                    <div className="d-flex gap-2">
                      <select 
                        className={`form-select ${darkMode ? "bg-dark text-white" : ""}`}
                        value={activeSemester}
                        onChange={(e) => setActiveSemester(e.target.value)}
                      >
                        <option value="4">Semester 4</option>
                        <option value="3">Semester 3</option>
                        <option value="2">Semester 2</option>
                        <option value="1">Semester 1</option>
                      </select>
                      <button className="btn btn-primary">
                        <Download size={18} className="me-1" /> Syllabus
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {courses.map((course, index) => (
                        <div className="col-md-6 mb-4" key={index}>
                          <motion.div 
                            className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} border-primary border-opacity-25 shadow-sm`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h5 className="mb-1">{course.name}</h5>
                                  <small className="text-muted">{course.code}</small>
                                </div>
                                <span className="badge bg-primary bg-opacity-10 text-primary">
                                  {course.credits || "4"} Credits
                                </span>
                              </div>
                              <p className="text-muted mb-3">Instructor: {course.instructor}</p>
                              <div className="d-flex justify-content-between mb-3">
                                <div>
                                  <small className="text-muted">Schedule</small>
                                  <p className="mb-0">{course.schedule}</p>
                                </div>
                                <div>
                                  <small className="text-muted">Room</small>
                                  <p className="mb-0">{course.room}</p>
                                </div>
                              </div>
                              <div className="progress mb-3" style={{ height: "6px" }}>
                                <div 
                                  className="progress-bar bg-success" 
                                  style={{ width: "75%" }}
                                ></div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <button className="btn btn-sm btn-outline-primary">
                                  Materials
                                </button>
                                <button className="btn btn-sm btn-outline-success">
                                  Assignments
                                </button>
                                <button className="btn btn-sm btn-outline-info">
                                  Grades
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="container-fluid">
            <div className="row mb-4">
              <div className="col-12">
                <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow`}>
                  <div className="card-header">
                    <h4 className="mb-0">Attendance Records</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive mb-4">
                      <table className={`table ${darkMode ? "table-dark" : ""}`}>
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Percentage</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance.map((record, index) => (
                            <tr key={index}>
                              <td>{record.subject}</td>
                              <td>{record.present}</td>
                              <td>{record.absent}</td>
                              <td>{record.percentage}</td>
                              <td>
                                <span className={`badge ${
                                  parseInt(record.percentage) >= 90 
                                    ? "bg-success" 
                                    : parseInt(record.percentage) >= 75 
                                      ? "bg-warning" 
                                      : "bg-danger"
                                }`}>
                                  {parseInt(record.percentage) >= 90 
                                    ? "Good" 
                                    : parseInt(record.percentage) >= 75 
                                      ? "Warning" 
                                      : "Critical"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                          <div className="card-header">
                            <h5 className="mb-0">Attendance Trend</h5>
                          </div>
                          <div className="card-body">
                            <div style={{ height: "250px" }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={attendance.map(a => ({
                                    subject: a.subject,
                                    percentage: parseInt(a.percentage)
                                  }))}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#495057" : "#e9ecef"} />
                                  <XAxis 
                                    dataKey="subject" 
                                    stroke={darkMode ? "#dee2e6" : "#495057"} 
                                  />
                                  <YAxis 
                                    stroke={darkMode ? "#dee2e6" : "#495057"} 
                                    domain={[0, 100]} 
                                  />
                                  <Tooltip 
                                    contentStyle={
                                      darkMode 
                                        ? { backgroundColor: "#212529", borderColor: "#495057" } 
                                        : { backgroundColor: "#fff", borderColor: "#dee2e6" }
                                    }
                                  />
                                  <Bar 
                                    dataKey="percentage" 
                                    name="Attendance %" 
                                    fill={themeColor}
                                    radius={[4, 4, 0, 0]} 
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm`}>
                          <div className="card-header">
                            <h5 className="mb-0">Attendance Summary</h5>
                          </div>
                          <div className="card-body">
                            <div className="d-flex flex-column h-100 justify-content-center">
                              <div className="text-center mb-4">
                                <h1 className="display-4">{profileData.attendance}</h1>
                                <p className="text-muted">Overall Attendance</p>
                              </div>
                              <div className="row text-center">
                                <div className="col-6 border-end">
                                  <h4 className="mb-1">18</h4>
                                  <small className="text-muted">Present</small>
                                </div>
                                <div className="col-6">
                                  <h4 className="mb-1">2</h4>
                                  <small className="text-muted">Absent</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}






  {/* Resources Tab */}
{activeTab === "resources" && (
  <div className="container-fluid">
    <div className="row mb-4">
      <div className="col-12">
        <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow`}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <Database size={20} className="me-2" />
              Learning Resources
            </h4>
            <div className="d-flex gap-2">
              <div className="input-group" style={{ width: "200px" }}>
                <span className={`input-group-text ${darkMode ? "bg-dark text-white" : ""}`}>
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className={`form-control ${darkMode ? "bg-dark text-white" : ""}`}
                  placeholder="Search resources..."
                />
              </div>
              <select className={`form-select ${darkMode ? "bg-dark text-white" : ""}`}>
                <option>All Courses</option>
                {courses.map((course, index) => (
                  <option key={index} value={course.code}>{course.name}</option>
                ))}
              </select>
              <select className={`form-select ${darkMode ? "bg-dark text-white" : ""}`}>
                <option>All Types</option>
                <option value="pdf">PDF Documents</option>
                <option value="ppt">Presentations</option>
                <option value="video">Videos</option>
                <option value="youtube">YouTube Links</option>
                <option value="code">Code Samples</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="badge bg-primary rounded-pill me-2">
                  {resources.length} resources
                </span>
                <span className="text-muted small">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="btn-group">
                <button className={`btn btn-sm ${darkMode ? "btn-dark" : "btn-light"}`}>
                  <Bookmark size={16} className="me-1" /> Bookmarked
                </button>
                <button className={`btn btn-sm ${darkMode ? "btn-dark" : "btn-light"}`}>
                  <BarChart2 size={16} className="me-1" /> Most Viewed
                </button>
                <button className={`btn btn-sm ${darkMode ? "btn-dark" : "btn-light"}`}>
                  <Calendar size={16} className="me-1" /> Recent
                </button>
              </div>
            </div>

            <div className="row">
              {[
             { 
              "name": "Advanced DBMS Concepts", 
              "type": "pdf", 
              "course": "CSE401",
              "code": "DBMS-2023-04",
              "size": "12MB",
              "url": "https://aries.ektf.hu/~hz/pdf-tamop/pdf-xx/Radvanyi-hdbms-eng2.pdf",
              "free_link": "<a href='https://aries.ektf.hu/~hz/pdf-tamop/pdf-xx/Radvanyi-hdbms-eng2.pdf' target='_blank'>Free Download</a>",
              "views": 124,
              "downloads": 89,
              "uploaded": "2023-10-15",
              "author": "Dr. Shweta Agarwal"
            }
            ,
                
            {
              "name": "An Introduction to Advanced Probability and Statistics",
              "type": "pdf",
              "course": "CSE402",
              "code": "MATH-2023-12",
              "size": "2.5MB",
              "url": "https://jhqian.org/aps/book.pdf",
              "free_link": "<a href='https://jhqian.org/aps/book.pdf' target='_blank'>Free Download</a>",
              "views": 95,
              "downloads": 67,
              "uploaded": "2023-11-02",
              "author": "Junhui Qian"
            }
            
            ,
            { 
              "name": "Cloud Computing Tutorial", 
              "type": "video", 
              "course": "CSE403",
              "code": "CLOUD-2023-08",
              "size": "45MB",
              "url": "https://youtu.be/gIWel4gFZaY?t=0&si=NSuyDnHjRGVzKijC",
              "free_link": "<a href='https://youtu.be/gIWel4gFZaY?t=0&si=NSuyDnHjRGVzKijC' target='_blank'>Watch Tutorial</a>",
              "views": 210,
              "downloads": 132,
              "uploaded": "2023-09-18",
              "author": "Dr. Kapil Chaturvedi"
            }
            ,
                { 
                  name: "Java Programming Full Course", 
                  type: "youtube", 
                  course: "CSE404",
                  code: "JAVA-2023-05",
                  size: "Online",
                  url: "https://youtu.be/VlPiVmYuoqw?si=Hi7WTxy3qYkMDSXL",
                  views: 356,
                  uploaded: "2023-08-22",
                  author: "FreeCodeCamp"
                },
                { 
                  name: "Database Design Fundamentals", 
                  type: "youtube", 
                  course: "CSE401",
                  code: "DB-DESIGN-2023-03",
                  size: "Online",
                  url: "https://www.youtube.com/embed/ztHopE5Wnpc",
                  views: 287,
                  uploaded: "2023-07-15",
                  author: "MIT OpenCourseWare"
                },
                { 
                  name: "Algorithms Cheat Sheet", 
                  type: "pdf", 
                  course: "CSE405",
                  code: "ALGO-2023-09",
                  size: "15MB",
                  url: "https://example.com/algorithms.pdf",
                  views: 178,
                  downloads: 143,
                  uploaded: "2023-10-05",
                  author: "Prof. Navjot Kaur"
                },
                { 
                  name: "React Sample Projects", 
                  type: "code", 
                  course: "CSE406",
                  code: "REACT-2023-11",
                  size: "28MB",
                  url: "https://github.com/isinghranjeet/next.js-Examination-Manegement-system-",
                  views: 312,
                  downloads: 204,
                  uploaded: "2023-11-20",
                  author: "CodeAcademy"
                },
                { 
                  name: "Python Data Science Handbook", 
                  type: "pdf", 
                  course: "CSE407",
                  code: "PYTHON-2023-07",
                  size: "22MB",
                  url: "https://example.com/python-handbook.pdf",
                  views: 198,
                  downloads: 167,
                  uploaded: "2023-09-30",
                  author: "Jake VanderPlas"
                }
              ].map((resource, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <motion.div 
                    className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} shadow-sm border-0`}
                    whileHover={{ y: -5, boxShadow: darkMode ? "0 10px 15px rgba(0,0,0,0.3)" : "0 10px 15px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-start mb-3">
                        <span className={`badge ${
                          resource.type === "pdf" 
                            ? "bg-danger bg-opacity-10 text-danger" 
                            : resource.type === "ppt" 
                              ? "bg-warning bg-opacity-10 text-warning"
                              : resource.type === "code"
                                ? "bg-success bg-opacity-10 text-success"
                                : resource.type === "youtube"
                                  ? "bg-danger bg-opacity-10 text-danger" 
                                  : "bg-info bg-opacity-10 text-info"
                        } me-3 p-3 rounded`}>
                          {resource.type === "pdf" ? <FileText size={20} /> : 
                           resource.type === "ppt" ? <File size={20} /> : 
                           resource.type === "code" ? <Code size={20} /> :
                           resource.type === "youtube" ? <Youtube size={20} /> : <Video size={20} />}
                        </span>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{resource.name}</h6>
                          <small className="text-muted d-block">
                            {resource.course} • {resource.code}
                          </small>
                          <small className="text-muted">
                            {resource.size} • {resource.views} views
                          </small>
                        </div>
                        <button className="btn btn-sm btn-link p-0">
                          <Bookmark size={16} className="text-muted" />
                        </button>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">
                            Uploaded: {new Date(resource.uploaded).toLocaleDateString()}
                          </small>
                          <small className="text-muted">
                            {resource.author}
                          </small>
                        </div>
                        
                        <div className="d-flex justify-content-between gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary flex-grow-1"
                            onClick={() => {
                              if (resource.type === "youtube") {
                                setSelectedVideo(resource.url);
                                setShowVideoModal(true);
                              } else if (resource.type === "code") {
                                window.open(resource.url, '_blank');
                              } else {
                                // Implement preview logic for other types
                                window.open(resource.url, '_blank');
                              }
                            }}
                          >
                            {resource.type === "youtube" ? "Watch" : 
                             resource.type === "code" ? "View Code" : "Preview"}
                          </button>
                          
                          {resource.type !== "youtube" && resource.type !== "code" ? (
                            <a 
                              href={resource.url} 
                              className="btn btn-sm btn-primary flex-grow-1"
                              download
                            >
                              <Download size={16} className="me-1" /> Download
                            </a>
                          ) : (
                            <a 
                              href={resource.type === "youtube" 
                                ? resource.url.replace('embed/', 'watch?v=') 
                                : resource.url} 
                              className={`btn btn-sm ${
                                resource.type === "youtube" ? "btn-danger" : "btn-success"
                              } flex-grow-1`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {resource.type === "youtube" ? (
                                <>
                                  <Youtube size={16} className="me-1" /> YouTube
                                </>
                              ) : (
                                <>
                                  <Github size={16} className="me-1" /> GitHub
                                </>
                              )}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
            
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className="page-item disabled">
                    <span className="page-link">Previous</span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">1</span>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>



    {/* YouTube Video Modal */}
    {showVideoModal && (
      <div className={`modal fade show d-block`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className={`modal-content ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="modal-header">
              <h5 className="modal-title">Video Player</h5>
              <button 
                type="button" 
                className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                onClick={() => setShowVideoModal(false)}
              ></button>
            </div>
            <div className="modal-body p-0">
              <div className="ratio ratio-16x9">
                <iframe 
                  src={selectedVideo} 
                  title="YouTube video" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="rounded"
                ></iframe>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className={`btn ${darkMode ? "btn-dark" : "btn-light"}`}
                onClick={() => setShowVideoModal(false)}
              >
                Close
              </button>
              <a 
                href={selectedVideo.replace('embed/', 'watch?v=')} 
                className="btn btn-danger"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube size={16} className="me-1" /> Open in YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Dark mode overlay for video modal */}
    {showVideoModal && (
      <div 
        className={`modal-backdrop fade show`}
        style={{ backgroundColor: darkMode ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)" }}
        onClick={() => setShowVideoModal(false)}
      ></div>
    )}
  </div>
)}




{/* Messages Tab - Enhanced Version */}
{activeTab === "messages" && (
  <div className="container-fluid">
    <div className="row mb-4">
      <div className="col-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`card ${darkMode ? "bg-dark border-light" : "bg-white"} shadow-lg rounded-lg overflow-hidden`}
        >
          <div className="card-header d-flex justify-content-between align-items-center p-3">
            <div className="d-flex align-items-center">
              <Mail size={20} className={`me-2 ${darkMode ? "text-primary" : "text-primary"}`} />
              <h4 className="mb-0 fw-bold">Your Messages</h4>
              {unreadMessages > 0 && (
                <span className="badge bg-danger rounded-pill ms-2 animate-pulse">
                  {unreadMessages} unread
                </span>
              )}
            </div>
           
          </div>
          
          <div className="card-body p-0">
            {/* Search and Filter Bar */}
            <div className={`p-3 border-bottom ${darkMode ? "bg-dark border-light" : "bg-light"}`}>
              <div className="input-group">
                <span className={`input-group-text ${darkMode ? "bg-dark text-light" : ""}`}>
                  <Search size={16} />
                </span>
                <input 
                  type="text" 
                  className={`form-control ${darkMode ? "bg-dark text-light border-light" : ""}`} 
                  placeholder="Search messages..." 
                />
                <button className={`btn ${darkMode ? "btn-outline-light" : "btn-outline-secondary"}`}>
                  Filter
                </button>
              </div>
            </div>
            
            {/* Message List with Enhanced UI */}
            <div className="list-group list-group-flush message-list">
              {messages.length === 0 ? (
                <div className={`text-center py-5 ${darkMode ? "text-light" : "text-muted"}`}>
                  <Inbox size={48} className="mb-3" />
                  <h5>No messages yet</h5>
                  <p>Start a conversation by sending a new message</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`list-group-item list-group-item-action ${darkMode ? "bg-dark" : ""} 
                      ${!message.read ? "unread-message" : ""} p-3`}
                    whileHover={{ 
                      scale: 1.005,
                      backgroundColor: darkMode ? "rgba(33, 150, 243, 0.1)" : "rgba(13, 110, 253, 0.05)"
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="d-flex align-items-start">
                      <div className={`flex-shrink-0 me-3 avatar ${message.important ? "important" : ""}`}>
                        <div className={`rounded-circle p-2 ${darkMode ? "bg-primary bg-opacity-25" : "bg-primary bg-opacity-10"}`}>
                          {message.senderPhoto ? (
                            <img src={message.senderPhoto} alt={message.sender} className="rounded-circle" width="40" height="40" />
                          ) : (
                            <User size={20} className={darkMode ? "text-primary" : "text-primary"} />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className={`mb-0 ${!message.read ? "fw-bold" : ""}`}>
                            {message.sender}
                            {message.important && (
                              <Star size={16} className={`ms-2 ${darkMode ? "text-warning" : "text-warning"}`} fill="currentColor" />
                            )}
                          </h6>
                          <small className={`${darkMode ? "text-light" : "text-muted"}`}>
                            {message.time}
                          </small>
                        </div>
                        <p className={`mb-1 ${darkMode ? "text-light" : ""}`}>
                          {message.text.length > 100 ? `${message.text.substring(0, 100)}...` : message.text}
                        </p>
                        {message.attachments && (
                          <div className="mt-2">
                            <Paperclip size={14} className="me-1" />
                            <small className="text-muted">1 attachment</small>
                          </div>
                        )}
                      </div>
                      {!message.read && (
                        <div className="flex-shrink-0 ms-3">
                          <span className="badge bg-primary rounded-pill">New</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Pagination */}
            {messages.length > 0 && (
              <div className={`p-3 border-top ${darkMode ? "bg-dark border-light" : "bg-light"}`}>
                <nav aria-label="Message pagination">
                  <ul className="pagination justify-content-center mb-0">
                    <li className="page-item disabled">
                      <a className={`page-link ${darkMode ? "bg-dark text-light" : ""}`} href="#" tabIndex="-1">
                        Previous
                      </a>
                    </li>
                    <li className="page-item active">
                      <a className={`page-link ${darkMode ? "bg-primary border-primary" : ""}`} href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a className={`page-link ${darkMode ? "bg-dark text-light" : ""}`} href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className={`page-link ${darkMode ? "bg-dark text-light" : ""}`} href="#">
                        3
                      </a>
                    </li>
                    <li className="page-item">
                      <a className={`page-link ${darkMode ? "bg-dark text-light" : ""}`} href="#">
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  </div>
)}



        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 mb-4">
                <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow`}>
                  <div className="card-header">
                    <h4 className="mb-0">Profile Settings</h4>
                  </div>
                  <div className="card-body">
                    {isEditingProfile ? (
                      <div>
                        <div className="mb-3">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={tempProfileData.name}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={tempProfileData.email}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Bio</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="bio"
                            value={tempProfileData.bio}
                            onChange={handleProfileChange}
                          ></textarea>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-primary" onClick={saveProfile}>
                            Save Changes
                          </button>
                          <button className="btn btn-outline-secondary" onClick={cancelEditProfile}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-center mb-4">
                          <div className="position-relative d-inline-block">
                            <img
                              src={profilePic || "https://media.licdn.com/dms/image/v2/D5603AQGDt02qOvcBMA/profile-displayphoto-shrink_200_200/B56ZUh8ITVHEAk-/0/1740031169550?e=1748476800&v=beta&t=FfgFhNGwozPFtuOjo_C1BaBDPnRNv_LS1g3hI4DpfY0"}
                              alt="Profile"
                              className="rounded-circle border border-3 border-primary"
                              style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                            <button 
                              className="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle"
                              onClick={() => fileInputRef.current.click()}
                            >
                              <Camera size={16} />
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              accept="image/*"
                              onChange={handleProfilePicChange}
                            />
                          </div>
                          <h5 className="mt-3 mb-1">{profileData.name}</h5>
                          <p className="text-muted">{profileData.email}</p>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Department</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profileData.department}
                            readOnly
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Semester</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profileData.semester}
                            readOnly
                          />
                        </div>
                        <button 
                          className="btn btn-primary w-100"
                          onClick={startEditProfile}
                        >
                          <Edit size={16} className="me-1" /> Edit Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-8 mb-4">
                <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow`}>
                  <div className="card-header">
                    <h4 className="mb-0">Account Settings</h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} border-0`}>
                          <div className="card-body">
                            <h5 className="mb-3">Appearance</h5>
                            <div className="mb-3">
                              <label className="form-label">Theme Color</label>
                              <div className="d-flex flex-wrap gap-2">
                                {themeColors.map((color, index) => (
                                  <div 
                                    key={index}
                                    className={`color-option rounded-circle ${themeColor === color.value ? "selected" : ""}`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setThemeColor(color.value)}
                                  >
                                    {themeColor === color.value && (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                                      </svg>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Dark Mode</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="darkModeSwitch"
                                  checked={darkMode}
                                  onChange={() => setDarkMode(!darkMode)}
                                />
                                <label className="form-check-label" htmlFor="darkModeSwitch">
                                  {darkMode ? "Dark" : "Light"} Theme
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} border-0`}>
                          <div className="card-body">
                            <h5 className="mb-3">Notifications</h5>
                            <div className="mb-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="assignmentNotifications"
                                  defaultChecked
                                />
                                <label className="form-check-label" htmlFor="assignmentNotifications">
                                  Assignment Deadlines
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="gradeNotifications"
                                  defaultChecked
                                />
                                <label className="form-check-label" htmlFor="gradeNotifications">
                                  Grade Updates
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="eventNotifications"
                                  defaultChecked
                                />
                                <label className="form-check-label" htmlFor="eventNotifications">
                                  University Events
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="courseNotifications"
                                />
                                <label className="form-check-label" htmlFor="courseNotifications">
                                  New Course Materials
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} border-0`}>
                          <div className="card-body">
                            <h5 className="mb-3">Change Password</h5>
                            <div className="mb-3">
                              <label className="form-label">Current Password</label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Enter current password"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">New Password</label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Enter new password"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Confirm Password</label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm new password"
                              />
                            </div>
                            <button className="btn btn-primary">Update Password</button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className={`card h-100 ${darkMode ? "bg-dark" : "bg-white"} border-0`}>
                          <div className="card-body">
                            <h5 className="mb-3">Account Security</h5>
                            <div className="mb-3">
                              <label className="form-label">Two-Factor Authentication</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="twoFactorAuth"
                                />
                                <label className="form-check-label" htmlFor="twoFactorAuth">
                                  Enable 2FA
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Login Activity</label>
                              <div className="d-flex align-items-center justify-content-between">
                                <small>Last login: Today, 10:30 AM</small>
                                <button className="btn btn-sm btn-link">View All</button>
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Connected Devices</label>
                              <div className="d-flex align-items-center justify-content-between">
                                <small>This device (Chrome, Windows)</small>
                                <button className="btn btn-sm btn-link">Manage</button>
                              </div>
                            </div>
                            <button className="btn btn-danger w-100 mt-2">
                              <LogOut size={16} className="me-1" /> Logout All Sessions
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
        )}




{/* Attractive Exam Section with Icons */}
{activeTab === "exam" && (
  <div className="container-fluid">
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className={`card ${darkMode ? "bg-dark border-light" : "bg-white border-0"} border-0 shadow-lg rounded-4 overflow-hidden`}>
          <div className={`card-header ${darkMode ? "bg-dark" : "bg-light"} py-3`}>
            <h4 className="mb-0 text-center">
              <BookOpen size={24} className="me-2 align-middle" />
              <span className="align-middle">Examination Portal</span>
            </h4>
          </div>
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-md-6">
                <Link 
                  href="/exam" 
                  className={`card h-100 text-decoration-none ${darkMode ? "bg-dark border-primary" : "bg-light border-0"} border-2 shadow-sm rounded-3 p-3 text-center transition-all hover-scale`}
                >
                  <div className="card-body">
                    <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                      <Calendar size={32} className="text-primary" />
                    </div>
                    <h5 className="mb-2">Exam Schedule</h5>
                    <p className={`small mb-0 ${darkMode ? "text-light" : "text-muted"}`}>
                      View your upcoming exam dates
                    </p>
                  </div>
                </Link>
              </div>
              
              <div className="col-md-6">
                <Link 
                  href="/coding" 
                  className={`card h-100 text-decoration-none ${darkMode ? "bg-dark border-success" : "bg-light border-0"} border-2 shadow-sm rounded-3 p-3 text-center transition-all hover-scale`}
                >
                  <div className="card-body">
                    <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                      <Code size={32} className="text-success" />
                    </div>
                    <h5 className="mb-2">Coding Tests</h5>
                    <p className={`small mb-0 ${darkMode ? "text-light" : "text-muted"}`}>
                      Practice coding challenges
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


        
{/* Payment Tab */}
{activeTab === "payment" && (
  <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow`}>
          <div className="card-header">
            <h4 className="mb-0">Payment Portal</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className={`card ${darkMode ? "bg-dark" : "bg-white"} border-success shadow-sm`}>
                  <div className="card-body">
                    <h5 className="mb-3">Fee Summary</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tuition Fee</span>
                      <span>₹25,000</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Hostel Fee</span>
                      <span>₹15,000</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Library Fee</span>
                      <span>₹2,000</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Other Charges</span>
                      <span>₹3,000</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total Amount Due</span>
                      <span>₹45,000</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`card ${darkMode ? "bg-dark" : "bg-white"} border-primary shadow-sm`}>
                  <div className="card-body">
                    <h5 className="mb-3">Make Payment</h5>
                    <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <select className={`form-select ${darkMode ? "bg-dark text-white" : ""}`}>
                        <option>Credit/Debit Card</option>
                        <option>Net Banking</option>
                        <option>UPI</option>
                        <option>Wallet</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value="₹45,000" 
                        readOnly 
                      />
                    </div>
                    <Link href="/payment" className="btn btn-primary w-100">
                      Proceed to Payment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Library Tab */}
{activeTab === "library" && (
  <div className="container-fluid">
    <div className="row">
      <div className="col-12">
        <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow`}>
          <div className="card-body text-center p-5">
            <Link href="/library" className="btn btn-primary btn-lg">
              Go to Library
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Feedback Tab - Improved UI */}
{activeTab === "feedback" && (
  <div className="container-fluid">
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className={`card ${darkMode ? "bg-dark" : "bg-white"} shadow-lg rounded-lg overflow-hidden`}>
          <div className="card-header bg-gradient-primary text-white">
            <h4 className="mb-0 text-center">Feedback Portal</h4>
          </div>
          <div className="card-body p-4">
            <div className="d-flex flex-column gap-4">
              <Link 
                href="/feedback" 
                className={`btn btn-primary btn-lg py-3 rounded-pill shadow-sm ${darkMode ? 'border border-light' : ''}`}
              >
                <FileText size={20} className="me-2" />
                Course Feedback
              </Link>
              
              <Link 
                href="/feedback" 
                className={`btn btn-secondary btn-lg py-3 rounded-pill shadow-sm ${darkMode ? 'border border-light' : ''}`}
              >
                <User size={20} className="me-2" />
                Faculty Feedback
              </Link>
            </div>
            
            <div className="mt-4 text-center">
              <small className={`text-muted ${darkMode ? 'text-light' : ''}`}>
                Your feedback helps us improve the learning experience
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </main>

      {/* Screen Time Modal */}
      <div className={`modal fade ${showScreenTimeModal ? "show d-block" : ""}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="modal-header">
              <h5 className="modal-title">Screen Time Analytics</h5>
              <button 
                type="button" 
                className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                onClick={() => setShowScreenTimeModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row mb-4">
                <div className="col-6 text-center">
                  <h1 className="display-5">{formatTime(screenTime)}</h1>
                  <small className="text-muted">Total Screen Time</small>
                </div>
                <div className="col-6 text-center">
                  <h1 className="display-5">{formatTime(activeTime)}</h1>
                  <small className="text-muted">Active Time</small>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Daily Screen Time Goal</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    value={screenTimeGoal}
                    onChange={(e) => setScreenTimeGoal(e.target.value)}
                  />
                  <span className="input-group-text">minutes</span>
                </div>
              </div>
              <div className="progress mb-3" style={{ height: "10px" }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${Math.min(100, (screenTime / screenTimeGoal) * 100)}%` }}
                ></div>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <small className="text-muted">Daily Progress</small>
                <small className="text-muted">
                  {Math.min(100, Math.round((screenTime / screenTimeGoal) * 100))}%
                </small>
              </div>
              <div style={{ height: "200px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { day: 'Mon', time: 45 },
                      { day: 'Tue', time: 90 },
                      { day: 'Wed', time: 60 },
                      { day: 'Thu', time: 120 },
                      { day: 'Fri', time: 75 },
                      { day: 'Sat', time: 30 },
                      { day: 'Sun', time: 15 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#495057" : "#e9ecef"} />
                    <XAxis 
                      dataKey="day" 
                      stroke={darkMode ? "#dee2e6" : "#495057"} 
                    />
                    <YAxis 
                      stroke={darkMode ? "#dee2e6" : "#495057"} 
                    />
                    <Tooltip 
                      contentStyle={
                        darkMode 
                          ? { backgroundColor: "#212529", borderColor: "#495057" } 
                          : { backgroundColor: "#fff", borderColor: "#dee2e6" }
                      }
                    />
                    <Area 
                      type="monotone" 
                      dataKey="time" 
                      name="Screen Time (min)" 
                      stroke={themeColor}
                      fill={themeColor}
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className={`btn ${darkMode ? "btn-dark" : "btn-light"}`}
                onClick={() => setShowScreenTimeModal(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  toast.success("Screen time goal updated!");
                  setShowScreenTimeModal(false);
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <div className={`modal fade ${showFeedbackModal ? "show d-block" : ""}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${darkMode ? "bg-dark" : "bg-white"}`}>
            <div className="modal-header">
              <h5 className="modal-title">Send Feedback</h5>
              <button 
                type="button" 
                className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                onClick={() => setShowFeedbackModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Your Feedback</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="What do you think about the dashboard? How can we improve?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      className={`btn ${feedback.length >= star * 20 ? "btn-warning" : darkMode ? "btn-dark" : "btn-light"}`}
                      onClick={() => setFeedback("".padEnd(star * 20, "⭐"))}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className={`btn ${darkMode ? "btn-dark" : "btn-light"}`}
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={submitFeedback}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dark mode overlay for modals */}
      {showScreenTimeModal || showFeedbackModal ? (
        <div 
          className={`modal-backdrop fade ${showScreenTimeModal || showFeedbackModal ? "show" : ""}`}
          style={{ backgroundColor: darkMode ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)" }}
          onClick={() => {
            setShowScreenTimeModal(false);
            setShowFeedbackModal(false);
          }}
        ></div>
      ) : null}
    </div>
  );
};

export default LoginPage;