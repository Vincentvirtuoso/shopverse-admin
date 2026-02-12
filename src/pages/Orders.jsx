import React, { useEffect, useState } from "react";
import {
  LuPackage,
  LuTruck,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuSearch,
  LuFilter,
  LuDownload,
  LuRefreshCw,
  LuEye,
  LuSend,
  LuPrinter,
  LuMail,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuShoppingBag,
  LuDollarSign,
  LuUsers,
  LuTrendingUp,
  LuMapPin,
  LuCreditCard,
  LuPackageOpen,
  LuHouse,
  LuSettings,
  LuBell,
  LuUser,
  LuPlus,
  LuArchive,
  LuSlidersHorizontal,
  LuArrowUpDown,
} from "react-icons/lu";
import { FiBarChart, FiEdit, FiMoreVertical } from "react-icons/fi";

import {
  useOrder,
  useOrderFilters,
  useBulkOrderOperations,
} from "../hooks/useOrders";
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
} from "../utils/formatters";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "../components/others/OrderBadges";
import WrapperHeader from "../components/common/WrapperHeader";
import CardWrapper from "../components/ui/CardWrapper";
import Spinner from "../components/common/Spinner";
import WrapperFooter from "../components/common/WrapperFooter";
import WrapperBody from "../components/common/WrapperBody";

const OrderManagementPage = () => {
  const {
    orders,
    pagination,
    stats,
    analytics,
    loading,
    error,
    getAllOrders,
    getOrderAnalytics,
    exportOrders,
    updateOrderStatus,
    getFulfillmentQueue,
  } = useOrder();

  const { filters, updateFilter, resetFilters, nextPage, prevPage } =
    useOrderFilters();
  const {
    selectedOrders,
    toggleSelectOrder,
    selectAllOrders,
    clearSelection,
    selectedCount,
  } = useBulkOrderOperations();

  const [activeTab, setActiveTab] = useState("all-orders");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    getAllOrders(filters);
    getOrderAnalytics({ period: "month" });
    getFulfillmentQueue();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter("search", searchTerm);
  };

  const handleExport = async (format = "csv") => {
    await exportOrders({ ...filters, format });
  };

  const tabs = [
    {
      id: "all-orders",
      label: "All Orders",
      icon: LuPackage,
      count: pagination?.total,
    },
    {
      id: "pending",
      label: "Pending",
      icon: LuClock,
      count: stats?.pendingOrders,
    },
    {
      id: "processing",
      label: "Processing",
      icon: LuPackageOpen,
      count: stats?.processingOrders,
    },
    {
      id: "shipped",
      label: "Shipped",
      icon: LuTruck,
      count: stats?.shippedOrders,
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: LuCircleCheck,
      count: stats?.deliveredOrders,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      icon: LuCircleX,
      count: stats?.cancelledOrders,
    },
    {
      id: "returns",
      label: "Returns",
      icon: LuArchive,
      count: stats?.returnOrders,
    },
  ];

  return (
    <div className="min-h-screen text-gray-100">
      {/* Main Content */}
      <div>
        {/* Header */}
        <WrapperHeader className="" title="Order Management">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <LuSearch className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          </form>
        </WrapperHeader>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                  <p className="text-xs text-green-500 mt-2">
                    +12.5% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <LuDollarSign className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats?.totalOrders || 0}
                  </p>
                  <p className="text-xs text-green-500 mt-2">
                    +8.2% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <LuShoppingBag className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Average Order Value</p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(stats?.avgOrderValue || 0)}
                  </p>
                  <p className="text-xs text-green-500 mt-2">
                    +5.3% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <LuTrendingUp className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-bold mt-1">24.8%</p>
                  <p className="text-xs text-red-500 mt-2">
                    -2.1% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <LuUsers className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 mb-6">
            <div className="border-b border-gray-800 overflow-x-auto">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-red-500 border-b-2 border-red-500"
                        : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          activeTab === tab.id
                            ? "bg-red-500/20 text-red-500"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {selectedCount > 0 && (
                <>
                  <span className="text-sm text-gray-400">
                    {selectedCount} order{selectedCount > 1 ? "s" : ""} selected
                  </span>
                  <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                    <LuSend className="w-4 h-4 inline mr-2" />
                    Update Status
                  </button>
                  <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                    <LuPrinter className="w-4 h-4 inline mr-2" />
                    Print Labels
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1.5 text-gray-400 hover:text-gray-100 transition-colors text-sm"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LuSlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <LuArrowUpDown className="w-4 h-4" />
                <span>Sort</span>
              </button>

              <button
                onClick={() => getAllOrders(filters)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LuRefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleExport("csv")}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LuDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="h-72 flex items-center justify-center">
              <Spinner
                label="Loading Orders... Please wait"
                size="2xl"
                labelAnimation="pulse"
              />
            </div>
          ) : (
            <CardWrapper className="rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-800">
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedOrders.length === orders?.length &&
                            orders?.length > 0
                          }
                          onChange={() => selectAllOrders(orders || [])}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Order Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {orders?.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                      >
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => toggleSelectOrder(order._id)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="shrink-0 w-10 h-10 bg-linear-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <LuShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium whitespace-nowrap">
                                {order.orderNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>{`${order.customer.firstName} ${order.customer.lastName}`}</div>
                            <div className="text-xs text-gray-400">
                              {order.customer.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Item Image Stack */}
                            <div className="relative flex items-center">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div
                                  key={index}
                                  className="relative w-10 h-10 rounded-lg border border-white shadow-sm shadow-red-600 overflow-hidden bg-gray-100 p-0.5"
                                  title={index === 0 ? "front" : ""}
                                  style={{
                                    zIndex: index === 0 ? 4 : index + 1,
                                    transform:
                                      index === 0
                                        ? "rotate(0)"
                                        : `rotate(${index * 1.8 + 7 + "deg"})`,
                                    marginLeft:
                                      index === 0
                                        ? "-12px"
                                        : `${index * 0.9 * 24 * -1}px`,
                                    marginRight: index !== 0 ? "0" : "-10px",
                                  }}
                                >
                                  <img
                                    src={item.product.image}
                                    alt="product"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ))}

                              {order.items.length > 3 && (
                                <div
                                  className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 text-xs font-medium border border-white shadow-sm"
                                  style={{
                                    zIndex: 4,
                                    transform: "rotate(8deg)",
                                    marginLeft: "-12px",
                                  }}
                                >
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm font-bold">
                            {formatCurrency(order.pricing?.total || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <OrderStatusBadge status={order.status} size="sm" />
                        </td>
                        <td className="px-6 py-4">
                          <PaymentStatusBadge
                            status={order.payment?.status}
                            size="sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs whitespace-nowrap">
                            <div>{formatDate(order.dates?.placedAt)}</div>
                            <div className="text-xs text-gray-400">
                              {formatRelativeTime(order.dates?.placedAt)}
                            </div>
                          </div>
                        </td>
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <button
                                className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
                                title="More Actions"
                              >
                                <FiMoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between px-6 py-4 border-t border-gray-800">
                  <div className="text-sm text-gray-400">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total} orders
                  </div>
                  <div className="flex items-center space-x-2 place-self-end">
                    <button
                      onClick={() => updateFilter("page", 1)}
                      disabled={pagination.page === 1}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <LuChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={prevPage}
                      disabled={pagination.page === 1}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <LuChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (
                            pagination.page >=
                            pagination.totalPages - 2
                          ) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => updateFilter("page", pageNum)}
                              className={`w-10 h-10 rounded-lg transition-colors ${
                                pagination.page === pageNum
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <LuChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        updateFilter("page", pagination.totalPages)
                      }
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <LuChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </CardWrapper>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 w-[90%] max-w-2xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <LuFilter className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold">Advanced Filters</h2>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LuCircleX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-60px)]">
              {/* Status Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Order Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "pending",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                    "refunded",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateFilter(
                          "status",
                          status === filters.status ? "" : status,
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                        filters.status === status
                          ? "bg-red-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Payment Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["pending", "paid", "refunded", "failed", "cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() =>
                          updateFilter(
                            "paymentStatus",
                            status === filters.paymentStatus ? "" : status,
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                          filters.paymentStatus === status
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100"
                        }`}
                      >
                        {status}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => {
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }));
                      updateFilter("startDate", e.target.value);
                    }}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => {
                      setDateRange((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }));
                      updateFilter("endDate", e.target.value);
                    }}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Customer Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={filters.customerEmail || ""}
                  onChange={(e) =>
                    updateFilter("customerEmail", e.target.value)
                  }
                  placeholder="customer@example.com"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Order Value Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    placeholder="₦0"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    placeholder="₦1000000"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-800">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Reset All
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <CardWrapper className="bg-gray-900 rounded-xl border border-gray-800 w-[90%] max-w-4xl max-h-[90vh] overflow-hidden">
            <WrapperHeader
              title="Order Details"
              className="border-b border-gray-400 p-4"
              onClose={() => setShowOrderDetails(false)}
              iconBgColor=""
              icon={<LuShoppingBag className="text-red-400 text-2xl" />}
              description={
                <OrderStatusBadge status={selectedOrder.status} size="sm" />
              }
            />

            <div className="p-6 space-y-6 overflow-y-auto h-[calc(90vh-190px)]">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-xl font-bold">
                    {selectedOrder.orderNumber}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Placed on {formatDate(selectedOrder.dates?.placedAt)}
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                  <LuPrinter className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
              </div>

              {/* Customer & Shipping Info */}
              <WrapperBody.Grid className="" cols={2}>
                <WrapperBody.Card className="rounded-lg p-4 bg-white dark:bg-neutral-700">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <LuUser className="w-4 h-4 text-gray-400" />
                      <span>{`${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <LuMail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">
                        {selectedOrder.customer.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <LuCreditCard className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">
                        {selectedOrder.payment?.method?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </WrapperBody.Card>

                <WrapperBody.Card className="rounded-lg p-4 bg-white dark:bg-neutral-700">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">
                    Shipping Address
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <LuMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div>
                          {selectedOrder.shipping?.address?.addressLine1}
                        </div>
                        {selectedOrder.shipping?.address?.addressLine2 && (
                          <div>
                            {selectedOrder.shipping.address.addressLine2}
                          </div>
                        )}
                        <div>
                          {selectedOrder.shipping?.address?.city},{" "}
                          {selectedOrder.shipping?.address?.state}
                        </div>
                        <div>{selectedOrder.shipping?.address?.postalCode}</div>
                        <div>{selectedOrder.shipping?.address?.country}</div>
                      </div>
                    </div>
                  </div>
                </WrapperBody.Card>
              </WrapperBody.Grid>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Order Items
                </h3>
                <div className="rounded-lg divide-y divide-gray-700">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center p-4">
                      <div className="w-16 h-16 bg-linear-to-br from-red-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                        <LuPackage className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="text-sm font-medium">Product Name</div>
                        <div className="text-xs text-gray-500">SKU: #12345</div>
                      </div>
                      <div className="text-sm">
                        {item.quantity} ×{" "}
                        {formatCurrency(item.price?.final || 0)}
                      </div>
                      <div className="ml-8 font-bold">
                        {formatCurrency(
                          (item.price?.final || 0) * item.quantity,
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-6">
                <WrapperBody.Card showBg className="rounded-lg" padding="md">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span>
                        {formatCurrency(selectedOrder.pricing?.subtotal || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shipping</span>
                      <span>
                        {formatCurrency(selectedOrder.pricing?.shipping || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tax</span>
                      <span>
                        {formatCurrency(selectedOrder.pricing?.tax?.total || 0)}
                      </span>
                    </div>
                    {selectedOrder.pricing?.discount?.amount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Discount</span>
                        <span>
                          -
                          {formatCurrency(
                            selectedOrder.pricing.discount.amount,
                          )}
                        </span>
                      </div>
                    )}
                    <WrapperBody.Divider />
                    <div className="pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>
                          {formatCurrency(selectedOrder.pricing?.total || 0)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 text-right mt-1">
                        {selectedOrder.pricing?.currency}
                      </div>
                    </div>
                  </div>
                </WrapperBody.Card>
              </div>

              {/* Status Timeline */}
              <WrapperBody padding="none">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Order Timeline
                </h3>
                <WrapperBody.Card showBg className="rounded-lg p-4">
                  <div className="space-y-4">
                    {selectedOrder.statusHistory
                      ?.slice()
                      .reverse()
                      .map((history, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="relative">
                            <div
                              className={`w-2 h-2 mt-2 rounded-full ${
                                index === 0 ? "bg-red-500" : "bg-gray-400"
                              }`}
                            />
                            {index < selectedOrder.statusHistory.length - 1 && (
                              <div className="absolute top-6 left-[3px] w-0.5 h-12 bg-gray-400/50" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium capitalize">
                              {history.status.replace("_", " ")}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(history.timestamp)} •{" "}
                              {formatRelativeTime(history.timestamp)}
                            </div>
                            {history.note && (
                              <div className="text-xs text-gray-300 mt-1">
                                {history.note}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </WrapperBody.Card>
              </WrapperBody>
            </div>

            <WrapperFooter className="border-t border-gray-800 p-4" sticky>
              <div className="flex items-center space-x-3">
                <button
                  className="px-4 py-2 rounded-lg transition-colors
               bg-gray-100 text-gray-800 hover:bg-gray-200
               dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  <LuSend className="w-4 h-4 inline mr-2" />
                  Update Status
                </button>

                <button
                  className="px-4 py-2 rounded-lg transition-colors
               bg-red-500 text-white hover:bg-red-600
               dark:bg-red-600 dark:hover:bg-red-700"
                >
                  <LuCircleCheck className="w-4 h-4 inline mr-2" />
                  Mark as Delivered
                </button>
              </div>
            </WrapperFooter>
          </CardWrapper>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
