import React, { createContext, useState, useContext, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "../api/authApi";

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Separate loader states for each function
  const [initialLoading, setInitialLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [authCheckLoading, setAuthCheckLoading] = useState(false);

  // Combined loading state for easy access
  const isLoading =
    initialLoading || loginLoading || logoutLoading || authCheckLoading;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setAuthCheckLoading(true);
      const response = await authApi.getCurrentUser();
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);

        if (window.location.pathname === "/auth") {
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      console.log("Not authenticated:", error.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthCheckLoading(false);
      setInitialLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoginLoading(true);
      const response = await authApi.login(email, password);

      if (response.data?.user?.role === "super_admin") {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        await authApi.logout();
        throw new Error("Access denied. Super admin privileges required.");
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLogoutLoading(true);
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      // window.location.href = "/auth";
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLogoutLoading(false);
    }
  };

  const isSuperAdmin = () => {
    return user?.role === "super_admin";
  };

  const value = {
    user,
    isAuthenticated,
    isSuperAdmin,

    // Loader states
    loading: isLoading,
    initialLoading,
    loginLoading,
    logoutLoading,
    authCheckLoading,

    // Functions
    login,
    logout,
    checkAuth,
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </AuthContext.Provider>
  );
};
