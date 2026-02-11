import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";

const FilterPanel = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    verified: "",
    dateRange: "",
    minOrders: "",
    minSpent: "",
    hasAddress: false,
    isSeller: false,
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      role: "",
      status: "",
      verified: "",
      dateRange: "",
      minOrders: "",
      minSpent: "",
      hasAddress: false,
      isSeller: false,
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 border-t pt-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium  text-gray-500 dark:text-gray-200 mb-2">
            Role
          </label>
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium  text-gray-500 dark:text-gray-200 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Verification Filter */}
        <div>
          <label className="block text-sm font-medium  text-gray-500 dark:text-gray-200 mb-2">
            Email Verification
          </label>
          <select
            value={filters.verified}
            onChange={(e) => handleFilterChange("verified", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="verified">Verified Only</option>
            <option value="not_verified">Not Verified</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium  text-gray-500 dark:text-gray-200 mb-2">
            Joined Date
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Anytime</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Min Orders */}
        <div>
          <label className="block text-sm font-medium  text-gray-500 dark:text-gray-200 mb-2">
            Min Orders
          </label>
          <input
            type="number"
            value={filters.minOrders}
            onChange={(e) => handleFilterChange("minOrders", e.target.value)}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Min Spent */}
        <div>
          <label className="block text-sm font-medium  text-gray-500 dark:text-gray-200 mb-2">
            Min Spent ($)
          </label>
          <input
            type="number"
            value={filters.minSpent}
            onChange={(e) => handleFilterChange("minSpent", e.target.value)}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Checkbox Filters */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.hasAddress}
              onChange={(e) =>
                handleFilterChange("hasAddress", e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Has Address</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.isSeller}
              onChange={(e) => handleFilterChange("isSeller", e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Verified Sellers Only</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <FiX />
            Clear Filters
          </button>
          <button
            onClick={() => onFilter(filters)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiCheck />
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;
