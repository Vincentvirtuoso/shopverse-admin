import { motion, AnimatePresence } from "framer-motion";
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
  FiShield,
  FiChevronLeft,
  FiX,
} from "react-icons/fi";
import { FaNairaSign } from "react-icons/fa6";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Link from "./Link";
import { useScreen } from "../../hooks/useScreen";
import { useProduct } from "../../hooks/useProduct";
import { LuNetwork } from "react-icons/lu";

const Spinner = ({ size }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
    />
  );
};
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { isMobile } = useScreen();
  const { user, logout, isSuperAdmin, logoutLoading } = useAuth();
  const { getProducts, loading: proloing, error, products = [] } = useProduct();

  useEffect(() => {
    if (!isMobile || !isSidebarOpen) return;

    const handleClickOutside = (event) => {
      const sidebar = document.querySelector("aside");
      if (sidebar && !sidebar.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isSidebarOpen, setIsSidebarOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProducts();
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchData();
  }, [getProducts]);

  // Get user initials
  const getUserInitials = () => {
    if (!user) return "AD";
    const { firstName, lastName } = user;
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (lastName) return lastName.charAt(0).toUpperCase();
    return "AD";
  };

  // Get user full name
  const getFullName = () => {
    if (!user) return "Admin User";
    const { firstName, lastName } = user;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return "Admin User";
  };

  // Get user email
  const getUserEmail = () => {
    return user?.email || "admin@shopverse.com";
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { icon: <FiHome />, label: "Dashboard", href: "/dashboard", count: 0 },
    {
      icon: <FiGrid />,
      label: "Manage Categories",
      href: "/manage-categories",
      count: 0,
    },
    {
      icon: <FiShoppingBag />,
      label: "Manage Products",
      href: "/manage-products",
      count: error ? (
        <LuNetwork />
      ) : proloing ? (
        <Spinner />
      ) : (
        products.length || 0
      ),
    },
    { icon: <FiUsers />, label: "Customers", href: "/customers", count: 12 },
    {
      icon: <FiPackage />,
      label: "Orders",
      href: "/orders",
      count: 23,
    },
    { icon: <FaNairaSign />, label: "Revenue", href: "/revenue" },
    { icon: <FiSettings />, label: "Settings", href: "/settings" },
  ];

  // Mobile overlay
  const MobileOverlay = () => (
    <AnimatePresence>
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 bg-opacity-50 z-52 md:hidden"
        />
      )}
    </AnimatePresence>
  );

  return (
    <>
      <MobileOverlay />

      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (isSidebarOpen ? 0 : "-100%") : 0,
          width: isMobile ? "256px" : isSidebarOpen ? "256px" : "80px",
        }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 h-dvh bg-white dark:bg-neutral-900 shadow-lg text-gray-800 dark:text-white z-50 ${
          isMobile && "z-60"
        } overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between py-6 px-4 border-b dark:border-gray-400/50 border-gray-200 h-22">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-5 justify-between"
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
            {(isSidebarOpen || isMobile) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                className="flex flex-col"
              >
                <span className="text-xl font-bold whitespace-nowrap">
                  Shopverse
                </span>
                {isSuperAdmin() && (
                  <span className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                    Super Admin
                  </span>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Close button for mobile */}
          {isMobile && isSidebarOpen && (
            <motion.button
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
          {navItems.map((item, index) => (
            <Link
              item={item}
              key={index + item.label}
              index={index}
              isSidebarOpen={isSidebarOpen || isMobile}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-400/50 border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-linear-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-sm">
                  {getUserInitials()}
                </span>
              </div>
              {isSuperAdmin() && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <FiShield className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            {(isSidebarOpen || isMobile) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="font-medium truncate">{getFullName()}</p>
                <p className="text-sm text-gray-400 truncate">
                  {getUserEmail()}
                </p>
              </motion.div>
            )}

            {(isSidebarOpen || isMobile) && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Sign out"
              >
                {logoutLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"
                  />
                ) : (
                  <FiLogOut className="w-5 h-5" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
