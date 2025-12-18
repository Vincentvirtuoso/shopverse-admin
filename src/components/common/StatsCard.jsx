import { motion } from "framer-motion";

const StatsCard = ({
  label,
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
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        {showIconBackground ? (
          <div
            className={`p-3 rounded-lg bg-${iconColor.bg} text-${iconColor.text}`}
          >
            <Icon size={iconSize} />
          </div>
        ) : (
          Icon
        )}
      </div>
      {change && (
        <p
          className={`text-sm mt-4 ${
            change?.startsWith("+") ? "dark:text-green-400" : "text-red-400"
          }`}
        >
          {change} from last month
        </p>
      )}
    </motion.div>
  );
};

export default StatsCard;
