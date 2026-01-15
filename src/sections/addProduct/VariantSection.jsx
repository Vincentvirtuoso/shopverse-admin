import { generateSKU } from "../../assets/addProducts";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLayers,
  FiPlus,
  FiTrash2,
  FiX,
  FiKey,
  FiType,
  FiCheck,
  FiTag,
} from "react-icons/fi";
import { LuBolt } from "react-icons/lu";
import { useState, useCallback } from "react";
import { MdBolt } from "react-icons/md";

const VariantSection = ({ form, addVariant, removeVariant, updateVariant }) => {
  const [activeAttributeEditors, setActiveAttributeEditors] = useState({});

  const safeToMap = (value) => {
    if (!value) return new Map();
    if (value instanceof Map) return new Map(value);
    if (Array.isArray(value)) return new Map(value);
    if (typeof value === "object") return new Map(Object.entries(value));
    return new Map();
  };

  const handleAttributeChange = useCallback(
    (variantIndex, key, value) => {
      const variant = form.variants[variantIndex];
      const newAttributes = safeToMap(variant.attributes);

      if (value.trim() === "") {
        newAttributes.delete(key);
      } else {
        newAttributes.set(key.trim(), value.trim());
      }

      updateVariant(variantIndex, "attributes", newAttributes);
    },
    [form.variants, updateVariant]
  );

  const toggleAttributeEditor = useCallback((index) => {
    setActiveAttributeEditors((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const addEmptyVariant = () => {
    addVariant({
      name: "",
      price: form.price || 0,
      sku: "",
      stockCount: 0,
      attributes: new Map(),
    });
  };

  return (
    <motion.div
      key="variants"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Product Variants
            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full">
              {form.variants.length} variant
              {form.variants.length !== 1 ? "s" : ""}
            </span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
            Create different versions of your product. Each variant can have
            unique pricing, SKU, inventory, and attributes.
          </p>
        </div>

        <button
          type="button"
          onClick={addEmptyVariant}
          className="px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl 
          hover:bg-red-600 active:scale-[0.98] transition-all duration-200 
          shadow-md hover:shadow-lg shadow-red-200/50 dark:shadow-red-900/20
          flex items-center justify-center space-x-2 min-w-[140px] group"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Variant</span>
        </button>
      </div>

      {/* Variants List */}
      <AnimatePresence mode="wait">
        {form.variants.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12 px-6 border-2 border-dashed border-gray-200 dark:border-gray-700 
            rounded-2xl bg-linear-to-b from-gray-50/50 to-transparent dark:from-gray-800/20"
          >
            <div className="relative inline-block mb-5">
              <div className="absolute inset-0 bg-linear-to-r from-red-500/10 to-pink-500/10 blur-xl rounded-full"></div>
              <div className="relative p-4 bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm">
                <FiLayers className="w-16 h-16 text-gray-300 dark:text-gray-700" />
              </div>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No variants yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Create product variants for different sizes, colors, materials, or
              specifications. Each variant can have unique pricing, SKU, and
              inventory.
            </p>
            <button
              type="button"
              onClick={addEmptyVariant}
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-medium 
              bg-linear-to-r from-red-500 to-pink-500 text-white rounded-lg
              hover:from-red-600 hover:to-pink-600 transition-all duration-200
              shadow-sm hover:shadow-md"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create First Variant</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="variants-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {form.variants.map((variant, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="group relative p-5 border border-gray-200 dark:border-gray-700/50 
                rounded-2xl bg-white dark:bg-gray-800/30 backdrop-blur-sm
                hover:border-red-200 dark:hover:border-red-900/50
                hover:shadow-lg hover:shadow-red-50/50 dark:hover:shadow-red-900/5
                transition-all duration-300"
              >
                {/* Variant Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg 
                    bg-linear-to-br from-red-500 to-pink-500 text-white font-semibold text-sm"
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {variant.name || `Variant ${index + 1}`}
                        {variant.name && (
                          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                            (Variant {index + 1})
                          </span>
                        )}
                      </h4>
                      {variant.sku && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                          SKU: {variant.sku}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Attributes Badge */}
                    {variant.attributes && variant.attributes.size > 0 && (
                      <div
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 
                      rounded-lg text-sm font-medium flex items-center space-x-1.5"
                      >
                        <FiTag className="w-3 h-3" />
                        <span>{variant.attributes.size} attributes</span>
                      </div>
                    )}

                    {/* Stock Indicator */}
                    <div
                      className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1.5
                      ${
                        variant.stockCount > 0
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          variant.stockCount > 0
                            ? "bg-green-500 animate-pulse"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span>
                        {variant.stockCount > 0
                          ? `${variant.stockCount} in stock`
                          : "Out of stock"}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 
                      hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200
                      group/delete"
                      title="Delete variant"
                    >
                      <FiTrash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Main Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Variant Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(index, "name", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        transition-all duration-200"
                        placeholder="e.g., Red Cotton - Large"
                        required
                      />
                      {!variant.name && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Customer-facing name
                    </p>
                  </div>

                  {/* Price Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Price
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        ₦
                      </div>
                      <input
                        type="number"
                        value={variant.price || ""}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min="0"
                        step="0.01"
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                        transition-all duration-200"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Individual variant price
                    </p>
                  </div>

                  {/* SKU Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      SKU Code
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={variant.sku || ""}
                        onChange={(e) =>
                          updateVariant(index, "sku", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono
                        placeholder:text-gray-400 rounded-r-none border-r-0 dark:placeholder:text-gray-500 transition-all duration-200"
                        placeholder="PROD-RED-001"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateVariant(
                            index,
                            "sku",
                            generateSKU({
                              isVariant: true,
                              title: variant.name,
                              attributes: variant.attributes,
                            })
                          )
                        }
                        className="p-3 rounded-l-none rounded-xl border border-red-500 border-l-0 bg-red-500  text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                      >
                        <MdBolt size={20} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Unique stock identifier
                    </p>
                  </div>

                  {/* Stock Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Stock Level
                    </label>
                    <input
                      type="number"
                      value={variant.stockCount || ""}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "stockCount",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                      placeholder:text-gray-400 dark:placeholder:text-gray-500
                      transition-all duration-200"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Available quantity
                    </p>
                  </div>
                </div>

                {/* Attributes Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FiTag className="w-4 h-4 text-gray-400" />
                      Variant Attributes
                    </label>

                    <button
                      type="button"
                      onClick={() => toggleAttributeEditor(index)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 
                      hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 
                      rounded-lg transition-colors flex items-center gap-2"
                    >
                      {activeAttributeEditors[index] ? (
                        <FiX className="w-4 h-4" />
                      ) : (
                        <FiPlus className="w-4 h-4" />
                      )}
                      {activeAttributeEditors[index] ? "Close" : "Add"}
                    </button>
                  </div>

                  {/* Attribute Editor */}
                  <AnimatePresence>
                    {activeAttributeEditors[index] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <FiKey className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id={`attr-key-${index}`}
                              placeholder="Attribute (e.g., Color)"
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                              focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <FiType className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id={`attr-value-${index}`}
                              placeholder="Value (e.g., Red)"
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                              focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const keyInput = document.getElementById(
                                    `attr-key-${index}`
                                  );
                                  const valueInput = document.getElementById(
                                    `attr-value-${index}`
                                  );
                                  if (
                                    keyInput.value.trim() &&
                                    valueInput.value.trim()
                                  ) {
                                    handleAttributeChange(
                                      index,
                                      keyInput.value,
                                      valueInput.value
                                    );
                                    keyInput.value = "";
                                    valueInput.value = "";
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Attributes Display */}
                  {variant.attributes && variant.attributes.size > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(variant.attributes.entries()).map(
                        ([key, value], attrIndex) => (
                          <div
                            key={attrIndex}
                            className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-red-50 to-pink-50 
                          dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-100 dark:border-red-800/30"
                          >
                            <span className="text-sm font-medium text-red-700 dark:text-red-300">
                              {key}:
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {value}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newAttributes = new Map(
                                  variant.attributes
                                );
                                newAttributes.delete(key);
                                updateVariant(
                                  index,
                                  "attributes",
                                  newAttributes
                                );
                              }}
                              className="ml-1 p-0.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 px-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                      <p className="text-gray-500 dark:text-gray-400">
                        No attributes added. Add attributes like color, size,
                        etc.
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-5 border-t border-gray-100 dark:border-gray-700/50 space-y-3"
                >
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Variant Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Price per unit
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₦{parseFloat(variant.price || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Stock value
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₦
                        {parseFloat(
                          (variant.price || 0) * (variant.stockCount || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Attributes
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {variant.attributes?.size || 0} set
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions Footer */}
      {form.variants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 p-4 bg-linear-to-r from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-800/10 rounded-2xl border border-gray-100 dark:border-gray-700/50"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {form.variants.length}
              </span>{" "}
              variants
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total stock:{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {form.variants.reduce(
                  (sum, v) => sum + (parseInt(v.stockCount) || 0),
                  0
                )}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total value:{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                ₦
                {form.variants
                  .reduce(
                    (sum, v) =>
                      sum +
                      (parseFloat(v.price) || 0) *
                        (parseInt(v.stockCount) || 0),
                    0
                  )
                  .toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={addEmptyVariant}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 
              hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 
              rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Another</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to remove all variants?"
                  )
                ) {
                  while (form.variants.length > 0) {
                    removeVariant(0);
                  }
                }
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 
              hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
              rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VariantSection;
