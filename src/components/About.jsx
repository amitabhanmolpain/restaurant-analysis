import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Headerr from "../assets/Headerr.png";
import H4 from "../assets/H4.png";

const About = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    // Simulate API call to backend (future implementation)
    setMessage('');
    setShowModal(false);
    setShowSuccessPopup(true);

    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate('/dashboard');
    }, 2000);
  };

  const handleAnalyzeClick = () => {
    navigate('/menu');
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>

      <div className="bg-[#0f172a] text-white min-h-screen flex flex-col items-center justify-between px-6 pt-24 pb-0 relative">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#fbbf24] mb-4">
            Unlock Restaurant <span className="block">Insights</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Your Ultimate Guide to Restaurant Analysis
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#fbbf24] hover:bg-yellow-400 text-black font-semibold py-2 px-6 rounded transition animate-float"
          >
            Sign In/Sign Up
          </button>
        </div>

        <div className="w-full flex flex-col items-center">
          <p className="text-[#e0e0e0] text-xl mb-12 italic">
            Savor the Essence of India
          </p>
          <div className="w-full">
            <img
              src={H4}
              alt="Indian Food Illustration"
              className="w-full h-[800px] object-cover rounded-t-lg shadow-lg"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyzeClick}
          className="fixed bottom-6 right-6 bg-[#fbbf24] hover:bg-yellow-400 text-black p-4 rounded-full shadow-lg transition-all duration-300 z-50"
          title="Analyze Now"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Password</label>
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
                  className="w-full bg-[#fbbf24] hover:bg-yellow-400 text-black py-2 rounded"
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
              </form>
              <p className="mt-4 text-center">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setMessage('');
                  }}
                  className="text-[#fbbf24] hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
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
            <div className="bg-white text-black p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Success!</h2>
              <p>{isSignUp ? 'Account created successfully!' : 'You have successfully signed in.'} Redirecting to dashboard...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default About;
