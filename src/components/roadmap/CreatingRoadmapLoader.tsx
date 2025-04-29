// components/roadmap/CreatingRoadmapLoader.tsx
'use client'

import { useEffect, useState } from 'react';

const messages = [
  "Hang tight, we are creating the best roadmap for you",
  "We are as excited as you are in this journey",
  "Don't get bored, we're searching for the most useful information",
  "Compiling the perfect resources for your success",
  "Almost there! Your personalized roadmap is coming together"
];

export default function CreatingRoadmapLoader() {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-[800px] h-[400px] mx-4 shadow-2xl flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 mb-8">
            <img 
              src= '/loading_animation.gif'
              alt="Creating roadmap"
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Creating Your Roadmap
          </h3>
          <p className="text-gray-600 text-center min-h-16 text-xl transition-all duration-500 ease-in-out">
            {messages[currentMessage]}
          </p>
          <div className="mt-8 w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full animate-pulse" 
              style={{ width: `${(currentMessage + 1) * (100 / messages.length)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}