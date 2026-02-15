import React from "react";
import { motion } from "framer-motion";
import CategorySelector from "../../categories/CategorySelector";
import DynamicMetaFields from "../../categories/DynamicMetaFields";

const BasicInfo = ({
  form,
  errors,
  handleChange,
  onCategoryChange,
  selectedCategory,
  onMetaFieldChange,
}) => {
  const inputBase =
    "w-full px-4 py-3 rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-600 dark:text-neutral-400 ml-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className={`${inputBase} ${errors.name ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"}`}
            placeholder="e.g. iPhone 15 Pro Max"
          />
          {errors.name && (
            <p className="text-xs text-red-500 ml-1">{errors.name}</p>
          )}
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-neutral-600 dark:text-neutral-400 ml-1">
            Brand{" "}
            <span className="text-neutral-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            name="brand"
            value={form.brand || ""}
            onChange={handleChange}
            className={`${inputBase} ${errors.brand ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"}`}
            placeholder="e.g. Apple"
          />
        </div>

        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          errors={errors}
        />

        {/* Dynamic Meta Fields Wrapper */}
        <div className="md:col-span-2">
          {selectedCategory && (
            <DynamicMetaFields
              category={selectedCategory}
              values={form.metaFields || {}}
              onChange={onMetaFieldChange}
              errors={errors}
            />
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-neutral-600 dark:text-neutral-400 ml-1">
          Product Description
        </label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          rows={5}
          className={`${inputBase} resize-none ${errors.description ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"}`}
          placeholder="Write a compelling description..."
        />
      </div>
    </motion.div>
  );
};

export default BasicInfo;
