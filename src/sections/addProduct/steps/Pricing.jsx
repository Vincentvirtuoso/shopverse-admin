import React from "react";
import {
  FiTag,
  FiPercent,
  FiInfo,
  FiCheck,
  FiPackage,
  FiChevronDown,
  FiArrowDown,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { unitOptions } from "../../../assets/addProducts";
import PriceInput from "../../../components/common/PriceInput";

const Pricing = ({ form, errors, handleChange }) => {
  return (
    <motion.div
      key="pricing"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-linear-to-r from-white to-gray-50 dark:from-gray-800/30 dark:to-gray-800/10 rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-linear-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
            <FiTag className="w-5 h-5 text-red-500 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              Pricing & Unit Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
              Set your product's pricing strategy and measurement unit for
              accurate inventory tracking.
            </p>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="flex items-center space-x-4">
          {form.originalPrice > form.price && (
            <div className="px-3 py-1.5 bg-linear-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg">
              -
              {Math.round(
                ((form.originalPrice - form.price) / form.originalPrice) * 100,
              )}
              %
            </div>
          )}
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Selling Price
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ₦
              {parseFloat(form.price || 0).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Price */}
        <PriceInput
          value={form.price}
          onChange={handleChange}
          error={errors.price}
          name="price"
          required
        />
        <PriceInput
          label="Original Price"
          value={form.originalPrice}
          onChange={handleChange}
          error={errors.originalPrice}
          name="originalPrice"
          // currency="USD"
          step={0.01}
          min={0}
          max={1000000}
          description="The original price before discount"
        />

        {/* Unit Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Measurement Unit
          </label>

          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiPackage className="w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3.5 appearance-none rounded-xl border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
            focus:ring-2 focus:ring-red-500/40 focus:border-red-500
            hover:border-red-300 dark:hover:border-red-700/50
            transition-all duration-200 cursor-pointer"
            >
              <option value="" className="text-gray-400">
                Select a unit
              </option>
              {unitOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-gray-900 dark:text-gray-100"
                >
                  {option.label}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              How this product is measured/sold
            </p>
            {form.unit && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                <FiCheck className="w-3 h-3 mr-1" />
                Selected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Discount Banner - Enhanced */}
      {form.originalPrice && form.price && form.originalPrice > form.price && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-red-500/10 via-red-500/5 to-transparent"></div>

          <div
            className="relative p-6 bg-linear-to-r from-white to-gray-50/80 dark:from-gray-800/60 dark:to-gray-900/60 
        border border-red-200/50 dark:border-red-900/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="">
              {/* Left Section */}
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-red-500 to-red-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative p-3 bg-linear-to-br from-red-500 to-red-600 rounded-xl">
                    <FiPercent className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Discount Applied! 🎉
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customers will see this as a great deal
                  </p>
                </div>
              </div>

              <div className="flex-1 mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {Math.round(
                        ((form.originalPrice - form.price) /
                          form.originalPrice) *
                          100,
                      )}
                      %
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Discount Rate
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₦
                      {(form.originalPrice - form.price).toLocaleString(
                        "en-NG",
                        { minimumFractionDigits: 2 },
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Amount Saved
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ₦
                      {parseFloat(form.price).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Final Price
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Original Price */}
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Original Price
                </div>
                <div className="text-xl font-bold text-gray-400 dark:text-gray-500 line-through">
                  ₦
                  {parseFloat(form.originalPrice).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <FiArrowDown className="w-3 h-3 inline mr-1 text-red-500" />
                  {Math.round(
                    ((form.originalPrice - form.price) / form.originalPrice) *
                      100,
                  )}
                  % lower
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Price Reduction</span>
                <span>
                  {Math.round((form.price / form.originalPrice) * 100)}% of
                  original
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(form.price / form.originalPrice) * 100}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-red-500 to-red-600 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Help */}
      <div className="p-4 bg-linear-to-r from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-800/10 rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-start space-x-3">
          <FiInfo className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Pricing Tips
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <FiCheck className="w-3 h-3 text-green-500" />
                Set original price to show discount percentage to customers
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="w-3 h-3 text-green-500" />
                Use appropriate units for accurate inventory management
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="w-3 h-3 text-green-500" />
                Regular price validations ensure accurate financial tracking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Pricing;
