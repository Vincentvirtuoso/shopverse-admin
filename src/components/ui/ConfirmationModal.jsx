import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiArchive,
  FiX,
  FiHelpCircle,
  FiRefreshCw,
} from "react-icons/fi";

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

// Type configurations
const typeConfig = {
  danger: {
    icon: FiAlertTriangle,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/20",
    confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    cancelButton:
      "bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600",
    titleColor: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: FiAlertCircle,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
    confirmButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    cancelButton:
      "bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600",
    titleColor: "text-yellow-600 dark:text-yellow-400",
  },
  info: {
    icon: FiInfo,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/20",
    confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    cancelButton:
      "bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600",
    titleColor: "text-blue-600 dark:text-blue-400",
  },
  success: {
    icon: FiCheckCircle,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/20",
    confirmButton: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    cancelButton:
      "bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600",
    titleColor: "text-green-600 dark:text-green-400",
  },
  archive: {
    icon: FiArchive,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900/20",
    confirmButton: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
    cancelButton:
      "bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600",
    titleColor: "text-purple-600 dark:text-purple-400",
  },
  delete: {
    icon: FiTrash2,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/20",
    confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    cancelButton:
      "bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600",
    titleColor: "text-red-600 dark:text-red-400",
  },
  help: {
    icon: FiHelpCircle,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/20",
    confirmButton: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    cancelButton:
      "bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600",
    titleColor: "text-indigo-600 dark:text-indigo-400",
  },
};

// Size configurations
const sizeConfig = {
  sm: {
    modal: "max-w-md",
    padding: "p-6",
    iconSize: "w-10 h-10",
    titleSize: "text-lg",
    messageSize: "text-sm",
    buttonSize: "px-3 py-1.5 text-sm",
  },
  md: {
    modal: "max-w-lg",
    padding: "p-8",
    iconSize: "w-12 h-12",
    titleSize: "text-xl",
    messageSize: "text-base",
    buttonSize: "px-4 py-2 text-base",
  },
  lg: {
    modal: "max-w-2xl",
    padding: "p-10",
    iconSize: "w-14 h-14",
    titleSize: "text-2xl",
    messageSize: "text-lg",
    buttonSize: "px-6 py-3 text-lg",
  },
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  size = "md",
  showIcon = true,
  icon: CustomIcon,
  loading = false,
  disabled = false,
  showCancelButton = true,
  showConfirmButton = true,
  confirmButtonProps = {},
  cancelButtonProps = {},
  closeOnClickOutside = true,
  closeOnEsc = true,
  onAfterClose,
  onAfterOpen,
  children,
  className = "",
  overlayClassName = "",
  modalClassName = "",
  reverseButtons = false,
  confirmButtonVariant = "solid", // solid, outline, ghost
  cancelButtonVariant = "solid", // solid, outline, ghost
  zIndex = 50,
}) => {
  const config = typeConfig[type] || typeConfig.danger;
  const sizes = sizeConfig[size] || sizeConfig.md;
  const Icon = CustomIcon || config.icon;

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (closeOnEsc && isOpen && e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, closeOnEsc]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      onAfterOpen?.();
    } else {
      document.body.style.overflow = "unset";
      onAfterClose?.();
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onAfterOpen, onAfterClose]);

  const handleOverlayClick = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  const getButtonClasses = (variant, baseClasses) => {
    switch (variant) {
      case "outline":
        return `${baseClasses} bg-transparent border-2 ${
          baseClasses.includes("red")
            ? "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            : baseClasses.includes("yellow")
              ? "border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              : baseClasses.includes("green")
                ? "border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                : baseClasses.includes("blue")
                  ? "border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  : "border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`;
      case "ghost":
        return `${baseClasses} bg-transparent ${
          baseClasses.includes("red")
            ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            : baseClasses.includes("yellow")
              ? "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              : baseClasses.includes("green")
                ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                : baseClasses.includes("blue")
                  ? "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  : "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`;
      default:
        return baseClasses;
    }
  };

  const confirmClasses = getButtonClasses(
    confirmButtonVariant,
    `${sizes.buttonSize} ${config.confirmButton} text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  );

  const cancelClasses = getButtonClasses(
    cancelButtonVariant,
    `${sizes.buttonSize} ${config.cancelButton} text-gray-700 dark:text-gray-300 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  );

  const buttons = (
    <div className="flex gap-3 mt-6">
      {showConfirmButton && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          disabled={loading || disabled}
          className={confirmClasses}
          {...confirmButtonProps}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FiRefreshCw className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            confirmText
          )}
        </motion.button>
      )}
      {showCancelButton && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          disabled={loading || disabled}
          className={cancelClasses}
          {...cancelButtonProps}
        >
          {cancelText}
        </motion.button>
      )}
    </div>
  );

  return (
    <AnimatePresence mode="wait" onExitComplete={onAfterClose}>
      {isOpen && (
        <div
          className={`fixed inset-0 z-${zIndex} overflow-y-auto`}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
            onClick={handleOverlayClick}
          >
            {/* Background overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-neutral-900 dark:bg-opacity-75 transition-opacity ${overlayClassName}`}
              aria-hidden="true"
            />

            {/* Modal positioning trick */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`
                inline-block 
                ${sizes.modal} 
                w-full 
                ${sizes.padding}
                bg-white dark:bg-neutral-800 
                rounded-2xl 
                text-left 
                shadow-2xl 
                transform 
                transition-all 
                sm:my-8 
                sm:align-middle
                ${modalClassName}
                ${className}
              `}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                disabled={loading}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-start">
                {/* Icon */}
                {showIcon && (
                  <div
                    className={`
                      shrink-0 
                      ${sizes.iconSize} 
                      ${config.iconBg} 
                      rounded-full 
                      flex 
                      items-center 
                      justify-center 
                      mr-4
                    `}
                  >
                    <Icon className={`${sizes.iconSize} ${config.iconColor}`} />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <h3
                    id="modal-title"
                    className={`
                      ${sizes.titleSize} 
                      font-semibold 
                      ${config.titleColor} 
                      mb-2
                    `}
                  >
                    {title}
                  </h3>

                  {message && (
                    <p
                      className={`${sizes.messageSize} text-gray-600 dark:text-gray-400`}
                    >
                      {message}
                    </p>
                  )}

                  {children}

                  {/* Buttons */}
                  {reverseButtons ? (
                    <div className="flex flex-row-reverse gap-3 mt-6">
                      {buttons.props.children}
                    </div>
                  ) : (
                    buttons
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Additional preset modals for common use cases
export const DeleteConfirmationModal = (props) => (
  <ConfirmationModal
    type="delete"
    confirmText="Delete"
    cancelText="Cancel"
    {...props}
  />
);

export const ArchiveConfirmationModal = (props) => (
  <ConfirmationModal
    type="archive"
    confirmText="Archive"
    cancelText="Cancel"
    {...props}
  />
);

export const WarningConfirmationModal = (props) => (
  <ConfirmationModal
    type="warning"
    confirmText="Continue"
    cancelText="Cancel"
    {...props}
  />
);

export const SuccessConfirmationModal = (props) => (
  <ConfirmationModal
    type="success"
    confirmText="OK"
    cancelText="Close"
    showCancelButton={false}
    {...props}
  />
);

export const InfoModal = (props) => (
  <ConfirmationModal
    type="info"
    confirmText="Got it"
    cancelText="Close"
    showCancelButton={false}
    {...props}
  />
);

export default ConfirmationModal;
