const Spinner = ({
  size = "md",
  color = "secondary",
  borderWidth = "4",
  className = "",
  svgClassName = "",
  label = "",
  labelPosition = "bottom",
  labelAnimation = "none",
  showBackground = true,
  backgroundOpacity = "25",
  spinArcOpacity = "75",
}) => {
  // Size mappings for SVG dimensions
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
    "2xl": "w-14 h-14",
    "3xl": "w-20 h-20",
    "4xl": "w-24 h-24",
  };

  // Color mappings for SVG strokes and fills
  const colorClasses = {
    white: "text-white",
    black: "text-black",
    primary: "text-red-500",
    secondary: "text-gray-600 dark:text-gray-200",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
    info: "text-blue-600",
  };

  // Secondary color mappings for background circle
  const secondaryColorClasses = {
    white: "text-white",
    black: "text-black",
    primary: "text-red-200",
    secondary: "text-gray-200",
    success: "text-green-200",
    warning: "text-yellow-200",
    danger: "text-red-200",
    info: "text-blue-200",
  };

  // Border width mappings for SVG stroke width
  const borderWidthMappings = {
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
  };

  // Label position classes
  const labelPositionClasses = {
    top: "flex-col-reverse",
    bottom: "flex-col",
    left: "flex-row-reverse",
    right: "flex-row",
  };

  // Label animation classes
  const labelAnimationClasses = {
    none: "",
    pulse: "animate-pulse",
    bounce: "animate-bounce",
    ping: "animate-ping",
    spin: "animate-spin",
    fade: "animate-fade",
    slide: "animate-slide",
    typing: "animate-typing",
    wave: "animate-wave",
    shimmer: "animate-shimmer",
    glow: "animate-glow",
  };

  const strokeWidth = borderWidthMappings[borderWidth] || borderWidth;
  const spinnerColor = colorClasses[color] || `text-${color}`;
  const bgColor = secondaryColorClasses[color] || `text-${color}`;
  const animationClass = labelAnimationClasses[labelAnimation] || "";

  return (
    <div
      className={`
      flex items-center gap-2 
      ${labelPositionClasses[labelPosition] || "flex-col"}
      ${className}
    `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {/* SVG Spinner */}
      <svg
        className={`
          animate-spin 
          ${sizeClasses[size] || size}
          ${spinnerColor}
          ${svgClassName}
        `
          .trim()
          .replace(/\s+/g, " ")}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={label || "Loading"}
      >
        {/* Background circle with custom opacity */}
        {showBackground && (
          <circle
            className={bgColor}
            style={{ opacity: backgroundOpacity / 100 }}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        )}

        {/* Spinning arc with custom opacity */}
        <path
          className={spinnerColor}
          style={{ opacity: spinArcOpacity / 100 }}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      {/* Animated Label */}
      {label && (
        <span
          className={`
          text-sm 
          ${spinnerColor}
          ${animationClass}
          transition-all duration-300
        `}
        >
          {label}
          {labelAnimation === "typing" && (
            <span className="animate-typing-dots">...</span>
          )}
        </span>
      )}
    </div>
  );
};

export default Spinner;
