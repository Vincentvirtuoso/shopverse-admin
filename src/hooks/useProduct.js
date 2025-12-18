import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { isValidCategory } from "../assets/addProducts";
import { useEffect } from "react";

export const useProduct = () => {
  const { loading, error, callApi } = useApi();
  const [success, setSuccess] = useState(false);

  const handleProductMutation = useCallback(
    async (endpoint, method, payload) => {
      setSuccess(false);
      let headers = {};
      let dataToSend = payload;

      if (payload instanceof FormData) {
        headers = {};
      } else {
        headers = { "Content-Type": "application/json" };
      }

      const response = await callApi(endpoint, method, dataToSend, {
        headers,
      });
      setSuccess(true);
      return response;
    },
    [callApi]
  );

  const createProduct = useCallback(
    async (productData, formData = null) => {
      const payload = formData || productData;
      return handleProductMutation("/products", "POST", payload);
    },
    [handleProductMutation]
  );

  const updateProduct = useCallback(
    async (id, productData, formData = null) => {
      const payload = formData || productData;
      return handleProductMutation(`/products/${id}`, "PUT", payload);
    },
    [handleProductMutation]
  );

  const getProducts = useCallback(
    async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
      return await callApi(endpoint, "GET");
    },
    [callApi]
  );

  const getProductById = useCallback(
    async (id) => {
      return await callApi(`/products/${id}`, "GET");
    },
    [callApi]
  );

  const deleteProduct = useCallback(
    async (id) => {
      const response = await callApi(`/products/${id}`, "DELETE");
      return response;
    },
    [callApi]
  );

  const getBestSellers = useCallback(async () => {
    return await callApi("/products/best-sellers", "GET");
  }, [callApi]);

  const getProductStats = useCallback(async () => {
    return await callApi("/products/stats", "GET");
  }, [callApi]);

  return {
    loading,
    error,
    success,
    createProduct,
    updateProduct,
    getProducts,
    getProductById,
    deleteProduct,
    getBestSellers,
    getProductStats,
    setSuccess,
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
  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

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

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim().toLowerCase())) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
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
    setTagInput("");
    setFeatureInput("");
    setKeywordInput("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const validateForm = (step, general = false) => {
    const errors = {};

    const shouldValidate = (s) => general || step === s;

    const trim = (v) => v?.trim?.() ?? "";

    const isEmpty = (v) => !trim(v);

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
      else if (price > 1_000_000)
        addError("price", "Price cannot exceed 1,000,000");
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
      if (!form.image) addError("images", "Main image is required");

      if (!form.images || form.images.length === 0)
        addError("images", "At least one product image is required");
      else if (form.images.length > 10)
        addError("images", "Maximum of 10 images allowed");
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
    tagInput,
    featureInput,
    keywordInput,
    setTagInput,
    setFeatureInput,
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
  };
};
