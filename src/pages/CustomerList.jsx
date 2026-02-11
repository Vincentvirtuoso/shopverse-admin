import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiRefreshCw,
  FiUsers,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { MdStore } from "react-icons/md";
// import { customersData } from "../data/customersData";
import StatsCards from "../sections/customersPage/StatsCards";
import FilterPanel from "../sections/customersPage/FilterPanel";
import CustomerCard from "../sections/customersPage/CustomerCard";
import CustomerDetailsModal from "./CustomerDetails";
import WrapperHeader from "../components/common/WrapperHeader";
import CardWrapper from "../components/ui/CardWrapper";
import { useCustomers } from "../hooks/useCustomers";
import Spinner from "../components/common/Spinner";

const CustomerList = () => {
  const {
    customers,
    selectedCustomer,
    isLoading,
    updateCustomerStatus,
    deleteCustomer,
    bulkUpdateCustomerStatus,
    setSelectedCustomer,
    refresh,
  } = useCustomers();

  const {
    fetchCustomers: loading,
    updateCustomerStatus: updatingCustomerStatus,
    deleteCustomer: deletingCustomer,
  } = isLoading;

  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Filtering and sorting logic
  useEffect(() => {
    let result = [...customers];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (customer) =>
          customer.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phoneNumber?.includes(searchTerm),
      );
    }

    // Sorting
    switch (sortBy) {
      case "name":
        result.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`,
          ),
        );
        break;
      // case "recent":
      //   result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      //   break;
      // case "spent":
      //   result.sort((a, b) => b.stats.totalSpent - a.stats.totalSpent);
      //   break;
      // case "orders":
      //   result.sort((a, b) => b.stats.totalOrders - a.stats.totalOrders);
      //   break;
      default:
        break;
    }

    setFilteredCustomers(result);
    setCurrentPage(1);
  }, [searchTerm, sortBy, customers]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(currentCustomers.map((c) => c._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleCustomerSelectToggle = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const handleExport = () => {
    // Export logic here
    console.log(
      "Exporting customers:",
      selectedCustomers.length > 0 ? selectedCustomers : "all",
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedCustomers.length === 0) return;

    try {
      switch (action) {
        case "activate":
          await bulkUpdateCustomerStatus(selectedCustomers, true);
          setSelectedCustomers([]);
          break;
        case "deactivate":
          await bulkUpdateCustomerStatus(selectedCustomers, false);
          setSelectedCustomers([]);
          break;
        case "delete":
          // Implement bulk delete
          console.log("Bulk delete:", selectedCustomers);
          setSelectedCustomers([]);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Bulk action failed:", error);
    }
  };

  const handleRefresh = () => {
    refresh();
    setSelectedCustomers([]);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-200 flex items-center gap-2">
              <FiUsers className="text-red-600" />
              Customer Management
            </h1>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </motion.button>
          </div>
        </div>

        {/* Stats Cards - Now uses hook internally */}
        <StatsCards />
      </motion.div>

      {/* Controls */}
      <CardWrapper className="rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-lg ${
                viewMode === "grid"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 dark:text-gray-100"
              }`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-lg ${
                viewMode === "list"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 dark:text-gray-100"
              }`}
            >
              <FiList />
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="spent">Total Spent</option>
              <option value="orders">Total Orders</option>
            </select>
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FiFilter />
            Filters
            {isFilterOpen ? <FiChevronUp /> : <FiChevronDown />}
          </motion.button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <FilterPanel
              onFilter={(filters) => {
                // Apply filters logic
                console.log("Filters:", filters);
              }}
            />
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-between"
          >
            <span className="text-red-700 dark:text-red-400 font-medium">
              {selectedCustomers.length} customer(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </CardWrapper>

      {/* Loading State */}
      {loading && (
        <Spinner
          size="2xl"
          borderWidth="3"
          label="Loading Customers"
          labelAnimation="bounce"
          className="gap-4"
        />
      )}

      {/* Customer List/Grid */}
      {!loading && (
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6"
            >
              {currentCustomers.map((customer, index) => (
                <motion.div
                  key={customer._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CustomerCard
                    customer={customer}
                    onSelect={handleCustomerSelect}
                    isSelected={selectedCustomers.includes(customer._id)}
                    onSelectToggle={() =>
                      handleCustomerSelectToggle(customer._id)
                    }
                    updateCustomerStatus={updateCustomerStatus}
                    deleteCustomer={deleteCustomer}
                    loadingStates={{
                      updatingCustomerStatus,
                      sendEmail: false,
                      sendSMS: false,
                      deletingCustomer,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-x-auto"
            >
              <table className="w-full">
                <thead className="overflow-x-auto">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 text-left">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedCustomers.length ===
                            currentCustomers.length &&
                          currentCustomers.length > 0
                        }
                      />
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">
                      Customer
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">
                      Contact
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">
                      Orders
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">
                      Total Spent
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map((customer, index) => (
                    <motion.tr
                      key={customer._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer._id)}
                          onChange={() =>
                            handleCustomerSelectToggle(customer._id)
                          }
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={customer.profileImage}
                            alt={customer.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {customer.role === "seller" && (
                                <span className="inline-flex items-center gap-1">
                                  <MdStore className="text-green-600" />
                                  Seller
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FiMail className="text-gray-400" />
                            {customer.email}
                          </div>
                          {customer.phoneNumber && (
                            <div className="flex items-center gap-1 mt-1 text-gray-700 dark:text-gray-300">
                              <FiPhone className="text-gray-400" />
                              {customer.phoneNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              customer.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {customer.isActive ? (
                              <FiCheckCircle />
                            ) : (
                              <FiXCircle />
                            )}
                            {customer.isActive ? "Active" : "Inactive"}
                          </span>
                          {customer.isEmailVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              <FiCheckCircle />
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {customer.stats.totalOrders}
                        </div>
                        <div className="text-sm text-gray-500">orders</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          ₦{customer.stats.totalSpent.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCustomerSelect(customer)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="View Details"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} customers
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border dark:border-gray-600 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded ${
                    currentPage === pageNum
                      ? "bg-red-600 text-white"
                      : "border dark:border-gray-600"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border dark:border-gray-600 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">
              Items per page:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border dark:border-gray-600 dark:bg-gray-700 rounded px-2 py-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredCustomers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No customers found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerList;
