import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiChevronRight,
  FiChevronLeft,
  FiSave,
  FiInfo,
  FiUpload,
} from "react-icons/fi";
import { LuRefreshCcw } from "react-icons/lu";
import { useProductForm } from "../../hooks/useProduct";
import WrapperHeader from "../../components/common/WrapperHeader";
import CardWrapper from "../../components/ui/CardWrapper";
import { sections } from "../../assets/addProducts";
import Inventory from "./steps/Inventory";
import ScrollToTop from "../../components/common/ScrollToTop";
import MediaUploadSection from "./steps/MediaUploadSection";
import AttributesSection from "./steps/AttributesSection";
import ShippingSection from "./steps/ShippingSection";
import VariantSection from "./VariantSection";
import BasicInfo from "./steps/BasicInfo";
import Pricing from "./steps/Pricing";
import SEO from "./steps/SEO";
import BulkProductUpload from "./BulkProductUpload";

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
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkEditIndex, setBulkEditIndex] = useState(null);
  const [bulkProducts, setBulkProducts] = useState([]);

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
    handleSpecificationsChange,
    initialForm,
    // markDirty,
    getChangedFields,
    getChangedImages,
  } = useProductForm(initialData, { isEditMode: isEdit });

  const currentIndex = sections.findIndex((s) => s.id === activeSection);

  const handleProductSelect = (index) => {
    setBulkEditIndex(index);
    if (bulkProducts[index]) {
      setForm(bulkProducts[index]);
      setActiveSection("basic");
    }
  };

  const handleBulkProductUpdate = (index, updatedData) => {
    setBulkProducts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        ...updatedData,
      };
      return updated;
    });
  };

  const handleBulkUpload = async (products) => {
    setBulkProducts(products);

    try {
      const formData = new FormData();
      formData.append("products", JSON.stringify(products));

      const response = await fetch("/api/products/bulk", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setNotification({
          type: "success",
          title: "Bulk Upload Successful",
          message: `Successfully uploaded ${products.length} products.`,
        });
        setShowBulkUpload(false);
        setBulkProducts([]);
      }
    } catch (error) {
      console.log(error);

      setNotification({
        type: "error",
        title: "Upload Failed",
        message: "Failed to upload products. Please try again.",
      });
    }
  };

  const handleSingleProductSubmit = async (e) => {
    e.preventDefault();

    if (bulkEditIndex !== null && showBulkUpload) {
      handleBulkProductUpdate(bulkEditIndex, form);

      setNotification({
        type: "success",
        title: "Product Updated",
        message: `Product ${bulkEditIndex + 1} updated in bulk list.`,
      });

      setBulkEditIndex(null);
      setShowBulkUpload(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage || !mainImage[0]) {
      setNotification({
        type: "error",
        title: "You can't proceed to the next step",
        message: "Main image is required",
      });
      return;
    }

    if (!additionalImages || additionalImages.length === 0) {
      setNotification({
        type: "error",
        title: "You can't proceed to the next step",
        message: "At least one additional product image is required",
      });
      return;
    } else if (additionalImages.length > 10) {
      setNotification({
        type: "error",
        title: "You can't proceed to the next step",
        message: "Maximum of 10 images allowed",
      });
      return;
    }

    if (!validateForm(null, true)) {
      setNotification({
        type: "error",
        title: "You can't submit",
        message:
          getErrorMessage(errors) || "Please check your inputs and try again.",
      });
      return;
    }

    const formData = new FormData();

    if (isEdit) {
      const changedFields = getChangedFields();
      const changedImages = getChangedImages();

      changedFields.id = initialForm.id;

      if (Object.keys(changedFields).length > 0) {
        formData.append("product", JSON.stringify(changedFields));
      }

      if (changedImages.mainImage instanceof File) {
        formData.append("mainImage", changedImages.mainImage);
      }

      if (changedImages.additionalImages?.length > 0) {
        changedImages.additionalImages.forEach((img) => {
          if (img instanceof File) {
            formData.append("additionalImages", img);
          }
        });
      }

      if (
        Object.keys(changedFields).length === 0 &&
        !changedImages.mainImage &&
        changedImages.additionalImages?.length === 0
      ) {
        setNotification({
          type: "info",
          title: "No Changes",
          message: "No changes detected to update.",
          duration: 3000,
        });
        return;
      }
    } else {
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

      if (mainImage[0] instanceof File) {
        formData.append("mainImage", mainImage[0]);
      }

      additionalImages.forEach((img) => {
        if (img instanceof File) {
          formData.append("additionalImages", img);
        }
      });
    }

    onSubmit({
      formData,
      setActiveSection,
      resetForm,
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "basic":
        return (
          <BasicInfo form={form} errors={errors} handleChange={handleChange} />
        );

      case "pricing":
        return (
          <Pricing form={form} errors={errors} handleChange={handleChange} />
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
            additionalImages={additionalImages}
            setMainImage={setMainImage}
            setAdditionalImages={setAdditionalImages}
            errors={errors}
          />
        );

      case "attributes":
        return (
          <AttributesSection
            addFeature={addFeature}
            form={form}
            addTag={addTag}
            removeFeature={removeFeature}
            removeTag={removeTag}
            onSpecificationsChange={handleSpecificationsChange}
          />
        );

      case "shipping":
        return (
          <ShippingSection
            form={form}
            handleChange={handleChange}
            setForm={setForm}
          />
        );

      case "seo":
        return (
          <SEO
            form={form}
            handleChange={handleChange}
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
            addKeyword={addKeyword}
            removeKeyword={removeKeyword}
          />
        );

      case "variants":
        return (
          <VariantSection
            form={form}
            addVariant={addVariant}
            removeVariant={removeVariant}
            updateVariant={updateVariant}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <ScrollToTop shouldScroll={activeSection} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {showBulkUpload
                  ? "Bulk Product Upload"
                  : isEdit
                    ? "Edit Product"
                    : "Add New Product"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {showBulkUpload
                  ? "Upload multiple products at once using JSON format"
                  : isEdit
                    ? "Update your product information and settings"
                    : "Fill in the details below to add a new product to your store"}
              </p>
            </div>

            {/* Bulk Upload Toggle Button */}
            {/* {!showBulkUpload && !isEdit && (
              <button
                type="button"
                onClick={() => setShowBulkUpload(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FiUpload className="w-4 h-4" />
                Bulk Upload
              </button>
            )} */}

            {/* {showBulkUpload && (
              <button
                type="button"
                onClick={() => setShowBulkUpload(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Single Product
              </button>
            )} */}
          </div>
        </div>

        {showBulkUpload ? (
          <div className="max-w-6xl mx-auto">
            <BulkProductUpload
              onUpload={handleBulkUpload}
              isLoading={loading}
              onProductSelect={handleProductSelect}
              selectedProductIndex={bulkEditIndex}
              onBackToList={() => {
                setBulkEditIndex(null);
                setShowBulkUpload(true);
              }}
              isEditMode={bulkEditIndex !== null}
            />
          </div>
        ) : (
          // Show regular form layout
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Sidebar Navigation */}
            <CardWrapper className="lg:w-1/4 p-6">
              <div className="flex flex-col gap-2 sticky top-24">
                {/* Quick Action Buttons */}
                {/* {!isEdit && (
                  <button
                    type="button"
                    onClick={() => setShowBulkUpload(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <FiUpload className="w-5 h-5" />
                    <span className="font-medium">Bulk Upload</span>
                  </button>
                )} */}

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
                      disabled={isEdit}
                      onClick={() => {
                        if (isEdit) {
                          return null;
                        } else {
                          if (
                            window.confirm(
                              "Are you sure you want to reset the form?",
                            )
                          ) {
                            resetForm();
                          }
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                        rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          (s) => s.id === activeSection,
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

                          console.log(form);

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
        )}
      </motion.div>
    </div>
  );
};

export default ProductForm;
