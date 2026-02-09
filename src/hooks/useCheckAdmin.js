import { useState } from "react";
import api from "../api/axiosInstance";

export const useCheckAdmin = () => {
  const [checking, setChecking] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(false);
  const [error, setError] = useState(null);

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

  return {
    setChecking,
    checking,
    superAdminExists,
    error,
    setError,
    checkSetupStatus,
    setSuperAdminExists,
  };
};
