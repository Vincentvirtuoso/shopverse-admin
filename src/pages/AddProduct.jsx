import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import ProductForm from "../sections/addProduct/ProductForm";
import initialProduct from "../assets/addProducts";
import { useEffect } from "react";
import Notification from "../components/ui/Notification";

const AddProduct = () => {
  const navigate = useNavigate();
  const { createProduct, loading } = useProduct();
  const [notification, setNotification] = useState(null);

  const handleSubmit = async ({ formData, setActiveSection, resetForm }) => {
    try {
      const result = await createProduct(null, formData);

      setNotification({
        type: "success",
        title: "Product Created Successfully!",
        message: "Your product has been added to the store.",
        productId: result.data._id,
      });
      resetForm?.();
      setActiveSection("basic");
      navigate("/manage-products");
    } catch (err) {
      setNotification({
        type: "error",
        title: "Failed to Create Product",
        message: err.message || "Please check your inputs and try again.",
      });
    }
  };

  // useEffect(() => {
  //   if (!notification) return;
  //   setTimeout(() => {
  //     setNotification(null);
  //   }, 500000);
  // }, [notification]);

  return (
    <div className="relative">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
            duration={5000}
          />
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
