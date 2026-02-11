import React, { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiEdit2,
  FiTag,
  FiPackage,
  FiStar,
  FiGrid,
  FiInfo,
  FiClock,
} from "react-icons/fi";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Rating from "../../components/ui/Rating";
import useGridColumns from "../../hooks/useGridColumns";
import { separateCamelCase } from "../../utils/helpers";
import TruncatedTextWithTooltip from "../../components/common/TruncatedTextWithTooltip";
import ProductVariants from "../../components/ui/ProductVariants";

const TagsSection = ({ selectedProduct }) => {
  const [showAllTags, setShowAllTags] = useState(false);

  if (!selectedProduct.tags || selectedProduct.tags.length === 0) {
    return null;
  }

  const tags = selectedProduct.tags;
  const visibleTags = showAllTags ? tags : tags.slice(0, 4);
  const hasMoreTags = tags.length > 4;
  const hiddenTagsCount = tags.length - 4;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <FiTag className="text-gray-400" />
          Tags
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
            ({tags.length})
          </span>
        </h3>

        {hasMoreTags && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 
                     hover:text-blue-700 dark:hover:text-blue-300 font-medium 
                     hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 rounded-lg 
                     transition-colors"
          >
            {showAllTags ? (
              <>
                <FiChevronUp size={14} />
                Show Less
              </>
            ) : (
              <>
                <FiChevronDown size={14} />
                Show More
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-linear-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium border border-red-100 dark:border-red-800/30 hover:scale-105 transition-transform duration-200 cursor-default"
          >
            {tag}
          </span>
        ))}

        {/* Show More Indicator */}
        {!showAllTags && hasMoreTags && hiddenTagsCount > 0 && (
          <button
            onClick={() => setShowAllTags(true)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 
                     text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium
                     hover:bg-gray-200 dark:hover:bg-gray-700 
                     hover:text-gray-800 dark:hover:text-gray-300
                     border border-gray-200 dark:border-gray-700
                     transition-colors flex items-center gap-1"
          >
            <span>+{hiddenTagsCount}</span>
            <FiChevronDown size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

const ProductDetail = ({
  selectedProduct,
  getStockStatus,
  handleEditProduct,
  onClose,
}) => {
  const stockStatus = useMemo(
    () => (selectedProduct ? getStockStatus(selectedProduct) : null),
    [selectedProduct, getStockStatus],
  );

  const discountPercentage = useMemo(() => {
    if (!selectedProduct?.originalPrice || !selectedProduct?.price) return 0;
    return Math.round(
      ((selectedProduct.originalPrice - selectedProduct.price) /
        selectedProduct.originalPrice) *
        100,
    );
  }, [selectedProduct]);

  // Handle escape key press
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      } else if (event.key === "Enter" && event.ctrlKey && handleEditProduct) {
        handleEditProduct(selectedProduct);
      }
    },
    [onClose, handleEditProduct, selectedProduct],
  );

  // Close modal on background click
  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget && onClose) {
        onClose();
      }
    },
    [onClose],
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const cols = useGridColumns({
    breakpoint: "md",
    maxCol: 2,
    minCol: 1,
  });

  useBodyScrollLock(selectedProduct);

  if (!selectedProduct) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200 dark:border-neutral-700 h-[130px]">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  SKU: {selectedProduct.sku}
                </span>
                {selectedProduct.isBestSeller && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                    <FiStar size={10} /> Best Seller
                  </span>
                )}
              </div>
              <h2
                id="product-modal-title"
                className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate"
              >
                {selectedProduct.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {selectedProduct.brand}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Close modal"
            >
              <FiX size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(95vh-240px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden h-[400px] ">
                  <img
                    src={
                      selectedProduct.image ||
                      selectedProduct.images?.[0] ||
                      "/api/placeholder/400/400"
                    }
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain main-product-image transition-transform hover:scale-105 duration-300"
                    loading="lazy"
                  />
                  {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white font-bold rounded-full text-sm">
                      -{discountPercentage}%
                    </div>
                  )}
                </div>

                {selectedProduct.images &&
                  selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {selectedProduct.images.slice(0, 4).map((img, index) => (
                        <button
                          key={index}
                          className="relative rounded-lg overflow-hidden aspect-square focus:outline-none focus:ring-2 focus:ring-red-500"
                          onClick={() => {
                            const imgElement = document.querySelector(
                              ".main-product-image",
                            );
                            if (imgElement) {
                              imgElement.src = img;
                            }
                          }}
                        >
                          <img
                            src={img}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                          {index === 3 && selectedProduct.images.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium">
                              +{selectedProduct.images.length - 4}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Price & Rating */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                          ₦{selectedProduct.price?.toLocaleString() || "0"}
                        </span>
                        {selectedProduct.originalPrice >
                          selectedProduct.price && (
                          <span className="text-lg text-gray-400 line-through">
                            ₦{selectedProduct.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span>includes VAT</span>
                    </div>
                    <Rating selectedProduct={selectedProduct} />
                  </div>
                </div>

                {/* Stock & Availability */}
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-gray-500" />
                      <span className="font-semibold">Availability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          stockStatus?.color.includes("green")
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium">{stockStatus?.label}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">In stock</span>
                      <span className="font-medium">
                        {selectedProduct.stockCount || 0}{" "}
                        {selectedProduct.unit || "units"}
                      </span>
                    </div>
                    {selectedProduct.isNewArrival && (
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <FiClock size={14} />
                        <span className="text-sm font-medium">New Arrival</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <FiInfo /> Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedProduct.description || "No description available"}
                  </p>
                </div>

                {/* Category & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <FiGrid /> Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                        {selectedProduct.category}
                      </span>
                      {selectedProduct.subCategory && (
                        <span className="px-3 py-1.5 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm">
                          {selectedProduct.subCategory}
                        </span>
                      )}
                    </div>
                  </div>

                  <TagsSection selectedProduct={selectedProduct} />
                </div>
              </div>
            </div>

            <ProductVariants variants={selectedProduct.variants || []} />
            {/* Specifications */}
            {selectedProduct.specifications &&
              Object.keys(selectedProduct.specifications).length > 0 && (
                <div className="mt-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Specifications
                  </h3>
                  <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-gray-200 dark:border-neutral-700 rounded-lg">
                      {Object.entries(selectedProduct.specifications).map(
                        ([key = "", value], index) => {
                          const row = Math.floor(index / cols);
                          return (
                            <div
                              key={index}
                              className={`flex justify-between py-4 border-b border-gray-200 dark:border-neutral-700 last:border-0 ${
                                row % 2 === 0
                                  ? "bg-gray-50 dark:bg-neutral-800/50"
                                  : ""
                              } px-3 gap-6`}
                            >
                              <span className="text-gray-500 dark:text-gray-400 capitalize">
                                {separateCamelCase(key)}
                              </span>
                              <TruncatedTextWithTooltip value={value} />
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50 h-[110px]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {selectedProduct.lastUpdated || "Recently"}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  handleEditProduct(selectedProduct);
                }}
                className="flex items-center gap-2 px-6 py-3 text-xs bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                <FiEdit2 size={18} />
                Edit Product
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(ProductDetail);
