import React, { useState, useCallback } from "react";
import {
  LuUpload as Upload,
  LuCircleAlert as AlertCircle,
  LuCheck as Check,
  LuX as X,
  LuCircleHelp as HelpCircle,
  LuEye as Eye,
  LuList as List,
  LuArrowLeft as ArrowLeft,
  LuSave as Save,
} from "react-icons/lu";
import { FiEdit as Edit } from "react-icons/fi";

const BulkProductUpload = ({
  onUpload,
  isLoading = false,
  onProductSelect,
  selectedProductIndex,
  onBackToList,
  isEditMode = false,
}) => {
  const [jsonInput, setJsonInput] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [bulkProducts, setBulkProducts] = useState([]); // Store all parsed products

  // Sample template for reference
  const sampleTemplate = `[
  {
    "name": "Premium Wireless Headphones",
    "brand": "SoundMax",
    "price": 129.99,
    "originalPrice": 199.99,
    "description": "High-quality wireless headphones with noise cancellation",
    "image": "https://example.com/images/headphones.jpg",
    "category": "Electronics",
    "subCategory": "Audio",
    "stockCount": 50,
    "unit": "piece",
    "tags": ["wireless", "noise-cancelling", "bluetooth"],
    "sku": "SM-WH-001",
    "features": ["40hr battery", "Noise cancellation", "Water resistant"],
    "specifications": {
      "batteryLife": "40 hours",
      "connectivity": "Bluetooth 5.2"
    },
    "variants": [
      {
        "name": "Black",
        "price": 129.99,
        "sku": "SM-WH-001-BLK",
        "stockCount": 25,
        "attributes": {
          "color": "black"
        }
      }
    ]
  },
  {
    "name": "Gaming Mouse RGB",
    "brand": "GameTech",
    "price": 59.99,
    "description": "Ergonomic gaming mouse with customizable RGB lighting",
    "image": "https://example.com/images/mouse.jpg",
    "category": "Electronics",
    "subCategory": "Gaming",
    "stockCount": 100,
    "unit": "piece",
    "tags": ["gaming", "rgb", "wireless"],
    "sku": "GT-MOUSE-001"
  }
]`;

  const validateProduct = useCallback((product, index) => {
    const errors = [];

    // Required fields validation
    const requiredFields = [
      "name",
      "brand",
      "price",
      "description",
      "image",
      "category",
    ];
    requiredFields.forEach((field) => {
      if (!product[field]) {
        errors.push(`Product ${index + 1}: ${field} is required`);
      }
    });

    // Numeric validations
    if (product.price !== undefined && product.price < 0) {
      errors.push(`Product ${index + 1}: Price must be non-negative`);
    }

    if (product.originalPrice !== undefined && product.originalPrice < 0) {
      errors.push(`Product ${index + 1}: Original price must be non-negative`);
    }

    if (product.originalPrice && product.price > product.originalPrice) {
      errors.push(
        `Product ${index + 1}: Price cannot be greater than original price`,
      );
    }

    if (
      product.discount !== undefined &&
      (product.discount < 0 || product.discount > 100)
    ) {
      errors.push(`Product ${index + 1}: Discount must be between 0 and 100`);
    }

    if (product.stockCount !== undefined && product.stockCount < 0) {
      errors.push(`Product ${index + 1}: Stock count cannot be negative`);
    }

    // Image URL validation
    const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|avif)$/i;
    if (product.image && !imageUrlRegex.test(product.image)) {
      errors.push(`Product ${index + 1}: Invalid image URL format`);
    }

    // Variants validation
    if (product.variants) {
      if (!Array.isArray(product.variants)) {
        errors.push(`Product ${index + 1}: Variants must be an array`);
      } else {
        product.variants.forEach((variant, variantIndex) => {
          if (!variant.name) {
            errors.push(
              `Product ${index + 1}, Variant ${variantIndex + 1}: Name is required`,
            );
          }
          if (variant.price !== undefined && variant.price < 0) {
            errors.push(
              `Product ${index + 1}, Variant ${variantIndex + 1}: Price must be non-negative`,
            );
          }
          if (variant.stockCount !== undefined && variant.stockCount < 0) {
            errors.push(
              `Product ${index + 1}, Variant ${variantIndex + 1}: Stock count cannot be negative`,
            );
          }
        });
      }
    }

    return errors;
  }, []);

  const handleJsonChange = useCallback(
    (e) => {
      const value = e.target.value;
      setJsonInput(value);

      if (!value.trim()) {
        setValidationErrors([]);
        setPreviewData([]);
        setBulkProducts([]);
        return;
      }

      try {
        setIsValidating(true);
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
          setValidationErrors(["Input must be a JSON array of products"]);
          setPreviewData([]);
          setBulkProducts([]);
          return;
        }

        const errors = [];
        const preview = [];
        const validProducts = [];

        parsed.forEach((product, index) => {
          const productErrors = validateProduct(product, index);
          errors.push(...productErrors);

          // Store the complete product object
          validProducts.push({
            ...product,
            _id: `bulk-${Date.now()}-${index}`, // Temporary ID
            _index: index,
          });

          // Create preview object
          preview.push({
            name: product.name || `Product ${index + 1}`,
            brand: product.brand || "N/A",
            price: product.price || 0,
            category: product.category || "N/A",
            stockCount: product.stockCount || 0,
            sku: product.sku || "N/A",
            variantCount: product.variants?.length || 0,
            hasErrors: productErrors.length > 0,
            _index: index,
          });
        });

        setValidationErrors(errors);
        setPreviewData(preview);
        setBulkProducts(validProducts);
      } catch (error) {
        setValidationErrors([`Invalid JSON: ${error.message}`]);
        setPreviewData([]);
        setBulkProducts([]);
      } finally {
        setIsValidating(false);
      }
    },
    [validateProduct],
  );

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonInput(event.target.result);
        handleJsonChange({ target: { value: event.target.result } });
      };
      reader.readAsText(file);
    },
    [handleJsonChange],
  );

  // Update a product in the bulk array
  // const updateProductInBulk = useCallback((index, updatedProduct) => {
  //   setBulkProducts((prev) => {
  //     const updated = [...prev];
  //     updated[index] = {
  //       ...updated[index],
  //       ...updatedProduct,
  //       _index: index, // Ensure index is preserved
  //     };
  //     return updated;
  //   });

  //   // Also update preview data
  //   setPreviewData((prev) => {
  //     const updated = [...prev];
  //     updated[index] = {
  //       ...updated[index],
  //       name: updatedProduct.name || updated[index].name,
  //       brand: updatedProduct.brand || updated[index].brand,
  //       price: updatedProduct.price || updated[index].price,
  //       category: updatedProduct.category || updated[index].category,
  //       stockCount: updatedProduct.stockCount || updated[index].stockCount,
  //       sku: updatedProduct.sku || updated[index].sku,
  //       variantCount:
  //         updatedProduct.variants?.length || updated[index].variantCount,
  //     };
  //     return updated;
  //   });

  //   // Update JSON input to reflect changes
  //   setJsonInput((prev) => {
  //     try {
  //       const parsed = JSON.parse(prev);
  //       parsed[index] = {
  //         ...parsed[index],
  //         ...updatedProduct,
  //       };
  //       // Clean up temporary fields
  //       delete parsed[index]._id;
  //       delete parsed[index]._index;
  //       return JSON.stringify(parsed, null, 2);
  //     } catch {
  //       return prev;
  //     }
  //   });
  // }, []);

  const handleSubmit = useCallback(() => {
    if (validationErrors.length > 0) {
      alert("Please fix validation errors before uploading");
      return;
    }

    try {
      const cleanedProducts = bulkProducts.map(
        // eslint-disable-next-line no-unused-vars
        ({ _id, _index, ...rest }) => rest,
      );
      onUpload?.(cleanedProducts);
    } catch (error) {
      console.log(error);
      alert("Invalid JSON format");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonInput, validationErrors, bulkProducts, onUpload]);

  const loadSample = useCallback(() => {
    setJsonInput(sampleTemplate);
    handleJsonChange({ target: { value: sampleTemplate } });
  }, [sampleTemplate, handleJsonChange]);

  const clearAll = useCallback(() => {
    setJsonInput("");
    setValidationErrors([]);
    setPreviewData([]);
    setBulkProducts([]);
    onBackToList?.();
  }, [onBackToList]);

  // If in edit mode and product is selected, show single product view
  if (
    isEditMode &&
    selectedProductIndex !== null &&
    bulkProducts[selectedProductIndex]
  ) {
    const selectedProduct = bulkProducts[selectedProductIndex];

    return (
      <div className="space-y-6">
        {/* Header for edit mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToList}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to List
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Editing Product #{selectedProductIndex + 1}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedProduct.name || `Product ${selectedProductIndex + 1}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {selectedProductIndex + 1} of {bulkProducts.length}
            </span>
          </div>
        </div>

        {/* Product Information Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={selectedProduct.name || ""}
                  onChange={(e) =>
                    onProductSelect(selectedProductIndex, {
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={selectedProduct.brand || ""}
                  onChange={(e) =>
                    onProductSelect(selectedProductIndex, {
                      brand: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={selectedProduct.category || ""}
                  onChange={(e) =>
                    onProductSelect(selectedProductIndex, {
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={selectedProduct.sku || ""}
                  onChange={(e) =>
                    onProductSelect(selectedProductIndex, {
                      sku: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Right Column - Pricing & Stock */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={selectedProduct.price || 0}
                  onChange={(e) =>
                    onProductSelect(selectedProductIndex, {
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={selectedProduct.originalPrice || ""}
                  onChange={(e) =>
                    onProductSelect(selectedProductIndex, {
                      originalPrice: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={selectedProduct.stockCount || 0}
                  onChange={(e) =>
                    onProductSelect(selectedProductIndex, {
                      stockCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={selectedProduct.description || ""}
                  onChange={(e) =>
                    onProductSelect(selectedProductIndex, {
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Variants Section */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Variants ({selectedProduct.variants.length})
              </h3>
              <div className="space-y-3">
                {selectedProduct.variants.map((variant, variantIndex) => (
                  <div
                    key={variantIndex}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {variant.name}
                      </h4>
                      <button
                        onClick={() => {
                          const updatedVariants = [...selectedProduct.variants];
                          updatedVariants.splice(variantIndex, 1);
                          onProductSelect(selectedProductIndex, {
                            variants: updatedVariants,
                          });
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Price:{" "}
                        </span>
                        <span className="font-medium">
                          ₦{variant.price?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Stock:{" "}
                        </span>
                        <span className="font-medium">
                          {variant.stockCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation between products */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => {
                if (selectedProductIndex > 0) {
                  onProductSelect(selectedProductIndex - 1);
                }
              }}
              disabled={selectedProductIndex === 0}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Previous
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Product {selectedProductIndex + 1} of {bulkProducts.length}
              </span>
            </div>

            <button
              onClick={() => {
                if (selectedProductIndex < bulkProducts.length - 1) {
                  onProductSelect(selectedProductIndex + 1);
                }
              }}
              disabled={selectedProductIndex === bulkProducts.length - 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main bulk upload view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={loadSample}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Load Sample
        </button>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".json,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-blue-600 hover:text-blue-700">
              Click to upload
            </span>{" "}
            or drag and drop
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            JSON files only
          </p>
        </label>
      </div>

      {/* JSON Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          JSON Input
        </label>
        <textarea
          value={jsonInput}
          onChange={handleJsonChange}
          rows={12}
          className="w-full font-mono text-sm p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Paste your JSON array of products here..."
          spellCheck="false"
        />
      </div>

      {/* Validation Status */}
      {isValidating && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Validating JSON...
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-3">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">
              Validation Errors ({validationErrors.length})
            </h3>
          </div>
          <ul className="space-y-1 max-h-60 overflow-y-auto">
            {validationErrors.map((error, index) => (
              <li
                key={index}
                className="text-sm text-red-600 dark:text-red-400"
              >
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview */}
      {previewData.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Preview ({previewData.length} products)
            </h3>
            <div className="flex items-center gap-2">
              {validationErrors.length === 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">All valid</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <X className="w-4 h-4" />
                  <span className="text-sm">
                    {validationErrors.length} errors
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Variants
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {previewData.map((product, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-white dark:hover:bg-gray-800 ${
                      product.hasErrors ? "bg-red-50/50 dark:bg-red-900/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {product.brand}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      ₦{product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stockCount > 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {product.stockCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs">
                        {product.variantCount} variants
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {product.hasErrors ? (
                        <span className="flex items-center gap-1 text-red-600">
                          <X className="w-4 h-4" />
                          Errors
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          Valid
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onProductSelect?.(index)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                          title="Edit this product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onProductSelect?.(index)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={clearAll}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          disabled={isLoading}
        >
          Clear All
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {previewData.length} products ready
          </span>
          <button
            onClick={handleSubmit}
            disabled={
              validationErrors.length > 0 ||
              previewData.length === 0 ||
              isLoading
            }
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Products
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkProductUpload;
