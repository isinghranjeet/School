"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCode, FaQuestionCircle, FaTerminal, FaRobot, FaHistory, FaChartLine, FaSun, FaMoon, FaCopy, FaVolumeUp, FaRedo, FaSave, FaCog, FaPlay, FaLightbulb, FaInfoCircle, FaShare, FaDownload, FaUpload, FaUsers, FaTrophy, FaMagic, FaUserFriends, FaSyncAlt } from "react-icons/fa";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion, AnimatePresence } from "framer-motion";

export default function CodingPage() {
  // State variables
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showMetrics, setShowMetrics] = useState(false);
  const [codeHistory, setCodeHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [aiAssistMode, setAiAssistMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [hasCompiled, setHasCompiled] = useState(false);
  const [codeLevel, setCodeLevel] = useState(null);
  const [difficulty, setDifficulty] = useState("Easy");
  const [fontSize, setFontSize] = useState(14);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState({
    problemsSolved: 0,
    linesWritten: 0,
    efficiency: 0
  });
  const [showCodeShare, setShowCodeShare] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  const [collaboratorCode, setCollaboratorCode] = useState("");
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const [typingEffect, setTypingEffect] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const editorRef = useRef(null);

  // Three.js Refs
  const threeContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationRef = useRef(null);
  const codeCubeRef = useRef(null);
  const outputPlaneRef = useRef(null);
  const particlesRef = useRef([]);

  // Typing effect for welcome message
  useEffect(() => {
    const welcomeMessage = "Welcome to CodeCraft Studio";
    const timer = setTimeout(() => {
      if (typingIndex < welcomeMessage.length) {
        setTypingEffect(welcomeMessage.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [typingIndex]);

  // Initialize dark mode after component mounts
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedMode ? savedMode === 'true' : prefersDark);
  }, []);

  // Apply dark mode and system preference listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('darkMode', darkMode.toString());

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
      toast.info(`System theme changed to ${e.matches ? 'dark' : 'light'} mode`, {
        icon: e.matches ? <FaMoon /> : <FaSun />
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [darkMode]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load history and stats from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('codeHistory');
    const savedStats = localStorage.getItem('userStats');
    
    if (savedHistory) {
      setCodeHistory(JSON.parse(savedHistory));
    }
    
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    
    // Simulate leaderboard data
    setLeaderboard([
      { id: 1, name: "Anand", score: 950, problems: 42, avatar: "👨‍💻" },
      { id: 2, name: "Shivam", score: 890, problems: 38, avatar: "🧑‍💻" },
      { id: 3, name: "Gautam", score: 820, problems: 35, avatar: "👩‍💻" },
      { id: 4, name: "Prakash", score: 820, problems: 35, avatar: "👨‍💻" },
      { id: 5, name: "You", score: 780, problems: 32, avatar: "😎" },
      { id: 6, name: "Satyam", score: 750, problems: 30, avatar: "🧑‍💻" }
    ]);
    
    // Simulate collaborators
    setCollaborators([
      { id: 1, name: "Ranjeet", online: true, avatar: "👨‍💻" },
      { id: 2, name: "Anand", online: false, avatar: "👩‍💻" },
      { id: 3, name: "Shivam", online: true, avatar: "🧑‍💻" }
    ]);
  }, []);

  // Simulate real-time collaboration updates
  useEffect(() => {
    if (!showCollaboration) return;
    
    const interval = setInterval(() => {
      if (collaborators.some(c => c.online)) {
        const randomCollaborator = collaborators.find(c => c.online);
        const update = {
          id: Date.now(),
          collaborator: randomCollaborator.name,
          change: `Changed line ${Math.floor(Math.random() * 10) + 1}`,
          timestamp: new Date().toLocaleTimeString(),
          avatar: randomCollaborator.avatar
        };
        setRealTimeUpdates(prev => [update, ...prev.slice(0, 4)]);
        
        if (Math.random() > 0.7) {
          setCollaboratorCode(prev => 
            prev ? prev + "\n// " + randomCollaborator.name + " made changes" 
                 : "// " + randomCollaborator.name + " made changes"
          );
          toast.info(`${randomCollaborator.name} made changes to the code`, {
            icon: <FaUserFriends />
          });
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [showCollaboration, collaborators]);

  // Initialize Three.js scene
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(darkMode ? 0x111111 : 0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      threeContainerRef.current.clientWidth,
      threeContainerRef.current.clientHeight
    );
    rendererRef.current = renderer;
    threeContainerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create code cube
    const codeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const codeMaterial = new THREE.MeshPhongMaterial({
      color: 0x3498db,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    const codeCube = new THREE.Mesh(codeGeometry, codeMaterial);
    codeCube.position.set(-1.5, 0, 0);
    scene.add(codeCube);
    codeCubeRef.current = codeCube;

    // Create output plane
    const outputGeometry = new THREE.PlaneGeometry(2, 2);
    const outputMaterial = new THREE.MeshPhongMaterial({
      color: 0x2ecc71,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
      transparent: true,
      opacity: 0.8,
    });
    const outputPlane = new THREE.Mesh(outputGeometry, outputMaterial);
    outputPlane.position.set(1.5, 0, 0);
    outputPlane.rotation.x = Math.PI / 4;
    scene.add(outputPlane);
    outputPlaneRef.current = outputPlane;

    // Create floating code particles
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
    
    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      particle.userData.velocity = new THREE.Vector3(
        Math.random() * 0.01 - 0.005,
        Math.random() * 0.01 - 0.005,
        Math.random() * 0.01 - 0.005
      );
      scene.add(particle);
      particles.push(particle);
    }
    particlesRef.current = particles;

    // Create floating text particles
    const textParticles = [];
    const loader = new THREE.TextureLoader();
    const textTexture = loader.load('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="50" y="50" font-family="Arial" font-size="50" text-anchor="middle" dominant-baseline="middle" fill="%23000000">{ }</text></svg>');
    
    for (let i = 0; i < 20; i++) {
      const textMaterial = new THREE.SpriteMaterial({ 
        map: textTexture,
        color: darkMode ? 0xffffff : 0x000000,
        transparent: true,
        opacity: 0.5
      });
      const textParticle = new THREE.Sprite(textMaterial);
      textParticle.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      textParticle.scale.set(0.5, 0.5, 0.5);
      textParticle.userData.velocity = new THREE.Vector3(
        Math.random() * 0.01 - 0.005,
        Math.random() * 0.01 - 0.005,
        Math.random() * 0.01 - 0.005
      );
      scene.add(textParticle);
      textParticles.push(textParticle);
    }

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate cubes slightly
      if (codeCubeRef.current) {
        codeCubeRef.current.rotation.x += 0.005;
        codeCubeRef.current.rotation.y += 0.005;
      }
      
      if (outputPlaneRef.current) {
        outputPlaneRef.current.rotation.z += 0.002;
      }
      
      // Update particles
      particlesRef.current.forEach(particle => {
        particle.position.add(particle.userData.velocity);
        
        // Bounce off boundaries
        if (particle.position.x > 5 || particle.position.x < -5) {
          particle.userData.velocity.x *= -1;
        }
        if (particle.position.y > 5 || particle.position.y < -5) {
          particle.userData.velocity.y *= -1;
        }
        if (particle.position.z > 5 || particle.position.z < -5) {
          particle.userData.velocity.z *= -1;
        }
      });
      
      controlsRef.current?.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        threeContainerRef.current.clientWidth,
        threeContainerRef.current.clientHeight
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      threeContainerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update Three.js scene when dark mode changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(darkMode ? 0x111111 : 0xf0f0f0);
    }
  }, [darkMode]);

  // Update code cube when code changes
  useEffect(() => {
    if (!codeCubeRef.current) return;
    
    // Change color based on code length
    const codeLength = code.length;
    const hue = (codeLength % 360) / 360;
    const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
    codeCubeRef.current.material.color = color;
    
    // Scale based on code complexity
    const scale = 1 + (code.split('\n').length / 100);
    codeCubeRef.current.scale.set(scale, scale, scale);
  }, [code]);

  // Update output plane when output changes
  useEffect(() => {
    if (!outputPlaneRef.current) return;
    
    // Change color based on output content
    if (output.includes("Error")) {
      outputPlaneRef.current.material.color.setHex(0xe74c3c);
    } else if (output.includes("Success")) {
      outputPlaneRef.current.material.color.setHex(0x2ecc71);
    } else {
      outputPlaneRef.current.material.color.setHex(0xf1c40f);
    }
    
    // Pulsate when output updates
    outputPlaneRef.current.scale.set(1.1, 1.1, 1);
    setTimeout(() => {
      if (outputPlaneRef.current) {
        outputPlaneRef.current.scale.set(1, 1, 1);
      }
    }, 300);
  }, [output]);

  // Languages and questions data
  const languages = [
    { name: "Java", value: "java", id: 62, icon: "java" },
    { name: "C++", value: "cpp", id: 54, icon: "cplusplus" },
    { name: "Python", value: "python", id: 71, icon: "python" },
    { name: "JavaScript", value: "javascript", id: 63, icon: "javascript" },
    { name: "Go", value: "go", id: 60, icon: "golang" },
    { name: "Rust", value: "rust", id: 73, icon: "rust" },
    { name: "C", value: "c", id: 50, icon: "c" },
    { name: "C#", value: "csharp", id: 51, icon: "csharp" },
    { name: "PHP", value: "php", id: 68, icon: "php" },
    { name: "Ruby", value: "ruby", id: 72, icon: "ruby" },
    { name: "Swift", value: "swift", id: 83, icon: "swift" },
    { name: "Kotlin", value: "kotlin", id: 78, icon: "kotlin" },
    { name: "TypeScript", value: "typescript", id: 74, icon: "typescript" },
  ];

  const questions = {
    java: {
      Easy: [
        {
          title: "Hello World",
          description: "Write a Java program to print 'Hello, World!'.",
          solution: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
          explanation: "This is a basic Java program that demonstrates the main method structure and console output.",
          testCases: [
            { input: "", output: "Hello, World!" }
          ]
        },
        {
          title: "Add Two Numbers",
          description: "Write a Java program to add two numbers.",
          solution: `public class Main {
  public static void main(String[] args) {
    int num1 = 5, num2 = 10;
    System.out.println("Sum: " + (num1 + num2));
  }
}`,
          explanation: "This program shows variable declaration, initialization, and basic arithmetic operations.",
          testCases: [
            { input: "5 10", output: "Sum: 15" }
          ]
        }
      ],
      Medium: [
        {
          title: "Factorial",
          description: "Write a Java program to find the factorial of a number.",
          solution: `public class Main {
  public static void main(String[] args) {
    int num = 5, factorial = 1;
    for(int i = 1; i <= num; i++) {
      factorial *= i;
    }
    System.out.println("Factorial: " + factorial);
  }
}`,
          explanation: "This demonstrates a for loop and the factorial calculation algorithm.",
          testCases: [
            { input: "5", output: "Factorial: 120" }
          ]
        },
        {
          title: "String Reverse",
          description: "Write a Java program to reverse a string.",
          solution: `public class Main {
  public static void main(String[] args) {
    String str = "Hello";
    String reversed = new StringBuilder(str).reverse().toString();
    System.out.println("Reversed: " + reversed);
  }
}`,
          explanation: "Demonstrates string manipulation using StringBuilder's reverse method.",
          testCases: [
            { input: "Hello", output: "Reversed: olleH" }
          ]
        }
      ],
      Hard: [
        {
          title: "Prime Check",
          description: "Write a Java program to check if a number is prime.",
          solution: `public class Main {
  public static void main(String[] args) {
    int num = 29;
    boolean isPrime = true;
    for(int i = 2; i <= num/2; i++) {
      if(num % i == 0) {
        isPrime = false;
        break;
      }
    }
    System.out.println(num + (isPrime ? " is prime" : " is not prime"));
  }
}`,
          explanation: "This program shows how to check for prime numbers using a loop and conditional logic.",
          testCases: [
            { input: "29", output: "29 is prime" },
            { input: "30", output: "30 is not prime" }
          ]
        },
        {
          title: "Fibonacci Series",
          description: "Write a Java program to print Fibonacci series up to n terms.",
          solution: `public class Main {
  public static void main(String[] args) {
    int n = 10, t1 = 0, t2 = 1;
    System.out.print("Fibonacci Series: ");
    for (int i = 1; i <= n; ++i) {
      System.out.print(t1 + " ");
      int sum = t1 + t2;
      t1 = t2;
      t2 = sum;
    }
  }
}`,
          explanation: "Demonstrates Fibonacci series generation using loops and variables.",
          testCases: [
            { input: "10", output: "Fibonacci Series: 0 1 1 2 3 5 8 13 21 34 " }
          ]
        }
      ]
    },
    python: {
      Easy: [
        {
          title: "Hello World",
          description: "Write a Python program to print 'Hello, World!'.",
          solution: `print("Hello, World!")`,
          explanation: "This is the simplest Python program that prints to the console.",
          testCases: [
            { input: "", output: "Hello, World!" }
          ]
        }
      ]
    },
    javascript: {
      Easy: [
        {
          title: "Hello World",
          description: "Write a JavaScript program to print 'Hello, World!'.",
          solution: `console.log("Hello, World!");`,
          explanation: "Basic JavaScript program using console.log.",
          testCases: [
            { input: "", output: "Hello, World!" }
          ]
        }
      ]
    }
  };

  // Add default questions for languages that don't have them
  languages.forEach(lang => {
    if (!questions[lang.value]) {
      questions[lang.value] = {
        Easy: [
          {
            title: "Hello World",
            description: `Write a ${lang.name} program to print 'Hello, World!'.`,
            solution: `// ${lang.name} Hello World example\n// Implement your solution here`,
            explanation: `This is a basic ${lang.name} program.`,
            testCases: [
              { input: "", output: "Hello, World!" }
            ]
          }
        ],
        Medium: [
          {
            title: "Basic Example",
            description: `Write a ${lang.name} program that demonstrates basic features.`,
            solution: `// ${lang.name} example\n// Implement your solution here`,
            explanation: `This demonstrates basic ${lang.name} features.`,
            testCases: [
              { input: "", output: "Example output" }
            ]
          }
        ],
        Hard: [
          {
            title: "Advanced Example",
            description: `Write a ${lang.name} program that demonstrates advanced features.`,
            solution: `// ${lang.name} advanced example\n// Implement your solution here`,
            explanation: `This demonstrates advanced ${lang.name} features.`,
            testCases: [
              { input: "", output: "Advanced output" }
            ]
          }
        ]
      };
    }
  });

  // All handler functions
  const handleRunCode = async (compileOnly = false) => {
    if (!code.trim()) {
      toast.warning("Please write some code before running!", {
        icon: "✏️"
      });
      return;
    }

    setIsLoading(true);
    setOutput("Running...");
    setProgress(0);
    setHasCompiled(true);
    addToHistory(code);

    try {
      const selectedLanguage = languages.find((lang) => lang.value === language);
      const currentQuestion = questions[language][difficulty][selectedQuestion];

      // Update user stats
      const newStats = {
        ...userStats,
        problemsSolved: userStats.problemsSolved + (compileOnly ? 0 : 1),
        linesWritten: userStats.linesWritten + code.split('\n').length
      };
      setUserStats(newStats);
      localStorage.setItem('userStats', JSON.stringify(newStats));

      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: selectedLanguage.id,
          stdin: "",
          expected_output: null,
          compile_only: compileOnly,
        },
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "5612f11fa3msh32f8f748d647453p1090d8jsne18a5b11a12e",
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      let outputResponse;

      do {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
        outputResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key": "5612f11fa3msh32f8f748d647453p1090d8jsne18a5b11a12e",
            },
          }
        );
      } while (outputResponse.data.status.id <= 2);

      setProgress(100);

      if (outputResponse.data.status.id === 3) {
        setOutput(outputResponse.data.stdout || "Code executed successfully with no output.");
        toast.success("Code executed successfully!", {
          icon: "✅"
        });
        analyzeCodeQuality();
      } else if (outputResponse.data.status.id === 4) {
        setOutput(outputResponse.data.compile_output || "Compilation error occurred.");
        toast.error("Compilation error!", {
          icon: "❌"
        });
      } else if (outputResponse.data.status.id === 5) {
        setOutput(outputResponse.data.stderr || "Runtime error occurred.");
        toast.error("Runtime error!", {
          icon: "⚠️"
        });
      } else {
        setOutput(outputResponse.data.message || "Unexpected response from server.");
        toast.info("Execution completed with status: " + outputResponse.data.status.description, {
          icon: "ℹ️"
        });
      }
    } catch (error) {
      setOutput("Error executing code: " + error.message);
      toast.error("Error executing code!", {
        icon: "❗"
      });
      console.error("Execution error:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const analyzeCodeQuality = () => {
    const lines = code.split('\n').filter(line => line.trim() !== '');
    const complexity = lines.length;
    const functions = code.match(/(function|def|public|private|protected)\s+\w+/g)?.length || 0;
    
    let level, feedback;
    if (complexity < 5) {
      level = "Beginner";
      feedback = "Simple implementation with basic constructs";
    } else if (complexity < 15) {
      level = "Intermediate";
      feedback = `Good structure with ${functions} functions and some complexity`;
    } else {
      level = "Advanced";
      feedback = `Complex implementation with ${functions} functions and multiple constructs`;
    }
    
    setCodeLevel({ level, feedback, complexity, functions });
  };

  const requestAiCodeReview = async () => {
    if (!code.trim()) {
      toast.warning("Please write some code before requesting a review!", {
        icon: "✏️"
      });
      return;
    }

    try {
      setIsLoading(true);
      toast.info("AI assistant is reviewing your code...", {
        icon: <FaRobot />
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentQuestion = questions[language][difficulty][selectedQuestion];
      let response = `AI Code Review (${difficulty} Level Problem):\n\n`;
      
      response += `Code Quality Analysis:\n`;
      response += `- ${codeLevel ? codeLevel.feedback : "Basic structure detected"}\n\n`;
      
      response += `Suggestions for Improvement:\n`;
      response += `1. Consider adding comments to explain complex logic\n`;
      response += `2. Break down large functions into smaller ones\n`;
      response += `3. Check for consistent indentation and formatting\n`;
      response += `4. Add error handling where appropriate\n\n`;
      
      response += `Best Practices for ${language}:\n`;
      response += `- Follow language-specific conventions\n`;
      response += `- Use meaningful variable names\n`;
      response += `- Test edge cases thoroughly\n`;
      
      setAiResponse(response);
      toast.success("AI code review completed!", {
        icon: "🤖"
      });
    } catch (error) {
      toast.error("AI review failed", {
        icon: "❌"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCode = () => {
    if (!code.trim()) {
      toast.warning("No code to format!", {
        icon: "✏️"
      });
      return;
    }

    try {
      // Simple formatting logic (can be enhanced with proper formatters)
      let formatted = code;
      
      // Indentation
      formatted = formatted.replace(/\t/g, '  ');
      
      // Trim trailing whitespace
      formatted = formatted.split('\n').map(line => line.trimEnd()).join('\n');
      
      // Ensure newline at end of file
      if (!formatted.endsWith('\n')) {
        formatted += '\n';
      }
      
      setCode(formatted);
      toast.success("Code formatted!", {
        icon: "✨"
      });
    } catch (error) {
      toast.error("Formatting failed", {
        icon: "❌"
      });
    }
  };

  const syncWithCollaborators = () => {
    if (!showCollaboration) {
      toast.warning("Collaboration mode is not active!", {
        icon: "👥"
      });
      return;
    }

    if (collaboratorCode) {
      setCode(prev => prev + "\n" + collaboratorCode);
      toast.success("Incorporated collaborator changes!", {
        icon: "🔄"
      });
      setCollaboratorCode("");
    } else {
      toast.info("No new changes from collaborators", {
        icon: "👥"
      });
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    toast.info(`Switched to ${newMode ? "Dark" : "Light"} mode`, {
      icon: newMode ? <FaMoon /> : <FaSun />
    });
  };

  const resetCode = () => {
    setCode("");
    setOutput("");
    setCodeLevel(null);
    setHasCompiled(false);
    toast.info("Code editor cleared!", {
      icon: "🧹"
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("Code copied to clipboard!", {
          icon: "📋"
        });
      })
      .catch((err) => {
        toast.error("Failed to copy code", {
          icon: "❌"
        });
        console.error("Copy error:", err);
      });
  };

  const speakOutput = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(output);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech is not supported in your browser.", {
        icon: "🔇"
      });
    }
  };

  const addToHistory = (codeSnap) => {
    if (codeSnap.trim()) {
      const newHistory = [
        {
          code: codeSnap,
          timestamp: new Date().toLocaleTimeString(),
          language,
          question: questions[language][difficulty][selectedQuestion].title
        },
        ...codeHistory.slice(0, 9)
      ];
      setCodeHistory(newHistory);
      localStorage.setItem('codeHistory', JSON.stringify(newHistory));
      toast.success("Code saved to history!", {
        icon: "💾"
      });
    }
  };

  const loadFromHistory = (index) => {
    setCode(codeHistory[index].code);
    setLanguage(codeHistory[index].language);
    toast.info("Code loaded from history", {
      icon: "⏳"
    });
  };

  const showSolution = () => {
    if (!hasCompiled) {
      toast.warning("Please compile your code first to see the solution!", {
        icon: "🔒"
      });
      return;
    }
    
    setCode(questions[language][difficulty][selectedQuestion].solution);
    toast.info("Solution loaded. Study and understand it!", {
      icon: "🔓"
    });
  };

  const requestAiHelp = async () => {
    if (!aiPrompt.trim()) {
      toast.warning("Please enter your question for the AI assistant", {
        icon: "❓"
      });
      return;
    }

    try {
      setIsLoading(true);
      toast.info("AI assistant is analyzing your code...", {
        icon: <FaRobot />
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentQuestion = questions[language][difficulty][selectedQuestion];
      let response = `AI Assistant Response (${difficulty} Level Problem):\n\n`;
      
      response += `Based on your question: "${aiPrompt}"\n\n`;
      response += `For this ${difficulty.toLowerCase()} problem ("${currentQuestion.title}"):\n`;
      response += `- ${currentQuestion.explanation}\n\n`;
      response += `General suggestions:\n`;
      response += `1. Make sure your syntax is correct for ${language}\n`;
      response += `2. Check for common mistakes\n`;
      response += `3. Consider breaking the problem into smaller steps\n`;
      response += `4. Test edge cases\n\n`;
      
      if (aiPrompt.toLowerCase().includes("example") || aiPrompt.toLowerCase().includes("solution")) {
        response += `Here's a partial solution to guide you:\n`;
        response += `${currentQuestion.solution.split('\n').slice(0, 5).join('\n')}...\n\n`;
        response += `Try implementing the rest yourself!`;
      } else {
        response += `Try implementing the solution step by step. You can do it!`;
      }
      
      setAiResponse(response);
      toast.success("AI assistant has provided guidance!", {
        icon: "🤖"
      });
    } catch (error) {
      toast.error("AI assistant failed to respond", {
        icon: "❌"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code-${language}-${Date.now()}.${language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Code downloaded!", {
      icon: "💾"
    });
  };

  const uploadCode = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
      toast.success("Code loaded from file!", {
        icon: "📂"
      });
    };
    reader.readAsText(file);
  };

  const generateShareLink = () => {
    const encodedCode = encodeURIComponent(code);
    const link = `${window.location.origin}${window.location.pathname}?code=${encodedCode}&lang=${language}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
    toast.success("Share link copied to clipboard!", {
      icon: "🔗"
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast.info(`Code recording ${!isRecording ? "started" : "stopped"}`, {
      icon: "🎥"
    });
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 1, 24));
    toast.info(`Font size increased to ${fontSize + 1}px`, {
      icon: "🔍"
    });
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 1, 10));
    toast.info(`Font size decreased to ${fontSize - 1}px`, {
      icon: "🔎"
    });
  };

  return (
    <div className={`min-vh-100 ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Three.js Container */}
      <div 
        ref={threeContainerRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          opacity: darkMode ? 0.1 : 0.2
        }}
      />
      
      {/* Navigation Bar */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"} shadow-sm`}>
        <div className="container">
          <motion.span 
            className="navbar-brand fw-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaCode className="me-2" />CodeCraft Studio
          </motion.span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="d-flex ms-auto align-items-center gap-2">
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setSelectedQuestion(0);
                }}
                className={`form-select form-select-sm me-2 ${darkMode ? "bg-secondary text-white" : ""}`}
                style={{ width: '100px' }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm btn-outline-secondary me-2" 
                onClick={() => setShowMetrics(!showMetrics)}
              >
                <FaChartLine className="me-1" />Metrics
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm btn-outline-secondary me-2" 
                onClick={() => setShowHistory(!showHistory)}
              >
                <FaHistory className="me-1" />History
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`btn btn-sm ${aiAssistMode ? "btn-success" : "btn-outline-success"} me-2`}
                onClick={() => setAiAssistMode(!aiAssistMode)}
              >
                <FaRobot className="me-1" />AI Assist
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm btn-outline-info me-2" 
                onClick={() => setShowCollaboration(!showCollaboration)}
              >
                <FaUserFriends className="me-1" />Collab
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm btn-outline-warning me-2" 
                onClick={() => setShowLeaderboard(!showLeaderboard)}
              >
                <FaTrophy className="me-1" />Leaderboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className={`btn btn-sm ${darkMode ? "btn-light" : "btn-dark"}`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4" style={{ position: 'relative', zIndex: 1 }}>
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`alert ${darkMode ? "alert-info" : "alert-primary"} mb-4 text-center`}
        >
          <h4 className="mb-0">{typingEffect}</h4>
          <small className="text-muted">Build, test, and collaborate on code in real-time</small>
        </motion.div>

        {/* Metrics Panel */}
        <AnimatePresence>
          {showMetrics && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`card mb-4 ${darkMode ? "bg-dark text-white" : ""}`} 
              style={{
                transform: 'perspective(1000px) rotateY(5deg)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <FaChartLine className="me-2" />Coding Metrics
                </h5>
                <div className="row">
                  <div className="col-md-3">
                    <div className="metric-card">
                      <h6>Time Spent</h6>
                      <p className="display-6">{formatTime(timeSpent)}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="metric-card">
                      <h6>Code Runs</h6>
                      <p className="display-6">{codeHistory.length}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="metric-card">
                      <h6>Problems Solved</h6>
                      <p className="display-6">{userStats.problemsSolved}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="metric-card">
                      <h6>Lines Written</h6>
                      <p className="display-6">{userStats.linesWritten}</p>
                    </div>
                  </div>
                </div>
                {codeLevel && (
                  <div className="mt-3">
                    <h6>Code Analysis</h6>
                    <div className="progress mb-2" style={{ height: '10px' }}>
                      <div 
                        className={`progress-bar ${codeLevel.level === 'Beginner' ? 'bg-success' : codeLevel.level === 'Intermediate' ? 'bg-warning' : 'bg-danger'}`} 
                        role="progressbar" 
                        style={{ width: `${Math.min(codeLevel.complexity * 5, 100)}%` }}
                      ></div>
                    </div>
                    <small>
                      Level: <strong>{codeLevel.level}</strong> | 
                      Complexity: <strong>{codeLevel.complexity} lines</strong> | 
                      Functions: <strong>{codeLevel.functions}</strong>
                    </small>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`card mb-4 ${darkMode ? "bg-dark text-white" : ""}`}
              style={{
                transform: 'perspective(1000px) rotateY(-5deg)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <FaHistory className="me-2" />Code History
                </h5>
                <div className="list-group" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {codeHistory.length > 0 ? (
                    codeHistory.map((item, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ x: 5 }}
                        className={`list-group-item list-group-item-action ${darkMode ? "bg-secondary text-white" : ""}`}
                        onClick={() => loadFromHistory(index)}
                      >
                        <div className="d-flex justify-content-between">
                          <span>
                            <i className={`fab fa-${languages.find(l => l.value === item.language)?.icon} me-2`}></i>
                            {item.question} - {item.code.substring(0, 30)}...
                          </span>
                          <small className="text-muted">{item.timestamp}</small>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-3">No history yet</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collaboration Panel */}
        <AnimatePresence>
          {showCollaboration && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`card mb-4 ${darkMode ? "bg-dark text-white" : ""}`}
              style={{
                transform: 'perspective(1000px) rotateX(3deg)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <FaUserFriends className="me-2" />Collaboration
                </h5>
                <div className="mb-3">
                  <h6>Active Collaborators</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {collaborators.map(collab => (
                      <motion.span 
                        key={collab.id} 
                        whileHover={{ scale: 1.1 }}
                        className={`badge ${collab.online ? 'bg-success' : 'bg-secondary'} p-2`}
                      >
                        {collab.avatar} {collab.name} {collab.online ? '🟢' : '⚪'}
                      </motion.span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <h6>Recent Changes</h6>
                  {realTimeUpdates.length > 0 ? (
                    <div className={`p-2 rounded ${darkMode ? "bg-secondary" : "bg-light"}`} style={{ maxHeight: "100px", overflowY: "auto" }}>
                      {realTimeUpdates.map(update => (
                        <motion.div 
                          key={update.id} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="small mb-1"
                        >
                          <span className="me-2">{update.avatar}</span>
                          <strong>{update.collaborator}</strong>: {update.change} <small className="text-muted">{update.timestamp}</small>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="small text-muted">No recent changes</div>
                  )}
                </div>
                
                <div className="d-flex gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowCodeShare(true)}
                  >
                    <FaShare className="me-1" /> Share Code
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`btn btn-sm ${isRecording ? 'btn-danger' : 'btn-outline-primary'}`}
                    onClick={toggleRecording}
                  >
                    {isRecording ? '⏹ Stop Recording' : '⏺ Start Recording'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-sm btn-success"
                    onClick={syncWithCollaborators}
                  >
                    <FaSyncAlt className="me-1" /> Sync
                  </motion.button>
                </div>
                
                {showCodeShare && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <div className="input-group">
                      <input
                        type="text"
                        className={`form-control ${darkMode ? "bg-secondary text-white" : ""}`}
                        value={shareLink}
                        readOnly
                        placeholder="Generate share link..."
                      />
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                        onClick={generateShareLink}
                      >
                        Generate Link
                      </motion.button>
                    </div>
                    <small className="text-muted">Anyone with this link can view your code</small>
                  </motion.div>
                )}
                
                {isRecording && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 alert alert-info"
                  >
                    <small>Recording your coding session. Share the link with others to collaborate in real-time.</small>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard Panel */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`card mb-4 ${darkMode ? "bg-dark text-white" : ""}`}
              style={{
                transform: 'perspective(1000px) rotateX(-3deg)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              <div className="card-body">
                <h5 className="card-title">
                  <FaTrophy className="me-2" />Leaderboard
                </h5>
                <div className="table-responsive">
                  <table className={`table ${darkMode ? "table-dark" : ""}`}>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Problems</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((user, index) => (
                        <motion.tr 
                          key={user.id} 
                          whileHover={{ scale: 1.01 }}
                          className={user.name === "You" ? "table-primary" : ""}
                        >
                          <td>{index + 1}</td>
                          <td>{user.avatar} {user.name}</td>
                          <td>{user.score}</td>
                          <td>{user.problems}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Assist Panel */}
        <AnimatePresence>
          {aiAssistMode && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`card mb-4 ${darkMode ? "bg-dark text-white" : ""}`}
              style={{
                transform: 'perspective(1000px) rotateY(5deg)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    <FaRobot className="me-2" />AI Coding Assistant
                  </h5>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => setShowAiPanel(!showAiPanel)}
                  >
                    {showAiPanel ? "Hide" : "Show"} Panel
                  </motion.button>
                </div>
                
                {showAiPanel && (
                  <>
                    <div className="mb-3">
                      <textarea
                        className={`form-control ${darkMode ? "bg-secondary text-white" : ""}`}
                        rows="3"
                        placeholder="Ask the AI assistant for help with your code..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                    </div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                        onClick={requestAiHelp}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Get AI Help"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-info text-white"
                        onClick={requestAiCodeReview}
                        disabled={isLoading}
                      >
                        <FaMagic className="me-1" /> Code Review
                      </motion.button>
                    </div>
                    
                    {aiResponse && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-3 rounded ${darkMode ? "bg-secondary" : "bg-light"}`}
                      >
                        <h6>AI Response:</h6>
                        <pre className="mb-0">{aiResponse}</pre>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Coding Area */}
        <div className="row">
          {/* Question Panel */}
          <div className="col-lg-4 mb-4">
            <motion.div 
              whileHover={{ y: -5 }}
              className={`card h-100 ${darkMode ? "bg-dark" : ""}`}
              style={{
                transform: 'perspective(1000px) rotateY(-3deg)',
                borderLeft: '5px solid #3498db',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    <FaQuestionCircle className="me-2" />
                    Problem Statement
                  </h5>
                  <span className={`badge ${difficulty === "Easy" ? "bg-success" : difficulty === "Medium" ? "bg-warning" : "bg-danger"}`}>
                    {difficulty}
                  </span>
                </div>
                
                <h6 className="text-primary">{questions[language][difficulty][selectedQuestion].title}</h6>
                <p className="card-text">{questions[language][difficulty][selectedQuestion].description}</p>
                
                <div className="mb-3">
                  <h6>Test Cases:</h6>
                  <div className={`p-2 rounded ${darkMode ? "bg-secondary" : "bg-light"}`}>
                    {questions[language][difficulty][selectedQuestion].testCases.map((testCase, index) => (
                      <div key={index} className="mb-2">
                        <small className="text-muted">Input:</small> <code>{testCase.input || "None"}</code><br/>
                        <small className="text-muted">Output:</small> <code>{testCase.output}</code>
                      </div>
                    ))}
                  </div>
                </div>
                
                {codeLevel && hasCompiled && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`alert ${darkMode ? "alert-info" : "alert-primary"} mt-3`}
                  >
                    <strong>Code Level:</strong> {codeLevel.level}<br/>
                    <small>{codeLevel.feedback}</small>
                  </motion.div>
                )}
                
                <div className="mt-3 d-flex flex-wrap gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-sm btn-outline-success"
                    onClick={showSolution}
                    disabled={!hasCompiled}
                  >
                    <FaLightbulb className="me-1" />Show Solution
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-sm btn-outline-info"
                    onClick={() => {
                      toast.info(questions[language][difficulty][selectedQuestion].explanation);
                    }}
                  >
                    <FaInfoCircle className="me-1" />Hint
                  </motion.button>
                </div>
              </div>
              
              <div className="card-footer bg-transparent">
                <div className="row">
                  <div className="col-md-6 mb-2 mb-md-0">
                    <label className="form-label">Language:</label>
                    <div className="input-group">
                      <span className={`input-group-text ${darkMode ? "bg-secondary text-white" : ""}`}>
                        <i className={`fab fa-${languages.find(l => l.value === language)?.icon}`}></i>
                      </span>
                      <select
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value);
                          setSelectedQuestion(0);
                          setCodeLevel(null);
                          setHasCompiled(false);
                        }}
                        className={`form-select form-select-sm ${darkMode ? "bg-secondary text-white" : ""}`}
                      >
                        {languages.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Question:</label>
                    <select
                      value={selectedQuestion}
                      onChange={(e) => {
                        setSelectedQuestion(Number(e.target.value));
                        setCodeLevel(null);
                        setHasCompiled(false);
                      }}
                      className={`form-select form-select-sm ${darkMode ? "bg-secondary text-white" : ""}`}
                    >
                      {questions[language][difficulty].map((q, index) => (
                        <option key={index} value={index}>
                          #{index + 1} - {q.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Code Editor Panel */}
          <div className="col-lg-8 mb-4">
            <motion.div 
              whileHover={{ y: -5 }}
              className={`card h-100 ${darkMode ? "bg-dark" : ""}`}
              style={{
                transform: 'perspective(1000px) rotateY(3deg)',
                borderRight: '5px solid #2ecc71',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}
            >
              <div className="card-body p-0">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <FaCode className="me-2" />
                    Editor
                  </h5>
                  <div className="d-flex gap-2">
                    <div className="btn-group btn-group-sm">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="btn btn-outline-secondary" 
                        onClick={decreaseFontSize}
                        title="Decrease font size"
                      >
                        A-
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="btn btn-outline-secondary" 
                        onClick={increaseFontSize}
                        title="Increase font size"
                      >
                        A+
                      </motion.button>
                    </div>
                  
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyToClipboard}
                      className="btn btn-sm btn-outline-primary"
                      title="Copy code"
                    >
                      <FaCopy className="me-1" /> Copy
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadCode}
                      className="btn btn-sm btn-outline-success"
                      title="Download code"
                    >
                      <FaDownload className="me-1" />
                    </motion.button>
                    <label className="btn btn-sm btn-outline-info mb-0">
                      <FaUpload className="me-1" />
                      <input 
                        type="file" 
                        style={{ display: 'none' }} 
                        onChange={uploadCode}
                        accept=".js,.java,.py,.cpp,.go,.rs,.c,.cs,.php,.rb,.swift,.kt,.ts"
                      />
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-sm btn-outline-warning"
                      onClick={formatCode}
                      title="Format code"
                    >
                      <FaMagic className="me-1" />
                    </motion.button>
                  </div>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <CodeEditor
                    ref={editorRef}
                    value={code}
                    language={language}
                    placeholder={`Enter ${language.toUpperCase()} code...`}
                    onChange={(e) => setCode(e.target.value)}
                    padding={15}
                    style={{
                      fontSize: fontSize,
                      backgroundColor: darkMode ? "#1e1e1e" : "#f8f9fa",
                      fontFamily: "'Fira Code', monospace",
                      minHeight: "400px",
                      borderRadius: "0 0 0.25rem 0.25rem",
                      color: darkMode ? "#ffffff" : "#212529",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="progress mb-4" 
            style={{ height: "8px" }}
          >
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          className="d-flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRunCode(true)}
            disabled={isLoading}
            className="btn btn-primary"
          >
            <FaCog className="me-2" />
            {isLoading ? "Compiling..." : "Compile"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRunCode(false)}
            disabled={isLoading}
            className="btn btn-success"
          >
            <FaPlay className="me-2" />
            {isLoading ? "Running..." : "Run Code"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={speakOutput}
            disabled={!output || isLoading}
            className="btn btn-info text-white"
          >
            <FaVolumeUp className="me-2" />
            Speak Output
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetCode}
            disabled={isLoading}
            className="btn btn-warning"
          >
            <FaRedo className="me-2" />
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToHistory(code)}
            disabled={!code.trim() || isLoading}
            className="btn btn-secondary"
          >
            <FaSave className="me-2" />
            Save to History
          </motion.button>
        </motion.div>

        {/* Output Panel */}
        <motion.div 
          whileHover={{ y: -5 }}
          className={`card ${darkMode ? "bg-dark" : ""}`}
          style={{
            transform: 'perspective(1000px) rotateX(2deg)',
            borderBottom: '5px solid #f1c40f',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
          }}
        >
          <div className="card-body p-0">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <FaTerminal className="me-2" />
                Output
              </h5>
              <div>
                <small className="text-muted me-2">
                  {language.toUpperCase()} | {questions[language][difficulty][selectedQuestion].title}
                </small>
              </div>
            </div>
            <pre
              className="p-3 mb-0"
              style={{
                minHeight: "150px",
                maxHeight: "300px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                backgroundColor: darkMode ? "#1e1e1e" : "#f8f9fa",
                color: output.startsWith("Error") ? "#ff5555" : darkMode ? "#ffffff" : "#212529",
              }}
            >
              {output || "Your output will appear here..."}
            </pre>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className={`py-3 ${darkMode ? "bg-dark text-white" : "bg-light"}`}
        style={{
          position: 'relative',
          zIndex: 1
        }}>
        <div className="container text-center">
          <small>
            CodeCraft Studio &copy; {new Date().getFullYear()} | 
            Time Spent: {formatTime(timeSpent)} | 
            Code Runs: {codeHistory.length} | 
            Problems Solved: {userStats.problemsSolved} | 
            Current Language: {language.toUpperCase()}
          </small>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />

      {/* Custom CSS */}
      <style jsx global>{`
        :root {
          --text-primary: #212529;
          --text-secondary: #495057;
          --bg-primary: rgba(255, 255, 255, 0.85);
          --bg-secondary: rgba(248, 249, 250, 0.9);
          --bg-tertiary: rgba(233, 236, 239, 0.9);
          --border-color: #dee2e6;
          --card-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          --btn-primary: #6a11cb;
          --btn-primary-hover: #2575fc;
          --gradient-primary: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          --gradient-secondary: linear-gradient(135deg, #f46b45 0%, #eea849 100%);
        }

        .dark-mode {
          --text-primary: #f8f9fa;
          --text-secondary: #e9ecef;
          --bg-primary: rgba(18, 18, 18, 0.85);
          --bg-secondary: rgba(30, 30, 30, 0.9);
          --bg-tertiary: rgba(45, 45, 45, 0.9);
          --border-color: #495057;
          --card-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          --btn-primary: #2575fc;
          --btn-primary-hover: #6a11cb;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--text-primary);
          background-color: transparent;
          transition: background-color 0.3s ease, color 0.3s ease;
          overflow-x: hidden;
        }
        
        .card {
          border: none;
          box-shadow: var(--card-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border-color: var(--border-color);
          backdrop-filter: blur(5px);
        }
        
        .card:hover {
          transform: translateY(-5px) rotateY(2deg) rotateX(1deg);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
        
        .navbar {
          backdrop-filter: blur(10px);
          background-color: rgba(var(--bg-secondary), 0.9) !important;
        }
        
        /* Add 3D button effects */
        .btn {
          transition: all 0.3s ease;
          transform-style: preserve-3d;
          position: relative;
        }
        
        .btn:active {
          transform: translateY(2px);
        }
        
        .btn-primary {
          background: var(--gradient-primary);
          border: none;
          box-shadow: 0 4px 0 #3a0ca3, 0 5px 10px rgba(0,0,0,0.2);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #3a0ca3, 0 8px 15px rgba(0,0,0,0.2);
        }
        
        /* Add depth to form elements */
        select, input, textarea {
          transition: all 0.3s ease;
          box-shadow: inset 0 -2px 0 rgba(0,0,0,0.1);
        }
        
        select:focus, input:focus, textarea:focus {
          box-shadow: inset 0 -2px 0 var(--btn-primary);
        }
        
        /* 3D progress bar */
        .progress {
          box-shadow: inset 0 -2px 5px rgba(0,0,0,0.1);
          border-radius: 10px;
          overflow: visible;
        }
        
        .progress-bar {
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          position: relative;
          overflow: visible;
        }
        
        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        
        /* Floating animations */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--bg-tertiary);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: var(--btn-primary);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--btn-primary-hover);
        }

        /* Code editor improvements */
        .code-editor {
          border-radius: 8px;
          overflow: hidden;
        }

        /* Avatar styles */
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          font-size: 16px;
        }

        /* Metric card styles */
        .metric-card {
          background: var(--bg-tertiary);
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .metric-card h6 {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 5px;
        }

        .metric-card .display-6 {
          font-weight: 700;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

