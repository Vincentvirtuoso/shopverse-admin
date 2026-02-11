import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";
import { toast } from "react-hot-toast";

export const useCustomers = () => {
  const { loading: apiLoading, error: apiError, callApi } = useApi();

  // Data states
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [stats, setStats] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCustomers: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter states
  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
    isEmailVerified: "",
    isPhoneVerified: "",
    isVerifiedSeller: "",
    search: "",
    dateFrom: "",
    dateTo: "",
    minOrders: "",
    maxOrders: "",
    minSpent: "",
    maxSpent: "",
    country: "",
    state: "",
    city: "",
  });

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Individual loading states
  const [loadingStates, setLoadingStates] = useState({
    fetchCustomers: false,
    fetchCustomerStats: false,
    fetchCustomerById: false,
    updateCustomerStatus: false,
    updateCustomerRole: false,
    deleteCustomer: false,
    bulkUpdateCustomerStatus: false,
    exportCustomers: false,
  });

  // Individual error states
  const [errorStates, setErrorStates] = useState({
    fetchCustomers: null,
    fetchCustomerStats: null,
    fetchCustomerById: null,
    updateCustomerStatus: null,
    updateCustomerRole: null,
    deleteCustomer: null,
    bulkUpdateCustomerStatus: null,
    exportCustomers: null,
  });

  // Helper to set loading state for a specific operation
  const setOperationLoading = (operation, isLoading) => {
    setLoadingStates((prev) => ({ ...prev, [operation]: isLoading }));
  };

  // Helper to set error state for a specific operation
  const setOperationError = (operation, error) => {
    setErrorStates((prev) => ({ ...prev, [operation]: error }));
  };

  // Helper to clear error for a specific operation
  const clearOperationError = (operation) => {
    setOperationError(operation, null);
  };

  // Fetch all customers with filters
  const fetchCustomers = useCallback(
    async (page = 1) => {
      setOperationLoading("fetchCustomers", true);
      clearOperationError("fetchCustomers");

      try {
        // Build query params
        const params = new URLSearchParams();

        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== "") {
            params.append(key, value);
          }
        });

        // Add sorting & pagination
        params.append("page", page);
        params.append("limit", pagination.limit);
        params.append("sortBy", sortBy);
        params.append("sortOrder", sortOrder);

        const response = await callApi(`/admin/customers?${params.toString()}`);

        setCustomers(response.data.customers);
        setPagination(response.data.pagination);
        clearOperationError("fetchCustomers");

        return response;
      } catch (error) {
        setOperationError("fetchCustomers", error);
        toast.error("Failed to fetch customers");
        throw error;
      } finally {
        setOperationLoading("fetchCustomers", false);
      }
    },
    [callApi, filters, sortBy, sortOrder, pagination.limit],
  );

  // Fetch customer stats
  const fetchCustomerStats = useCallback(
    async (period = "monthly") => {
      setOperationLoading("fetchCustomerStats", true);
      clearOperationError("fetchCustomerStats");

      try {
        const response = await callApi(
          `/admin/customers/stats?period=${period}`,
        );
        setStats(response.data);
        clearOperationError("fetchCustomerStats");
        return response.data;
      } catch (error) {
        setOperationError("fetchCustomerStats", error);
        toast.error("Failed to fetch customer statistics");
        throw error;
      } finally {
        setOperationLoading("fetchCustomerStats", false);
      }
    },
    [callApi],
  );

  // Fetch single customer by ID
  const fetchCustomerById = useCallback(
    async (customerId) => {
      setOperationLoading("fetchCustomerById", true);
      clearOperationError("fetchCustomerById");

      try {
        const response = await callApi(`/admin/customers/${customerId}`);
        setSelectedCustomer(response.data.customer);
        clearOperationError("fetchCustomerById");
        return response.data.customer;
      } catch (error) {
        setOperationError("fetchCustomerById", error);
        toast.error("Failed to fetch customer details");
        throw error;
      } finally {
        setOperationLoading("fetchCustomerById", false);
      }
    },
    [callApi],
  );

  // Update customer status (activate/deactivate)
  const updateCustomerStatus = useCallback(
    async (customerId, isActive, reason = "") => {
      setOperationLoading("updateCustomerStatus", true);
      clearOperationError("updateCustomerStatus");

      try {
        const response = await callApi(
          `/admin/customers/${customerId}/status`,
          "PATCH",
          {
            isActive,
            reason,
          },
        );

        // Update local state
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer._id === customerId ? { ...customer, isActive } : customer,
          ),
        );

        if (selectedCustomer?._id === customerId) {
          setSelectedCustomer((prev) => ({ ...prev, isActive }));
        }

        clearOperationError("updateCustomerStatus");
        toast.success(
          response.message ||
            `Customer ${isActive ? "activated" : "deactivated"} successfully`,
        );
        return response.data;
      } catch (error) {
        setOperationError("updateCustomerStatus", error);
        toast.error(
          `Failed to ${isActive ? "activate" : "deactivate"} customer`,
        );
        throw error;
      } finally {
        setOperationLoading("updateCustomerStatus", false);
      }
    },
    [callApi, selectedCustomer],
  );

  // Update customer role
  const updateCustomerRole = useCallback(
    async (customerId, role, reason = "") => {
      setOperationLoading("updateCustomerRole", true);
      clearOperationError("updateCustomerRole");

      try {
        const response = await callApi(
          `/admin/customers/${customerId}/role`,
          "PATCH",
          {
            role,
            reason,
          },
        );

        // Update local state
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer._id === customerId ? { ...customer, role } : customer,
          ),
        );

        if (selectedCustomer?._id === customerId) {
          setSelectedCustomer((prev) => ({ ...prev, role }));
        }

        clearOperationError("updateCustomerRole");
        toast.success(response.message);
        return response.data;
      } catch (error) {
        setOperationError("updateCustomerRole", error);
        toast.error("Failed to update customer role");
        throw error;
      } finally {
        setOperationLoading("updateCustomerRole", false);
      }
    },
    [callApi, selectedCustomer],
  );

  // Delete customer (soft delete or permanent)
  const deleteCustomer = useCallback(
    async (customerId, options = {}) => {
      const { permanent = false, reason = "" } = options;

      setOperationLoading("deleteCustomer", true);
      clearOperationError("deleteCustomer");

      try {
        const response = await callApi(
          `/admin/customers/${customerId}`,
          "DELETE",
          {
            permanent,
            reason,
          },
        );

        if (permanent) {
          // Remove from list
          setCustomers((prevCustomers) =>
            prevCustomers.filter((customer) => customer._id !== customerId),
          );

          if (selectedCustomer?._id === customerId) {
            setSelectedCustomer(null);
          }

          toast.success("Customer permanently deleted");
        } else {
          // Update status in list
          setCustomers((prevCustomers) =>
            prevCustomers.map((customer) =>
              customer._id === customerId
                ? { ...customer, isActive: false }
                : customer,
            ),
          );

          if (selectedCustomer?._id === customerId) {
            setSelectedCustomer((prev) => ({ ...prev, isActive: false }));
          }

          toast.success("Customer deactivated successfully");
        }

        clearOperationError("deleteCustomer");
        return response.data;
      } catch (error) {
        setOperationError("deleteCustomer", error);
        toast.error(
          permanent
            ? "Failed to delete customer"
            : "Failed to deactivate customer",
        );
        throw error;
      } finally {
        setOperationLoading("deleteCustomer", false);
      }
    },
    [callApi, selectedCustomer],
  );

  // Bulk update customer status
  const bulkUpdateCustomerStatus = useCallback(
    async (customerIds, isActive, reason = "") => {
      setOperationLoading("bulkUpdateCustomerStatus", true);
      clearOperationError("bulkUpdateCustomerStatus");

      try {
        const response = await callApi(
          "/admin/customers/bulk/status",
          "PATCH",
          {
            customerIds,
            isActive,
            reason,
          },
        );

        // Update local state
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customerIds.includes(customer._id)
              ? { ...customer, isActive }
              : customer,
          ),
        );

        clearOperationError("bulkUpdateCustomerStatus");
        toast.success(response.message);
        return response.data;
      } catch (error) {
        setOperationError("bulkUpdateCustomerStatus", error);
        toast.error(
          `Failed to ${isActive ? "activate" : "deactivate"} customers`,
        );
        throw error;
      } finally {
        setOperationLoading("bulkUpdateCustomerStatus", false);
      }
    },
    [callApi],
  );

  // Export customers
  const exportCustomers = useCallback(
    async (format = "json", exportFilters = {}) => {
      setOperationLoading("exportCustomers", true);
      clearOperationError("exportCustomers");

      try {
        const params = new URLSearchParams();
        params.append("format", format);

        // Add current filters to export
        Object.entries({ ...filters, ...exportFilters }).forEach(
          ([key, value]) => {
            if (value && value !== "") {
              params.append(key, value);
            }
          },
        );

        if (format === "csv") {
          // For CSV, trigger download
          const response = await callApi(
            `/admin/customers/export?${params.toString()}`,
            "GET",
            {
              responseType: "blob",
            },
          );

          // Create download link
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `customers-export-${Date.now()}.csv`);
          document.body.appendChild(link);
          link.click();
          link.remove();

          toast.success("Customers exported successfully");
        } else {
          // For JSON, return data
          const response = await callApi(
            `/admin/customers/export?${params.toString()}`,
          );
          toast.success("Customers exported successfully");
          return response.data;
        }

        clearOperationError("exportCustomers");
      } catch (error) {
        setOperationError("exportCustomers", error);
        toast.error("Failed to export customers");
        throw error;
      } finally {
        setOperationLoading("exportCustomers", false);
      }
    },
    [callApi, filters],
  );

  // Update filter
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      role: "",
      isActive: "",
      isEmailVerified: "",
      isPhoneVerified: "",
      isVerifiedSeller: "",
      search: "",
      dateFrom: "",
      dateTo: "",
      minOrders: "",
      maxOrders: "",
      minSpent: "",
      maxSpent: "",
      country: "",
      state: "",
      city: "",
    });
    setSortBy("createdAt");
    setSortOrder("desc");
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Change page
  const changePage = useCallback(
    (page) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchCustomers(page);
    },
    [fetchCustomers],
  );

  // Toggle sort
  const toggleSort = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortOrder("desc");
      }
    },
    [sortBy],
  );

  // Clear selected customer
  const clearSelectedCustomer = useCallback(() => {
    setSelectedCustomer(null);
  }, []);

  // Refresh current page
  const refresh = useCallback(() => {
    fetchCustomers(pagination.page);
  }, [fetchCustomers, pagination.page]);

  // Initial fetch
  useEffect(() => {
    fetchCustomers(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived loading states for common operations
  const isLoading = {
    // Any operation is loading
    any: Object.values(loadingStates).some(Boolean),
    // Specific operations
    fetchCustomers: loadingStates.fetchCustomers,
    fetchCustomerStats: loadingStates.fetchCustomerStats,
    fetchCustomerById: loadingStates.fetchCustomerById,
    updateCustomerStatus: loadingStates.updateCustomerStatus,
    updateCustomerRole: loadingStates.updateCustomerRole,
    deleteCustomer: loadingStates.deleteCustomer,
    bulkUpdateCustomerStatus: loadingStates.bulkUpdateCustomerStatus,
    exportCustomers: loadingStates.exportCustomers,
  };

  // Derived error states
  const errors = {
    fetchCustomers: errorStates.fetchCustomers,
    fetchCustomerStats: errorStates.fetchCustomerStats,
    fetchCustomerById: errorStates.fetchCustomerById,
    updateCustomerStatus: errorStates.updateCustomerStatus,
    updateCustomerRole: errorStates.updateCustomerRole,
    deleteCustomer: errorStates.deleteCustomer,
    bulkUpdateCustomerStatus: errorStates.bulkUpdateCustomerStatus,
    exportCustomers: errorStates.exportCustomers,
  };

  return {
    // State
    customers,
    selectedCustomer,
    pagination,
    filters,
    sortBy,
    sortOrder,
    stats,

    // Loading states (individual)
    isLoading,
    loadingStates,

    // Error states (individual)
    errors,
    errorStates,

    // Global API loading/error (from useApi)
    apiLoading,
    apiError,

    // Customer CRUD
    fetchCustomers,
    fetchCustomerById,
    fetchCustomerStats,
    updateCustomerStatus,
    updateCustomerRole,
    deleteCustomer,
    bulkUpdateCustomerStatus,
    exportCustomers,

    // Filter & Sort
    updateFilter,
    resetFilters,
    toggleSort,
    changePage,

    // Utility
    clearSelectedCustomer,
    refresh,
    setSelectedCustomer,
  };
};
