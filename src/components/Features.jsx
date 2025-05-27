import React from 'react';
import { assets } from '../assets/assets.js';

const Features = () => {
  const features = [
    {
      id: 1,
      title: 'Minimize Food Waste',
      description: 'Track inventory and sales in real-time to reduce food wastage effectively.',
      icon: assets.foodwaste,
    },
    {
      id: 2,
      title: 'Boost Revenue with Smart Insights',
      description: 'Optimize menu pricing and identify top-selling items to boost profits.',
      icon: assets.growth,
    },
    {
      id: 3,
      title: 'Identify Peak Sales Hours',
      description: 'Track orders to pinpoint peak hours and plan staffing or promotions.',
      icon: assets.peo,
    },
  ];

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400&family=Roboto:wght@400;700&display=swap');
        `}
      </style>

      <div className="bg-[#F5F1EB] text-[#1A2A44] flex flex-col items-center px-6 py-16 w-full min-h-screen">
        <h2
          className="text-5xl md:text-6xl mb-16 italic text-[#000000]"
          style={{ fontFamily: "'Dancing Script', cursive'" }}
        >
          Why Choose Us?
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-8 w-full max-w-[90%]">
          {features.map((item) => (
            <div
              key={item.id}
              className="bg-[#1e2a44] rounded-xl shadow-lg p-8 flex flex-col items-center flex-1 min-h-[300px] md:min-h-[350px]"
            >
              <img
                src={item.icon}
                alt={`Icon for ${item.title}`}
                className="w-12 h-12 md:w-16 md:h-16 object-contain mb-6"
              />
              <h3
                className="text-2xl md:text-3xl font-semibold mb-4 text-center text-yellow-400 whitespace-nowrap"
                style={{ fontFamily: "'Roboto', sans-serif'" }}
              >
                {item.title}
              </h3>
              {item.description && (
                <p
                  className="text-lg md:text-xl text-center text-white"
                  style={{ fontFamily: "'Roboto', sans-serif'" }}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Features;