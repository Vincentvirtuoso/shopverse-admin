import { motion } from "framer-motion";
import {
  LuArrowDown,
  LuArrowUp,
  LuTrendingDown,
  LuTrendingUp,
} from "react-icons/lu";

const StatsCard = ({
  label,
  subtitle,
  index,
  value,
  icon: Icon,
  change,
  iconColor = { bg: "", text: "" },
  iconSize = 22,
  showIconBackground = false,
}) => {
  return (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-neutral-600 rounded-xl shadow-sm border border-gray-200 p-6 dark:border-gray-400/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-200">{label}</p>

          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-300 mt-1">
              {subtitle}
            </p>
          )}

          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>

        {Icon &&
          (showIconBackground ? (
            <div className={`p-3 rounded-lg ${iconColor.bg} ${iconColor.text}`}>
              {typeof Icon === "function" ? <Icon size={iconSize} /> : Icon}
            </div>
          ) : typeof Icon === "function" ? (
            <Icon size={iconSize} />
          ) : (
            Icon
          ))}
      </div>

      {change && (
        <p
          className={`flex items-center gap-1 text-sm mt-4 ${
            change > 0
              ? "text-green-500 dark:text-green-400"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          {change > 0 ? <LuArrowUp /> : <LuArrowDown />}
          {change}%
        </p>
      )}
    </motion.div>
  );
};

export default StatsCard;
