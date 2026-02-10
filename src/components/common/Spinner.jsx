const Spinner = ({
  size = "md",
  color = "white",
  borderWidth = "4",
  className = "",
}) => {
  // Size mappings
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
    "2xl": "w-12 h-12",
  };

  // Color mappings
  const colorClasses = {
    white: "border-white border-t-transparent",
    black: "border-black border-t-transparent",
    primary: "border-blue-600 border-t-transparent",
    secondary: "border-gray-600 border-t-transparent",
    success: "border-green-600 border-t-transparent",
    danger: "border-red-600 border-t-transparent",
    warning: "border-yellow-600 border-t-transparent",
  };

  // Border width mappings
  const borderClasses = {
    2: "border-2",
    3: "border-3",
    4: "border-4",
    5: "border-5",
  };

  return (
    <div
      className={`
        ${sizeClasses[size] || size}
        ${colorClasses[color] || color}
        ${borderClasses[borderWidth] || `border-${borderWidth}`}
        rounded-full 
        animate-spin
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
