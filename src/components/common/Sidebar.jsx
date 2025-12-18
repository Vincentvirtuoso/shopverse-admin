import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import Link from "./Link";
import { FaNairaSign } from "react-icons/fa6";

const Sidebar = ({ isSidebarOpen }) => {
  const navItems = [
    { icon: <FiHome />, label: "Dashboard", href: "/dashboard", count: 0 },
    {
      icon: <FiShoppingBag />,
      label: "Manage Products",
      href: "/manage-products",
      count: 5,
    },
    { icon: <FiUsers />, label: "Customers", href: "/customers", count: 12 },
    {
      icon: <FiPackage />,
      label: "Orders",
      href: "/orders",
      count: 23,
    },
    { icon: <FaNairaSign />, label: "Revenue", href: "/revenue" },
    { icon: <FiBarChart2 />, label: "Analytics", href: "/analytics" },
    {
      icon: <FiMessageSquare />,
      label: "Messages",
      href: "/messages",
      count: 3,
    },
    { icon: <FiGrid />, label: "Categories", href: "/categories" },
    { icon: <FiSettings />, label: "Settings", href: "/settings" },
  ];

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      className={`fixed h-screen bg-white dark:bg-neutral-900 shadow-lg dark:text-white text-gray-800 z-50 ${
        isSidebarOpen ? "w-64" : "w-20"
      } transition-all duration-400`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b dark:border-gray-400/50 border-gray-200 h-22">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-5"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center w-10 h-10 overflow-hidden"
          >
            <img
              src="/images/logo.jpg"
              alt="Logo"
              className="rounded-full w-full h-full object-cover"
            />
          </motion.div>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              className="text-xl font-bold whitespace-nowrap"
            >
              Shopverse
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item, index) => (
          <Link
            item={item}
            key={index}
            index={index}
            isSidebarOpen={isSidebarOpen}
          />
        ))}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-400/50 border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="font-bold">AD</span>
          </div>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <p className="font-medium truncate">Admin User</p>
              <p className="text-sm text-gray-400 truncate">
                admin@shopverse.com
              </p>
            </motion.div>
          )}
          {isSidebarOpen && (
            <button className="p-2 hover:bg-gray-800 hover:text-white rounded">
              <FiLogOut />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
