import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { isValidCategory } from "../assets/addProducts";
import { useEffect } from "react";

export const useProduct = () => {
  const { loading, error, callApi } = useApi();
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);

  // Generic API handler
  const handleProductMutation = useCallback(
    async (endpoint, method, payload = null) => {
      setSuccess(false);
      try {
        const response = await callApi(endpoint, method, payload);
        setSuccess(true);
        return response;
      } catch (err) {
        setSuccess(false);
        throw err;
      }
    },
    [callApi]
  );

  // Create a product
  const createProduct = useCallback(
    (productData, formData = null) =>
      handleProductMutation("/products", "POST", formData || productData),
    [handleProductMutation]
  );

  // Update a product
  const updateProduct = useCallback(
    (id, productData, formData = null) =>
      handleProductMutation(`/products/${id}`, "PUT", formData || productData),
    [handleProductMutation]
  );

  // Delete a product
  const deleteProduct = useCallback(
    (id) => handleProductMutation(`/products/${id}`, "DELETE"),
    [handleProductMutation]
  );

  // Fetch all products with optional query params
  const getProducts = useCallback(
    async (params = {}) => {
      try {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
        const res = await callApi(endpoint, "GET");

        const data = res?.data || {};
        setProducts(data.products || []);
        setPagination(data.pagination || null);
        setSuccess(true);

        return res;
      } catch (err) {
        setProducts([]);
        setPagination(null);
        setSuccess(false);
        throw err;
      }
    },
    [callApi]
  );

  // Fetch single product by ID
  const getProductById = useCallback(
    (id) => callApi(`/products/${id}`, "GET"),
    [callApi]
  );

  // Best sellers
  const getBestSellers = useCallback(
    () => callApi("/products/best-sellers", "GET"),
    [callApi]
  );

  // Product stats
  const getProductStats = useCallback(
    () => callApi("/products/stats", "GET"),
    [callApi]
  );

  return {
    loading,
    error,
    success,
    products,
    pagination,
    setSuccess,
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById,
    getBestSellers,
    getProductStats,
  };
};

export const useProductForm = (initialValues = {}) => {
  const STORAGE_KEY = "product-form";
  const initialForm = {
    tags: [],
    features: [],
    variants: [],
    ...initialValues,
  };

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...initialForm, ...JSON.parse(saved) } : initialForm;
    } catch {
      return initialForm;
    }
  });
  const [errors, setErrors] = useState({});
  const [keywordInput, setKeywordInput] = useState("");
  const [mainImage, setMainImage] = useState([]);
  const [additionalImages, setAdditionalImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent.includes(".")) {
        const [grandParent, middle] = parent.split(".");
        setForm((prev) => ({
          ...prev,
          [grandParent]: {
            ...prev[grandParent],
            [middle]: {
              ...prev[grandParent][middle],
              [child]: type === "checkbox" ? checked : value,
            },
          },
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addTag = (tag, updateForm) => {
    if (tag && !form.tags.includes(tag.toLowerCase())) {
      if (updateForm) {
        updateForm((prev) => ({
          ...prev,
          tags: [...prev.tags, tag.toLowerCase()],
        }));
        return;
      }
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag.toLowerCase()] }));
    }
  };
  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addFeature = (feature) => {
    if (!feature) return;

    setForm((prev) => ({
      ...prev,
      features: [...(prev.features || []), feature],
    }));
  };

  const removeFeature = (featureToRemove) => {
    setForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((f) => f !== featureToRemove),
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setForm((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          keywords: [...(prev.meta.keywords || []), keywordInput.trim()],
        },
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setForm((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        keywords: (prev.meta.keywords || []).filter(
          (keyword) => keyword !== keywordToRemove
        ),
      },
    }));
  };

  const handleSpecificationsChange = useCallback((newSpecs) => {
    setForm((prev) => ({
      ...prev,
      specifications: newSpecs,
    }));
  }, []);

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "",
          price: "",
          sku: "",
          stockCount: "",
          attributes: {},
        },
      ],
    }));
  };

  const updateVariant = (index, field, value) => {
    setForm((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setKeywordInput("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const validateForm = (step, general = false) => {
    const errors = {};

    const shouldValidate = (s) => general || step === s;

    const trim = (v) => v?.trim?.() ?? "";

    const isNumber = (v) => !isNaN(parseFloat(v));

    const addError = (key, message) => {
      if (!errors[key]) errors[key] = message;
    };

    if (shouldValidate(0)) {
      const name = trim(form.name);
      const brand = trim(form.brand);
      const description = trim(form.description);
      const category = trim(form.category);

      if (!name) addError("name", "Product name is required");
      else if (name.length < 3)
        addError("name", "Product name must be at least 3 characters long");
      else if (name.length > 100)
        addError("name", "Product name cannot exceed 100 characters");

      if (!brand) addError("brand", "Brand is required");
      else if (brand.length < 2)
        addError("brand", "Brand name must be at least 2 characters long");
      else if (brand.length > 50)
        addError("brand", "Brand name cannot exceed 50 characters");

      if (!description) addError("description", "Description is required");
      else if (description.length < 10)
        addError(
          "description",
          "Description must be at least 10 characters long"
        );
      else if (description.length > 5000)
        addError("description", "Description cannot exceed 5000 characters");

      if (!category) addError("category", "Category is required");
      else if (!isValidCategory(category))
        addError("category", "Please select a valid category");
    }

    if (shouldValidate(1)) {
      const price = parseFloat(form.price);
      const originalPrice = parseFloat(form.originalPrice);

      if (!form.price) addError("price", "Price is required");
      else if (!isNumber(form.price))
        addError("price", "Price must be a valid number");
      else if (price <= 0) addError("price", "Price must be greater than 0");
      else if (!/^\d+(\.\d{1,2})?$/.test(form.price.toString()))
        addError("price", "Price must have at most 2 decimal places");

      if (form.originalPrice) {
        if (!isNumber(form.originalPrice))
          addError("originalPrice", "Original price must be a valid number");
        else if (originalPrice <= 0)
          addError("originalPrice", "Original price must be greater than 0");
        else if (originalPrice < price)
          addError(
            "originalPrice",
            "Original price must be greater than or equal to the current price"
          );
        else if (originalPrice > price * 10)
          addError(
            "originalPrice",
            "Original price seems unusually high compared to current price"
          );
      }

      if (form.stock !== undefined) {
        if (form.stock < 0) addError("stock", "Stock cannot be negative");
        else if (!Number.isInteger(Number(form.stock)))
          addError("stock", "Stock must be a whole number");
      }

      if (trim(form.sku)) {
        const sku = trim(form.sku);

        if (sku.length < 3)
          addError("sku", "SKU must be at least 3 characters");
        else if (sku.length > 50)
          addError("sku", "SKU cannot exceed 50 characters");
        else if (!/^[A-Za-z0-9-_.]+$/.test(sku))
          addError(
            "sku",
            "SKU can only contain letters, numbers, hyphens, underscores, and periods"
          );
      }
    }

    if (shouldValidate(2) && form.dimensions) {
      const { length, weight } = form.dimensions;

      if (length && (length <= 0 || length > 500))
        addError("dimensions", "Length must be between 0 and 500 cm");

      if (weight && (weight <= 0 || weight > 1000))
        addError("dimensions", "Weight must be between 0 and 1000 kg");
    }

    if (shouldValidate(3)) {
      if (!mainImage || mainImage.length === 0)
        addError("images", "Main image is required");

      if (!additionalImages || additionalImages.length === 0)
        addError("images", "At least additional one product image is required");
      else if (additionalImages.length > 10)
        addError("images", "Maximum of 10 images allowed");
    }
    if (shouldValidate(4)) {
      if (form.features?.length === 0) {
        addError("features", "Minimum of 3 features allowed");
      }
    }

    setErrors(errors);

    const isValid = Object.keys(errors).length === 0;

    if (!isValid) {
      console.warn(
        `Validation failed for step ${step} (${
          Object.keys(errors).length
        } errors):`,
        errors
      );
    }

    return isValid;
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch (err) {
      console.warn("Failed to save product form:", err);
    }
  }, [form]);

  return {
    form,
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
    setForm,
    setErrors,
    additionalImages,
    setAdditionalImages,
    mainImage,
    setMainImage,
    handleSpecificationsChange,
  };
};
