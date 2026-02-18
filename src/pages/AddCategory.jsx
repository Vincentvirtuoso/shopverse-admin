import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaSave,
  FaPlus,
  FaTag,
  FaCog,
  FaStar,
  FaInfoCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaGlobe,
  FaLink,
} from "react-icons/fa";
import CardWrapper from "../components/ui/CardWrapper";
import { toast } from "react-hot-toast";
import { useCategory } from "../hooks/useCategory";
import WrapperBody from "../components/common/WrapperBody";
import WrapperHeader from "../components/common/WrapperHeader";
import RadioCard from "../components/common/RadioCard";
import MultiInput from "../components/common/MultiInput";
import { LuArrowLeft } from "react-icons/lu";
import Spinner from "../components/common/Spinner";
import MetaFieldModal from "../sections/addCategory/MetaFieldModal";
import MetaFieldManagement from "../sections/addCategory/MetaFieldManagement";
import ImageUpload from "../components/ui/ImageUpload";

// Custom slug generator
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const AddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    loadingStates,
    // error,
    // category,
    categories,
    createCategory,
    updateCategory,
    getCategoryById,
    getAllCategories,
    addMetaField,
    updateMetaField,
    removeMetaField,
    // clearError,
  } = useCategory();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    image: "",
    // parent: "",
    sortOrder: 0,
    isFeatured: false,
    isActive: true,
    meta: {
      title: "",
      description: "",
      keywords: [],
    },
    metaFields: [],
  });

  // UI state
  const [activeTab, setActiveTab] = useState("basic");
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [showSEOSection, setShowSEOSection] = useState(false);
  const [metaFieldModal, setMetaFieldModal] = useState({
    isOpen: false,
    mode: "add", // 'add' or 'edit'
    data: null,
    index: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: null,
    index: null,
    name: "",
  });
  const [imagePreview, setImagePreview] = useState({
    icon: null,
    image: null,
  });

  // Load data on mount
  useEffect(() => {
    getAllCategories();
    if (isEditing && id) {
      loadCategory(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCategory = async (categoryId) => {
    try {
      const response = await getCategoryById(categoryId);
      const data = response.data;
      setFormData({
        name: data.name || "",
        slug: data.slug || "",
        description: data.description || "",
        icon: data.icon || "",
        image: data.image || "",
        parent: data.parent?._id || data.parent || "",
        sortOrder: data.sortOrder || 0,
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== false,
        meta: {
          title: data.meta?.title || "",
          description: data.meta?.description || "",
          keywords: data.meta?.keywords || [],
        },
        metaFields: data.metaFields || [],
      });
      setImagePreview({
        icon: data.icon,
        image: data.image,
      });
    } catch (err) {
      toast.error(err.message || "Failed to load category");
      navigate("/categories");
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Auto-generate slug for name field
      if (name === "name" && autoGenerateSlug) {
        setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
      }
    }
  };

  // Handle keywords
  const addKeyword = (keyword) => {
    if (keyword.trim()) {
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          keywords: [...prev.meta.keywords, keyword.trim()],
        },
      }));
    }
  };

  const removeKeyword = (keyword) => {
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        keywords: prev.meta.keywords.filter((item) => item !== keyword),
      },
    }));
  };

  // Handle image upload
  const handleImageUpload = (type, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => ({ ...prev, [type]: reader.result }));
        setFormData((prev) => ({ ...prev, [type]: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUpload = (type) => {
    setImagePreview((prev) => ({ ...prev, [type]: null }));
    setFormData((prev) => ({ ...prev, [type]: null }));
  };

  const openAddMetaField = () => {
    setMetaFieldModal({
      isOpen: true,
      mode: "add",
      data: {
        key: "",
        label: "",
        type: "text",
        unit: "",
        placeholder: "",
        options: [],
        defaultValue: "",
        isRequired: false,
        isFilterable: false,
        isSearchable: false,
        isVisibleOnProductPage: true,
        sortOrder: formData.metaFields.length + 1,
      },
      index: null,
    });
  };

  const openEditMetaField = (index) => {
    setMetaFieldModal({
      isOpen: true,
      mode: "edit",
      data: { ...formData.metaFields[index] },
      index,
    });
  };

  const handleMetaFieldSubmit = async () => {
    const { mode, data, index } = metaFieldModal;

    if (!data.label?.trim()) return toast.error("Field label is required");
    if (!data.key?.trim()) return toast.error("Field key is required");

    const sanitizedKey = data.key
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    if (!/^[a-z]/.test(sanitizedKey)) {
      return toast.error("Key must start with a lowercase letter");
    }

    const finalFieldData = {
      ...data,
      key: sanitizedKey,
      options:
        data.type === "array" || data.type === "select"
          ? data.options || []
          : [],
      defaultValue:
        data.type === "number"
          ? Number(data.defaultValue || 0)
          : data.defaultValue,
      sortOrder:
        data.sortOrder || (mode === "add" ? formData.metaFields.length : 0),
    };

    if (mode === "add") {
      const keyExists = formData.metaFields.some((f) => f.key === sanitizedKey);
      if (keyExists) return toast.error("A field with this key already exists");
    }

    try {
      if (isEditing) {
        if (mode === "add") {
          await addMetaField(id, finalFieldData);
        } else {
          const oldKey = formData.metaFields[index].key;
          await updateMetaField(id, oldKey, finalFieldData);
        }
        await loadCategory(id);
      } else {
        setFormData((prev) => {
          const newFields = [...prev.metaFields];
          if (mode === "add") {
            newFields.push({ ...finalFieldData });
          } else {
            newFields[index] = { ...newFields[index], ...finalFieldData };
          }
          return { ...prev, metaFields: newFields };
        });
      }

      toast.success(
        `Meta field ${mode === "add" ? "added" : "updated"} successfully`,
      );

      setMetaFieldModal({
        isOpen: false,
        mode: "add",
        data: null,
        index: null,
      });
    } catch (err) {
      console.error("MetaField Submit Error:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${mode} meta field`,
      );
    }
  };

  const handleDeleteMetaField = async () => {
    const { index } = deleteConfirm;

    try {
      if (isEditing) {
        await removeMetaField(id, formData.metaFields[index].key);
        await loadCategory(id);
      } else {
        setFormData((prev) => ({
          ...prev,
          metaFields: prev.metaFields.filter((_, i) => i !== index),
        }));
      }

      toast.success("Meta field deleted successfully");
      setDeleteConfirm({ isOpen: false, type: null, index: null, name: "" });
    } catch (err) {
      toast.error(err.message || "Failed to delete meta field");
    }
  };

  // ==================== Form Submission ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.name) {
        toast.error("Category name is required");
        return;
      }

      // Generate slug if empty
      if (!formData.slug && formData.name) {
        formData.slug = generateSlug(formData.name);
      }

      // Prepare data for submission
      const submitData = { ...formData };

      // Handle file uploads
      if (submitData.icon instanceof File) {
        // Will be handled by FormData in the hook
      }
      if (submitData.image instanceof File) {
        // Will be handled by FormData in the hook
      }

      let response;
      if (isEditing) {
        response = await updateCategory(id, submitData);
        toast.success("Category updated successfully");
      } else {
        response = await createCategory(submitData);
        toast.success("Category created successfully");
      }

      console.log(response);

      // Navigate back to list
      setTimeout(() => {
        navigate("/categories");
      }, 1500);
    } catch (err) {
      toast.error(
        err.message || `Failed to ${isEditing ? "update" : "create"} category`,
      );
    }
  };

  // Tabs configuration
  const tabs = [
    { id: "basic", label: "Basic Info", icon: <FaInfoCircle /> },
    { id: "metafields", label: "Meta Fields", icon: <FaCog /> },
  ];

  if (isEditing && loadingStates.fetchCategory) {
    return (
      <div>
        <Spinner size="lg" />
      </div>
    );
  }

  if (loadingStates.fetchCategories && !categories) {
    return (
      <div>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=""
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {isEditing ? "Edit Category" : "Create New Category"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isEditing
              ? "Update category details and meta fields"
              : "Add a new category to organize your products"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <LuArrowLeft /> Back
          </button>
          <button
            type="submit"
            form="category-form"
            disabled={
              isEditing
                ? loadingStates.updateCategory
                : loadingStates.createCategory
            }
            className="px-4 py-2 bg-linear-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isEditing ? (
              loadingStates.updateCategory
            ) : loadingStates.createCategory ? (
              <Spinner
                label="Saving"
                labelPosition="right"
                labelAnimation="pulse"
              />
            ) : (
              <>
                <FaSave /> {isEditing ? "Update" : "Create"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <WrapperBody.Flex
        className="flex gap-2 overflow-hidden overflow-x-auto items-center pb-1 mb-6"
        padding="none"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </WrapperBody.Flex>

      {/* Form */}
      <form id="category-form" onSubmit={handleSubmit}>
        {activeTab === "basic" && (
          <CardWrapper className="mb-6" bodyClassName="">
            <WrapperHeader
              title="Basic Information"
              description="Organize your category hierarchy"
              icon={<FaInfoCircle />}
              className="bg-gray-50/50 dark:bg-neutral-800/50 p-5"
            />
            <WrapperBody.Grid cols={2} gap={6} className="mt-6 p-5">
              {/* Left Column */}
              <WrapperBody.Flex direction="col" gap={4} align="stretch">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800  focus:border-transparent"
                    placeholder="e.g., Electronics"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-400">
                      Slug
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={autoGenerateSlug}
                        onChange={(e) => setAutoGenerateSlug(e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      Auto-generate
                    </label>
                  </div>
                  <div className="relative">
                    <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border pl-10 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/50 text-gray-500 font-mono text-sm disabled:opacity-70"
                      placeholder="electronics"
                    />
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    URL-friendly version of the name
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800  focus:border-transparent"
                    placeholder="Describe this category..."
                  />
                </div>

                {/* Parent Category */}
                {categories && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Parent Category
                    </label>
                    <select
                      name="parent"
                      value={formData.parent}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800  focus:border-transparent"
                    >
                      <option value="">None (Top Level)</option>
                      {categories
                        ?.filter((cat) => !isEditing || cat._id !== id)
                        .map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name} {!cat.isActive && "(Inactive)"}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800  focus:border-transparent"
                  />
                </div>
              </WrapperBody.Flex>

              {/* Right Column */}
              <WrapperBody.Flex direction="col" gap={4}>
                <WrapperBody.Flex className="flex-wrap" gap={4}>
                  <ImageUpload
                    label="Category Icon"
                    value={imagePreview?.icon}
                    onRemove={() => handleRemoveUpload("icon")}
                    onUpload={(file) => handleImageUpload("icon", file)}
                  />
                  <ImageUpload
                    label="Category Image"
                    value={imagePreview?.image}
                    onRemove={() => handleRemoveUpload("image")}
                    onUpload={(file) => handleImageUpload("image", file)}
                  />
                </WrapperBody.Flex>

                {/* Status Toggles */}
                <WrapperBody.Flex
                  direction="col"
                  gap={3}
                  align="stretch"
                  className="flex-1"
                >
                  {[
                    {
                      name: "isFeatured",
                      isChecked: formData.isFeatured,
                      label: "Featured Category",
                      colors: { checked: "text-yellow-500", unChecked: "" },
                      icon: FaStar,
                    },
                    {
                      name: "isActive",
                      isChecked: formData.isActive,
                      label: "Active Status",
                      colors: { checked: "text-green-500", unChecked: "" },
                      icon: FaEye,
                      iconAlt: FaEyeSlash,
                    },
                  ].map((item) => (
                    <RadioCard {...item} handleChange={handleChange} />
                  ))}
                </WrapperBody.Flex>
              </WrapperBody.Flex>
            </WrapperBody.Grid>

            {/* SEO Section */}
            <WrapperBody.Divider className="my-6" />

            <WrapperHeader
              title="SEO Settings"
              icon={<FaGlobe />}
              isExpandable
              expanded={showSEOSection}
              toggleExpand={() => setShowSEOSection(!showSEOSection)}
              padding
              iconSize="p-2 text-xl"
            />

            <AnimatePresence>
              {showSEOSection && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <WrapperBody.Flex direction="col" gap={4} className="p-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        name="meta.title"
                        value={formData.meta.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800  focus:border-transparent"
                        placeholder="SEO title (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        name="meta.description"
                        value={formData.meta.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800  focus:border-transparent"
                        placeholder="SEO description (optional)"
                      />
                    </div>

                    <MultiInput
                      label="Keywords"
                      name="keywords"
                      value={formData.meta.keywords}
                      addItem={addKeyword}
                      removeItem={removeKeyword}
                      placeholder="Add tags (comma-separated)..."
                      mode="comma-separated"
                      allowModeSwitch={false}
                      maxItems={15}
                      minItems={0}
                      maxLength={30}
                      minLength={2}
                      helperText="Tags help customers find your product. Use comma-separated values for bulk entry."
                      icon="keywords"
                      allowDuplicates={false}
                      styling={{
                        primaryColor: "blue",
                        numberBadgeGradient: "from-blue-500 to-blue-600",
                      }}
                    />
                  </WrapperBody.Flex>
                </motion.div>
              )}
            </AnimatePresence>
          </CardWrapper>
        )}

        {activeTab === "metafields" && (
          <MetaFieldManagement
            formData={formData}
            setFormData={setFormData}
            openAddMetaField={openAddMetaField}
            openEditMetaField={openEditMetaField}
            setDeleteConfirm={setDeleteConfirm}
          />
        )}
      </form>

      {/* Meta Field Modal */}
      <AnimatePresence>
        <MetaFieldModal
          isOpen={metaFieldModal.isOpen}
          metaFieldModal={metaFieldModal}
          setMetaFieldModal={setMetaFieldModal}
          handleMetaFieldSubmit={handleMetaFieldSubmit}
        />
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() =>
              setDeleteConfirm({ ...deleteConfirm, isOpen: false })
            }
          >
            <CardWrapper
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shadow-sm bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Meta Field
                  </h3>
                  <p className="text-sm text-gray-400">
                    Are you sure you want to delete "{deleteConfirm.name}"?
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-300/70 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">
                      This action cannot be undone
                    </p>
                    <p>Products using this meta field will lose this data.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteConfirm({ ...deleteConfirm, isOpen: false })
                  }
                  className="flex-1 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {loadingStates.removeMetaField ? (
                  <Spinner
                    label="Deleting"
                    labelAnimation="typing"
                    labelPosition="right"
                  />
                ) : (
                  <button
                    onClick={() => {
                      handleDeleteMetaField(deleteConfirm.index);
                      setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </CardWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddCategory;
