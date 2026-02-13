import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiInfo,
  FiX,
  FiBell,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const Notification = ({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  position = "bottom-right",
  showIcon = true,
  showProgress = true,
  dismissible = true,
  actions = [],
  icon: CustomIcon,
  className = "",
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (duration && onClose && !isPaused) {
      const startTime = Date.now();
      const timer = setTimeout(onClose, duration);

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [duration, onClose, isPaused]);

  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    warning: FiAlertCircle,
    info: FiInfo,
    loading: FiClock,
    default: FiBell,
  };

  const Icon = CustomIcon || icons[type] || icons.default;

  const styles = {
    success: {
      container:
        "bg-white dark:bg-gray-800 border-l-4 border-green-500 dark:border-green-400",
      icon: "text-green-500 dark:text-green-400",
      title: "text-gray-900 dark:text-white",
      message: "text-gray-600 dark:text-gray-300",
      progress: "bg-green-500 dark:bg-green-400",
      actionHover: "hover:bg-green-50 dark:hover:bg-green-900/30",
      shadow: "shadow-green-100 dark:shadow-green-900/20",
    },
    error: {
      container:
        "bg-white dark:bg-gray-800 border-l-4 border-red-500 dark:border-red-400",
      icon: "text-red-500 dark:text-red-400",
      title: "text-gray-900 dark:text-white",
      message: "text-gray-600 dark:text-gray-300",
      progress: "bg-red-500 dark:bg-red-400",
      actionHover: "hover:bg-red-50 dark:hover:bg-red-900/30",
      shadow: "shadow-red-100 dark:shadow-red-900/20",
    },
    warning: {
      container:
        "bg-white dark:bg-gray-800 border-l-4 border-yellow-500 dark:border-yellow-400",
      icon: "text-yellow-500 dark:text-yellow-400",
      title: "text-gray-900 dark:text-white",
      message: "text-gray-600 dark:text-gray-300",
      progress: "bg-yellow-500 dark:bg-yellow-400",
      actionHover: "hover:bg-yellow-50 dark:hover:bg-yellow-900/30",
      shadow: "shadow-yellow-100 dark:shadow-yellow-900/20",
    },
    info: {
      container:
        "bg-white dark:bg-gray-800 border-l-4 border-blue-500 dark:border-blue-400",
      icon: "text-blue-500 dark:text-blue-400",
      title: "text-gray-900 dark:text-white",
      message: "text-gray-600 dark:text-gray-300",
      progress: "bg-blue-500 dark:bg-blue-400",
      actionHover: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
      shadow: "shadow-blue-100 dark:shadow-blue-900/20",
    },
    loading: {
      container:
        "bg-white dark:bg-gray-800 border-l-4 border-purple-500 dark:border-purple-400",
      icon: "text-purple-500 dark:text-purple-400 animate-spin",
      title: "text-gray-900 dark:text-white",
      message: "text-gray-600 dark:text-gray-300",
      progress: "bg-purple-500 dark:bg-purple-400",
      actionHover: "hover:bg-purple-50 dark:hover:bg-purple-900/30",
      shadow: "shadow-purple-100 dark:shadow-purple-900/20",
    },
  };

  const positionStyles = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-center": "top-6 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="notification"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className={`fixed z-50 w-full max-w-sm ${positionStyles[position]}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`
            relative overflow-hidden rounded-xl shadow-xl
            ${currentStyle.container}
            ${currentStyle.shadow}
            ${className}
          `}
        >
          {/* Progress Bar */}
          {showProgress && duration > 0 && (
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={`
                absolute bottom-0 left-0 h-1
                ${currentStyle.progress}
              `}
            />
          )}

          {/* Main Content */}
          <div className="relative p-4">
            <div className="flex items-start">
              {/* Icon */}
              {showIcon && (
                <div className="shrink-0 mr-3">
                  <Icon className={`w-6 h-6 ${currentStyle.icon}`} />
                </div>
              )}

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                {title && (
                  <h4
                    className={`font-semibold text-base ${currentStyle.title}`}
                  >
                    {title}
                  </h4>
                )}
                {message && (
                  <p className={`mt-1 text-sm ${currentStyle.message}`}>
                    {message}
                  </p>
                )}

                {/* Action Buttons */}
                {actions.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className={`
                          px-3 py-1.5 text-xs font-medium rounded-lg
                          transition-all duration-200
                          ${currentStyle.actionHover}
                          ${action.className || ""}
                        `}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              {dismissible && onClose && (
                <button
                  onClick={onClose}
                  className="ml-4 shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close notification"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const NotificationContainer = ({
  notifications,
  removeNotification,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default Notification;
