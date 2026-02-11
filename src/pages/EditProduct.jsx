import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiRefreshCcw, FiAlertCircle } from "react-icons/fi";
import { useProduct, useProductForm } from "../hooks/useProduct";
import ProductForm from "../sections/addProduct/ProductForm";
import ErrorState from "../components/ui/ErrorState";
import Notification from "../components/ui/Notification";
import Spinner from "../components/common/Spinner";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct } = useProduct();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const { form: formData, setForm: setFormData } = useProductForm(productData, {
    isEditMode: true,
  });

  // Fetch product data
  const fetchProductData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getProductById(id);

      if (response?.data) {
        setProductData(response.data);
        setFormData(response.data);
      } else {
        throw new Error("No product data received");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError({
        message: err?.message || "Failed to load product data",
        retry: fetchProductData,
      });
    } finally {
      setLoading(false);
    }
  }, [id, getProductById, setFormData]);

  // Initial fetch
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Calculate discount when prices change
  useEffect(() => {
    if (formData.originalPrice > 0 && formData.originalPrice > formData.price) {
      const discount = Math.round(
        ((formData.originalPrice - formData.price) / formData.originalPrice) *
          100,
      );

      if (discount !== formData.discount) {
        setFormData((prev) => ({
          ...prev,
          discount,
        }));
      }
    } else if (formData.discount !== 0) {
      setFormData((prev) => ({
        ...prev,
        discount: 0,
      }));
    }
  }, [formData.price, formData.originalPrice, formData.discount, setFormData]);

  // Handle form submission
  const handleSubmit = useCallback(
    async ({ formData: submitData, setActiveSection }) => {
      setIsSubmitting(true);

      try {
        const cleanedData = { ...submitData };

        Object.keys(cleanedData).forEach((key) => {
          if (
            cleanedData[key] === "" ||
            cleanedData[key] === null ||
            cleanedData[key] === undefined ||
            (Array.isArray(cleanedData[key]) && cleanedData[key].length === 0)
          ) {
            delete cleanedData[key];
          }
        });

        const response = await updateProduct(id, cleanedData);

        setNotification({
          type: "success",
          title: "Product Updated",
          message: "The product has been updated successfully!",
          duration: 5000,
        });

        setActiveSection("basic");
        navigate("/manage-products");

        return response;
      } catch (err) {
        console.error("Error updating product:", err);

        setNotification({
          type: "error",
          title: "Update Failed",
          message:
            err?.message || "Failed to update the product. Please try again.",
          duration: 7000,
        });

        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [id, updateProduct, navigate],
  );

  // Handle notification close
  const handleNotificationClose = useCallback(() => {
    setNotification(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner
          size="2xl"
          label="Loading product details..."
          color="primary"
        />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-[calc(100vh-10rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <ErrorState
          icon={FiAlertCircle}
          title="Error Loading Product"
          message={error?.message || "Unable to load product data"}
          actions={[
            {
              label: "Retry",
              icon: FiRefreshCcw,
              onClick: error?.retry || fetchProductData,
              variant: "secondary",
            },
            {
              label: "Back to Products",
              onClick: () => navigate("/manage-products"),
              variant: "primary",
            },
          ]}
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900"
        >
          <div className="">
            <div className="flex sm:items-center sm:justify-between gap-4 flex-col sm:flex-row">
              <button
                onClick={() => navigate("/manage-products")}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors place-self-start"
                aria-label="Back to products"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>

              {productData && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated:{" "}
                    {new Date(productData.updatedAt).toLocaleString()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      productData.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {productData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ProductForm
              loading={isSubmitting}
              onSubmit={handleSubmit}
              // initialData={productData}
              setNotification={setNotification}
              isEdit={true}
            />
          </motion.div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            duration={notification.duration}
            onClose={handleNotificationClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Optional: Add prop types if using PropTypes
EditProduct.propTypes = {
  // Add prop types if needed
};

export default React.memo(EditProduct);
