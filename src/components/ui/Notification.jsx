import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiAlertCircle, FiX, FiInfo } from "react-icons/fi";

const Notification = ({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: FiCheck,
    error: FiAlertCircle,
    warning: FiAlertCircle,
    info: FiInfo,
  };

  const colors = {
    success:
      "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    warning:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
  };

  const textColors = {
    success: "text-green-800 dark:text-green-400",
    error: "text-red-800 dark:text-red-400",
    warning: "text-yellow-800 dark:text-yellow-400",
    info: "text-blue-800 dark:text-blue-400",
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 max-w-md"
      >
        <div className={`${colors[type]} border rounded-xl shadow-lg p-4`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`w-6 h-6 ${textColors[type]}`} />
            </div>

            <div className="ml-3 flex-1">
              {title && (
                <h4 className={`font-semibold ${textColors[type]}`}>{title}</h4>
              )}

              {message && (
                <p className={`mt-1 text-sm ${textColors[type]}`}>{message}</p>
              )}
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close notification"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
