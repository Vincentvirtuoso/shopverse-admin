import React, { useState, useRef } from "react";

const TruncatedTextWithTooltip = ({ value, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef(null);

  // Check if text is truncated
  const isTruncated = () => {
    if (!textRef.current) return false;
    return textRef.current.scrollWidth > textRef.current.clientWidth;
  };

  return (
    <>
      <span
        ref={textRef}
        className={`font-medium text-gray-900 dark:text-white text-right truncate ${className}`}
        onMouseEnter={() => isTruncated() && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={value}
      >
        {value}
      </span>

      {showTooltip && (
        <div className="relative inline-block max-w-md">
          <div className="absolute z-50 px-3 py-2 text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg bottom-7 right-0 max-w-xl min-w-xs text-sm">
            {value}
            <div className="absolute w-4 h-4 bg-gray-900 dark:bg-gray-700 transform rotate-45 -bottom-1 right-3"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default TruncatedTextWithTooltip;
