import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import api from "../api/axiosInstance";
import SetupSuperAdmin from "../pages/SetupSuperAdmin";

const SetupCheck = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      setChecking(true);
      const response = await api.get("/setup/check");

      if (response.data.success) {
        setSuperAdminExists(response.data.data.superAdminExists);
      }
    } catch (err) {
      console.error("Setup check failed:", err);
      setError("Unable to check setup status. Please refresh the page.");
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mb-4"
        />
        <p className="text-white text-lg">Checking setup status...</p>
        <p className="text-gray-400 text-sm mt-2">
          Verifying system configuration
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 to-gray-800 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Setup Check Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!superAdminExists) {
    return <SetupSuperAdmin />;
  }

  return children;
};

export default SetupCheck;
