import React, { useState } from 'react';

const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setMessage('Please enter your name.');
      setShowSuccessAnimation(false);
      return;
    }
    if (!email) {
      setMessage('Please enter your email.');
      setShowSuccessAnimation(false);
      return;
    }
    if (!feedback) {
      setMessage('Please enter your feedback.');
      setShowSuccessAnimation(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      setShowSuccessAnimation(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setMessage('');
      setShowSuccessAnimation(true);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setFeedback('');

      setTimeout(() => {
        setShowSuccessAnimation(false);
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      setMessage('Error submitting feedback. Please check your connection and try again.');
      setShowSuccessAnimation(false);
      console.error('Feedback submission error:', error);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
            50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.7); }
            100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
          }
          .animate-glow {
            animation: glow 1.5s ease-in-out infinite;
          }
        `}
      </style>

      <div className="bg-[#0f172a] min-h-screen flex flex-col items-center justify-center py-12 px-6">
        <div className="text-center max-w-lg w-full">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#ebbf24] mb-4"
            style={{ fontFamily: "'Roboto', sans-serif'" }}
          >
            We Value Your Feedback
          </h2>
          <p
            className="text-lg text-white mb-6"
            style={{ fontFamily: "'Roboto', sans-serif'" }}
          >
            Help us improve your ThaliVerse experience!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-base font-medium text-[#ebbf24] mb-2"
                style={{ fontFamily: "'Roboto', sans-serif'" }}
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-lg bg-[#1a2639] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ebbf24] placeholder-gray-400"
                placeholder="Enter your name"
                disabled={isSubmitted}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-[#ebbf24] mb-2"
                style={{ fontFamily: "'Roboto', sans-serif'" }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-lg bg-[#1a2639] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ebbf24] placeholder-gray-400"
                placeholder="Enter your email"
                disabled={isSubmitted}
              />
            </div>

            <div>
              <label
                htmlFor="feedback"
                className="block text-base font-medium text-[#ebbf24] mb-2"
                style={{ fontFamily: "'Roboto', sans-serif'" }}
              >
                Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-4 rounded-lg bg-[#1a2639] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ebbf24] resize-none placeholder-gray-400"
                rows="4"
                placeholder="Enter your feedback"
                disabled={isSubmitted}
              />
            </div>

            {message && !showSuccessAnimation && (
              <p
                className="text-center text-red-400"
                style={{ fontFamily: "'Roboto', sans-serif'" }}
              >
                {message}
              </p>
            )}

            {showSuccessAnimation && (
              <div className="flex flex-col items-center mt-4">
                <p
                  className="text-green-400 text-center animate-glow"
                  style={{ fontFamily: "'Roboto', sans-serif'" }}
                >
                  Thank you for your feedback!
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#ebbf24] text-black font-semibold py-4 rounded-lg hover:bg-yellow-500 transition"
              disabled={isSubmitted}
              style={{ fontFamily: "'Roboto', sans-serif'" }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Feedback;
