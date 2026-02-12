/* eslint-disable no-useless-catch */
import { useState, useCallback, useMemo } from "react";
import { useApi } from "./useApi";

export const useOrder = () => {
  const { loading, error, callApi } = useApi();
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [returns, setReturns] = useState([]);
  const [fulfillmentQueue, setFulfillmentQueue] = useState([]);

  const getAllOrders = useCallback(
    async (filters = {}) => {
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await callApi(`/orders/admin?${queryParams}`, "GET");
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
        setStats(response.data.stats);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  const getOrder = useCallback(
    async (orderId) => {
      try {
        const response = await callApi(`/orders/${orderId}`, "GET");
        setOrder(response.data.order);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Update order status with validation and history tracking
   */
  const updateOrderStatus = useCallback(
    async (orderId, statusData) => {
      try {
        const response = await callApi(
          `/orders/${orderId}/status`,
          "PATCH",
          statusData,
        );

        // Update order in state if exists
        setOrder((prev) =>
          prev?._id === orderId ? response.data.order : prev,
        );

        // Update order in orders list
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? response.data.order : order,
          ),
        );

        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Bulk update multiple orders (admin only)
   */
  const bulkUpdateOrders = useCallback(
    async (orderIds, updateData) => {
      try {
        const response = await callApi("/orders/bulk-update", "PATCH", {
          orderIds,
          ...updateData,
        });

        // Refresh orders after bulk update
        await getAllOrders();

        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi, getAllOrders],
  );

  /**
   * Cancel order with reason
   */
  const cancelOrder = useCallback(
    async (orderId, reason) => {
      try {
        const response = await callApi(`/orders/${orderId}/cancel`, "POST", {
          reason,
        });

        setOrder((prev) =>
          prev?._id === orderId ? response.data.order : prev,
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  // ============= ANALYTICS & REPORTING =============

  /**
   * Get order analytics with timeframe filtering
   */
  const getOrderAnalytics = useCallback(
    async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await callApi(
          `/orders/analytics?${queryParams}`,
          "GET",
        );
        setAnalytics(response.data);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Get sales statistics
   */
  const getSalesStats = useCallback(
    async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await callApi(`/orders/stats?${queryParams}`, "GET");
        setStats(response.data.data);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Export orders in various formats
   */
  const exportOrders = useCallback(
    async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await callApi(`/orders/export?${queryParams}`, "GET");
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  // ============= FULFILLMENT & SHIPPING =============

  /**
   * Get fulfillment queue
   */
  const getFulfillmentQueue = useCallback(
    async (type = "pending_fulfillment") => {
      try {
        const response = await callApi(
          `/orders/fulfillment/queue?type=${type}`,
          "GET",
        );
        setFulfillmentQueue(response.data.orders);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Mark order as shipped with tracking info
   */
  const markAsShipped = useCallback(
    async (orderId, shippingInfo) => {
      try {
        const response = await callApi(
          `/orders/${orderId}/ship`,
          "POST",
          shippingInfo,
        );

        setOrder((prev) =>
          prev?._id === orderId ? response.data.order : prev,
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Bulk update fulfillment status
   */
  const bulkFulfillmentUpdate = useCallback(
    async (updateData) => {
      try {
        const response = await callApi(
          "/orders/fulfillment/bulk-update",
          "PATCH",
          updateData,
        );
        await getFulfillmentQueue();
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi, getFulfillmentQueue],
  );

  /**
   * Update tracking information
   */
  const updateTracking = useCallback(
    async (orderId, trackingInfo) => {
      try {
        const response = await callApi(
          `/orders/${orderId}/tracking`,
          "PATCH",
          trackingInfo,
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  // ============= RETURNS & REFUNDS =============

  /**
   * Get returns dashboard
   */
  const getReturnsDashboard = useCallback(
    async (filters = {}) => {
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await callApi(
          `/orders/returns/dashboard?${queryParams}`,
          "GET",
        );
        setReturns(response.data.returnsByStatus);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Process return request
   */
  const processReturn = useCallback(
    async (returnData) => {
      try {
        const response = await callApi(
          "/orders/returns/process",
          "POST",
          returnData,
        );

        // Update order if it exists in state
        if (response.data.order) {
          setOrder((prev) =>
            prev?._id === returnData.orderId ? response.data.order : prev,
          );
        }

        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Process refund
   */
  const processRefund = useCallback(
    async (refundData) => {
      try {
        const response = await callApi(
          "/orders/refund/process",
          "POST",
          refundData,
        );

        setOrder((prev) =>
          prev?._id === refundData.orderId ? response.data.order : prev,
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Request return for order
   */
  const requestReturn = useCallback(
    async (orderId, returnRequest) => {
      try {
        const response = await callApi(
          `/orders/${orderId}/return`,
          "POST",
          returnRequest,
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  // ============= CUSTOMER INSIGHTS =============

  /**
   * Get customer order insights
   */
  const getCustomerInsights = useCallback(
    async (customerId) => {
      try {
        const response = await callApi(
          `/orders/customer/${customerId}/insights`,
          "GET",
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Get customer order history
   */
  const getCustomerOrders = useCallback(
    async (customerId, filters = {}) => {
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await callApi(
          `/orders/customer/${customerId}?${queryParams}`,
          "GET",
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  // ============= INVENTORY IMPACT =============

  /**
   * Get order inventory impact
   */
  const getInventoryImpact = useCallback(
    async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await callApi(
          `/orders/inventory/impact?${queryParams}`,
          "GET",
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  // ============= ABANDONED CARTS =============

  /**
   * Get abandoned carts
   */
  const getAbandonedCarts = useCallback(
    async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await callApi(
          `/orders/abandoned-carts?${queryParams}`,
          "GET",
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Send recovery email for abandoned cart
   */
  const sendRecoveryEmail = useCallback(
    async (cartId) => {
      try {
        const response = await callApi(
          `/orders/abandoned-carts/${cartId}/recover`,
          "POST",
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  // ============= ORDER NOTES & COMMUNICATION =============

  /**
   * Add note to order
   */
  const addOrderNote = useCallback(
    async (orderId, note, isPrivate = true) => {
      try {
        const response = await callApi(`/orders/${orderId}/notes`, "POST", {
          note,
          isPrivate,
        });

        setOrder((prev) =>
          prev?._id === orderId ? response.data.order : prev,
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Send order email (invoice, confirmation, etc.)
   */
  const sendOrderEmail = useCallback(
    async (orderId, emailType) => {
      try {
        const response = await callApi(`/orders/${orderId}/email`, "POST", {
          type: emailType,
        });
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  // ============= INVOICE & DOCUMENTS =============

  /**
   * Generate invoice
   */
  const generateInvoice = useCallback(
    async (orderId) => {
      try {
        const response = await callApi(`/orders/${orderId}/invoice`, "GET");
        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  /**
   * Download invoice as PDF
   */
  const downloadInvoice = useCallback(
    async (orderId) => {
      try {
        const response = await callApi(
          `/orders/${orderId}/invoice/download`,
          "GET",
          null,
          { responseType: "blob" },
        );

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        return response;
      } catch (err) {
        throw err;
      }
    },
    [callApi],
  );

  // ============= PERFORMANCE METRICS =============

  /**
   * Get order processing metrics
   */
  const getProcessingMetrics = useCallback(async () => {
    try {
      const response = await callApi("/orders/metrics/processing", "GET");
      return response;
    } catch (err) {
      throw err;
    }
  }, [callApi]);

  // ============= UTILITY FUNCTIONS =============

  /**
   * Clear selected order
   */
  const clearSelectedOrder = useCallback(() => {
    setOrder(null);
  }, []);

  /**
   * Clear all orders
   */
  const clearOrders = useCallback(() => {
    setOrders([]);
    setPagination(null);
  }, []);

  /**
   * Reset state
   */
  const resetState = useCallback(() => {
    setOrders([]);
    setOrder(null);
    setPagination(null);
    setStats(null);
    setAnalytics(null);
    setReturns([]);
    setFulfillmentQueue([]);
  }, []);

  /**
   * Refetch current order
   */
  const refetchOrder = useCallback(async () => {
    if (order?._id) {
      await getOrder(order._id);
    }
  }, [order, getOrder]);

  // ============= COMPUTED PROPERTIES =============

  const orderMetrics = useMemo(() => {
    if (!orders.length) return null;

    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + (order.pricing?.total || 0),
        0,
      ),
      averageOrderValue:
        orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0) /
        orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      processingOrders: orders.filter((o) => o.status === "processing").length,
      shippedOrders: orders.filter((o) => o.status === "shipped").length,
      deliveredOrders: orders.filter((o) => o.status === "delivered").length,
      cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  return {
    // State
    loading,
    error,
    orders,
    order,
    pagination,
    stats,
    analytics,
    returns,
    fulfillmentQueue,
    orderMetrics,

    // Order Management
    getAllOrders,
    getOrder,
    updateOrderStatus,
    bulkUpdateOrders,
    cancelOrder,

    // Analytics
    getOrderAnalytics,
    getSalesStats,
    exportOrders,

    // Fulfillment
    getFulfillmentQueue,
    markAsShipped,
    bulkFulfillmentUpdate,
    updateTracking,

    // Returns & Refunds
    getReturnsDashboard,
    processReturn,
    processRefund,
    requestReturn,

    // Customer Insights
    getCustomerInsights,
    getCustomerOrders,

    // Inventory
    getInventoryImpact,

    // Abandoned Carts
    getAbandonedCarts,
    sendRecoveryEmail,

    // Notes & Communication
    addOrderNote,
    sendOrderEmail,

    // Documents
    generateInvoice,
    downloadInvoice,

    // Performance
    getProcessingMetrics,

    // Utility
    clearSelectedOrder,
    clearOrders,
    resetState,
    refetchOrder,
  };
};

// ============= SPECIALIZED HOOKS =============

/**
 * Hook for order filtering and pagination
 */
export const useOrderFilters = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "",
    paymentStatus: "",
    customerEmail: "",
    startDate: "",
    endDate: "",
    search: "",
    sortBy: "-dates.placedAt",
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter change
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
      status: "",
      paymentStatus: "",
      customerEmail: "",
      startDate: "",
      endDate: "",
      search: "",
      sortBy: "-dates.placedAt",
    });
  }, []);

  const nextPage = useCallback(() => {
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    nextPage,
    prevPage,
  };
};

/**
 * Hook for bulk order operations
 */
export const useBulkOrderOperations = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { bulkUpdateOrders, bulkFulfillmentUpdate } = useOrder();

  const toggleSelectOrder = useCallback((orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  }, []);

  const selectAllOrders = useCallback((orderList) => {
    setSelectedOrders(orderList.map((order) => order._id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedOrders([]);
  }, []);

  const bulkStatusUpdate = useCallback(
    async (status, note) => {
      if (selectedOrders.length === 0) return;
      return await bulkUpdateOrders(selectedOrders, { status, note });
    },
    [selectedOrders, bulkUpdateOrders],
  );

  const bulkShippingUpdate = useCallback(
    async (trackingInfo) => {
      if (selectedOrders.length === 0) return;
      return await bulkFulfillmentUpdate({
        orderIds: selectedOrders,
        ...trackingInfo,
      });
    },
    [selectedOrders, bulkFulfillmentUpdate],
  );

  return {
    selectedOrders,
    toggleSelectOrder,
    selectAllOrders,
    clearSelection,
    bulkStatusUpdate,
    bulkShippingUpdate,
    hasSelected: selectedOrders.length > 0,
    selectedCount: selectedOrders.length,
  };
};
