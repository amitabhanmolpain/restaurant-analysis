import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white py-12 px-6 w-full">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400&family=Roboto:wght@400;700&display=swap');
        `}
      </style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Thali Verse Branding */}
        <div className="flex flex-col items-center md:items-start">
          <h2
            className="text-4xl italic text-[#ebbf24] mb-2"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Thali Verse
          </h2>
          <p
            className="text-sm text-center md:text-left text-gray-300"
            style={{ fontFamily: "'Roboto', sans-serif'" }}
          >
            Savor the Essence of Indian Cuisine
          </p>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col items-center md:items-start">
          <h3
            className="text-xl font-semibold text-[#ebbf24] mb-4"
            style={{ fontFamily: "'Roboto', sans-serif'" }}
          >
            Contact Us
          </h3>
          <p
            className="text-sm text-gray-300 mb-2"
            style={{ fontFamily: "'Roboto', sans-serif'" }}
          >
            Email: support@thaliverse.com
          </p>
          <p
            className="text-sm text-gray-300 mb-2"
            style={{ fontFamily: "'Roboto', sans-serif'" }}
          >
            Phone: +91 98765 43210
          </p>
          <p
            className="text-sm text-gray-300"
            style={{ fontFamily: "'Roboto', sans-serif'" }}
          >
            Address: 123 Flavor Street, Mumbai, India
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3
            className="text-xl font-semibold text-[#ebbf24] mb-4"
            style={{ fontFamily: "'Roboto', sans-serif'" }}
          >
            Follow Us
          </h3>
          <div className="flex space-x-4">
            {/* Twitter */}
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
            {/* Instagram */}
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
            {/* Facebook */}
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

      {/* Copyright Notice */}
      <div className="mt-8 text-center border-t border-gray-700 pt-4">
        <p
          className="text-sm text-gray-400"
          style={{ fontFamily: "'Roboto', sans-serif'" }}
        >
          © 2025 Thali Verse. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;