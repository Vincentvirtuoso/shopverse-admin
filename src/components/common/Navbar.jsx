import { useState, useEffect, useRef } from "react";
import {
  FiBell,
  FiSearch,
  FiX,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiShoppingBag,
  FiTrendingUp,
  FiPackage,
  FiShield,
  FiMeh,
  FiMenu,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LuChevronRight, LuMail } from "react-icons/lu";
import { motion } from "framer-motion";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order received", time: "5 min ago", read: false },
    { id: 2, text: "Product low in stock", time: "1 hour ago", read: false },
    {
      id: 3,
      text: "Monthly sales report ready",
      time: "2 hours ago",
      read: true,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const { user, logout, isSuperAdmin, logoutLoading } = useAuth();

  // Get user initials for avatar
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

  // Get full name
  const getFullName = () => {
    if (!user) return "Admin User";
    const { firstName, lastName } = user;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return "Admin User";
  };

  // Get user role display text
  const getUserRole = () => {
    if (!user) return "Administrator";
    if (isSuperAdmin()) return "Super Administrator";
    return user.role?.replace("_", " ") || "Administrator";
  };

  // Mock search results based on query
  const mockSearchResults = [
    {
      type: "order",
      id: "#ORD-7890",
      title: "Order from John Doe",
      status: "Processing",
    },
    {
      type: "product",
      id: "PROD-123",
      title: "Wireless Headphones",
      stock: 12,
    },
    { type: "customer", id: "CUST-456", title: "Sarah Johnson", orders: 5 },
    { type: "category", id: "CAT-001", title: "Electronics", products: 45 },
  ];

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = mockSearchResults.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowProfileDropdown(false);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    setShowProfileDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b dark:border-neutral-400/50 border-gray-200 h-22 flex items-center">
      <div className="px-4 sm:px-6 lg:px-8 flex-1">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? (
                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Logo/Brand for mobile */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <FiShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-800 dark:text-white">
                Shopverse
              </span>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block relative" ref={searchRef}>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="Search orders, products, customers..."
                  className="pl-10 pr-4 py-2.5 w-96 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              {showSearchDropdown &&
                (searchQuery || searchResults.length > 0) && (
                  <div className="absolute top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    {searchResults.length > 0 ? (
                      <>
                        <div className="px-4 py-3 border-b dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Search Results
                            </p>
                            <button
                              onClick={clearSearch}
                              className="text-xs text-red-500 hover:text-red-600"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                        {searchResults.map((result, index) => (
                          <a
                            key={index}
                            href="#"
                            className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0 dark:border-gray-700 transition-colors"
                          >
                            <div
                              className={`p-2 rounded-lg mr-3 ${
                                result.type === "order"
                                  ? "bg-blue-100 dark:bg-blue-900/30"
                                  : result.type === "product"
                                    ? "bg-green-100 dark:bg-green-900/30"
                                    : result.type === "customer"
                                      ? "bg-purple-100 dark:bg-purple-900/30"
                                      : "bg-yellow-100 dark:bg-yellow-900/30"
                              }`}
                            >
                              {result.type === "order" && (
                                <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              )}
                              {result.type === "product" && (
                                <FiShoppingBag className="w-4 h-4 text-green-600 dark:text-green-400" />
                              )}
                              {result.type === "customer" && (
                                <FiUser className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              )}
                              {result.type === "category" && (
                                <FiTrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {result.title}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {result.id}
                                </p>
                                {result.status && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      result.status === "Processing"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    }`}
                                  >
                                    {result.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          </a>
                        ))}
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Press Enter to search all results
                          </p>
                        </div>
                      </>
                    ) : (
                      searchQuery && (
                        <div className="px-4 py-8 text-center">
                          <FiSearch className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">
                            No results found for "{searchQuery}"
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            Try searching with different keywords
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearchDropdown(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
              >
                <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      {unreadNotifications > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b last:border-b-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          !notification.read
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        }`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`p-2 rounded-lg mr-3 ${
                              notification.id === 1
                                ? "bg-green-100 dark:bg-green-900/30"
                                : notification.id === 2
                                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                                  : "bg-blue-100 dark:blue-900/30"
                            }`}
                          >
                            {notification.id === 1 && (
                              <FiShoppingBag className="w-4 h-4 text-green-600 dark:text-green-400" />
                            )}
                            {notification.id === 2 && (
                              <FiPackage className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            )}
                            {notification.id === 3 && (
                              <FiTrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {notification.text}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-3 text-center text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 border-t dark:border-gray-700"
                  >
                    View all notifications
                  </a>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-3 group"
                aria-label="User menu"
              >
                <div className="text-right hidden lg:block">
                  <p className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-red-600 transition-colors">
                    {getFullName()}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getUserRole()}
                    </p>
                    {isSuperAdmin() && (
                      <FiShield className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 bg-linear-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow group-hover:ring-2 group-hover:ring-red-500 transition-all">
                    <span className="font-bold text-white text-sm">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  {/* User Info Section */}
                  <div
                    className="flex items-center justify-between px-2 border-b dark:border-gray-700 border-gray-500/20 group cursor-pointer"
                    onClick={handleProfileClick}
                  >
                    <div className="px-4 py-3 ">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-linear-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="font-bold text-white text-xs">
                            {getUserInitials()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {getFullName()}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {getUserRole()}
                            </p>
                            {isSuperAdmin() && (
                              <FiShield className="w-3 h-3 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                        <LuMail className="inline-flex mr-2" />
                        {user?.email || "admin@shopverse.com"}
                      </p>
                    </div>
                    <LuChevronRight className="text-2xl group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleSettingsClick}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FiSettings className="w-4 h-4 mr-3 text-gray-400" />
                      Account Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <FiHelpCircle className="w-4 h-4 mr-3 text-gray-400" />
                      Help & Support
                    </button>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-gray-500/20 dark:border-gray-700 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {logoutLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full mr-2"
                          />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <FiLogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSearchDropdown && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div
            className="absolute inset-0"
            onClick={() => setShowSearchDropdown(false)}
          ></div>
          <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={() => setShowSearchDropdown(false)}
                className="p-2"
              >
                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search
              </h3>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, products, customers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {searchResults.map((result, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center px-4 py-3 border-b last:border-b-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div
                      className={`p-2 rounded-lg mr-3 ${
                        result.type === "order"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : result.type === "product"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : result.type === "customer"
                              ? "bg-purple-100 dark:bg-purple-900/30"
                              : "bg-yellow-100 dark:bg-yellow-900/30"
                      }`}
                    >
                      {result.type === "order" && (
                        <FiPackage className="w-4 h-4" />
                      )}
                      {result.type === "product" && (
                        <FiShoppingBag className="w-4 h-4" />
                      )}
                      {result.type === "customer" && (
                        <FiUser className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {result.id}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
