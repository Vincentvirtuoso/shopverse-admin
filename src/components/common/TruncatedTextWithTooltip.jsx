import React, { useState, useRef } from "react";

const TruncatedTextWithTooltip = ({
  value,
  className = "",
  maxLength = 9999,
  tooltipStyle = "auto",
  showTooltipOnHover = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef(null);

  // Truncate text if it exceeds maxLength
  const truncatedText =
    value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;

  // Check if text is truncated (visually)
  const isVisuallyTruncated = () => {
    if (!textRef.current) return false;
    return textRef.current.scrollWidth > textRef.current.clientWidth;
  };

  // Determine if we should show tooltip
  const shouldShowTooltip =
    value.length > maxLength || (showTooltipOnHover && isVisuallyTruncated());

  const handleMouseEnter = () => {
    if (shouldShowTooltip) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <span
        ref={textRef}
        className={`font-medium text-gray-900 dark:text-white text-right truncate ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={value.length > maxLength ? value : undefined}
        title={
          !showTooltipOnHover && value.length > maxLength ? value : undefined
        }
      >
        {truncatedText}
      </span>

      {showTooltip && shouldShowTooltip && (
        <div className="relative inline-block max-w-md">
          <div
            className={`absolute z-50 px-3 py-2 text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg bottom-7 right-0 ${tooltipStyle === "auto" ? "text-sm max-w-xl min-w-xs" : tooltipStyle} z-1`}
          >
            {value}
            <div className="absolute w-4 h-4 bg-gray-900 dark:bg-gray-700 transform rotate-45 -bottom-1 right-3 -z-1"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default TruncatedTextWithTooltip;
