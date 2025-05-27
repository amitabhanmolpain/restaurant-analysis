import React, { useState } from 'react';
import '../index.css';
import { assets } from '../assets/assets.js';

const foodItems = [
  { id: 1, image: assets.im1 },
  { id: 2, image: assets.im9 },
  { id: 3, image: assets.im10 },
  { id: 4, image: assets.img7 },
  { id: 5, image: assets.bi },
  { id: 6, image: assets.su },
  { id: 7, image: assets.cb },
  { id: 8, image: assets.ra },
  { id: 9, image: assets.cro },
  { id: 10, image: assets.doa },
  { id: 11, image: assets.ra },
  { id: 12, image: assets.smo },
];

const Middle = () => {
  const itemsPerPage = 4;
  const totalSlides = Math.ceil(foodItems.length / itemsPerPage);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const startIndex = currentSlide * itemsPerPage;
  const visibleItems = foodItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="py-9 min-h-[500px] flex flex-col items-center justify-center bg-[#F5F1EB] w-full">
      <h1
        className="text-4xl md:text-5xl font-bold text-center text-black mb-6"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Featured Dishes
      </h1>

      <div className="relative w-full max-w-7xl flex items-center justify-center px-4 sm:px-6">
        {/* Left Arrow */}
        <button
          className="absolute left-2 sm:left-[-20px] top-1/2 transform -translate-y-1/2 z-10 focus:outline-none"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 hover:text-yellow-500 transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Cards */}
        <div className="flex gap-4 sm:gap-6 overflow-hidden w-full justify-center">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] bg-[#1e2a44] rounded-lg overflow-hidden shadow-lg border-4 border-[#2c3e50]"
            >
              <img
                src={item.image}
                alt="Food"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/280x280')}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-2 sm:right-[-20px] top-1/2 transform -translate-y-1/2 z-10 focus:outline-none"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 hover:text-yellow-500 transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <a
        href="/menu"
        className="block text-center mt-12 text-[#0f172a] text-base md:text-lg hover:text-yellow-500 transition"
        style={{ fontFamily: "'Roboto', sans-serif'" }}
      >
        See More →
      </a>
    </div>
  );
};

export default Middle;