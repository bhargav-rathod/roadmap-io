'use client'

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const messages = [
  "Hang tight, we are creating the best roadmap for you",
  "We are as excited as you are in this journey",
  "Don't get bored, we're searching for the most useful information",
  "Compiling the perfect resources for your success",
  "Almost there! Your personalized roadmap is coming together"
];

export default function CreatingRoadmapLoader() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Loader content */}
      <div className="relative z-10 w-full max-w-[800px] mx-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="relative h-[400px] flex flex-col items-center justify-center p-8">
            {/* Animated gradient background */}
            <div className="absolute inset-0 animate-gradient-slow bg-[length:400%_400%] bg-gradient-to-r from-indigo-100 via-pink-100 to-blue-100" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="w-48 h-48 mb-8">
                <img 
                  src="/gifs/loading_animation.gif"
                  alt="Creating roadmap"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Creating Your Roadmap
              </h3>
              <p className="text-gray-600 text-center text-xl min-h-[48px] transition-opacity duration-500 ease-in-out">
                {messages[currentMessage]}
              </p>
              
              {/* Progress bar */}
              <div className="mt-8 w-3/4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${(currentMessage + 1) * (100 / messages.length)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .animate-gradient-slow {
          animation: gradientBG 12s ease infinite;
        }
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>,
    document.body
  );
}
