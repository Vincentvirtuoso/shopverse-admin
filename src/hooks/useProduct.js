import { useState, useCallback, useMemo } from "react";
import { useApi } from "./useApi";
import { useEffect } from "react";
import useValidateForm from "./useValidateForm";

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
    [callApi],
  );

  // Create a product
  const createProduct = useCallback(
    (productData, formData = null) =>
      handleProductMutation("/products", "POST", formData || productData),
    [handleProductMutation],
  );

  // Update a product
  const updateProduct = useCallback(
    (id, productData, formData = null) =>
      handleProductMutation(`/products/${id}`, "PUT", formData || productData),
    [handleProductMutation],
  );

  // Delete a product
  const deleteProduct = useCallback(
    (id) => handleProductMutation(`/products/${id}`, "DELETE"),
    [handleProductMutation],
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
    [callApi],
  );

  // Fetch single product by ID
  const getProductById = useCallback(
    (id) => callApi(`/products/${id}`, "GET"),
    [callApi],
  );

  // Best sellers
  const getBestSellers = useCallback(
    () => callApi("/products/best-sellers", "GET"),
    [callApi],
  );

  // Product stats
  const getProductStats = useCallback(
    () => callApi("/products/stats", "GET"),
    [callApi],
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

export const useProductForm = (initialValues = {}, options = {}) => {
  const STORAGE_KEY = "product-form";
  const initialForm = useMemo(
    () => ({
      tags: [],
      features: [],
      variants: [],
      ...initialValues,
    }),
    [initialValues],
  );

  const { isEditMode = false, openJsonInput = null } = options;

  const [form, setForm] = useState(initialForm);
  const [dirtyFields, setDirtyFields] = useState(new Set()); // Track changed fields
  const [mainImage, setMainImage] = useState([]);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [initialMainImage, setInitialMainImage] = useState(null);
  const [_, setInitialAdditionalImages] = useState([]);

  useEffect(() => {
    if (!initialForm) return;

    if (isEditMode) {
      setForm(initialForm);
      setDirtyFields(new Set());

      if (initialForm.image) {
        setMainImage([initialForm.image]);
        setInitialMainImage(initialForm.image);
      }

      if (initialForm.images) {
        setAdditionalImages([...initialForm.images]);
        setInitialAdditionalImages([...initialForm.images]);
      }
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      setForm(saved ? { ...initialForm, ...JSON.parse(saved) } : initialForm);
      setMainImage([]);
      setAdditionalImages([]);
      setDirtyFields(new Set());
    }
  }, [initialForm, isEditMode]);

  const [errors, setErrors] = useState({});
  const [keywordInput, setKeywordInput] = useState("");

  const { validateForm } = useValidateForm(
    form,
    setErrors,
    mainImage,
    additionalImages,
  );

  const markDirty = useCallback(
    (fieldPath) => {
      const normalizedPath = fieldPath.replace(/\[(\d+)\]/g, ".$1");

      setDirtyFields((prev) => new Set([...prev, normalizedPath]));

      const parts = normalizedPath.split(".");
      let path = "";
      parts.forEach((part, index) => {
        if (index === 0) {
          path = part;
        } else {
          path = `${path}.${part}`;
        }
        setDirtyFields((prev) => new Set([...prev, path]));
      });
    },
    [setDirtyFields],
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent.includes(".")) {
        const [grandParent, middle] = parent.split(".");
        setForm((prev) => {
          const updated = {
            ...prev,
            [grandParent]: {
              ...prev[grandParent],
              [middle]: {
                ...prev[grandParent]?.[middle],
                [child]: newValue,
              },
            },
          };
          return updated;
        });
        markDirty(name);
      } else {
        setForm((prev) => {
          const updated = {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: newValue,
            },
          };
          return updated;
        });
        markDirty(name);
      }
    } else {
      setForm((prev) => {
        const updated = { ...prev, [name]: newValue };
        return updated;
      });
      markDirty(name);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleJsonEditField = (fieldPath, currentValue, setNotification) => {
    // for (const key of fieldPath) {
    //   if (currentValue instanceof Map) {
    //     currentValue = currentValue.get(key);
    //   } else {
    //     currentValue = currentValue?.[key];
    //   }
    // }

    openJsonInput(fieldPath, currentValue, {
      title: `Edit ${fieldPath.join(" > ")}`,
      onSave: (savedData) => {
        console.log("Saved data:", savedData);
        setNotification?.({
          type: "success",
          title: "JSON Updated",
          message: "Form data has been updated from JSON input.",
        });
      },
    });
  };

  const handleJsonAllFieldEdit = ({ setNotification }) => {
    openJsonInput(null, form, {
      title: "Edit Entire Product",
      onSave: (savedData) => {
        console.log("Saved entire form:", savedData);
        setNotification?.({
          type: "success",
          title: "JSON Updated",
          message: "Form data has been updated from JSON input.",
        });
      },
    });
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
      markDirty("tags");
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
    markDirty("tags");
  };

  const addFeature = (feature) => {
    if (!feature) return;

    setForm((prev) => ({
      ...prev,
      features: [...(prev.features || []), feature],
    }));
    markDirty("features");
  };

  const removeFeature = (featureToRemove) => {
    setForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((f) => f !== featureToRemove),
    }));
    markDirty("features");
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setForm((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          keywords: [...(prev.meta?.keywords || []), keywordInput.trim()],
        },
      }));
      markDirty("meta.keywords");
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setForm((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        keywords: (prev.meta?.keywords || []).filter(
          (keyword) => keyword !== keywordToRemove,
        ),
      },
    }));
    markDirty("meta.keywords");
  };

  const handleSpecificationsChange = useCallback((newSpecs) => {
    setForm((prev) => ({
      ...prev,
      specifications: newSpecs,
    }));
    markDirty("specifications");
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
    markDirty("variants");
  };

  const updateVariant = useCallback(
    (
      variantIndex,
      field,
      value,
      options = { isObject: false, objectName: "" },
    ) => {
      if (options.isObject) {
        setForm((prev) => ({
          ...prev,
          variants: prev.variants.map((variant, index) =>
            index === variantIndex
              ? {
                  ...variant,
                  [options.objectName]: {
                    ...variant[options.objectName],
                    [field]: value,
                  },
                }
              : variant,
          ),
        }));

        markDirty(`variants.${variantIndex}.${options.objectName}.${field}`);
        markDirty(`variants.${variantIndex}.${options.objectName}`);
        markDirty(`variants.${variantIndex}`);
        markDirty("variants");
      } else {
        setForm((prev) => {
          const updatedVariants = [...prev.variants];
          updatedVariants[variantIndex] = {
            ...updatedVariants[variantIndex],
            [field]: value,
          };
          return { ...prev, variants: updatedVariants };
        });

        markDirty(`variants.${variantIndex}.${field}`);
        markDirty(`variants.${variantIndex}`);
        markDirty("variants");
      }
    },
    [markDirty],
  );

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
    markDirty("variants");
  };

  const getChangedFields = useCallback(() => {
    if (!isEditMode) {
      return JSON.parse(JSON.stringify(form));
    }

    const changed = {};
    const initial = initialForm;

    const clone = (value) => {
      if (value instanceof Map) {
        return new Map(value);
      }
      return JSON.parse(JSON.stringify(value));
    };

    const simpleFields = [
      "name",
      "brand",
      "price",
      "originalPrice",
      "discount",
      "rating",
      "reviewCount",
      "shortDescription",
      "description",
      "category",
      "subCategory",
      "inStock",
      "stockCount",
      "availabilityType",
      "unit",
      "sku",
      "isBestSeller",
      "isFeatured",
      "isNewArrival",
      "features",
      "tags",
    ];

    simpleFields.forEach((field) => {
      if (dirtyFields.has(field)) {
        if (JSON.stringify(form[field]) !== JSON.stringify(initial[field])) {
          changed[field] = clone(form[field]);
        }
      }
    });

    if (
      dirtyFields.has("weight") ||
      dirtyFields.has("weight.value") ||
      dirtyFields.has("weight.unit")
    ) {
      const weightChanged =
        form.weight?.value !== initial.weight?.value ||
        form.weight?.unit !== initial.weight?.unit;

      if (weightChanged) {
        changed.weight = {
          value: form.weight?.value || "",
          unit: form.weight?.unit || "g",
        };
      }
    }

    if (
      dirtyFields.has("dimensions") ||
      dirtyFields.has("dimensions.length") ||
      dirtyFields.has("dimensions.width") ||
      dirtyFields.has("dimensions.height") ||
      dirtyFields.has("dimensions.unit")
    ) {
      const dimensionsChanged =
        form.dimensions?.length !== initial.dimensions?.length ||
        form.dimensions?.width !== initial.dimensions?.width ||
        form.dimensions?.height !== initial.dimensions?.height ||
        form.dimensions?.unit !== initial.dimensions?.unit;

      if (dimensionsChanged) {
        changed.dimensions = {
          length: form.dimensions?.length || 0,
          width: form.dimensions?.width || 0,
          height: form.dimensions?.height || 0,
          unit: form.dimensions?.unit || "cm",
        };
      }
    }

    if (dirtyFields.has("specifications")) {
      const specsChanged =
        JSON.stringify([...form.specifications]) !==
        JSON.stringify([...initial.specifications]);

      if (specsChanged) {
        changed.specifications = new Map(form.specifications);
      }
    }

    if (
      dirtyFields.has("shippingInfo") ||
      dirtyFields.has("shippingInfo.dimensions") ||
      dirtyFields.has("shippingInfo.weight") ||
      dirtyFields.has("shippingInfo.isFreeShipping") ||
      dirtyFields.has("shippingInfo.deliveryTime") ||
      dirtyFields.has("shippingInfo.shippingClass")
    ) {
      const shippingChanged =
        JSON.stringify(form.shippingInfo) !==
        JSON.stringify(initial.shippingInfo);

      if (shippingChanged) {
        changed.shippingInfo = {
          dimensions: { ...form.shippingInfo?.dimensions },
          weight: form.shippingInfo?.weight || 0,
          isFreeShipping: form.shippingInfo?.isFreeShipping || false,
          deliveryTime: form.shippingInfo?.deliveryTime || "3-5 business days",
          shippingClass: form.shippingInfo?.shippingClass || "",
        };
      }
    }

    if (
      dirtyFields.has("meta") ||
      dirtyFields.has("meta.title") ||
      dirtyFields.has("meta.description") ||
      dirtyFields.has("meta.keywords")
    ) {
      const metaChanged =
        form.meta?.title !== initial.meta?.title ||
        form.meta?.description !== initial.meta?.description ||
        form.meta?.keywords !== initial.meta?.keywords;

      if (metaChanged) {
        changed.meta = {
          title: form.meta?.title || "",
          description: form.meta?.description || "",
          keywords: form.meta?.keywords || "",
        };
      }
    }

    if (
      dirtyFields.has("variants") ||
      Array.from(dirtyFields).some((f) => f.startsWith("variants"))
    ) {
      const initialVariants = initial.variants || [];

      const changedVariants = form.variants
        .map((variant, index) => {
          const initialVariant = initialVariants[index];

          if (!initialVariant) {
            return clone(variant);
          }

          const hasChanges = Object.keys(variant).some((key) => {
            if (key === "attributes") {
              return (
                JSON.stringify(variant.attributes) !==
                JSON.stringify(initialVariant.attributes)
              );
            }
            return variant[key] !== initialVariant[key];
          });

          return hasChanges ? clone(variant) : null;
        })
        .filter(Boolean);

      if (changedVariants.length > 0) {
        changed.variants = changedVariants;
      }
    }

    if (initial.variants?.length > form.variants.length) {
      const deletedVariantIds = initial.variants
        .filter((_, index) => !form.variants[index])
        .map((v) => v.id)
        .filter(Boolean);

      if (deletedVariantIds.length > 0) {
        changed.deletedVariantIds = deletedVariantIds;
      }
    }

    Object.keys(changed).forEach((key) => {
      if (
        changed[key] === undefined ||
        changed[key] === null ||
        (typeof changed[key] === "object" &&
          !(changed[key] instanceof Map) &&
          Object.keys(changed[key]).length === 0) ||
        (Array.isArray(changed[key]) && changed[key].length === 0)
      ) {
        delete changed[key];
      }
    });

    if (Object.keys(changed).length > 0) {
      changed.id = initial.id;
    }

    return changed;
  }, [form, initialForm, dirtyFields, isEditMode]);

  const getChangedImages = useCallback(() => {
    if (!isEditMode) {
      return {
        mainImage: mainImage[0] instanceof File ? mainImage[0] : null,
        additionalImages: additionalImages.filter((img) => img instanceof File),
      };
    }

    const changes = {
      mainImage: null,
      additionalImages: [],
    };

    if (mainImage[0] !== initialMainImage) {
      changes.mainImage = mainImage[0] instanceof File ? mainImage[0] : null;
    }

    if (additionalImages.length > 0) {
      changes.additionalImages = additionalImages.filter(
        (img) => img instanceof File,
      );
    }

    return changes;
  }, [mainImage, additionalImages, initialMainImage, isEditMode]);

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setKeywordInput("");
    setDirtyFields(new Set());
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    if (!isEditMode) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      } catch (err) {
        console.warn("Failed to save product form:", err);
      }
    }
  }, [form, isEditMode]);

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
    initialForm,
    getChangedFields,
    getChangedImages,
    dirtyFields,
    isEditMode,
    markDirty,
    handleJsonEditField,
    handleJsonAllFieldEdit,
  };
};
