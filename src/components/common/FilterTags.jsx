import WrapperBody from "./WrapperBody";
import { LuTag, LuX } from "react-icons/lu";
import { motion } from "framer-motion";

const defaultVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Size configurations
const sizeConfig = {
  sm: {
    wrapper: "px-2 py-1 text-xs",
    icon: "w-3 h-3",
    button: "w-4 h-4",
    gap: "gap-1",
  },
  md: {
    wrapper: "px-3 py-1.5 text-sm",
    icon: "w-3.5 h-3.5",
    button: "w-5 h-5",
    gap: "gap-2",
  },
  lg: {
    wrapper: "px-4 py-2 text-base",
    icon: "w-4 h-4",
    button: "w-6 h-6",
    gap: "gap-2.5",
  },
};

// Variant configurations
const variantConfig = {
  default: {
    wrapper: "bg-white border-gray-200 text-gray-700",
    icon: "text-gray-400",
    button: "text-gray-400 hover:text-red-500 hover:bg-red-50",
  },
  primary: {
    wrapper: "bg-blue-50 border-blue-200 text-blue-700",
    icon: "text-blue-400",
    button: "text-blue-400 hover:text-blue-600 hover:bg-blue-100",
  },
  secondary: {
    wrapper: "bg-gray-50 border-gray-300 text-gray-600",
    icon: "text-gray-500",
    button: "text-gray-500 hover:text-gray-700 hover:bg-gray-200",
  },
  success: {
    wrapper: "bg-green-50 border-green-200 text-green-700",
    icon: "text-green-400",
    button: "text-green-400 hover:text-green-600 hover:bg-green-100",
  },
  warning: {
    wrapper: "bg-yellow-50 border-yellow-200 text-yellow-700",
    icon: "text-yellow-400",
    button: "text-yellow-400 hover:text-yellow-600 hover:bg-yellow-100",
  },
  error: {
    wrapper: "bg-red-50 border-red-200 text-red-700",
    icon: "text-red-400",
    button: "text-red-400 hover:text-red-600 hover:bg-red-100",
  },
  outline: {
    wrapper: "bg-transparent border-gray-300 text-gray-600",
    icon: "text-gray-400",
    button: "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
  },
  ghost: {
    wrapper: "bg-transparent border-transparent text-gray-600 hover:bg-gray-50",
    icon: "text-gray-400",
    button: "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
  },
};

// Rounded configurations
const roundedConfig = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

const FilterTags = ({
  activeFilters,
  animationVariants = defaultVariants,
  size = "md",
  variant = "default",
  rounded = "full",
  showIcon = true,
  icon: CustomIcon,
  onRemoveAll,
  showRemoveAll = false,
  removeAllText = "Clear all",
  className = "",
  maxHeight,
  maxWidth,
  wrap = true,
  removable = true,
  disabled = false,
  removeAllButtonProps = {},
  filterButtonProps = {},
  ...props
}) => {
  const sizes = sizeConfig[size];
  const variants = variantConfig[variant];
  const roundedClass = roundedConfig[rounded];

  const IconComponent = CustomIcon || LuTag;

  const handleRemoveAll = () => {
    if (onRemoveAll && !disabled) {
      onRemoveAll();
    }
  };

  return (
    <WrapperBody.Flex
      className={`
        flex-wrap 
        ${wrap ? "flex-wrap" : "flex-nowrap overflow-x-auto"} 
        gap-2 
        mb-4 
        ${maxHeight ? `max-h-${maxHeight} overflow-y-auto` : ""}
        ${maxWidth ? `max-w-${maxWidth}` : ""}
        ${className}
      `}
      {...props}
    >
      {activeFilters.map((filter, index) => (
        <motion.div
          key={`${filter.type}-${filter.label}-${index}`}
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
          transition={{
            layout: { duration: 0.2 },
          }}
          className={`
            inline-flex items-center 
            ${sizes.gap}
            ${sizes.wrapper}
            ${roundedClass}
            border 
            shadow-sm 
            transition-all 
            duration-200
            ${variants.wrapper}
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
            ${filter.className || ""}
          `}
        >
          {showIcon && (
            <IconComponent className={`${sizes.icon} ${variants.icon}`} />
          )}

          <span className="font-medium">{filter.label}</span>

          {removable && filter.onRemove && (
            <button
              onClick={() => !disabled && filter.onRemove()}
              className={`
                p-0.5 
                rounded-full 
                transition-colors 
                focus:outline-none 
                focus:ring-2 
                focus:ring-offset-1
                ${variants.button}
                ${disabled ? "cursor-not-allowed" : ""}
              `}
              aria-label={`Remove ${filter.label} filter`}
              disabled={disabled}
              {...filterButtonProps}
            >
              <LuX className={sizes.button} />
            </button>
          )}
        </motion.div>
      ))}

      {showRemoveAll && activeFilters.length > 0 && (
        <motion.button
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleRemoveAll}
          disabled={disabled}
          className={`
            inline-flex items-center
            ${sizes.gap}
            ${sizes.wrapper}
            ${roundedClass}
            border border-gray-200
            bg-white
            text-gray-500
            shadow-sm
            hover:bg-gray-50
            hover:text-gray-700
            transition-all
            duration-200
            focus:outline-none
            focus:ring-2
            focus:ring-gray-400
            focus:ring-offset-1
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
          `}
          {...removeAllButtonProps}
        >
          <LuX className={sizes.icon} />
          <span>{removeAllText}</span>
        </motion.button>
      )}
    </WrapperBody.Flex>
  );
};

export default FilterTags;
