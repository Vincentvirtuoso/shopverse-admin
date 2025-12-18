import { useState, useCallback } from "react";
import api from "../api/axiosInstance";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api({
        url: endpoint,
        method,
        data: body,
      });

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      const errorData = err.response?.data || { ...err };
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, callApi };
};
