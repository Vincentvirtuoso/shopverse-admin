// ManageProducts.jsx
import React, { useState } from "react";
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

const initialProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    brand: "SonicPro",
    price: 79000.99,
    originalPrice: 129000.99,
    discount: 38,
    rating: 4.5,
    reviewCount: 328,
    description:
      "Experience immersive sound with these noise-cancelling wireless headphones featuring 40-hour battery life, touch controls, and comfortable ear cushions.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1618365908648-5f3c1d0f48b3?auto=format&fit=crop&w=600&q=80",
    ],
    category: "Electronics",
    subCategory: "Audio",
    inStock: true,
    stockCount: 5,
    availabilityType: "limited",
    unit: "piece",
    isBestSeller: true,
    tags: ["wireless", "headphones", "bluetooth", "noise-cancelling"],
  },
  {
    id: 2,
    name: "Ultra-Thin Laptop Pro",
    brand: "TechMaster",
    price: 224999.99,
    originalPrice: 299999.99,
    discount: 25,
    rating: 4.8,
    reviewCount: 512,
    description:
      "Professional laptop with 4K display, 16GB RAM, 1TB SSD, and 10-hour battery life. Perfect for creative professionals.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    category: "Electronics",
    subCategory: "Computers",
    inStock: true,
    stockCount: 12,
    availabilityType: "in-stock",
    unit: "piece",
    isBestSeller: true,
    tags: ["laptop", "professional", "4k", "portable"],
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    brand: "FitGear",
    price: 45999.99,
    originalPrice: 59999.99,
    discount: 23,
    rating: 4.3,
    reviewCount: 189,
    description:
      "Track your fitness with heart rate monitoring, sleep tracking, and 7-day battery life. Water-resistant and compatible with iOS/Android.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    category: "Wearables",
    subCategory: "Fitness",
    inStock: true,
    stockCount: 25,
    availabilityType: "in-stock",
    unit: "piece",
    isBestSeller: false,
    tags: ["smartwatch", "fitness", "health", "tracking"],
  },
  {
    id: 4,
    name: "Professional DSLR Camera",
    brand: "PhotoPro",
    price: 189999.99,
    originalPrice: 249999.99,
    discount: 24,
    rating: 4.7,
    reviewCount: 421,
    description:
      "24MP full-frame sensor with 4K video recording and advanced autofocus system. Includes kit lens and accessories.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    category: "Electronics",
    subCategory: "Photography",
    inStock: false,
    stockCount: 0,
    availabilityType: "out-of-stock",
    unit: "piece",
    isBestSeller: false,
    tags: ["camera", "photography", "dslr", "professional"],
  },
  {
    id: 5,
    name: "Wireless Gaming Mouse",
    brand: "GameMaster",
    price: 12999.99,
    originalPrice: 19999.99,
    discount: 35,
    rating: 4.4,
    reviewCount: 156,
    description:
      "High-precision gaming mouse with customizable RGB lighting, 6 programmable buttons, and 50-hour battery life.",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80",
    category: "Gaming",
    subCategory: "Accessories",
    inStock: true,
    stockCount: 8,
    availabilityType: "limited",
    unit: "piece",
    isBestSeller: true,
    tags: ["gaming", "mouse", "wireless", "rgb"],
  },
  {
    id: 6,
    name: "Bluetooth Portable Speaker",
    brand: "AudioSphere",
    price: 8999.99,
    originalPrice: 14999.99,
    discount: 40,
    rating: 4.2,
    reviewCount: 234,
    description:
      "Waterproof portable speaker with 360° sound, 12-hour battery, and built-in microphone for hands-free calls.",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    category: "Electronics",
    subCategory: "Audio",
    inStock: true,
    stockCount: 15,
    availabilityType: "in-stock",
    unit: "piece",
    isBestSeller: false,
    tags: ["speaker", "portable", "bluetooth", "waterproof"],
  },
];

const ManageProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: FiPackage,
      iconColor: {
        bg: "red-100",
        text: "red-600",
      },
    },
    {
      label: "In Stock",
      value: products.filter((p) => p.inStock).length,
      icon: FiCheckCircle,
      iconColor: {
        bg: "green-100",
        text: "green-600",
      },
    },
    {
      label: "Best Sellers",
      value: products.filter((p) => p.isBestSeller).length,
      icon: FiTrendingUp,
      iconColor: {
        bg: "orange-100",
        text: "orange-600",
      },
    },
    {
      label: "Out of Stock",
      value: products.filter((p) => !p.inStock).length,
      icon: FiAlertCircle,
      iconColor: {
        bg: "blue-100",
        text: "blue-600",
      },
    },
  ];

  const navigate = useNavigate();
  const categories = [
    "all",
    "Electronics",
    "Wearables",
    "Gaming",
    "Home",
    "Fashion",
  ];
  const stockOptions = [
    { value: "all", label: "All Stock" },
    { value: "in-stock", label: "In Stock" },
    { value: "limited", label: "Limited Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
  ];

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
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
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price;
        case "stock":
          return b.stockCount - a.stockCount;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  // Handle product deletion
  const handleDelete = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
    setShowDeleteModal(false);
    setSelectedProduct(null);
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
  const handleEditProduct = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    navigate("/edit-product", { state: { id: product._id } });
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
          <StatsCard {...stat} index={index} showIconBackground />
        ))}
      </div>

      {/* Filters Section */}
      <CardWrapper className=" shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 input-group">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, brand, or description..."
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
                className="appearance-none pl-4 pr-10 py-2 "
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
                className="appearance-none pl-4 pr-10 py-2 "
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
                    key={product.id}
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
                            src={product.image}
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
                          ${product.price.toLocaleString()}
                        </p>
                        {product.discount > 0 && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-400 line-through">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              -{product.discount}%
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
                          {product.stockCount} {product.unit}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              product.stockCount > 20
                                ? "bg-green-500"
                                : product.stockCount > 10
                                ? "bg-yellow-500"
                                : product.stockCount > 5
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (product.stockCount / 30) * 100,
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
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            handleEditProduct(product);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <FiEdit2 className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => {
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
              <div className="flex items-center justify-between p-6 border-b  border-gray-200 dark:border-gray-400/60">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-400 mt-1">{selectedProduct.brand}</p>
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
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    {selectedProduct.images &&
                      selectedProduct.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {selectedProduct.images.map((img, index) => (
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
                            ${selectedProduct.price.toLocaleString()}
                          </p>
                          {selectedProduct.discount > 0 && (
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-lg text-gray-400 line-through">
                                $
                                {selectedProduct.originalPrice.toLocaleString()}
                              </span>
                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                -{selectedProduct.discount}%
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">
                              {selectedProduct.rating}
                            </span>
                            <span className="text-gray-400">
                              ({selectedProduct.reviewCount} reviews)
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
                        {selectedProduct.description}
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
                            {selectedProduct.stockCount} {selectedProduct.unit}
                          </span>
                          {selectedProduct.isBestSeller && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium block w-fit">
                              Best Seller
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
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg  text-gray-900 dark:text-gray-50  hover:bg-gray-50 hover:text-gray-900 transition-colors"
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
                    onClick={() => handleDelete(selectedProduct.id)}
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
