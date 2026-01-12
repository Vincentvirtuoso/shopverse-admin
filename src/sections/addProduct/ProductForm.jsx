import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTag,
  FiPercent,
  FiLayers,
  FiPlus,
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiSave,
  FiTrash2,
  FiInfo,
  FiCheck,
  FiPackage,
  FiChevronDown,
  FiArrowDown,
} from "react-icons/fi";
import { FaNairaSign, FaStar } from "react-icons/fa6";
import { LuRefreshCcw } from "react-icons/lu";
import { useProductForm } from "../../hooks/useProduct";
import WrapperHeader from "../../components/common/WrapperHeader";
import CardWrapper from "../../components/ui/CardWrapper";
import {
  weightUnitOptions,
  dimensionUnitOptions,
  unitOptions,
  sections,
} from "../../assets/addProducts";
import Inventory from "./steps/Inventory";
import ScrollToTop from "../../components/common/ScrollToTop";
import MediaUploadSection from "./steps/MediaUploadSection";
import MultiInput from "../../components/common/MultiInput";

const getErrorMessage = (errors) => {
  if (!errors || typeof errors !== "object") return "";

  return Object.values(errors).join("\n");
};

const ProductForm = ({
  loading,
  onSubmit,
  initialData = null,
  setNotification,
  isEdit = false,
}) => {
  const [activeSection, setActiveSection] = useState("basic");

  const {
    form,
    setForm,
    errors,
    keywordInput,
    setKeywordInput,
    handleChange,
    addTag,
    removeTag,
    addFeature,
    removeFeature,
    addKeyword,
    removeKeyword,
    addVariant,
    updateVariant,
    removeVariant,
    resetForm,
    validateForm,
    mainImage,
    setAdditionalImages,
    setMainImage,
    additionalImages,
  } = useProductForm(initialData);

  const currentIndex = sections.findIndex((s) => s.id === activeSection);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(null, true)) return;

    if (!mainImage || !mainImage[0]) {
      alert("Please select a main image!");
      return;
    }

    const formData = new FormData();

    const productJson = { ...form };
    delete productJson.image;
    delete productJson.images;
    delete productJson.id;

    Object.keys(productJson).forEach((key) => {
      if (
        productJson[key] === "" ||
        productJson[key] === null ||
        (Array.isArray(productJson[key]) && productJson[key].length === 0)
      ) {
        delete productJson[key];
      }
    });

    if (productJson.shippingInfo) {
      delete productJson.shippingInfo.weight;
      delete productJson.shippingInfo.dimensions;
    }

    formData.append("product", JSON.stringify(productJson));
    formData.append("mainImage", mainImage[0]);

    if (additionalImages && additionalImages.length > 0) {
      additionalImages.forEach((img) => {
        if (img instanceof File) formData.append("additionalImages", img);
      });
    }

    onSubmit({ formData, setActiveSection, resetForm });
  };
  const renderSection = () => {
    switch (activeSection) {
      case "basic":
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

      case "pricing":
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
                      ((form.originalPrice - form.price) / form.originalPrice) *
                        100
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    Selling Price *
                    <span className="inline-flex items-center justify-center w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Required
                  </span>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaNairaSign
                      className={`w-5 h-5 ${
                        errors.price
                          ? "text-red-500"
                          : "text-gray-400 group-focus-within:text-red-500 transition-colors"
                      }`}
                    />
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                      errors.price
                        ? "border-red-500 bg-red-50/50 dark:bg-red-900/10"
                        : "border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700/50"
                    } 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
            focus:ring-2 focus:ring-red-500/40 focus:border-red-500
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-all duration-200`}
                    placeholder="0.00"
                    aria-invalid={!!errors.price}
                    aria-describedby={errors.price ? "price-error" : undefined}
                  />
                </div>

                {errors.price && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="price-error"
                    className="flex items-start space-x-2 text-sm text-red-600 dark:text-red-400"
                  >
                    <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{errors.price}</span>
                  </motion.div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This is the price customers will pay
                </p>
              </div>

              {/* Original Price */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Original Price
                  </label>
                  {form.originalPrice > form.price && (
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                      Discount Active
                    </span>
                  )}
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaNairaSign className="w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="number"
                    name="originalPrice"
                    value={form.originalPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                      errors.originalPrice
                        ? "border-red-500 bg-red-50/50 dark:bg-red-900/10"
                        : "border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700/50"
                    } 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
            focus:ring-2 focus:ring-red-500/40 focus:border-red-500
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-all duration-200`}
                    placeholder="0.00"
                    aria-describedby={
                      errors.originalPrice ? "original-price-error" : undefined
                    }
                  />
                </div>

                {errors.originalPrice && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="original-price-error"
                    className="flex items-start space-x-2 text-sm text-red-600 dark:text-red-400"
                  >
                    <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{errors.originalPrice}</span>
                  </motion.div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Original price before discount (optional)
                </p>
              </div>

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
            {form.originalPrice &&
              form.price &&
              form.originalPrice > form.price && (
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
        border border-red-200/50 dark:border-red-900/30 backdrop-blur-sm"
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
                                  100
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
                                { minimumFractionDigits: 2 }
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
                          {parseFloat(form.originalPrice).toLocaleString(
                            "en-NG",
                            { minimumFractionDigits: 2 }
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <FiArrowDown className="w-3 h-3 inline mr-1 text-red-500" />
                          {Math.round(
                            ((form.originalPrice - form.price) /
                              form.originalPrice) *
                              100
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
                          {Math.round((form.price / form.originalPrice) * 100)}%
                          of original
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (form.price / form.originalPrice) * 100
                            }%`,
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
                      Set original price to show discount percentage to
                      customers
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="w-3 h-3 text-green-500" />
                      Use appropriate units for accurate inventory management
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="w-3 h-3 text-green-500" />
                      Regular price validations ensure accurate financial
                      tracking
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "inventory":
        return (
          <Inventory
            form={form}
            handleChange={handleChange}
            setForm={setForm}
          />
        );

      case "media":
        return (
          <MediaUploadSection
            mainImage={mainImage}
            setAdditionalImages={setAdditionalImages}
            setMainImage={setMainImage}
            additionalImages={additionalImages}
          />
        );

      case "attributes":
        return (
          <motion.div
            key="attributes"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <MultiInput
              label="Product Tags"
              name="tags"
              value={form.tags}
              addItem={addTag}
              removeItem={removeTag}
              placeholder="Add tags (comma-separated)..."
              mode="comma-separated"
              allowModeSwitch={true}
              maxItems={15}
              minItems={0}
              maxLength={30}
              minLength={2}
              helperText="Tags help customers find your product. Use comma-separated values for bulk entry."
              suggestions={[
                "electronics",
                "gadget",
                "tech",
                "innovative",
                "bestseller",
                "new-arrival",
              ]}
              icon="tag"
              allowDuplicates={false}
              styling={{
                primaryColor: "purple",
                numberBadgeGradient: "from-purple-500 to-purple-600",
              }}
            />

            <MultiInput
              label="Product Features"
              name="features"
              value={form.features}
              addItem={addFeature}
              removeItem={removeFeature}
              placeholder="Enter a product feature..."
              mode="individual"
              allowModeSwitch={true}
              maxItems={8}
              minItems={3}
              maxLength={100}
              helperText="Add 3-8 key features that highlight your product's main benefits"
              suggestions={[
                "Long battery life",
                "Water resistant",
                "Easy to use",
                "Premium materials",
                "Fast charging",
                "Lightweight design",
                "Durable construction",
                "Energy efficient",
              ]}
              required={true}
              icon="list"
              styling={{
                primaryColor: "blue",
                numberBadgeGradient: "from-blue-500 to-blue-600",
              }}
            />
          </motion.div>
        );

      case "shipping":
        return (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weight
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="number"
                      name="weight.value"
                      value={form.weight.value}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Weight value"
                    />
                  </div>
                  <div>
                    <select
                      name="weight.unit"
                      value={form.weight.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {weightUnitOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dimensions
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="number"
                        name="dimensions.length"
                        value={form.dimensions.length}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-red-500 focus:border-transparent"
                        placeholder="L"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Length
                      </p>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="dimensions.width"
                        value={form.dimensions.width}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-red-500 focus:border-transparent"
                        placeholder="W"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Width
                      </p>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="dimensions.height"
                        value={form.dimensions.height}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-red-500 focus:border-transparent "
                        placeholder="H"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Height
                      </p>
                    </div>
                  </div>
                  <div>
                    <select
                      name="dimensions.unit"
                      value={form.dimensions.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {dimensionUnitOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shipping Class
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: "Standard",
                    value: "Standard",
                    color: "from-gray-500 to-gray-600",
                  },
                  {
                    label: "Express",
                    value: "Express",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    label: "Free Shipping",
                    value: "Free Shipping",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    label: "Heavy Item",
                    value: "Heavy Item",
                    color: "from-amber-500 to-orange-500",
                  },
                  {
                    label: "Fragile",
                    value: "Fragile",
                    color: "from-red-500 to-pink-500",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        shippingInfo: {
                          ...form.shippingInfo,
                          shippingClass: option.value,
                        },
                      })
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
              ${
                form.shippingInfo.shippingClass === option.value
                  ? `bg-linear-to-r ${option.color} text-white shadow-lg`
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
                  >
                    {option.label}
                    {form.shippingInfo.shippingClass === option.value && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "seo":
        return (
          <motion.div
            key="seo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                name="meta.title"
                value={form.meta.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Optimized title for search engines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SEO Description
              </label>
              <textarea
                name="meta.description"
                value={form.meta.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Meta description for search results"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {form.meta.description.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Keywords
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addKeyword())
                  }
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter SEO keywords"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence>
                {form.meta.keywords && form.meta.keywords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {form.meta.keywords.map((keyword, index) => (
                      <motion.div
                        key={keyword + "-" + index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 
                          text-purple-800 dark:text-purple-300"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case "variants":
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-linear-to-r from-white to-gray-50 dark:from-gray-800/30 dark:to-gray-800/10 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-linear-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
                  <FiLayers className="w-5 h-5 text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    Product Variants
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full">
                      {form.variants.length} variant
                      {form.variants.length !== 1 ? "s" : ""}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
                    Create different versions of your product. Each variant can
                    have unique pricing, SKU, and inventory levels.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="px-4 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white font-medium rounded-xl 
        hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition-all duration-200 
        shadow-md hover:shadow-lg shadow-red-200/50 dark:shadow-red-900/20
        flex items-center justify-center space-x-2 min-w-[140px] group"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <FiPlus className="w-4 h-4" />
                </div>
                <span>Add Variant</span>
              </button>
            </div>

            {/* Empty State */}
            <AnimatePresence mode="wait">
              {form.variants.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12 px-6 border-2 border-dashed border-gray-200 dark:border-gray-700 
          rounded-2xl bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-800/20"
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
                    Start by adding your first variant. You can create different
                    options like sizes, colors, or materials.
                  </p>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-medium 
            bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg
            hover:from-red-600 hover:to-red-700 transition-all duration-200
            shadow-sm hover:shadow-md"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Create First Variant</span>
                  </button>
                </motion.div>
              ) : (
                /* Variants List */
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
                  bg-linear-to-br from-red-500 to-red-600 text-white font-semibold text-sm"
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
                          {/* Stock Indicator */}
                          {variant.stockCount > 0 ? (
                            <div
                              className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 
                    rounded-lg text-sm font-medium flex items-center space-x-1.5"
                            >
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                              <span>{variant.stockCount} in stock</span>
                            </div>
                          ) : (
                            <div
                              className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 
                    rounded-lg text-sm font-medium flex items-center space-x-1.5"
                            >
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span>Out of stock</span>
                            </div>
                          )}

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

                      {/* Input Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                      focus:ring-2 focus:ring-red-500/30 focus:border-red-500
                      placeholder:text-gray-400 dark:placeholder:text-gray-500
                      transition-all duration-200"
                              placeholder="e.g., Red, Large"
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
                              $
                            </div>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) =>
                                updateVariant(index, "price", e.target.value)
                              }
                              min="0"
                              step="0.01"
                              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                      focus:ring-2 focus:ring-red-500/30 focus:border-red-500
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
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) =>
                              updateVariant(index, "sku", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono
                    focus:ring-2 focus:ring-red-500/30 focus:border-red-500
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    transition-all duration-200"
                            placeholder="SHOPV-001-RED"
                          />
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
                            value={variant.stockCount}
                            onChange={(e) =>
                              updateVariant(index, "stockCount", e.target.value)
                            }
                            min="0"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                    focus:ring-2 focus:ring-red-500/30 focus:border-red-500
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    transition-all duration-200"
                            placeholder="0"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Available quantity
                          </p>
                        </div>
                      </div>

                      {/* Price Summary */}
                      {variant.price > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700/50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Variant Total Value
                            </span>
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              $
                              {parseFloat(
                                variant.price * variant.stockCount
                              ).toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      )}
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
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {form.variants.length}
                    </span>{" "}
                    variants added
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
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={addVariant}
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
                      form.variants.forEach((_, idx) => removeVariant(idx));
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <ScrollToTop shouldScroll={activeSection} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit
              ? "Update your product information and settings"
              : "Fill in the details below to add a new product to your store"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <CardWrapper className="lg:w-1/4 p-6">
            <div className="flex flex-col gap-2 sticky top-24">
              <nav className="space-y-2.5 mb-8 flex-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        activeSection === section.id
                          ? "bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{section.label}</span>
                      </div>
                      {activeSection === section.id ? (
                        <FiChevronRight className="w-4 h-4" />
                      ) : null}
                    </button>
                  );
                })}
              </nav>

              {/* Progress Indicator */}
              <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Step
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {sections.findIndex((s) => s.id === activeSection) + 1}/
                    {sections.length}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-red-500 to-red-600"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((sections.findIndex((s) => s.id === activeSection) +
                          1) /
                          sections.length) *
                        100
                      }%`,
                    }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                </div>
              </div>
            </div>
          </CardWrapper>

          {/* Main Form */}
          <CardWrapper className="lg:w-3/4">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden flex flex-col flex-1 h-full"
            >
              {/* Section Header */}
              <WrapperHeader
                padding
                showDivider
                icon={(() => {
                  const Icon =
                    sections.find((s) => s.id === activeSection)?.icon ||
                    FiInfo;
                  return (
                    <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  );
                })()}
                iconBgColor="bg-linear-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20"
                title={sections.find((s) => s.id === activeSection)?.label}
                description={
                  sections.find((s) => s.id === activeSection)?.description
                }
                descriptionClassName="text-sm"
              >
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                        rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-1 flex items-center justify-center gap-2"
                  >
                    <LuRefreshCcw />
                    Reset
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 bg-linear-to-r flex-1 from-green-500 to-emerald-600 text-white rounded-lg 
                        hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed justify-center transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>
                      {loading
                        ? "Saving..."
                        : isEdit
                        ? "Update Product"
                        : "Add Product"}
                    </span>
                  </button>
                </div>
              </WrapperHeader>

              {/* Form Content */}
              <div className="p-8 flex flex-col flex-1 gap-12">
                <div className="mb-auto">{renderSection()}</div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-5 gap-5 border-t border-gray-200 dark:border-gray-400/60">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = sections.findIndex(
                        (s) => s.id === activeSection
                      );
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1].id);
                      }
                    }}
                    disabled={activeSection === "basic"}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                      rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed 
                      transition-colors flex items-center space-x-2"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentIndex === 7 ? (
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl 
                      hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed 
                      transition-all flex items-center space-x-2"
                    >
                      <span>Submit</span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (!validateForm(currentIndex)) {
                          setNotification({
                            type: "error",
                            title: "You can't proceed to the next step",
                            message:
                              getErrorMessage(errors) ||
                              "Please check your inputs and try again.",
                          });
                          return;
                        }

                        if (currentIndex < sections.length - 1) {
                          setActiveSection(sections[currentIndex + 1].id);
                        }
                      }}
                      className="px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl 
                      hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed 
                      transition-all flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </CardWrapper>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductForm;
