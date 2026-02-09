import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loginLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const featureItems = [
    {
      icon: FiBarChart2,
      title: "Real-time Analytics",
      desc: "Monitor platform performance",
    },
    {
      icon: FiUsers,
      title: "User Management",
      desc: "Manage all user accounts",
    },
    {
      icon: FiPackage,
      title: "Product Control",
      desc: "Full inventory oversight",
    },
    {
      icon: FiTrendingUp,
      title: "Revenue Dashboard",
      desc: "Track sales & growth",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-black overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 dark:bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 dark:bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex">
        {/* Left Panel - Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-7/12 xl:w-8/12 p-6 md:p-8 lg:p-12 flex-col justify-between items-center flex-1"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <FiShield className="w-8 h-8 text-red-500 dark:text-red-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Shopverse Admin
              </span>
            </div>
            <div className="hidden xl:block text-sm text-gray-600 dark:text-gray-400">
              v1.0 • Secure Portal
            </div>
          </div>

          <div className="max-w-3xl mx-auto lg:mx-0 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center"
            >
              Command Your{" "}
              <span className="text-red-600 dark:text-red-500">E-commerce</span>{" "}
              Universe
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-md sm:text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-12"
            >
              Access your e-commerce management platform designed for your super
              administrator needs.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {featureItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none text-start"
                >
                  <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-500/10 rounded-lg shrink-0">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 dark:text-gray-400 justify-center"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Real-time Monitoring</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Login Form */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full lg:w-5/12 xl:w-4/12 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border-l border-gray-200 dark:border-white/10 overflow-y-auto"
        >
          <div className="min-h-screen flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6 sm:mb-8">
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <FiShield className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-500" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Shopverse Admin
                  </h1>
                </div>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Secure access to your management console
                </p>
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="w-full max-w-sm sm:max-w-md mx-auto"
            >
              <motion.div
                variants={itemVariants}
                className="mb-6 sm:mb-8 text-center"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Sign in to your admin account
                </p>
              </motion.div>

              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6"
              >
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 dark:group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base"
                      placeholder="admin@shopverse.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate("/auth/forgot-password")}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 dark:group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 focus:border-transparent transition text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 dark:hover:text-white transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <FiShield className="mr-2 shrink-0" />
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="space-y-3 sm:space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium text-white transition-all text-sm sm:text-base relative overflow-hidden group
                      ${
                        loading
                          ? "bg-red-500/50 dark:bg-red-600/50 cursor-not-allowed"
                          : "bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 dark:from-red-600 dark:to-pink-600 dark:hover:from-red-700 dark:hover:to-pink-700"
                      }`}
                  >
                    <span className="relative z-10">
                      {loginLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Authenticating...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-red-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => navigate("/auth/setup-admin")}
                    className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Need to set up admin account?
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>

            {/* Mobile Footer */}
            <motion.div
              variants={itemVariants}
              className="lg:hidden mt-6 sm:mt-8 text-center"
            >
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                © {new Date().getFullYear()} Shopverse Admin Portal v2.0
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                Restricted Access • Authorized Personnel Only
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
