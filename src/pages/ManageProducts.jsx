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
  FiRefreshCw,
  FiImage,
  FiTag,
} from "react-icons/fi";
import {} from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/common/StatsCard";
import CardWrapper from "../components/ui/CardWrapper";
import { useProduct } from "../hooks/useProduct";
import ProductDetail from "../sections/manageProduct/ProductDetail";
import { getSmartUnit } from "../utils/helpers";
import Rating from "../components/ui/Rating";

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
      if (
        product.category &&
        !uniqueCategories.includes(product.category?.name)
      ) {
        uniqueCategories.push(product.category?.name);
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
          selectedCategory === "all" ||
          product.category?.name === selectedCategory;

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
      <div className="space-y-6 p-6">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
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

  if (!loading && products.length === 0 && !error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
        <div className="text-center">
          {/* Illustration/Icon */}
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-linear-to-r from-red-500/10 to-pink-500/10 rounded-full blur-xl"></div>
            <div className="relative w-full h-full flex items-center justify-center bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <FiPackage className="w-16 h-16 text-gray-300 dark:text-gray-600" />
            </div>
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            No Products Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
            Your product catalog is empty
          </p>
          <p className="text-gray-500 dark:text-gray-500 mb-8 max-w-md mx-auto">
            Start by adding your first product to showcase in your store. Add
            descriptions, images, pricing, and inventory details.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleAddProduct}
              className="group px-8 py-3.5 bg-linear-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl 
                       hover:from-red-700 hover:to-red-800 active:scale-[0.98] transition-all duration-200 
                       shadow-lg hover:shadow-xl shadow-red-200/50 dark:shadow-red-900/30
                       flex items-center justify-center space-x-3"
            >
              <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <FiPlus className="w-5 h-5" />
              </div>
              <span className="text-lg">Add Your First Product</span>
            </button>

            <button
              onClick={() => getProducts({ limit: 100 })}
              className="px-6 py-3.5 text-gray-700 dark:text-gray-300 font-medium 
                       hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors
                       border border-gray-200 dark:border-gray-700
                       flex items-center space-x-2"
            >
              <FiRefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Quick Tips */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Quick Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiImage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Add Images
                  </h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use high-quality images to showcase your products
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiTag className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Set Pricing
                  </h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure competitive pricing and discounts
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FiPackage className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Manage Inventory
                  </h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track stock levels and set up alerts for low inventory
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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
                  Rating
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
                        <div className="w-12 h-full rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={product.image || product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-200 line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {product.brand}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            SKU: {product.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-neutral-400 text-gray-900 dark:text-gray-50 rounded-full text-sm">
                          {product.category?.name}
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
                                    100,
                                )}
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Rating selectedProduct={product} vertical />
                    </td>
                    <td className="py-4 px-6">
                      <p
                        className={`font-medium whitespace-nowrap ${
                          product.stockCount <= 5
                            ? "text-red-600"
                            : "text-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {product.stockCount || 0}{" "}
                        {getSmartUnit(product.stockCount, product.unit)}
                      </p>
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
          <ProductDetail
            selectedProduct={selectedProduct}
            getStockStatus={getStockStatus}
            onClose={() => setShowProductModal(false)}
            handleEditProduct={handleEditProduct}
          />
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
