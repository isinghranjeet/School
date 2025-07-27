"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { Spinner, Modal, Card, Button, Form, Row, Col, Pagination as BootstrapPagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// Reusable BookCard Component
const BookCard = ({ book, onViewDetails, onBorrow, onReserve, onAddToWishlist, borrowedBooks, reservedBooks }) => (
  <Col md={4} className="mb-4">
    <Card className="h-100 shadow" style={{ maxWidth: "200px" }}>
      <Card.Img variant="top" src={book.cover} style={{ height: "120px", objectFit: "cover" }} />
      <Card.Body className="p-2">
        <Card.Title style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{book.title}</Card.Title>
        <Card.Text style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>{book.author}</Card.Text>
        <Card.Text>
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>{book.category}</small>
        </Card.Text>
        <Button variant="primary" size="sm" onClick={() => onViewDetails(book)}>
          View Details
        </Button>
      </Card.Body>
      <Card.Footer className="p-2">
        {book.available ? (
          <span className="text-success" style={{ fontSize: "0.75rem" }}>Available</span>
        ) : (
          <span className="text-danger" style={{ fontSize: "0.75rem" }}>Not Available</span>
        )}
      </Card.Footer>
    </Card>
  </Col>
);

// Reusable Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <BootstrapPagination className="justify-content-center mt-4">
    {Array.from({ length: totalPages }, (_, i) => (
      <BootstrapPagination.Item key={i} active={currentPage === i + 1} onClick={() => onPageChange(i + 1)}>
        {i + 1}
      </BootstrapPagination.Item>
    ))}
  </BootstrapPagination>
);

// Star Rating Component
const StarRating = ({ rating, onRatingChange, isFilter = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="d-flex">
      {stars.map((star) => (
        <span
          key={star}
          style={{ 
            cursor: "pointer", 
            fontSize: isFilter ? "1.5rem" : "2rem", 
            color: star <= rating ? "#ffc107" : "#e4e5e9",
            transition: "color 0.2s",
          }}
          onClick={() => onRatingChange(star)}
          onMouseEnter={!isFilter ? () => onRatingChange(star) : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const LibraryPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(6);
  const [wishlist, setWishlist] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [filters, setFilters] = useState({
    publicationYear: "",
    language: "",
    minRating: 0,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const webcamRef = useRef(null);

  // Sample book data
  const books = [
    { id: 1, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Computer Science", available: true, publicationYear: 2009, language: "English", cover: "https://m.media-amazon.com/images/I/41SNoh5ZhOL._SY445_SX342_.jpg" },
    { id: 2, title: "Clean Code", author: "Robert C. Martin", category: "Programming", available: false, publicationYear: 2008, language: "English", cover: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg" },
    { id: 3, title: "Design Patterns", author: "Erich Gamma", category: "Programming", available: true, publicationYear: 1994, language: "English", cover: "https://m.media-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg" },
    { id: 4, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Programming", available: true, publicationYear: 1999, language: "English", cover: "https://m.media-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg" },
    { id: 5, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", available: true, publicationYear: 1960, language: "English", cover: "https://m.media-amazon.com/images/I/51OZerWcGCL._SY445_SX342_.jpg" },
    { id: 6, title: "1984", author: "George Orwell", category: "Fiction", available: false, publicationYear: 1949, language: "English", cover: "https://m.media-amazon.com/images/I/41abFG7G5XL._SY445_SX342_.jpg" },
    { id: 7, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", available: true, publicationYear: 1925, language: "English", cover: "https://m.media-amazon.com/images/I/41F3tYG-D2L._SY445_SX342_.jpg" },
    { id: 8, title: "Sapiens", author: "Yuval Noah Harari", category: "Non-Fiction", available: true, publicationYear: 2011, language: "English", cover: "https://m.media-amazon.com/images/I/41yu2qXhXXL._SY445_SX342_.jpg" },
    { id: 9, title: "The Art of War", author: "Sun Tzu", category: "Non-Fiction", available: true, publicationYear: -500, language: "Chinese", cover: "https://m.media-amazon.com/images/I/41K7F-W9JZL._SY445_SX342_.jpg" },
  ];

  // Capture a photo from the webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsLoading(true);

    // Simulate face detection
    setTimeout(() => {
      const isFaceDetected = Math.random() > 0.5; // Simulate face detection
      setFaceDetected(isFaceDetected);
      setIsLoading(false);

      if (!isFaceDetected) {
        alert("No face detected. Please try again.");
      }
    }, 1000);
  }, [webcamRef]);

  // Retry photo capture
  const retryCapture = () => {
    setCapturedImage(null);
    setFaceDetected(false);
  };

  // Simulate authentication (replace with actual API call)
  const authenticateUser = async (image) => {
    try {
      // Simulate sending the image to a backend for verification
      console.log("Sending image for authentication...", image);

      // Simulate a successful authentication
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
        alert("Authentication successful! Access granted.");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      alert("Authentication failed. Please try again.");
    }
  };

  // Filter books based on search term, category, and other filters
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
      const matchesPublicationYear = !filters.publicationYear || book.publicationYear === parseInt(filters.publicationYear);
      const matchesLanguage = !filters.language || book.language === filters.language;
      const matchesRating = !filters.minRating || (ratings[book.id] || 0) >= filters.minRating;

      return matchesSearch && matchesCategory && matchesPublicationYear && matchesLanguage && matchesRating;
    });
  }, [books, searchTerm, selectedCategory, filters, ratings]);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open book details modal
  const openBookDetails = (book) => setSelectedBook(book);

  // Close book details modal
  const closeBookDetails = () => setSelectedBook(null);

  // Add book to wishlist
  const addToWishlist = (bookId) => {
    if (!wishlist.includes(bookId)) {
      setWishlist([...wishlist, bookId]);
    }
  };

  // Borrow a book
  const borrowBook = (bookId) => {
    if (isAuthenticated) {
      setBorrowedBooks([...borrowedBooks, bookId]);
      alert("Book borrowed successfully!");
    } else {
      alert("Please authenticate to borrow books.");
    }
  };

  // Reserve a book
  const reserveBook = (bookId) => {
    if (!reservedBooks.includes(bookId)) {
      setReservedBooks([...reservedBooks, bookId]);
      alert("Book reserved! You will be notified when it's available.");
    }
  };

  // Rate a book
  const rateBook = (bookId, rating) => {
    setRatings({ ...ratings, [bookId]: rating });
  };

  // Add a review
  const addReview = (bookId, review) => {
    setReviews({ ...reviews, [bookId]: review });
  };

  // Handle books per page change
  const handleBooksPerPageChange = (e) => {
    setBooksPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  // Toggle dark mode
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setRememberMe(false);
  };

  return (
    <div className={`d-flex flex-column align-items-center justify-content-center vh-100 ${darkMode ? "dark" : ""}`}>
      {!isAuthenticated ? (
        // Video Authentication Section
        <div className="text-center">
          <h1 className="mb-4">Video Authentication</h1>
          <div className="mb-4">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="img-fluid rounded shadow" style={{ maxWidth: "100%", height: "auto" }} />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                height={240}
                className="rounded shadow"
              />
            )}
          </div>
          {capturedImage ? (
            <div>
              <Button variant="primary" className="me-2" onClick={retryCapture}>
                Retry
              </Button>
              <Button
                variant="success"
                onClick={() => authenticateUser(capturedImage)}
                disabled={!faceDetected || isLoading}
              >
                {isLoading ? <Spinner animation="border" size="sm" /> : "Confirm"}
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={capture} disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Capture Photo"}
            </Button>
          )}
          {capturedImage && !faceDetected && (
            <p className="text-danger mt-2">No face detected. Please retry.</p>
          )}
          <Form.Check
            type="checkbox"
            label="Remember Me"
            className="mt-3"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </div>
      ) : (
        // Library Section
        <motion.div
          className="p-4 shadow-lg rounded"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            maxWidth: "1200px",
            margin: "auto",
            background: darkMode ? "#1e1e1e" : "#f8f9fa",
            color: darkMode ? "#ffffff" : "#000",
            border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "15px",
          }}
        >
          <h2 className="mb-4">📚 Library</h2>
          <Button variant="danger" className="mb-4" onClick={handleLogout}>
            Logout
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="secondary"
            className="mb-4"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>

          {/* Search Bar */}
          <Form.Control
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          {/* Advanced Filters */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Label>Publication Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter year"
                value={filters.publicationYear}
                onChange={(e) => setFilters({ ...filters, publicationYear: e.target.value })}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Language</Form.Label>
              <Form.Select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              >
                <option value="">All</option>
                <option value="English">English</option>
                <option value="Chinese">Hindi</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Minimum Rating</Form.Label>
              <StarRating
                rating={filters.minRating}
                onRatingChange={(rating) => setFilters({ ...filters, minRating: rating })}
                isFilter
              />
            </Col>
          </Row>

          {/* Book List */}
          <Row>
            {currentBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={openBookDetails}
                onBorrow={borrowBook}
                onReserve={reserveBook}
                onAddToWishlist={addToWishlist}
                borrowedBooks={borrowedBooks}
                reservedBooks={reservedBooks}
              />
            ))}
          </Row>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredBooks.length / booksPerPage)}
            onPageChange={paginate}
          />

          {/* Book Details Modal */}
          {selectedBook && (
            <Modal show={!!selectedBook} onHide={closeBookDetails}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedBook.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>Author:</strong> {selectedBook.author}</p>
                <p><strong>Category:</strong> {selectedBook.category}</p>
                <p><strong>Availability:</strong> {selectedBook.available ? "Available" : "Not Available"}</p>
                <p><strong>Publication Year:</strong> {selectedBook.publicationYear}</p>
                <p><strong>Language:</strong> {selectedBook.language}</p>
                <Form.Group className="mt-3">
                  <Form.Label>Rate this book:</Form.Label>
                  <StarRating
                    rating={ratings[selectedBook.id] || 0}
                    onRatingChange={(rating) => rateBook(selectedBook.id, rating)}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Add a review:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={reviews[selectedBook.id] || ""}
                    onChange={(e) => addReview(selectedBook.id, e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeBookDetails}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  disabled={!selectedBook.available || borrowedBooks.includes(selectedBook.id)}
                  onClick={() => borrowBook(selectedBook.id)}
                >
                  {borrowedBooks.includes(selectedBook.id) ? "Borrowed" : "Borrow"}
                </Button>
                <Button
                  variant="warning"
                  disabled={reservedBooks.includes(selectedBook.id)}
                  onClick={() => reserveBook(selectedBook.id)}
                >
                  Reserve
                </Button>
                <Button
                  variant="success"
                  onClick={() => addToWishlist(selectedBook.id)}
                >
                  Add to Wishlist
                </Button>
              </Modal.Footer>
            </Modal>
          )}

          {/* Wishlist */}
          <div className="mt-4">
            <h3>Wishlist</h3>
            <ul>
              {wishlist.map((bookId) => {
                const book = books.find((b) => b.id === bookId);
                return <li key={bookId}>{book.title}</li>;
              })}
            </ul>
          </div>

          {/* Borrowed Books */}
          <div className="mt-4">
            <h3>Borrowed Books</h3>
            <ul>
              {borrowedBooks.map((bookId) => {
                const book = books.find((b) => b.id === bookId);
                return <li key={bookId}>{book.title}</li>;
              })}
            </ul>
          </div>

          {/* Reserved Books */}
          <div className="mt-4">
            <h3>Reserved Books</h3>
            <ul>
              {reservedBooks.map((bookId) => {
                const book = books.find((b) => b.id === bookId);
                return <li key={bookId}>{book.title}</li>;
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LibraryPage;