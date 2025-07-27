"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [showRecordings, setShowRecordings] = useState(false);
  
  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('codeHistory');
    if (savedHistory) {
      setCodeHistory(JSON.parse(savedHistory));
    }

    const savedRecordings = localStorage.getItem('screenRecordings');
    if (savedRecordings) {
      setRecordings(JSON.parse(savedRecordings));
    }
  }, []);

  // Languages configuration
  const languages = [
    { name: "Java", value: "java", id: 62, icon: "java" },
    { name: "C++", value: "cpp", id: 54, icon: "cplusplus" },
    { name: "Python", value: "python", id: 71, icon: "python" },
    { name: "JavaScript", value: "javascript", id: 63, icon: "javascript" },
  ];

  // Questions data with fallback for all languages and difficulties
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
          explanation: "This is a basic Java program that demonstrates the main method structure and console output."
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
          explanation: "This program shows variable declaration, initialization, and basic arithmetic operations."
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
          explanation: "This demonstrates a for loop and the factorial calculation algorithm."
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
          explanation: "This program shows how to check for prime numbers using a loop and conditional logic."
        }
      ]
    },
    cpp: {
      Easy: [
        {
          title: "Hello World",
          description: "Write a C++ program to print 'Hello, World!'.",
          solution: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!";
  return 0;
}`,
          explanation: "Basic C++ program structure with console output."
        }
      ],
      Medium: [
        {
          title: "Factorial",
          description: "Write a C++ program to find the factorial of a number.",
          solution: `#include <iostream>
using namespace std;

int main() {
  int num = 5, factorial = 1;
  for(int i = 1; i <= num; i++) {
    factorial *= i;
  }
  cout << "Factorial: " << factorial;
  return 0;
}`,
          explanation: "Demonstrates loops and arithmetic operations in C++."
        }
      ],
      Hard: [
        {
          title: "Prime Check",
          description: "Write a C++ program to check if a number is prime.",
          solution: `#include <iostream>
using namespace std;

int main() {
  int num = 29;
  bool isPrime = true;
  for(int i = 2; i <= num/2; i++) {
    if(num % i == 0) {
      isPrime = false;
      break;
    }
  }
  cout << num << (isPrime ? " is prime" : " is not prime");
  return 0;
}`,
          explanation: "Shows complex logic with loops and conditionals in C++."
        }
      ]
    },
    python: {
      Easy: [
        {
          title: "Hello World",
          description: "Write a Python program to print 'Hello, World!'.",
          solution: `print("Hello, World!")`,
          explanation: "Simple Python program demonstrating the print function."
        }
      ],
      Medium: [
        {
          title: "Factorial",
          description: "Write a Python program to find the factorial of a number.",
          solution: `num = 5
factorial = 1
for i in range(1, num + 1):
    factorial *= i
print("Factorial:", factorial)`,
          explanation: "Demonstrates Python loops and arithmetic operations."
        }
      ],
      Hard: [
        {
          title: "Prime Check",
          description: "Write a Python program to check if a number is prime.",
          solution: `num = 29
is_prime = True
for i in range(2, num//2 + 1):
    if num % i == 0:
        is_prime = False
        break
print(f"{num} is {'prime' if is_prime else 'not prime'}")`,
          explanation: "Shows more complex Python logic with loops and conditionals."
        }
      ]
    },
    javascript: {
      Easy: [
        {
          title: "Hello World",
          description: "Write a JavaScript program to print 'Hello, World!'.",
          solution: `console.log("Hello, World!");`,
          explanation: "Basic JavaScript console output."
        }
      ],
      Medium: [
        {
          title: "Factorial",
          description: "Write a JavaScript program to find the factorial of a number.",
          solution: `let num = 5;
let factorial = 1;
for(let i = 1; i <= num; i++) {
  factorial *= i;
}
console.log("Factorial:", factorial);`,
          explanation: "Demonstrates JavaScript loops and arithmetic operations."
        }
      ],
      Hard: [
        {
          title: "Prime Check",
          description: "Write a JavaScript program to check if a number is prime.",
          solution: `let num = 29;
let isPrime = true;
for(let i = 2; i <= Math.floor(num/2); i++) {
  if(num % i === 0) {
    isPrime = false;
    break;
  }
}
console.log(\`\${num} is \${isPrime ? 'prime' : 'not prime'}\`);`,
          explanation: "Shows more complex JavaScript logic with loops and conditionals."
        }
      ]
    }
  };

  // Helper function to safely get current question
  const getCurrentQuestion = () => {
    try {
      if (!questions[language] || !questions[language][difficulty] || 
          !questions[language][difficulty][selectedQuestion]) {
        return {
          title: "Question not available",
          description: "Please select a valid language and difficulty level",
          solution: "// No solution available",
          explanation: ""
        };
      }
      return questions[language][difficulty][selectedQuestion];
    } catch (error) {
      return {
        title: "Error loading question",
        description: "Please try selecting a different question",
        solution: "// No solution available",
        explanation: ""
      };
    }
  };

  // Run code function
  const handleRunCode = async (compileOnly = false) => {
    if (!code.trim()) {
      toast.warning("Please write some code before running!");
      return;
    }

    setIsLoading(true);
    setOutput("Running...");
    setProgress(0);
    setHasCompiled(true);
    addToHistory(code);

    try {
      const selectedLanguage = languages.find((lang) => lang.value === language);
      if (!selectedLanguage) {
        throw new Error("Selected language not found");
      }

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
        toast.success("Code executed successfully!");
        analyzeCodeQuality();
      } else if (outputResponse.data.status.id === 4) {
        setOutput(outputResponse.data.compile_output || "Compilation error occurred.");
        toast.error("Compilation error!");
      } else if (outputResponse.data.status.id === 5) {
        setOutput(outputResponse.data.stderr || "Runtime error occurred.");
        toast.error("Runtime error!");
      } else {
        setOutput(outputResponse.data.message || "Unexpected response from server.");
        toast.info("Execution completed with status: " + outputResponse.data.status.description);
      }
    } catch (error) {
      setOutput("Error executing code: " + error.message);
      toast.error("Error executing code!");
      console.error("Execution error:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // Screen recording functions
  const startScreenRecording = async () => {
    try {
      // Try to get display media (screen sharing)
      let stream;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: "screen" },
          audio: false
        });
      } catch (err) {
        toast.warning("Screen sharing not available. Recording browser tab only.");
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      if (!stream) {
        toast.error("Could not start recording");
        return;
      }

      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const videoUrl = URL.createObjectURL(blob);
          
          const newRecording = {
            id: Date.now(),
            url: videoUrl,
            timestamp: new Date().toLocaleString(),
            language,
            question: getCurrentQuestion().title,
            code: code
          };

          const updatedRecordings = [newRecording, ...recordings.slice(0, 4)];
          setRecordings(updatedRecordings);
          localStorage.setItem('screenRecordings', JSON.stringify(updatedRecordings));
          
          setShowRecordings(true);
          stream.getTracks().forEach(track => track.stop());
          
          toast.success("Recording saved!");
        } catch (err) {
          toast.error("Failed to save recording");
          console.error(err);
        }
      };

      recorder.start(1000); // Capture data every second
      setIsRecording(true);
      toast.success("Recording started!");

      // Auto-stop after 5 minutes
      setTimeout(() => {
        if (isRecording) {
          stopScreenRecording();
        }
      }, 300000);

    } catch (err) {
      toast.error("Failed to start recording: " + err.message);
      console.error(err);
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info("Recording stopped");
    }
  };

  const playRecording = (url) => {
    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.style.display = "block";
      videoRef.current.play();
    }
  };

  const deleteRecording = (id) => {
    const updatedRecordings = recordings.filter(rec => rec.id !== id);
    setRecordings(updatedRecordings);
    localStorage.setItem('screenRecordings', JSON.stringify(updatedRecordings));
    toast.success("Recording deleted");
  };

  // Other utility functions
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.info(`Switched to ${!darkMode ? "Dark" : "Light"} mode`);
  };

  const resetCode = () => {
    setCode("");
    setOutput("");
    setCodeLevel(null);
    setHasCompiled(false);
    toast.info("Code editor cleared!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("Code copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy code");
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
      toast.error("Text-to-speech is not supported in your browser.");
    }
  };

  const addToHistory = (codeSnap) => {
    if (codeSnap.trim()) {
      const newHistory = [
        {
          code: codeSnap,
          timestamp: new Date().toLocaleTimeString(),
          language
        },
        ...codeHistory.slice(0, 9)
      ];
      setCodeHistory(newHistory);
      localStorage.setItem('codeHistory', JSON.stringify(newHistory));
    }
  };

  const loadFromHistory = (index) => {
    setCode(codeHistory[index].code);
    setLanguage(codeHistory[index].language);
    toast.info("Code loaded from history");
  };

  const showSolution = () => {
    if (!hasCompiled) {
      toast.warning("Please compile your code first to see the solution!");
      return;
    }
    
    setCode(getCurrentQuestion().solution);
    toast.info("Solution loaded. Study and understand it!");
  };

  const requestAiHelp = async () => {
    if (!aiPrompt.trim()) {
      toast.warning("Please enter your question for the AI assistant");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("AI assistant is analyzing your code...");
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentQuestion = getCurrentQuestion();
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
      toast.success("AI assistant has provided guidance!");
    } catch (error) {
      toast.error("AI assistant failed to respond");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCodeQuality = () => {
    const lines = code.split('\n').filter(line => line.trim() !== '');
    const complexity = lines.length;
    
    if (complexity < 5) {
      setCodeLevel({ level: "Beginner", feedback: "Simple implementation with basic constructs" });
    } else if (complexity < 15) {
      setCodeLevel({ level: "Intermediate", feedback: "Good structure with some complexity" });
    } else {
      setCodeLevel({ level: "Advanced", feedback: "Complex implementation with multiple constructs" });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Render functions for UI components
  const renderRecordingControls = () => (
    <div className="d-flex align-items-center">
      {isRecording ? (
        <>
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={stopScreenRecording}
            title="Stop Recording"
          >
            <i className="fas fa-stop"></i>
          </button>
          <span className="text-danger small me-2">
            <i className="fas fa-circle"></i> Recording
          </span>
        </>
      ) : (
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={startScreenRecording}
          title="Record Screen"
          disabled={isLoading}
        >
          <i className="fas fa-video"></i>
        </button>
      )}
      {recordings.length > 0 && (
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShowRecordings(!showRecordings)}
          title="View Recordings"
        >
          <i className="fas fa-history"></i>
        </button>
      )}
    </div>
  );

  const RecordingsPanel = () => (
    <div className={`card mb-4 ${darkMode ? "bg-dark text-white" : ""}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">
            <i className="fas fa-video me-2"></i>Screen Recordings
          </h5>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowRecordings(false)}
          >
            Close
          </button>
        </div>
        
        {recordings.length > 0 ? (
          <div className="list-group" style={{ maxHeight: "300px", overflowY: "auto" }}>
            {recordings.map((recording) => (
              <div 
                key={recording.id} 
                className={`list-group-item ${darkMode ? "bg-secondary text-white" : ""}`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className={`fab fa-${languages.find(l => l.value === recording.language)?.icon} me-2`}></i>
                    <strong>{recording.question}</strong>
                    <div className="small text-muted">{recording.timestamp}</div>
                  </div>
                  <div>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => playRecording(recording.url)}
                    >
                      <i className="fas fa-play"></i> Play
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteRecording(recording.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                {recording.code && (
                  <div className={`mt-2 p-2 small ${darkMode ? "bg-dark" : "bg-light"}`} style={{ borderRadius: "5px" }}>
                    <pre className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {recording.code.substring(0, 100)}...
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3">
            No recordings yet. Click the <i className="fas fa-video"></i> button to start recording.
          </div>
        )}
      </div>
    </div>
  );

  // Get current question data
  const currentQuestion = getCurrentQuestion();

  // Main render
  return (
    <div className={`min-vh-100 ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
      {/* Navigation Bar */}
      <nav className={`navbar ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"} shadow-sm`}>
        <div className="container">
          <span className="navbar-brand fw-bold">
            <i className="fas fa-code me-2"></i>Advanced Coding Platform
          </span>
          <div className="d-flex align-items-center">
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
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setShowMetrics(!showMetrics)}>
              <i className="fas fa-chart-line me-1"></i>Metrics
            </button>
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setShowHistory(!showHistory)}>
              <i className="fas fa-history me-1"></i>History
            </button>
            <button 
              className={`btn btn-sm ${aiAssistMode ? "btn-success" : "btn-outline-success"} me-2`}
              onClick={() => setAiAssistMode(!aiAssistMode)}
            >
              <i className="fas fa-robot me-1"></i>AI Assist
            </button>
            {renderRecordingControls()}
            <button
              onClick={toggleDarkMode}
              className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-dark"} ms-2`}
            >
              <i className={`fas fa-${darkMode ? "sun" : "moon"}`}></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Video Player */}
        <div className="mb-4" style={{ display: 'none' }}>
          <video 
            ref={videoRef} 
            controls 
            className="w-100 rounded"
            style={{ maxHeight: '500px', backgroundColor: '#000' }}
          />
        </div>

        {/* Show recordings panel when toggled or after recording */}
        {(showRecordings || (recordings.length > 0 && !isRecording)) && <RecordingsPanel />}

        {/* Metrics Panel */}
        {showMetrics && (
          <div className={`card mb-4 ${darkMode ? "bg-dark text-white" : ""}`}>
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-chart-pie me-2"></i>Coding Metrics
              </h5>
              <div className="row">
                <div className="col-md-4">
                  <div className="metric-card">
                    <h6>Time Spent</h6>
                    <p className="display-6">{formatTime(timeSpent)}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="metric-card">
                    <h6>Code Runs</h6>
                    <p className="display-6">{codeHistory.length}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="metric-card">
                    <h6>Current Language</h6>
                    <p className="display-6">{language.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code History Panel */}
        {showHistory && (
          <div className={`card mb-4 ${darkMode ? "bg-dark text-white" : ""}`}>
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-history me-2"></i>Code History
              </h5>
              <div className="list-group" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {codeHistory.length > 0 ? (
                  codeHistory.map((item, index) => (
                    <button
                      key={index}
                      className={`list-group-item list-group-item-action ${darkMode ? "bg-secondary text-white" : ""}`}
                      onClick={() => loadFromHistory(index)}
                    >
                      <div className="d-flex justify-content-between">
                        <span>
                          <i className={`fab fa-${languages.find(l => l.value === item.language)?.icon} me-2`}></i>
                          {item.code.substring(0, 40)}...
                        </span>
                        <small className="text-muted">{item.timestamp}</small>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-3">No history yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Assist Panel */}
        {aiAssistMode && (
          <div className={`card mb-4 ${darkMode ? "bg-dark text-white" : ""}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="fas fa-robot me-2"></i>AI Coding Assistant
                </h5>
                <button 
                  className="btn btn-sm btn-outline-primary" 
                  onClick={() => setShowAiPanel(!showAiPanel)}
                >
                  {showAiPanel ? "Hide" : "Show"} Panel
                </button>
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
                  <button
                    className="btn btn-primary mb-3"
                    onClick={requestAiHelp}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Get AI Help"}
                  </button>
                  
                  {aiResponse && (
                    <div className={`p-3 rounded ${darkMode ? "bg-secondary" : "bg-light"}`}>
                      <h6>AI Response:</h6>
                      <pre className="mb-0">{aiResponse}</pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Coding Area */}
        <div className="row">
          {/* Question Panel */}
          <div className="col-lg-4 mb-4">
            <div className={`card h-100 ${darkMode ? "bg-dark" : ""}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-question-circle me-2"></i>
                    Problem Statement
                  </h5>
                  <span className={`badge ${difficulty === "Easy" ? "bg-success" : difficulty === "Medium" ? "bg-warning" : "bg-danger"}`}>
                    {difficulty}
                  </span>
                </div>
                
                <h6 className="text-primary">{currentQuestion.title}</h6>
                <p className="card-text">{currentQuestion.description}</p>
                
                {codeLevel && hasCompiled && (
                  <div className={`alert ${darkMode ? "alert-info" : "alert-primary"} mt-3`}>
                    <strong>Code Level:</strong> {codeLevel.level}<br/>
                    <small>{codeLevel.feedback}</small>
                  </div>
                )}
                
                <div className="mt-3 d-flex flex-wrap gap-2">
                  <button 
                    className="btn btn-sm btn-outline-success"
                    onClick={showSolution}
                    disabled={!hasCompiled}
                  >
                    <i className="fas fa-lightbulb me-1"></i>Show Solution
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-info"
                    onClick={() => {
                      setCode("");
                      setCodeLevel(null);
                    }}
                  >
                    <i className="fas fa-info-circle me-1"></i>Hint
                  </button>
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
                      {questions[language] && questions[language][difficulty] ? 
                        questions[language][difficulty].map((q, index) => (
                          <option key={index} value={index}>
                            #{index + 1} - {q.title}
                          </option>
                        )) : <option>No questions available</option>}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="col-lg-8 mb-4">
            <div className={`card h-100 ${darkMode ? "bg-dark" : ""}`}>
              <div className="card-body p-0">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-code me-2"></i>
                    Editor
                  </h5>
                  <button 
                    onClick={copyToClipboard}
                    className="btn btn-sm btn-outline-primary"
                    title="Copy code"
                  >
                    <i className="fas fa-copy me-1"></i> Copy
                  </button>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <CodeEditor
                    value={code}
                    language={language}
                    placeholder={`Enter ${language.toUpperCase()} code...`}
                    onChange={(e) => setCode(e.target.value)}
                    padding={15}
                    style={{
                      fontSize: 14,
                      backgroundColor: "#000000",
                      fontFamily: "'Fira Code', monospace",
                      minHeight: "400px",
                      borderRadius: "0 0 0.25rem 0.25rem",
                      color: "#ffffff",
                      position: 'relative'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        {isLoading && (
          <div className="progress mb-4" style={{ height: "8px" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleRunCode(true)}
            disabled={isLoading}
            className="btn btn-primary"
          >
            <i className="fas fa-cog me-2"></i>
            {isLoading ? "Compiling..." : "Compile"}
          </button>
          <button
            onClick={() => handleRunCode(false)}
            disabled={isLoading}
            className="btn btn-success"
          >
            <i className="fas fa-play me-2"></i>
            {isLoading ? "Running..." : "Run Code"}
          </button>
          <button
            onClick={speakOutput}
            disabled={!output || isLoading}
            className="btn btn-info text-white"
          >
            <i className="fas fa-volume-up me-2"></i>
            Speak Output
          </button>
          <button
            onClick={resetCode}
            disabled={isLoading}
            className="btn btn-warning"
          >
            <i className="fas fa-redo me-2"></i>
            Reset
          </button>
          <button
            onClick={() => addToHistory(code)}
            disabled={!code.trim() || isLoading}
            className="btn btn-secondary"
          >
            <i className="fas fa-save me-2"></i>
            Save to History
          </button>
        </div>

        {/* Output Panel */}
        <div className={`card ${darkMode ? "bg-dark" : ""}`}>
          <div className="card-body p-0">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <i className="fas fa-terminal me-2"></i>
                Output
              </h5>
              <div>
                <small className="text-muted me-2">
                  {language.toUpperCase()} | {currentQuestion.title}
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
                backgroundColor: "#000000",
                color: output.startsWith("Error") ? "#ff5555" : "#ffffff",
              }}
            >
              {output || "Your output will appear here..."}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-3 ${darkMode ? "bg-dark text-white" : "bg-light"}`}>
        <div className="container text-center">
          <small>
            Advanced Coding Platform &copy; {new Date().getFullYear()} | 
            Time Spent: {formatTime(timeSpent)} | 
            Code Runs: {codeHistory.length} | 
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

      {/* Show recording indicator when recording */}
      {isRecording && (
        <div className="recording-indicator">
          <i className="fas fa-circle me-1"></i> Recording
        </div>
      )}

      <style jsx global>{`
        :root {
          --gradient-primary: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          --gradient-secondary: linear-gradient(135deg, #f46b45 0%, #eea849 100%);
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .card {
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .metric-card {
          padding: 15px;
          border-radius: 8px;
          background: ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
          text-align: center;
        }
        
        .metric-card h6 {
          font-size: 0.8rem;
          color: ${darkMode ? '#adb5bd' : '#6c757d'};
          margin-bottom: 0.5rem;
        }
        
        .btn-primary {
          background: var(--gradient-primary);
          border: none;
        }
        
        .btn-success {
          background: var(--gradient-secondary);
          border: none;
        }
        
        .navbar {
          padding: 0.8rem 1rem;
        }
        
        pre {
          font-family: 'Fira Code', monospace;
          line-height: 1.5;
        }
        
        .recording-indicator {
          position: fixed;
          top: 10px;
          right: 10px;
          background: red;
          color: white;
          padding: 5px 10px;
          border-radius: 3px;
          z-index: 1000;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}