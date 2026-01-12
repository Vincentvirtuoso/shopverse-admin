import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { generateSKU } from "../../../assets/addProducts";

const Inventory = ({ form, handleChange, setForm }) => {
  return (
    <motion.div
      key="inventory"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Stock Count and Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stock Count
          </label>
          <input
            type="number"
            name="stockCount"
            value={form.stockCount}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="0"
          />
        </div>
      </div>

      {/* SKU Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          SKU (Stock Keeping Unit)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="e.g., PROD-001"
          />
          <button
            type="button"
            onClick={() => setForm({ ...form, sku: generateSKU() })}
            className="px-4 py-3 rounded-lg bg-red-700 hover:bg-red-600 
          text-white font-medium transition-colors whitespace-nowrap"
          >
            Generate SKU
          </button>
        </div>
      </div>

      {/* Availability Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Availability Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["in-stock", "limited", "out-of-stock", "pre-order"].map((type) => (
            <label
              key={type}
              className={`relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                form.availabilityType === type
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                name="availabilityType"
                value={type}
                checked={form.availabilityType === type}
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {type.replace("-", " ")}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Status Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* New Arrival */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start">
            <div className="relative flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id="isNewArrival"
                name="isNewArrival"
                checked={form.isNewArrival}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer peer z-10"
              />
              <div
                className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 peer-checked:border-blue-500 peer-checked:bg-blue-500 
              peer-focus:ring-4 peer-focus:ring-blue-500/20 transition-all duration-200 
              flex items-center justify-center"
              >
                <svg
                  className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="ml-3 flex-1">
              <label
                htmlFor="isNewArrival"
                className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer flex items-center gap-2"
              >
                <span className="flex items-center gap-1">
                  New Arrival
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    New
                  </span>
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mark this product as a new arrival. Will be highlighted in new
                arrivals section.
              </p>
            </div>

            <div className="ml-2">
              <div className="w-10 h-6 flex items-center justify-center">
                <svg
                  className={`w-6 h-6 transition-all duration-300 ${
                    form.isNewArrival
                      ? "text-blue-500"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Product */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start">
            <div className="relative flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer peer z-10"
              />
              <div
                className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 peer-checked:border-purple-500 peer-checked:bg-purple-500 
              peer-focus:ring-4 peer-focus:ring-purple-500/20 transition-all duration-200 
              flex items-center justify-center"
              >
                <svg
                  className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="ml-3 flex-1">
              <label
                htmlFor="isFeatured"
                className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer flex items-center gap-2"
              >
                <span className="flex items-center gap-1">
                  Featured Product
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    Featured
                  </span>
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Feature this product prominently on homepage and category pages.
              </p>
            </div>

            <div className="ml-2">
              <div className="w-10 h-6 flex items-center justify-center">
                <svg
                  className={`w-6 h-6 transition-all duration-300 ${
                    form.isFeatured
                      ? "text-purple-500"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start">
            <div className="relative flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id="isBestSeller"
                name="isBestSeller"
                checked={form.isBestSeller}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer peer z-10"
              />
              <div
                className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 peer-checked:border-yellow-500 peer-checked:bg-yellow-500 
              peer-focus:ring-4 peer-focus:ring-yellow-500/20 transition-all duration-200 
              flex items-center justify-center"
              >
                <svg
                  className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="ml-3 flex-1">
              <label
                htmlFor="isBestSeller"
                className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer flex items-center gap-2"
              >
                <span className="flex items-center gap-1">
                  Best Seller
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    Premium
                  </span>
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Highlight with a "Best Seller" badge across the platform.
              </p>
            </div>

            <div className="ml-2">
              <div className="w-10 h-6 flex items-center justify-center">
                <FaStar
                  className={`w-6 h-6 transition-all duration-300 ${
                    form.isBestSeller
                      ? "text-yellow-500"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In Stock Status */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              In Stock Status
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Controls whether this product is available for purchase
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {form.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </label>
        </div>
      </div>

      {/* Warranty Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Warranty Information
        </label>
        <input
          type="text"
          name="warranty"
          value={form.warranty}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          placeholder="e.g., 2 years manufacturer warranty"
        />
      </div>
    </motion.div>
  );
};

export default Inventory;
