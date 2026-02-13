import React from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { LuCircleX } from "react-icons/lu";

const WrapperHeader = ({
  toggleExpand,
  isExpandable = false,
  expanded = false,
  icon = null,
  title,
  description = "",
  children = null,
  className = "",
  onClick,
  showChevron = true,
  chevronSize = 20,
  iconBgColor = "bg-blue-50 dark:bg-blue-500/60",
  iconSize = "p-2",
  titleClassName = "",
  descriptionClassName = "text-gray-600",
  containerClassName = "",
  showDivider = false,
  disabled = false,
  padding = false,
  onClose,
}) => {
  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
    if (toggleExpand) toggleExpand();
  };

  return (
    <div
      className={`
        ${padding && "p-6"} 
        ${isExpandable || onClick ? "cursor-pointer" : "cursor-default"} 
        flex items-center justify-between
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${showDivider ? "border-b border-gray-200 dark:border-gray-400/60" : ""}
        ${containerClassName}
        ${className} 
      `}
      onClick={handleClick}
      role={isExpandable || onClick ? "button" : "none"}
      tabIndex={isExpandable || (onClick && !disabled) ? 0 : -1}
      onKeyDown={(e) => {
        if (
          (e.key === "Enter" || e.key === " ") &&
          (isExpandable || onClick) &&
          !disabled
        ) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex flex-1 sm:items-center justify-between flex-col sm:flex-row gap-4">
        {/* Left side content */}
        <div className="flex items-center gap-3">
          {/* Icon */}
          {icon && (
            <div className={`${iconSize} ${iconBgColor} rounded-lg shrink-0`}>
              {icon}
            </div>
          )}

          {/* Main content */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center flex-wrap -mb-1">
              <h2
                className={`text-xl font-bold text-gray-900 dark:text-gray-200 ${titleClassName} line-clamp-1`}
              >
                {title}
              </h2>
            </div>
            {description && (
              <p
                className={`text-gray-900 dark:text-white ${descriptionClassName}`}
              >
                {description}
              </p>
            )}
          </div>
        </div>
        {children}
      </div>
      {isExpandable && showChevron ? (
        expanded ? (
          <FiChevronUp size={chevronSize} className="shrink-0 ml-2" />
        ) : (
          <FiChevronDown size={chevronSize} className="shrink-0 ml-2" />
        )
      ) : null}
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 text-gray-900 dark:text-white hover:text-gray-100 dark:hover:text-gray-300 rounded-lg transition-colors"
        >
          <LuCircleX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default WrapperHeader;
