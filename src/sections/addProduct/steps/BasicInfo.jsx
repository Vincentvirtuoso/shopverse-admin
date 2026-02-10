import React from "react";
import { motion } from "framer-motion";

const BasicInfo = ({ form, errors, handleChange }) => {
  return (
    <motion.div
      key="basic"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand *
          </label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.brand
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
            placeholder="Enter brand name"
          />
          {errors.brand && (
            <motion.p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.brand}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.category
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
            placeholder="e.g., Electronics, Clothing"
          />
          {errors.category && (
            <motion.p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.category}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sub Category
          </label>
          <input
            type="text"
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="e.g., Headphones, T-Shirts"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.description
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
          placeholder="Describe your product in detail..."
        />
        {errors.description && (
          <motion.p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default BasicInfo;
