import { useState, useCallback } from "react";
import { useApi } from "./useApi";

export const useCategory = () => {
  const { loading, error, setError, callApi } = useApi();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState(null);

  const handleCategoryMutation = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, transform } = options;

    const response = await apiCall();

    if (transform) {
      return transform(response);
    }

    if (onSuccess) {
      onSuccess(response);
    }

    return response;
  }, []);

  const getAllCategories = useCallback(
    async (params = {}) => {
      const queryParams = new URLSearchParams(params).toString();
      const response = await callApi(
        `/categories${queryParams ? `?${queryParams}` : ""}`,
        "GET",
      );
      setCategories(response.data);
      setPagination(response.pagination);
      return response;
    },
    [callApi],
  );

  const getCategoryById = useCallback(
    async (id) => {
      const response = await callApi(`/categories/${id}`, "GET");
      setCategory(response.data);
      return response;
    },
    [callApi],
  );

  const getCategoryBySlug = useCallback(
    async (slug) => {
      const response = await callApi(`/categories/slug/${slug}`, "GET");
      setCategory(response.data);
      return response;
    },
    [callApi],
  );

  const getActiveCategories = useCallback(async () => {
    return callApi("/categories/active", "GET");
  }, [callApi]);

  const getCategoryHierarchy = useCallback(async () => {
    return callApi("/categories/hierarchy", "GET");
  }, [callApi]);

  const getProductCount = useCallback(
    async (id) => {
      return callApi(`/categories/${id}/product-count`, "GET");
    },
    [callApi],
  );

  const createCategory = useCallback(
    async (categoryData) => {
      let data;
      let headers = { "Content-Type": "application/json" };

      if (categoryData.image || categoryData.icon) {
        const formData = new FormData();
        const { image, icon, ...restData } = categoryData;

        formData.append("data", JSON.stringify(restData));

        if (image instanceof File) {
          formData.append("image", image);
        }
        if (icon instanceof File) {
          formData.append("icon", icon);
        }

        data = formData;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        data = categoryData;
      }

      const response = await handleCategoryMutation(
        () => callApi("/categories", "POST", data, { headers }),
        {
          onSuccess: (res) => setCategory(res.data),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation],
  );

  const updateCategory = useCallback(
    async (id, categoryData) => {
      // Handle FormData for file uploads
      let data;
      let headers = { "Content-Type": "application/json" };

      if (
        categoryData.image instanceof File ||
        categoryData.icon instanceof File ||
        categoryData.image === null ||
        categoryData.icon === null
      ) {
        const formData = new FormData();
        const { image, icon, ...restData } = categoryData;

        formData.append("data", JSON.stringify(restData));

        if (image instanceof File) {
          formData.append("image", image);
        } else if (image === null) {
          formData.append("data", JSON.stringify({ ...restData, image: "" }));
        }

        if (icon instanceof File) {
          formData.append("icon", icon);
        } else if (icon === null) {
          formData.append("data", JSON.stringify({ ...restData, icon: "" }));
        }

        data = formData;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        data = categoryData;
      }

      const response = await handleCategoryMutation(
        () => callApi(`/categories/${id}`, "PATCH", data, { headers }),
        {
          onSuccess: (res) => setCategory(res.data),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation],
  );

  const renameCategory = useCallback(
    async (id, name) => {
      const response = await handleCategoryMutation(
        () => callApi(`/categories/${id}/rename`, "PATCH", { name }),
        {
          onSuccess: (res) => setCategory(res.data),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation],
  );

  const deleteCategory = useCallback(
    async (id, globalFallbackId = null) => {
      const response = await handleCategoryMutation(
        () =>
          callApi(
            `/categories/${id}`,
            "DELETE",
            globalFallbackId ? { globalFallbackId } : {},
          ),
        {
          onSuccess: () => {
            setCategories((prev) => prev.filter((c) => c._id !== id));
            if (category?._id === id) setCategory(null);
          },
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, category],
  );

  const reorderCategories = useCallback(
    async (ids) => {
      return callApi("/categories/reorder", "PATCH", { ids });
    },
    [callApi],
  );

  const updateCategoryStatus = useCallback(
    async (id, isActive) => {
      const response = await handleCategoryMutation(
        () => callApi(`/categories/${id}/status`, "PATCH", { isActive }),
        {
          onSuccess: () => {
            setCategories((prev) =>
              prev.map((c) => (c._id === id ? { ...c, isActive } : c)),
            );
            if (category?._id === id) {
              setCategory((prev) => ({ ...prev, isActive }));
            }
          },
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, category],
  );

  const setFallbackCategory = useCallback(
    async (id, fallbackCategoryId) => {
      const response = await handleCategoryMutation(
        () =>
          callApi(`/categories/${id}/fallback`, "PATCH", {
            fallbackCategoryId,
          }),
        {
          onSuccess: () => {
            setCategories((prev) =>
              prev.map((c) =>
                c._id === id
                  ? { ...c, fallbackCategory: fallbackCategoryId }
                  : c,
              ),
            );
            if (category?._id === id) {
              setCategory((prev) => ({
                ...prev,
                fallbackCategory: fallbackCategoryId,
              }));
            }
          },
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, category],
  );

  const updateCategoryInState = useCallback(
    (categoryId, updatedCategory) => {
      setCategories((prev) =>
        prev.map((c) => (c._id === categoryId ? updatedCategory : c)),
      );
      if (category?._id === categoryId) {
        setCategory(updatedCategory);
      }
    },
    [category],
  );

  const addSubCategory = useCallback(
    async (categoryId, subCategoryData) => {
      // Handle FormData for file uploads
      let data;
      let headers = { "Content-Type": "application/json" };

      if (subCategoryData.image instanceof File) {
        const formData = new FormData();
        const { image, ...restData } = subCategoryData;

        formData.append("data", JSON.stringify(restData));
        formData.append("image", image);

        data = formData;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        data = subCategoryData;
      }

      const response = await handleCategoryMutation(
        () =>
          callApi(`/categories/${categoryId}/subcategories`, "POST", data, {
            headers,
          }),
        {
          onSuccess: (res) => updateCategoryInState(categoryId, res.data),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, updateCategoryInState],
  );

  const updateSubCategory = useCallback(
    async (categoryId, subCategorySlug, subCategoryData) => {
      // Handle FormData for file uploads
      let data;
      let headers = { "Content-Type": "application/json" };

      if (
        subCategoryData.image instanceof File ||
        subCategoryData.image === null
      ) {
        const formData = new FormData();
        const { image, ...restData } = subCategoryData;

        formData.append("data", JSON.stringify(restData));

        if (image instanceof File) {
          formData.append("image", image);
        } else if (image === null) {
          formData.append("data", JSON.stringify({ ...restData, image: "" }));
        }

        data = formData;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        data = subCategoryData;
      }

      const response = await handleCategoryMutation(
        () =>
          callApi(
            `/categories/${categoryId}/subcategories/${subCategorySlug}`,
            "PATCH",
            data,
            { headers },
          ),
        {
          onSuccess: (res) => updateCategoryInState(categoryId, res.data),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, updateCategoryInState],
  );

  const removeSubCategory = useCallback(
    async (categoryId, subCategorySlug) => {
      const response = await handleCategoryMutation(
        () =>
          callApi(
            `/categories/${categoryId}/subcategories/${subCategorySlug}`,
            "DELETE",
          ),
        {
          onSuccess: (res) => updateCategoryInState(categoryId, res.data),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, updateCategoryInState],
  );

  const reorderSubCategories = useCallback(
    async (categoryId, ids) => {
      const response = await handleCategoryMutation(
        () =>
          callApi(`/categories/${categoryId}/subcategories/reorder`, "PATCH", {
            ids,
          }),
        {
          onSuccess: (res) => updateCategoryInState(categoryId, res.data),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, updateCategoryInState],
  );

  const updateMetaFieldInState = useCallback(
    (categoryId, response) => {
      setCategories((prev) =>
        prev.map((c) => (c._id === categoryId ? response.data : c)),
      );
      if (category?._id === categoryId) {
        setCategory(response.data);
      }
    },
    [category],
  );

  const addMetaField = useCallback(
    async (categoryId, metaFieldData) => {
      const response = await handleCategoryMutation(
        () =>
          callApi(
            `/categories/${categoryId}/metafields`,
            "POST",
            metaFieldData,
          ),
        {
          onSuccess: (res) => updateMetaFieldInState(categoryId, res),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, updateMetaFieldInState],
  );

  const updateMetaField = useCallback(
    async (categoryId, key, metaFieldData) => {
      const response = await handleCategoryMutation(
        () =>
          callApi(
            `/categories/${categoryId}/metafields/${key}`,
            "PATCH",
            metaFieldData,
          ),
        {
          onSuccess: (res) => updateMetaFieldInState(categoryId, res),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, updateMetaFieldInState],
  );

  const renameMetaFieldKey = useCallback(
    async (categoryId, oldKey, newKey) => {
      const response = await handleCategoryMutation(
        () =>
          callApi(
            `/categories/${categoryId}/metafields/${oldKey}/rename`,
            "PATCH",
            { newKey },
          ),
        {
          onSuccess: (res) => updateMetaFieldInState(categoryId, res),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, updateMetaFieldInState],
  );

  const removeMetaField = useCallback(
    async (categoryId, key) => {
      const response = await handleCategoryMutation(
        () => callApi(`/categories/${categoryId}/metafields/${key}`, "DELETE"),
        {
          onSuccess: (res) => updateMetaFieldInState(categoryId, res),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, updateMetaFieldInState],
  );

  const reorderMetaFields = useCallback(
    async (categoryId, keys) => {
      const response = await handleCategoryMutation(
        () =>
          callApi(`/categories/${categoryId}/metafields/reorder`, "PATCH", {
            ids: keys,
          }),
        {
          onSuccess: (res) => updateMetaFieldInState(categoryId, res),
        },
      );

      return response;
    },
    [callApi, handleCategoryMutation, updateMetaFieldInState],
  );

  // Clear states
  const clearCategory = useCallback(() => {
    setCategory(null);
  }, []);

  const clearCategories = useCallback(() => {
    setCategories([]);
    setPagination(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // States
    loading,
    error,
    categories,
    category,
    pagination,

    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    getActiveCategories,
    getCategoryHierarchy,
    getProductCount,
    createCategory,
    updateCategory,
    renameCategory,
    deleteCategory,
    reorderCategories,
    updateCategoryStatus,
    setFallbackCategory,

    addSubCategory,
    updateSubCategory,
    removeSubCategory,
    reorderSubCategories,

    addMetaField,
    updateMetaField,
    renameMetaFieldKey,
    removeMetaField,
    reorderMetaFields,

    clearCategory,
    clearCategories,
    clearError,
  };
};
