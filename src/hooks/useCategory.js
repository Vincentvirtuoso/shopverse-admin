import { useState, useCallback } from "react";
import { useApi } from "./useApi";

export const useCategory = () => {
  const { loading: apiLoading, error, setError, callApi } = useApi();

  const [loadingStates, setLoadingStates] = useState({
    fetchCategories: false,
    fetchCategory: false,
    fetchActiveCategories: false,
    fetchHierarchy: false,
    fetchProductCount: false,
    createCategory: false,
    updateCategory: false,
    renameCategory: false,
    deleteCategory: false,
    reorderCategories: false,
    updateStatus: false,
    setFallback: false,
    addMetaField: false,
    updateMetaField: false,
    renameMetaField: false,
    removeMetaField: false,
    reorderMetaFields: false,
  });

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Helper to manage loading states
  const withLoading = useCallback(
    async (loadingKey, apiCall) => {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));
      setError(null);

      try {
        const result = await apiCall();
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [setError],
  );

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
      return withLoading("fetchCategories", async () => {
        const queryParams = new URLSearchParams(params).toString();
        const response = await callApi(
          `/categories${queryParams ? `?${queryParams}` : ""}`,
          "GET",
        );
        setCategories(response.data);
        setPagination(response.pagination);
        return response;
      });
    },
    [callApi, withLoading],
  );

  const getCategoryById = useCallback(
    async (id) => {
      return withLoading("fetchCategory", async () => {
        const response = await callApi(`/categories/${id}`, "GET");
        setCategory(response.data);
        return response;
      });
    },
    [callApi, withLoading],
  );

  const getCategoryBySlug = useCallback(
    async (slug) => {
      return withLoading("fetchCategory", async () => {
        const response = await callApi(`/categories/slug/${slug}`, "GET");
        setCategory(response.data);
        return response;
      });
    },
    [callApi, withLoading],
  );

  const getActiveCategories = useCallback(async () => {
    return withLoading("fetchActiveCategories", async () => {
      return callApi("/categories/active", "GET");
    });
  }, [callApi, withLoading]);

  const getCategoryHierarchy = useCallback(async () => {
    return withLoading("fetchHierarchy", async () => {
      return callApi("/categories/hierarchy", "GET");
    });
  }, [callApi, withLoading]);

  const getProductCount = useCallback(
    async (id) => {
      return withLoading("fetchProductCount", async () => {
        return callApi(`/categories/${id}/product-count`, "GET");
      });
    },
    [callApi, withLoading],
  );

  const createCategory = useCallback(
    async (categoryData) => {
      return withLoading("createCategory", async () => {
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
      });
    },
    [callApi, handleCategoryMutation, withLoading],
  );

  const updateCategory = useCallback(
    async (id, categoryData) => {
      return withLoading("updateCategory", async () => {
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
      });
    },
    [callApi, handleCategoryMutation, withLoading],
  );

  const renameCategory = useCallback(
    async (id, name) => {
      return withLoading("renameCategory", async () => {
        const response = await handleCategoryMutation(
          () => callApi(`/categories/${id}/rename`, "PATCH", { name }),
          {
            onSuccess: (res) => setCategory(res.data),
          },
        );

        return response;
      });
    },
    [callApi, handleCategoryMutation, withLoading],
  );

  const deleteCategory = useCallback(
    async (id, globalFallbackId = null) => {
      return withLoading("deleteCategory", async () => {
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
      });
    },
    [callApi, handleCategoryMutation, category, withLoading],
  );

  const reorderCategories = useCallback(
    async (ids) => {
      return withLoading("reorderCategories", async () => {
        return callApi("/categories/reorder", "POST", { ids });
      });
    },
    [callApi, withLoading],
  );

  const updateCategoryStatus = useCallback(
    async (id, isActive) => {
      return withLoading("updateStatus", async () => {
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
      });
    },
    [callApi, handleCategoryMutation, category, withLoading],
  );

  const setFallbackCategory = useCallback(
    async (id, fallbackCategoryId) => {
      return withLoading("setFallback", async () => {
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
      });
    },
    [callApi, handleCategoryMutation, category, withLoading],
  );

  const updateMetaFieldInState = useCallback(
    (response) => {
      setCategories((prev) =>
        prev.map((c) => (c._id === response.data._id ? response.data : c)),
      );

      if (category?._id === response.data._id) {
        console.log("yes");

        setCategory(response.data);
      }
    },
    [category],
  );

  const addMetaField = useCallback(
    async (categoryId, metaFieldData) => {
      try {
        setLoadingStates((prev) => ({ ...prev, addMetaField: true }));
        setError(null);
        const response = await handleCategoryMutation(
          () =>
            callApi(
              `/categories/${categoryId}/metafields`,
              "POST",
              metaFieldData,
            ),
          {
            onSuccess: (res) => {
              updateMetaFieldInState(res);
            },
          },
        );

        await getCategoryById(categoryId);

        return response;
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingStates((prev) => ({ ...prev, addMetaField: false }));
      }
    },
    [
      callApi,
      handleCategoryMutation,
      updateMetaFieldInState,
      setLoadingStates,
      setError,
    ],
  );

  const updateMetaField = useCallback(
    async (categoryId, key, metaFieldData) => {
      return withLoading("updateMetaField", async () => {
        const response = await handleCategoryMutation(
          () =>
            callApi(
              `/categories/${categoryId}/metafields/${key}`,
              "PATCH",
              metaFieldData,
            ),
          {
            onSuccess: (res) => updateMetaFieldInState(res),
          },
        );

        return response;
      });
    },
    [callApi, handleCategoryMutation, updateMetaFieldInState, withLoading],
  );

  const renameMetaFieldKey = useCallback(
    async (categoryId, oldKey, newKey) => {
      return withLoading("renameMetaField", async () => {
        const response = await handleCategoryMutation(
          () =>
            callApi(
              `/categories/${categoryId}/metafields/${oldKey}/rename`,
              "PATCH",
              { newKey },
            ),
          {
            onSuccess: (res) => updateMetaFieldInState(res),
          },
        );

        return response;
      });
    },
    [callApi, handleCategoryMutation, updateMetaFieldInState, withLoading],
  );

  const removeMetaField = useCallback(
    async (categoryId, key) => {
      return withLoading("removeMetaField", async () => {
        const response = await handleCategoryMutation(
          () =>
            callApi(`/categories/${categoryId}/metafields/${key}`, "DELETE"),
          {
            onSuccess: (res) => updateMetaFieldInState(res),
          },
        );

        return response;
      });
    },
    [callApi, handleCategoryMutation, updateMetaFieldInState, withLoading],
  );

  const reorderMetaFields = useCallback(
    async (categoryId, keys) => {
      return withLoading("reorderMetaFields", async () => {
        const response = await handleCategoryMutation(
          () =>
            callApi(`/categories/${categoryId}/metafields/reorder`, "PATCH", {
              ids: keys,
            }),
          {
            onSuccess: (res) => updateMetaFieldInState(res),
          },
        );

        return response;
      });
    },
    [callApi, handleCategoryMutation, updateMetaFieldInState, withLoading],
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

  // Reset all loading states
  const resetLoadingStates = useCallback(() => {
    setLoadingStates({
      fetchCategories: false,
      fetchCategory: false,
      fetchActiveCategories: false,
      fetchHierarchy: false,
      fetchProductCount: false,
      createCategory: false,
      updateCategory: false,
      renameCategory: false,
      deleteCategory: false,
      reorderCategories: false,
      updateStatus: false,
      setFallback: false,
      addMetaField: false,
      updateMetaField: false,
      renameMetaField: false,
      removeMetaField: false,
      reorderMetaFields: false,
    });
  }, []);

  return {
    // States
    loading: apiLoading,
    loadingStates,
    error,
    categories,
    category,
    pagination,

    // Actions
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

    addMetaField,
    updateMetaField,
    renameMetaFieldKey,
    removeMetaField,
    reorderMetaFields,

    clearCategory,
    clearCategories,
    clearError,
    resetLoadingStates,
  };
};
