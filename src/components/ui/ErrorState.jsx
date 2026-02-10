import React from "react";

const ErrorState = ({
  icon: Icon = null,
  title,
  message,
  actions = [],
  className = "",
}) => {
  return (
    <div className={`text-center max-w-md mx-auto px-4 ${className}`}>
      {Icon && (
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                action.variant === "primary"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {action.icon && <action.icon className="w-4 h-4" />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorState;
