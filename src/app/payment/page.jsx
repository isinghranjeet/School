"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "bootstrap/dist/css/bootstrap.min.css";

// SkeletonLoader Component
const SkeletonLoader = () => (
  <div className="skeleton-loader">
    <div className="skeleton-line" style={{ width: "100%", height: "40px", borderRadius: "8px", backgroundColor: "#e0e0e0" }}></div>
  </div>
);

// Payment History Component
const PaymentHistory = ({ payments, onClose }) => {
  const [filter, setFilter] = useState("all"); // Filter by status: all, success, failed
  const [sort, setSort] = useState("latest"); // Sort by: latest, oldest, amount

  // Filter payments based on status
  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true;
    return payment.status === filter;
  });

  // Sort payments based on criteria
  const sortedPayments = filteredPayments.sort((a, b) => {
    if (sort === "latest") return new Date(b.timestamp) - new Date(a.timestamp);
    if (sort === "oldest") return new Date(a.timestamp) - new Date(b.timestamp);
    if (sort === "amount") return b.amount - a.amount;
    return 0;
  });

  return (
    <motion.div
      className="payment-history-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Payment History</h4>
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>

      {/* Filter and Sort Controls */}
      <div className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="success">Successful Payments</option>
              <option value="failed">Failed Payments</option>
            </select>
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount">Highest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment List */}
      {sortedPayments.length === 0 ? (
        <p className="text-muted">No payments found.</p>
      ) : (
        <div className="list-group">
          {sortedPayments.map((payment, index) => (
            <motion.div
              key={index}
              className="list-group-item mb-3 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="d-flex align-items-center">
                    <i
                      className={`fas ${
                        payment.status === "success" ? "fa-check-circle text-success" : "fa-times-circle text-danger"
                      } me-2`}
                    ></i>
                    <div>
                      <strong>Amount:</strong> ₹{payment.amount}
                    </div>
                  </div>
                  <div className="text-muted">
                    <small>{new Date(payment.timestamp).toLocaleString()}</small>
                  </div>
                </div>
                <span className={`badge ${payment.status === "success" ? "bg-success" : "bg-danger"}`}>
                  {payment.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Payment Form Component
const PaymentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [showUPI, setShowUPI] = useState(false);
  const [upiId, setUpiId] = useState("9315058665@ptsbi");
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [paymentDone, setPaymentDone] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const storedPayments = JSON.parse(localStorage.getItem("payments")) || [];
    setPayments(storedPayments);
    setIsFormLoading(false);
  }, []);

  const savePayment = (amount, status) => {
    const newPayment = {
      amount,
      status,
      timestamp: new Date().toISOString(),
    };
    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);
    localStorage.setItem("payments", JSON.stringify(updatedPayments));
  };

  const handleRazorpayPayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      setPaymentStatus("Please enter a valid amount.");
      return;
    }

    if (!scriptLoaded) {
      setPaymentStatus("Razorpay script is still loading. Please try again.");
      return;
    }

    setIsLoading(true);

    const options = {
      key: "rzp_test_YOUR_RAZORPAY_KEY_ID",
      amount: paymentAmount * 100,
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      handler: function (response) {
        setPaymentStatus("Payment successful!");
        savePayment(paymentAmount, "success");
        setPaymentDone(true);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      setPaymentStatus("Payment failed. Please try again.");
      savePayment(paymentAmount, "failed");
    });
    rzp.open();
    setIsLoading(false);
  };

  const handleUPIPayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      setPaymentStatus("Please enter a valid amount.");
      return;
    }

    setPaymentStatus("UPI payment initiated. Please complete the payment using the QR code.");
    setShowUPI(true);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.5;
      if (isSuccess) {
        setPaymentStatus("Payment successful!");
        savePayment(paymentAmount, "success");
        setPaymentDone(true);
      } else {
        setPaymentStatus("Payment failed. Please try again.");
        savePayment(paymentAmount, "failed");
      }
      setShowUPI(false);
    }, 3000);
  };

  const resetForm = () => {
    setPaymentDone(false);
    setPaymentStatus("");
    setShowUPI(false);
    setPaymentAmount("");
  };

  const closeMessage = () => {
    setPaymentStatus("");
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="mb-4">
        <label htmlFor="paymentAmount" className="form-label">
          Enter Amount (₹)
        </label>
        <input
          type="number"
          className="form-control"
          id="paymentAmount"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          min="1"
          required
          disabled={paymentDone || isLoading}
        />
      </div>

      <div className="mb-4">
        {isFormLoading ? (
          <SkeletonLoader />
        ) : (
          <motion.div
            className="btn-group w-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="button"
              className={`btn ${!showUPI ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setShowUPI(false)}
              disabled={paymentDone || isLoading}
            >
              <i className="fas fa-credit-card me-2"></i> Card Payment
            </button>
            <button
              type="button"
              className={`btn ${showUPI ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setShowUPI(true)}
              disabled={paymentDone || isLoading}
            >
              <i className="fas fa-qrcode me-2"></i> UPI Payment
            </button>
          </motion.div>
        )}
      </div>

      {!paymentDone ? (
        !showUPI ? (
          <>
            {isFormLoading ? (
              <SkeletonLoader />
            ) : (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button
                  type="button"
                  className="btn btn-primary w-100 btn-gradient"
                  onClick={handleRazorpayPayment}
                  disabled={isLoading || !paymentAmount || !scriptLoaded}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <>
            {isFormLoading ? (
              <SkeletonLoader />
            ) : (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="mb-3">Scan the QR code below to pay via UPI:</p>
                <div className="neumorphic-card p-3 mb-3">
                  <QRCode
                    value={`upi://pay?pa=${upiId}&pn=Your%20Name&am=${paymentAmount}&cu=INR`}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="Q"
                  />
                </div>
                <p className="text-muted">UPI ID: {upiId}</p>
                <button
                  type="button"
                  className="btn btn-primary w-100 btn-gradient"
                  onClick={handleUPIPayment}
                  disabled={isLoading || !paymentAmount}
                >
                  Simulate UPI Payment
                </button>
              </motion.div>
            )}
          </>
        )
      ) : (
        <>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-success mb-3">
              <i className="fas fa-check-circle me-2"></i> Payment Successful!
            </h3>
            <p>Thank you for your payment.</p>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={resetForm}
            >
              Make Another Payment
            </button>
          </motion.div>
        </>
      )}

      {paymentStatus && !paymentDone && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className={`alert ${paymentStatus.includes("success") ? "alert-success" : "alert-danger"}`}>
            {paymentStatus}
            <button
              type="button"
              className="btn-close"
              onClick={closeMessage}
              aria-label="Close"
            ></button>
          </div>
        </motion.div>
      )}

      <div className="mt-4 text-center">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowHistory(true)}
        >
          <i className="fas fa-history me-2"></i> View Payment History
        </button>
      </div>

      {/* Full-Page Payment History Modal */}
      {showHistory && (
        <div
          className="modal-backdrop-full"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="modal-content-full"
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <PaymentHistory payments={payments} onClose={() => setShowHistory(false)} />
          </div>
        </div>
      )}
    </form>
  );
};

// Payment Page Component
const PaymentPage = () => {
  const particlesInit = async (main) => {
  
  };

  const particlesOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    particles: {
      number: {
        value: 50,
      },
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
      },
    },
  };

  return (
    <div
      className="p-4"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
      />

      {/* Payment Form */}
      <motion.div
        className="p-4 shadow-lg rounded"
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "15px",
          zIndex: 2,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-center text-gradient">
          <i className="fas fa-credit-card me-2"></i> Payment
        </h2>
        <PaymentForm />
      </motion.div>
    </div>
  );
};

export default PaymentPage;