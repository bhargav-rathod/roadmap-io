import React, { useState, useRef, useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  maxWidth?: number; // Max width in pixels
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  className = '',
  maxWidth = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      // Create a test element to measure content width
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.whiteSpace = 'nowrap';
      testElement.style.padding = '0.5rem';
      testElement.style.fontSize = '0.875rem';
      testElement.style.lineHeight = '1.25rem';
      testElement.textContent = content;
      document.body.appendChild(testElement);

      const contentWidth = testElement.offsetWidth;
      document.body.removeChild(testElement);

      // Set width only if content exceeds maxWidth
      setTooltipWidth(contentWidth > maxWidth ? maxWidth : undefined);
    }
  }, [isVisible, content, maxWidth]);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-pointer"
      >
        {children || <FiInfo className="text-gray-400 hover:text-gray-600" size={16} />}
      </div>
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`
            absolute z-50 p-2 text-sm text-white bg-gray-800 rounded shadow-lg
            ${positionClasses[position]}
            animate-fadeIn
            ${tooltipWidth ? 'whitespace-normal' : 'whitespace-nowrap'}
          `}
          style={{ width: tooltipWidth, maxWidth }}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
            position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
            position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
            position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
            'left-[-4px] top-1/2 -translate-y-1/2'
          }`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;