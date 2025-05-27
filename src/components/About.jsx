import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { assets } from '../assets/assets.js';
import Middle from './Middle';
import Features from './Features';

const About = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [showFeedbackAnimation, setShowFeedbackAnimation] = useState(false);
  const [navError, setNavError] = useState('');

  const middleRef = useRef(null);
  const featuresRef = useRef(null);
  const feedbackRef = useRef(null);

  const credentials = {
    'admin': 'admin123',
    'manager': 'manager456',
    'owner': 'owner789',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setMessage('Name is required');
      return;
    }
    if (!password) {
      setMessage('Password is required');
      return;
    }

    if (credentials[name.toLowerCase()] && credentials[name.toLowerCase()] === password) {
      localStorage.setItem('isAuthorized', 'true');
      setMessage('');
      setShowModal(false);
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
        try {
          navigate('/dashboard');
        } catch (error) {
          console.error('Navigation error:', error);
          setMessage('Failed to redirect to dashboard. Please try again.');
        }
      }, 2000);
    } else {
      setMessage('Invalid name or password');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackName) {
      setFeedbackMessage('Please enter your name.');
      setShowFeedbackAnimation(false);
      return;
    }
    if (!feedbackEmail) {
      setFeedbackMessage('Email is required.');
      setShowFeedbackAnimation(false);
      return;
    }
    if (!feedback) {
      setFeedbackMessage('Feedback is required.');
      setShowFeedbackAnimation(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(feedbackEmail)) {
      setFeedbackMessage('Please enter a valid email address.');
      setShowFeedbackAnimation(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: feedbackName,
          email: feedbackEmail,
          feedback: feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setFeedbackMessage('');
      setShowFeedbackAnimation(true);
      setIsFeedbackSubmitted(true);
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedback('');

      setTimeout(() => {
        setShowFeedbackAnimation(false);
        setIsFeedbackSubmitted(false);
      }, 3000);
    } catch (error) {
      setFeedbackMessage('Error submitting feedback. Please check your connection and try again.');
      setShowFeedbackAnimation(false);
      console.error('Feedback submission error:', error);
    }
  };

  const scrollToMiddle = () => {
    middleRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeatures = () => {
    featuresRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeedback = () => {
    feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiscoverMore = () => {
    try {
      navigate('/');
      setNavError('');
    } catch (error) {
      console.error('Navigation error:', error);
      setNavError('Failed to navigate to homepage. Please try again.');
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400&family=Roboto:wght@400;700&display=swap');
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
            50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.7); }
            100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
          }
          .animate-checkmark {
            animation: scaleIn 0.5s ease-out forwards;
          }
          .animate-glow {
            animation: glow 1.5s ease-in-out infinite;
          }
          .footer-overlay::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.7);
            z-index: 0;
          }
          .footer-overlay > * {
            position: relative;
            z-index: 1;
          }
        `}
      </style>

      <div className="bg-[#0f172a] text-white flex flex-col">
        <nav className="fixed top-0 left-0 w-full bg-[#0f172a] shadow-md z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="text-4xl font-bold text-[#ebbf24]" style={{ fontFamily: "'Dancing Script', cursive" }}>
                Thali Verse
              </div>
              <div className="flex items-center space-x-8">
                <a
                  href="#home"
                  className="text-white hover:text-[#ebbf24] transition cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  Home
                </a>
                <a
                  href="#menu"
                  className="text-white hover:text-[#ebbf24] transition cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToMiddle();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToMiddle();
                    }
                  }}
                >
                  Menu
                </a>
                <a
                  href="#about"
                  className="text-white hover:text-[#ebbf24] transition cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToFeatures();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToFeatures();
                    }
                  }}
                >
                  About
                </a>
                <a
                  href="#feedback"
                  className="text-white hover:text-[#ebbf24] transition cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToFeedback();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToFeedback();
                    }
                  }}
                >
                  Feedback
                </a>
                <a
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#ebbf24] hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded transition"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-1 pt-20 px-6 pb-12 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#ebbf24] mb-4">
              Unlock Restaurant <span className="block">Insights</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6">Your Ultimate Guide to Restaurant Analysis</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#ebbf24] hover:bg-yellow-400 text-black font-semibold py-2 px-6 rounded transition animate-float"
            >
              Access Dashboard
            </button>
          </div>

          <div className="w-full flex flex-col items-center">
            <p className="text-white text-xl mb-12 italic">Savor the Essence of Flavors</p>
            <div className="w-full">
              <img
                src={assets.H4}
                alt="Indian Food Illustration"
                className="w-full h-[800px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {navError && (
            <div className="text-center text-red-400 mt-4">
              {navError}
            </div>
          )}

          <div ref={middleRef}>
            <Middle />
          </div>

          <div className="flex flex-col md:flex-row min-h-[400px] bg-[#0f172a] w-full">
            <div className="md:w-1/2 flex items-center justify-center p-6">
              <img
                src={assets.A1}
                alt="Restaurant Analytics Illustration"
                className="w-full max-w-md object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center p-8 text-white">
              <h2 className="text-4xl font-bold mb-4 tracking-wide uppercase text-[#ebbf24]">
                Why Choose Our Restaurant Analytics Website?
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                As a restaurant owner, you need tools to stay ahead in a competitive industry. Thali Verse is your all-in-one restaurant analytics platform, designed to empower you with clear, actionable insights. From tracking sales and customer preferences to optimizing inventory and staff performance, our website helps you make data-driven decisions that boost efficiency, enhance customer satisfaction, and increase profits. With an intuitive dashboard tailored for your restaurant, you’ll unlock the full potential of your business in just a few clicks.
              </p>
              <button 
                onClick={handleDiscoverMore}
                className="bg-[#ebbf24] text-[#0f172a] font-semibold py-3 px-6 rounded-full w-fit hover:bg-yellow-500 transition"
              >
                Discover More
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row min-h-[400px] bg-[#0f172a] w-full">
            <div className="md:w-1/2 flex items-center justify-center p-6">
              <img
                src={assets.A3}
                alt="Analytics Operation Illustration"
                className="w-full max-w-md object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center p-8 text-white">
              <h2 className="text-4xl font-bold mb-4 tracking-wide uppercase text-[#ebbf24]">
                How Our Platform Transforms Your Operations
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Thali Verse seamlessly integrates with your restaurant’s systems to deliver real-time analytics that drive success. By connecting to your point-of-sale system, reservation platforms, and customer feedback channels, our platform compiles data into comprehensive reports. Monitor top-performing dishes, identify peak hours, and track inventory to minimize waste. Our predictive analytics forecast demand, helping you optimize staffing and stock levels. With Thali Verse, you’ll streamline operations, reduce costs, and create exceptional dining experiences that keep customers coming back.
              </p>
              <button 
                onClick={handleDiscoverMore}
                className="bg-[#ebbf24] text-[#0f172a] font-semibold py-3 px-6 rounded-full w-fit hover:bg-yellow-500 transition"
              >
                Discover More
              </button>
            </div>
          </div>

          <div ref={featuresRef}>
            <Features />
          </div>

          <div ref={feedbackRef} className="bg-[#0f172a] w-full flex flex-col items-center py-12 px-6">
            <div className="text-center max-w-lg w-full">
              <h2
                className="text-4xl md:text-5xl font-bold text-[#ebbf24] mb-4"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Share Your Feedback
              </h2>
              <p
                className="text-lg text-white mb-6"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                We’d love to hear your thoughts! Let us know how we can improve.
              </p>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="feedbackName"
                    className="block text-base font-medium text-[#ebbf24] mb-2"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="feedbackName"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    className="w-full p-4 rounded-lg bg-[#1a2639] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ebbf24] placeholder-gray-400"
                    placeholder="Enter your name"
                    disabled={isFeedbackSubmitted}
                  />
                </div>

                <div>
                  <label
                    htmlFor="feedbackEmail"
                    className="block text-base font-medium text-[#ebbf24] mb-2"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="feedbackEmail"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    className="w-full p-4 rounded-lg bg-[#1a2639] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ebbf24] placeholder-gray-400"
                    placeholder="Enter your email"
                    disabled={isFeedbackSubmitted}
                  />
                </div>

                <div>
                  <label
                    htmlFor="feedbackText"
                    className="block text-base font-medium text-[#ebbf24] mb-2"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Feedback
                  </label>
                  <textarea
                    id="feedbackText"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-4 rounded-lg bg-[#1a2639] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ebbf24] resize-none placeholder-gray-400"
                    rows="4"
                    placeholder="Enter your feedback"
                    disabled={isFeedbackSubmitted}
                  />
                </div>

                {feedbackMessage && !showFeedbackAnimation && (
                  <p
                    className="text-center text-red-400"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    {feedbackMessage}
                  </p>
                )}

                {showFeedbackAnimation && (
                  <div className="flex flex-col items-center mt-4">
                    <div className="relative flex items-center justify-center w-16 h-16 bg-green-500 rounded-full animate-glow">
                      <svg
                        className="w-10 h-10 text-white animate-checkmark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Success checkmark"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p
                      className="mt-2 text-green-400 text-center"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Thank you for your feedback!
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#ebbf24] text-black font-semibold py-4 rounded-lg hover:bg-yellow-500 transition"
                  disabled={isFeedbackSubmitted}
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-black">Authorize Access</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-black">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border rounded text-black"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-black">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 border rounded text-black"
                      required
                    />
                  </div>
                  {message && <p className="text-red-500 mb-4">{message}</p>}
                  <button
                    type="submit"
                    className="w-full bg-[#ebbf24] hover:bg-yellow-400 text-black py-2 rounded"
                  >
                    Authorize
                  </button>
                </form>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {showSuccessPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg flex flex-col items-center">
                <div className="relative flex items-center justify-center w-16 h-16 bg-green-500 rounded-full animate-glow mb-4">
                  <svg
                    className="w-10 h-10 text-white animate-checkmark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Success checkmark"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-black">Success!</h2>
                <p className="text-black">Access authorized. Redirecting to dashboard...</p>
              </div>
            </div>
          )}
        </div>

        <footer
          className="footer-overlay relative text-white py-12 px-6 w-full"
          style={{
            backgroundImage: `url(${assets.H4})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center md:items-start">
              <h2
                className="text-4xl italic text-[#ebbf24] mb-2"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Thali Verse
              </h2>
              <p
                className="text-sm text-center md:text-left text-gray-300"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Savor the Essence of Indian Cuisine
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3
                className="text-xl font-semibold text-[#ebbf24] mb-4"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Contact Us
              </h3>
              <p
                className="text-sm text-gray-300 mb-2"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Email: support@thaliverse.com
              </p>
              <p
                className="text-sm text-gray-300 mb-2"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Phone: +91 98765 43210
              </p>
              <p
                className="text-sm text-gray-300"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Address: 123 Flavor Street, Mumbai, India
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3
                className="text-xl font-semibold text-[#ebbf24] mb-4"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-[#ebbf24] hover:text-[#f4d03f] transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                    />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-[#ebbf24] hover:text-[#f4d03f] transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 7a2 2 0 100 4 2 2 0 000-4zm5-3a1 1 0 110 2 1 1 0 010-2z"
                    />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-[#ebbf24] hover:text-[#f4d03f] transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center border-t border-gray-700 pt-4">
            <p
              className="text-sm text-gray-400"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              © 2025 Thali Verse. All rights reserved.

            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default About;
