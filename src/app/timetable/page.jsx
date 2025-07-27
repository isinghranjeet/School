"use client";
import { useState } from "react";

const ExamTimetablePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [filterMode, setFilterMode] = useState("All"); // Filter by mode (All, Online, Offline)
  const [searchQuery, setSearchQuery] = useState(""); // Search query

  // Sample exam timetable data
  const examTimetable = [
    {
      date: "2023-11-01",
      day: "Monday",
      exams: [
        { subject: "Mathematics", time: "9:00 AM - 12:00 PM", venue: "B1", mode: "Offline" },
        { subject: "Python", time: "2:00 PM - 5:00 PM", venue: "Online", mode: "Online", link: "https://example.com/physics-exam" },
      ],
    },
    {
      date: "2023-11-02",
      day: "Tuesday",
      exams: [
        { subject: "DBMS", time: "9:00 AM - 12:00 PM", venue: "B1", mode: "Offline" },
        { subject: "G.P", time: "2:00 PM - 5:00 PM", venue: "Online", mode: "Online", link: "https://example.com/biology-exam" },
      ],
    },
    {
      date: "26-03-2025",
      day: "Wednesday",
      exams: [
        { subject: "Computer orgination artectuture", time: "9:00 AM - 12:00 PM", venue: "B1", mode: "Offline" },
        { subject: "Soft Skill", time: "2:00 PM - 5:00 PM", venue: "Online", mode: "Online", link: "https://example.com/english-exam" },
      ],
    },
    {
      date: "25-03-2025",
      day: "Thursday",
      exams: [
        { subject: "Python", time: "9:00 AM - 12:00 PM", venue: "B1", mode: "Offline" },
        { subject: "Java", time: "2:00 PM - 5:00 PM", venue: "Online", mode: "Online", link: "https://example.com/geography-exam" },
      ],
    },
    {
      date: "24-03-2025",
      day: "Friday",
      exams: [
        { subject: "DSA", time: "9:00 AM - 12:00 PM", venue: "B1", mode: "Offline" },
        { subject: "Apptitude", time: "2:00 PM - 5:00 PM", venue: "Online", mode: "Online", link: "https://example.com/business-exam" },
      ],
    },
  ];

  // Filter exams by mode and search query
  const filteredTimetable = examTimetable
    .map((day) => ({
      ...day,
      exams: day.exams.filter(
        (exam) =>
          (filterMode === "All" || exam.mode === filterMode) &&
          (exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.venue.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    }))
    .filter((day) => day.exams.length > 0); // Remove days with no exams after filtering

  return (
    <div className={`d-flex flex-column align-items-center justify-content-center vh-100 ${darkMode ? "bg-dark text-white" : "bg-light"}`}>
      <div
        className="p-4 shadow-lg rounded"
        style={{
          maxWidth: "1200px",
          margin: "auto",
          background: darkMode ? "#333" : "#fff",
          color: darkMode ? "#fff" : "#000",
          border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
        }}
      >
        <h2 className="mb-4">📅 Exam Timetable</h2>

        {/* Dark Mode Toggle */}
        <button
          className="btn btn-secondary mb-4"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Filters */}
        <div className="mb-4">
          <label htmlFor="filterMode" className="form-label">
            Filter by Mode:
          </label>
          <select
            className="form-select"
            id="filterMode"
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <label htmlFor="searchQuery" className="form-label">
            Search:
          </label>
          <input
            type="text"
            className="form-control"
            id="searchQuery"
            placeholder="Search by subject or venue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Exam Timetable */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Mode</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimetable.map((day) =>
                day.exams.map((exam, index) => (
                  <tr key={`${day.date}-${index}`}>
                    {index === 0 ? (
                      <>
                        <td rowSpan={day.exams.length}>{day.date}</td>
                        <td rowSpan={day.exams.length}>{day.day}</td>
                      </>
                    ) : null}
                    <td>{exam.subject}</td>
                    <td>{exam.time}</td>
                    <td>{exam.venue}</td>
                    <td>
                      <span
                        className={`badge ${
                          exam.mode === "Online" ? "bg-success" : "bg-primary"
                        }`}
                      >
                        {exam.mode}
                      </span>
                    </td>
                    <td>
                      {exam.mode === "Online" && exam.link ? (
                        <a
                          href={exam.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          Join Exam
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamTimetablePage;