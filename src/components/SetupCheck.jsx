import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import SetupSuperAdmin from "../pages/SetupSuperAdmin";
import { useCheckAdmin } from "../hooks/useCheckAdmin";

const SetupCheck = ({ children }) => {
  const { checkSetupStatus, checking, error, superAdminExists } =
    useCheckAdmin();

  useEffect(() => {
    checkSetupStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center dark:bg-linear-to-br from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-800 dark:text-white text-lg">
          Checking setup status...
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Verifying system configuration
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-linear-to-br from-gray-900 to-gray-800 p-4">
        <div className="rounded-2xl p-8 max-w-md text-center">
          <FiAlertCircle className="w-15 h-15 text-red-600 inline-flex mb-4" />
          <h2 className="text-xl text-gray-800 dark:text-white mb-2 font-medium">
            Setup Check Failed
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
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
