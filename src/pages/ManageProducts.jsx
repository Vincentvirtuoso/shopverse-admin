// ManageProducts.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiChevronDown,
  FiX,
  FiCheckCircle,
  FiPackage,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/common/StatsCard";
import CardWrapper from "../components/ui/CardWrapper";
import { useProduct } from "../hooks/useProduct";

const ManageProducts = () => {
  const {
    getProducts,
    loading,
    error,
    products = [],
    getProductStats,
    deleteProduct,
  } = useProduct();

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [statsData, setStatsData] = useState({
    total: 0,
    inStock: 0,
    bestSellers: 0,
    outOfStock: 0,
  });

  // Fetch products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProducts({ limit: 100 }); // Fetch more products for management
        const statsRes = await getProductStats();
        if (statsRes?.data) {
          setStatsData(statsRes.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchData();
  }, [getProducts, getProductStats]);

  const stats = [
    {
      label: "Total Products",
      value: statsData.total || products.length,
      icon: FiPackage,
      iconColor: {
        bg: "red-100",
        text: "red-600",
      },
    },
    {
      label: "In Stock",
      value: statsData.inStock || products.filter((p) => p.inStock).length,
      icon: FiCheckCircle,
      iconColor: {
        bg: "green-100",
        text: "green-600",
      },
    },
    {
      label: "Best Sellers",
      value:
        statsData.bestSellers || products.filter((p) => p.isBestSeller).length,
      icon: FiTrendingUp,
      iconColor: {
        bg: "orange-100",
        text: "orange-600",
      },
    },
    {
      label: "Out of Stock",
      value: statsData.outOfStock || products.filter((p) => !p.inStock).length,
      icon: FiAlertCircle,
      iconColor: {
        bg: "blue-100",
        text: "blue-600",
      },
    },
  ];

  // Extract unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = ["all"];
    products.forEach((product) => {
      if (product.category && !uniqueCategories.includes(product.category)) {
        uniqueCategories.push(product.category);
      }
    });
    return uniqueCategories;
  }, [products]);

  const stockOptions = [
    { value: "all", label: "All Stock" },
    { value: "in-stock", label: "In Stock" },
    { value: "limited", label: "Limited Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" || product.category === selectedCategory;

        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "in-stock" &&
            product.inStock &&
            product.stockCount > 10) ||
          (stockFilter === "limited" &&
            product.inStock &&
            product.stockCount <= 10) ||
          (stockFilter === "out-of-stock" && !product.inStock);

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          case "price":
            return (b.price || 0) - (a.price || 0);
          case "stock":
            return (b.stockCount || 0) - (a.stockCount || 0);
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy]);

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      if (!productId) return;

      // Call the API to delete the product
      const res = await deleteProduct(productId);

      // Optionally, you can check for success in the response
      if (res?.status === 200 || res?.success) {
        // Close modal and reset selected product
        setShowDeleteModal(false);
        setSelectedProduct(null);

        // Refresh the products list
        await getProducts({ limit: 100 });

        alert({
          type: "success",
          title: "Product deleted",
          message: `Product with ID ${productId} has been successfully deleted.`,
        });
      } else {
        alert({
          type: "error",
          title: "Delete failed",
          message: `Could not delete product with ID ${productId}.`,
        });
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert({
        type: "error",
        title: "Delete failed",
        message:
          err?.message || "An error occurred while deleting the product.",
      });
    }
  };

  // Handle product view
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Handle add product
  const handleAddProduct = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate("/add-product");
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    navigate(`/edit-product/${product._id}`);
  };

  // Get stock status
  const getStockStatus = (product) => {
    if (!product.inStock)
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (product.stockCount <= 5)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    if (product.stockCount <= 10)
      return { label: "Limited", color: "bg-orange-100 text-orange-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Products
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || "Unable to load products at this time"}
          </p>
          <button
            onClick={() => getProducts({ limit: 100 })}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            Manage Products
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your product catalog, inventory, and pricing
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
        >
          <FiPlus size={20} />
          Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <StatsCard {...stat} index={index} key={index} showIconBackground />
        ))}
      </div>

      {/* Filters Section */}
      <CardWrapper className="shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 input-group">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, brand, description, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((c) => c !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Stock Filter */}
            <div className="relative">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2"
              >
                {stockOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </CardWrapper>

      {/* Products Table */}
      <CardWrapper className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white dark:bg-neutral-500 border-b border-gray-100">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Product
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Price
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Stock
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product);
                return (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleViewProduct(product)}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={product.image || product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-200">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {product.brand}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            SKU: {product.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-neutral-400 text-gray-900 dark:text-gray-50 rounded-full text-sm">
                          {product.category}
                        </span>
                        {product.subCategory && (
                          <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-sm block">
                            {product.subCategory}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-200">
                          ₦{product.price?.toLocaleString() || "0"}
                        </p>
                        {product.originalPrice > product.price && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-400 line-through">
                              ₦{product.originalPrice.toLocaleString()}
                            </span>
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              {product.discount ||
                                Math.round(
                                  ((product.originalPrice - product.price) /
                                    product.originalPrice) *
                                    100
                                )}
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <p
                          className={`font-medium ${
                            product.stockCount <= 5
                              ? "text-red-600"
                              : "text-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {product.stockCount || 0} {product.unit || "units"}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              (product.stockCount || 0) > 20
                                ? "bg-green-500"
                                : (product.stockCount || 0) > 10
                                ? "bg-yellow-500"
                                : (product.stockCount || 0) > 5
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                ((product.stockCount || 0) / 30) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-2 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${stockStatus.color}`}
                        >
                          {stockStatus.label}
                        </span>
                        {product.isBestSeller && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium w-fit">
                            Best Seller
                          </span>
                        )}
                        {product.isNewArrival && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium w-fit">
                            New Arrival
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(product);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <FiEdit2 className="text-blue-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <FiTrash2 className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiPackage className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">
              No products found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setStockFilter("all");
              }}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </CardWrapper>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-99">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-50 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-400/60">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-400 mt-1">{selectedProduct.brand}</p>
                  <p className="text-sm text-gray-500">
                    SKU: {selectedProduct.sku}
                  </p>
                </div>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Images */}
                  <div>
                    <div className="rounded-xl overflow-hidden bg-gray-100 mb-4">
                      <img
                        src={
                          selectedProduct.image || selectedProduct.images?.[0]
                        }
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    {selectedProduct.images &&
                      selectedProduct.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {selectedProduct.images
                            .slice(0, 4)
                            .map((img, index) => (
                              <div
                                key={index}
                                className="rounded-lg overflow-hidden bg-gray-100"
                              >
                                <img
                                  src={img}
                                  alt={`${selectedProduct.name} ${index + 1}`}
                                  className="w-full h-20 object-cover"
                                />
                              </div>
                            ))}
                        </div>
                      )}
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    {/* Price & Rating */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                            ₦{selectedProduct.price?.toLocaleString() || "0"}
                          </p>
                          {selectedProduct.originalPrice >
                            selectedProduct.price && (
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-lg text-gray-400 line-through">
                                ₦
                                {selectedProduct.originalPrice.toLocaleString()}
                              </span>
                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                -
                                {selectedProduct.discount ||
                                  Math.round(
                                    ((selectedProduct.originalPrice -
                                      selectedProduct.price) /
                                      selectedProduct.originalPrice) *
                                      100
                                  )}
                                %
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">
                              {selectedProduct.rating?.toFixed(1) || "0.0"}
                            </span>
                            <span className="text-gray-400">
                              ({selectedProduct.reviewCount || 0} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-400">
                        {selectedProduct.description ||
                          "No description available"}
                      </p>
                    </div>

                    {/* Category & Stock */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                          Category
                        </h3>
                        <div className="space-y-1">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm inline-block">
                            {selectedProduct.category}
                          </span>
                          {selectedProduct.subCategory && (
                            <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-sm inline-block ml-2">
                              {selectedProduct.subCategory}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                          Stock Status
                        </h3>
                        <div className="space-y-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              getStockStatus(selectedProduct).color
                            }`}
                          >
                            {getStockStatus(selectedProduct).label} -{" "}
                            {selectedProduct.stockCount || 0}{" "}
                            {selectedProduct.unit || "units"}
                          </span>
                          {selectedProduct.isBestSeller && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium block w-fit">
                              Best Seller
                            </span>
                          )}
                          {selectedProduct.isNewArrival && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium block w-fit">
                              New Arrival
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedProduct.tags &&
                      selectedProduct.tags.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Specifications */}
                    {selectedProduct.specifications &&
                      Object.keys(selectedProduct.specifications).length >
                        0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                            Specifications
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(selectedProduct.specifications)
                              .filter(([_, value]) => value)
                              .map(([key, value], index) => (
                                <div key={index} className="text-sm">
                                  <span className="text-gray-600">{key}: </span>
                                  <span className="font-medium">{value}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-50 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    handleEditProduct(selectedProduct);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Edit Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-99">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-100 dark:bg-neutral-600 text-gray-900 dark:text-gray-50 rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FiTrash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-2">
                  Delete Product
                </h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{selectedProduct.name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 
                    not-dark:hover:bg-gray-50 dark:hover:text-white dark:hover:border-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(selectedProduct._id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;
