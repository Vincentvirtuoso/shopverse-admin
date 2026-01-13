// EditProduct.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiUpload,
  FiTrash2,
  FiPlus,
  FiX,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiBarChart2,
  FiTruck,
  FiRefreshCcw,
  FiLayers,
  FiBox,
  FiGrid,
  FiImage,
  FiInfo,
  FiCheck,
  FiAlertCircle,
  FiHash,
  FiStar,
  FiList,
  FiFileText,
} from "react-icons/fi";
import { useProduct } from "../hooks/useProduct";
import CardWrapper from "../components/ui/CardWrapper";
import MultiInput from "../components/common/MultiInput";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading, error, updateProduct } = useProduct();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    subCategory: "",
    price: 0,
    originalPrice: 0,
    discount: 0,

    // Inventory
    stockCount: 0,
    unit: "piece",
    availabilityType: "in-stock",
    inStock: true,

    // Images
    image: "",
    images: [],

    // Status Flags
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,

    // Metadata
    tags: [],
    features: [],
    warranty: "",

    // Specifications
    specifications: {},

    // Physical Attributes
    weight: {
      value: 0,
      unit: "g",
    },
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: "cm",
    },

    // Shipping
    shippingInfo: {
      isFreeShipping: false,
      deliveryTime: "",
      shippingClass: "",
    },

    // SEO
    meta: {
      title: "",
      description: "",
      keywords: [],
    },

    // Related Products & Variants
    relatedProducts: [],
    variants: [],
  });

  const [currentTab, setCurrentTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [newVariant, setNewVariant] = useState({
    name: "",
    price: "",
    sku: "",
    stockCount: 0,
    attributes: {},
  });
  const fileInputRef = useRef(null);

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Automotive",
    "Health",
  ];

  const units = ["piece", "pair", "set", "kg", "g", "lb", "oz", "liter", "ml"];
  const availabilityTypes = [
    "in-stock",
    "limited",
    "out-of-stock",
    "pre-order",
  ];
  const weightUnits = ["g", "kg", "lb", "oz"];
  const dimensionUnits = ["cm", "m", "in", "ft"];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const res = await getProductById(id);
          if (res && res.data) {
            const product = res.data;
            // Map the API response to form data
            setFormData({
              name: product.name || "",
              brand: product.brand || "",
              description: product.description || "",
              category: product.category || "",
              subCategory: product.subCategory || "",

              price: product.price || 0,
              originalPrice: product.originalPrice || 0,
              discount: product.discount || 0,

              stockCount: product.stockCount || 0,
              unit: product.unit || "piece",
              availabilityType: product.availabilityType || "in-stock",
              inStock: product.inStock || true,

              image: product.image || "",
              images: product.images || [],

              isBestSeller: product.isBestSeller || false,
              isFeatured: product.isFeatured || false,
              isNewArrival: product.isNewArrival || false,
              isActive:
                product.isActive !== undefined ? product.isActive : true,

              tags: product.tags || [],
              features: product.features || [],
              warranty: product.warranty || "",

              specifications: product.specifications || {},

              weight: product.weight || { value: 0, unit: "g" },
              dimensions: product.dimensions || {
                length: 0,
                width: 0,
                height: 0,
                unit: "cm",
              },

              shippingInfo: product.shippingInfo || {
                isFreeShipping: false,
                deliveryTime: "",
                shippingClass: "",
              },

              meta: product.meta || {
                title: "",
                description: "",
                keywords: [],
              },

              relatedProducts: product.relatedProducts || [],
              variants: product.variants || [],
            });
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          alert("Failed to load product data");
        }
      }
    };

    fetchProduct();
  }, [id, getProductById]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSpecificationChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          keywords: [...prev.meta.keywords, newKeyword.trim()],
        },
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (index) => {
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        keywords: prev.meta.keywords.filter((_, i) => i !== index),
      },
    }));
  };

  const addVariant = () => {
    if (newVariant.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant }],
      }));
      setNewVariant({
        name: "",
        price: "",
        sku: "",
        stockCount: 0,
        attributes: {},
      });
    }
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload to cloud storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await updateProduct(id, formData);

      alert({
        type: "success",
        title: "Product Updated",
        message: "The product was updated successfully!",
        id,
      });

      console.log("Product updated:", response);
      navigate("/manage-products");
    } catch (error) {
      console.error("Error updating product:", error);

      alert({
        type: "error",
        title: "Update Failed",
        message:
          error?.message || "Failed to update the product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate discount if not provided
  useEffect(() => {
    if (formData.originalPrice > 0 && formData.originalPrice > formData.price) {
      const discount = Math.round(
        ((formData.originalPrice - formData.price) / formData.originalPrice) *
          100
      );
      setFormData((prev) => ({
        ...prev,
        discount,
      }));
    }
  }, [formData.price, formData.originalPrice]);

  // Tabs configuration
  const tabs = [
    { id: "basic", label: "Basic Info", icon: FiInfo },
    { id: "pricing", label: "Pricing", icon: FiDollarSign },
    { id: "inventory", label: "Inventory", icon: FiPackage },
    { id: "images", label: "Images", icon: FiImage },
    { id: "attributes", label: "Attributes", icon: FiLayers },
    { id: "shipping", label: "Shipping", icon: FiTruck },
    { id: "seo", label: "SEO", icon: FiBarChart2 },
    { id: "variants", label: "Variants", icon: FiGrid },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Updating Product
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || "Unable to load product data"}
          </p>
          <div className="flex">
            <button
              className="flex px-5 py-2.5 bg-gray-400 text-white items-center gap-2.5 rounded-lg mr-2"
              onClick={() => handleSubmit}
            >
              <FiRefreshCcw /> Retry
            </button>
            <button
              onClick={() => navigate("/manage-products")}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/manage-products")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
            >
              <FiArrowLeft />
              Back to Products
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-2">
              Update product details and inventory
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Tab Navigation */}
        <CardWrapper className="p-4">
          <div className="flex overflow-x-auto pb-2 -mb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                  currentTab === tab.id
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </CardWrapper>

        <AnimatePresence mode="wait">
          {/* Basic Information Tab */}
          {currentTab === "basic" && (
            <motion.div
              key="basic"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiInfo />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand *
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <MultiInput
                    label="Tags"
                    name="tags"
                    value={formData.tags || []}
                    addItem={(tag) => addTag(tag)}
                    removeItem={(tag) => removeTag(tag)}
                    placeholder="Add a tag and press Enter"
                    minItems={0}
                    maxItems={10}
                    maxLength={50}
                    minLength={2}
                    helperText="Add tags for this product. Press Enter to add each tag."
                    icon="tag"
                    allowDuplicates={false}
                  />
                </div>

                {/* Status Flags */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Best Seller</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={formData.isNewArrival}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </CardWrapper>
            </motion.div>
          )}

          {/* Pricing Tab */}
          {currentTab === "pricing" && (
            <motion.div
              key="pricing"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiDollarSign />
                  Pricing Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selling Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₦
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₦
                      </span>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {formData.originalPrice > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Calculated:{" "}
                        {Math.round(
                          ((formData.originalPrice - formData.price) /
                            formData.originalPrice) *
                            100
                        )}
                        %
                      </p>
                    )}
                  </div>
                </div>

                {/* Discount Preview */}
                {formData.originalPrice > 0 &&
                  formData.originalPrice > formData.price && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-medium">
                        Discount Applied:{" "}
                        {Math.round(
                          ((formData.originalPrice - formData.price) /
                            formData.originalPrice) *
                            100
                        )}
                        %
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        Customer saves ₦
                        {(
                          formData.originalPrice - formData.price
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
              </CardWrapper>
            </motion.div>
          )}

          {/* Inventory Tab */}
          {currentTab === "inventory" && (
            <motion.div
              key="inventory"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiPackage />
                  Inventory Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stockCount"
                      value={formData.stockCount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability Type
                    </label>
                    <select
                      name="availabilityType"
                      value={formData.availabilityType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {availabilityTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace("-", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">In Stock</span>
                    </label>
                  </div>
                </div>

                {/* Stock Status Preview */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status Preview
                  </label>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                      formData.stockCount === 0
                        ? "bg-red-100 text-red-700"
                        : formData.stockCount <= 10
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {formData.stockCount === 0
                      ? "Out of Stock"
                      : formData.stockCount <= 10
                      ? "Low Stock"
                      : "In Stock"}{" "}
                    ({formData.stockCount} {formData.unit})
                  </div>
                </div>
              </CardWrapper>
            </motion.div>
          )}

          {/* Images Tab */}
          {currentTab === "images" && (
            <motion.div
              key="images"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiImage />
                  Product Images
                </h2>

                {/* Main Image */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image *
                  </label>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Main product"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <>
                          <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Click to upload
                          </p>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Choose Image
                      </button>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Enter a direct URL to the main product image
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images
                  </label>
                  <div className="space-y-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              images: newImages,
                            }));
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Image URL"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              images: newImages,
                            }));
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: [...prev.images, ""],
                        }))
                      }
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      <FiPlus />
                      Add Another Image
                    </button>
                  </div>
                </div>
              </CardWrapper>
            </motion.div>
          )}

          {/* Attributes Tab */}
          {currentTab === "attributes" && (
            <motion.div
              key="attributes"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Features */}
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiList />
                  Features
                </h2>
                <div className="space-y-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="flex-1">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addFeature())
                      }
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </CardWrapper>

              {/* Specifications */}
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiLayers />
                  Specifications
                </h2>
                <div className="space-y-4">
                  {Object.entries(formData.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">
                            {key}
                          </div>
                          <div className="text-gray-600">{value}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSpecification(key)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Specification name"
                      id="specKey"
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      id="specValue"
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const key = document.getElementById("specKey").value;
                        const value =
                          document.getElementById("specValue").value;
                        if (key.trim() && value.trim()) {
                          handleSpecificationChange(key.trim(), value.trim());
                          document.getElementById("specKey").value = "";
                          document.getElementById("specValue").value = "";
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Add Specification
                    </button>
                  </div>
                </div>
              </CardWrapper>

              {/* Physical Attributes */}
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiBox />
                  Physical Attributes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.weight.value}
                        onChange={(e) =>
                          handleNestedChange("weight", "value", e.target.value)
                        }
                        min="0"
                        step="0.01"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={formData.weight.unit}
                        onChange={(e) =>
                          handleNestedChange("weight", "unit", e.target.value)
                        }
                        className="px-4 py-3 border border-gray-300 rounded-lg"
                      >
                        {weightUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (L × W × H)
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={formData.dimensions.length}
                          onChange={(e) =>
                            handleNestedChange(
                              "dimensions",
                              "length",
                              e.target.value
                            )
                          }
                          min="0"
                          step="0.01"
                          placeholder="Length"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="number"
                          value={formData.dimensions.width}
                          onChange={(e) =>
                            handleNestedChange(
                              "dimensions",
                              "width",
                              e.target.value
                            )
                          }
                          min="0"
                          step="0.01"
                          placeholder="Width"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="number"
                          value={formData.dimensions.height}
                          onChange={(e) =>
                            handleNestedChange(
                              "dimensions",
                              "height",
                              e.target.value
                            )
                          }
                          min="0"
                          step="0.01"
                          placeholder="Height"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <select
                        value={formData.dimensions.unit}
                        onChange={(e) =>
                          handleNestedChange(
                            "dimensions",
                            "unit",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        {dimensionUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Warranty */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years manufacturer warranty"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </CardWrapper>
            </motion.div>
          )}

          {/* Shipping Tab */}
          {currentTab === "shipping" && (
            <motion.div
              key="shipping"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiTruck />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={formData.shippingInfo.isFreeShipping}
                        onChange={(e) =>
                          handleNestedChange(
                            "shippingInfo",
                            "isFreeShipping",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Free Shipping
                      </span>
                    </label>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Time
                        </label>
                        <input
                          type="text"
                          value={formData.shippingInfo.deliveryTime}
                          onChange={(e) =>
                            handleNestedChange(
                              "shippingInfo",
                              "deliveryTime",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 3-5 business days"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Class
                        </label>
                        <input
                          type="text"
                          value={formData.shippingInfo.shippingClass}
                          onChange={(e) =>
                            handleNestedChange(
                              "shippingInfo",
                              "shippingClass",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Standard Shipping"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Shipping Preview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">
                          {formData.weight.value} {formData.weight.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="font-medium">
                          {formData.dimensions.length}×
                          {formData.dimensions.width}×
                          {formData.dimensions.height}{" "}
                          {formData.dimensions.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium text-green-600">
                          {formData.shippingInfo.isFreeShipping
                            ? "FREE"
                            : "Calculated at checkout"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium">
                          {formData.shippingInfo.deliveryTime || "Standard"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardWrapper>
            </motion.div>
          )}

          {/* SEO Tab */}
          {currentTab === "seo" && (
            <motion.div
              key="seo"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiBarChart2 />
                  SEO & Meta Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.meta.title}
                      onChange={(e) =>
                        handleNestedChange("meta", "title", e.target.value)
                      }
                      placeholder="Optimized title for search engines"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.meta.description}
                      onChange={(e) =>
                        handleNestedChange(
                          "meta",
                          "description",
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Brief description for search results"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.meta.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Add a keyword"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addKeyword())
                        }
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </CardWrapper>
            </motion.div>
          )}

          {/* Variants Tab */}
          {currentTab === "variants" && (
            <motion.div
              key="variants"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <CardWrapper className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiGrid />
                  Product Variants
                </h2>

                {/* Existing Variants */}
                {formData.variants.length > 0 && (
                  <div className="mb-8 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Current Variants
                    </h3>
                    {formData.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">
                            {variant.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">
                              Price:
                            </span>
                            <div className="font-medium">
                              ₦{variant.price?.toLocaleString() || "0"}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">SKU:</span>
                            <div className="font-medium">
                              {variant.sku || "N/A"}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">
                              Stock:
                            </span>
                            <div className="font-medium">
                              {variant.stockCount || 0}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">
                              Attributes:
                            </span>
                            <div className="font-medium">
                              {Object.entries(variant.attributes).map(
                                ([k, v]) => (
                                  <div key={k} className="text-xs">
                                    {k}: {v}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Variant */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Add New Variant
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variant Name *
                      </label>
                      <input
                        type="text"
                        value={newVariant.name}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., Size: Large, Color: Red"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        value={newVariant.price}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={newVariant.sku}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            sku: e.target.value,
                          }))
                        }
                        placeholder="Optional"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={newVariant.stockCount}
                        onChange={(e) =>
                          setNewVariant((prev) => ({
                            ...prev,
                            stockCount: e.target.value,
                          }))
                        }
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attributes (Key:Value pairs)
                    </label>
                    <input
                      type="text"
                      placeholder="color:red, size:large (comma separated)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      onBlur={(e) => {
                        const pairs = e.target.value
                          .split(",")
                          .map((pair) => pair.trim());
                        const attributes = {};
                        pairs.forEach((pair) => {
                          const [key, value] = pair
                            .split(":")
                            .map((s) => s.trim());
                          if (key && value) attributes[key] = value;
                        });
                        setNewVariant((prev) => ({ ...prev, attributes }));
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Add Variant
                  </button>
                </div>
              </CardWrapper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Actions */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            onClick={() => navigate("/manage-products")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default EditProduct;
