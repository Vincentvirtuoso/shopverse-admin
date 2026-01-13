import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const Link = ({ item, index, isSidebarOpen }) => {
  const MotionLink = motion(NavLink);

  return (
    <MotionLink
      key={item.label}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      to={item.href}
      title={item.label}
      className={({ isActive }) =>
        `flex items-center justify-between p-3 rounded-lg transition-all text-gray-600 dark:text-white text-sm ${
          isActive
            ? "bg-red-500 text-white"
            : "dark:hover:bg-gray-800 hover:bg-gray-50 hover:text-red-500"
        }`
      }
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg">{item.icon}</span>
        {isSidebarOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </div>
      {item.count > 0 && isSidebarOpen && (
        <span className="px-2 py-1 text-xs bg-primary-500 rounded-full">
          {item.count}
        </span>
      )}
    </MotionLink>
  );
};

export default Link;
