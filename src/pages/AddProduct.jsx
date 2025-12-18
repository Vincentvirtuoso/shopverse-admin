import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import ProductForm from "../sections/addProduct/ProductForm";
import initialProduct from "../assets/addProducts";

const AddProduct = () => {
  const navigate = useNavigate();
  const { createProduct, loading } = useProduct();
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const result = await createProduct(null, formData);

      setNotification({
        type: "success",
        title: "Product Created Successfully!",
        message: "Your product has been added to the store.",
        productId: result.data._id,
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (err) {
      setNotification({
        type: "error",
        title: "Failed to Create Product",
        message: err.message || "Please check your inputs and try again.",
      });
    }
  };

  return (
    <div className="relative">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-26 right-10 transform z-50 w-full max-w-md"
          >
            <div
              className={`rounded-xl shadow-2xl p-6 ${
                notification.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-gradient-to-r from-red-500 to-pink-600 text-white"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  {notification.type === "success" ? (
                    <FiCheckCircle className="w-6 h-6" />
                  ) : (
                    <FiAlertCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm opacity-90">{notification.message}</p>
                  {notification.productId && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs opacity-75">
                        Product ID: {notification.productId}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="shrink-0 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <span className="sr-only">Close</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xs">✕</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-40">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/products")}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg 
            text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <ProductForm
        loading={loading}
        onSubmit={handleSubmit}
        initialData={initialProduct}
        setNotification={setNotification}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div
                    className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-500 dark:border-t-blue-400 
                    rounded-full animate-spin"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Creating Product
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we save your product...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProduct;
