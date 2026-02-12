import React from "react";

const WrapperFooter = ({
  children,
  className = "",
  bordered = true,
  padding = "md",
  sticky = false,
}) => {
  const paddingClasses = {
    none: "px-0 py-0",
    sm: "px-4 py-3",
    md: "px-6 py-4",
    lg: "px-8 py-6",
  };

  const borderClass = bordered
    ? "border-t border-neutral-200 dark:border-neutral-500"
    : "";

  const stickyClass = sticky
    ? "sticky bottom-0 bg-neutral-50 dark:bg-neutral-700"
    : "";

  return (
    <div
      className={`
        ${paddingClasses[padding]}
        ${borderClass}
        ${stickyClass}
        ${className}
      `}
      role="contentinfo"
    >
      {children}
    </div>
  );
};

export default WrapperFooter;
