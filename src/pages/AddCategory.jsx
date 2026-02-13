import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaSave,
  FaTimes,
  FaTrash,
  FaPlus,
  FaGripVertical,
  FaImage,
  FaTag,
  FaCog,
  FaStar,
  FaRegStar,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaSearch,
  FaUpload,
  FaGlobe,
  FaLink,
  FaHashtag,
  FaCalendar,
  FaCheckSquare,
  FaList,
  FaDollarSign,
  FaPercent,
  FaWeight,
  FaRuler,
  FaCube,
  FaPalette,
  FaSort,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import CardWrapper from "../components/ui/CardWrapper";
import { toast } from "react-hot-toast";
import { useCategory } from "../hooks/useCategory";
import WrapperBody from "../components/common/WrapperBody";
import WrapperHeader from "../components/common/WrapperHeader";
import WrapperFooter from "../components/common/WrapperFooter";
import MiniFileUpload from "../components/common/MiniFileUpload";
import RadioCard from "../components/common/RadioCard";
import MultiInput from "../components/common/MultiInput";

// Custom slug generator
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Meta Field Types
const META_FIELD_TYPES = [
  { value: "string", label: "Text", icon: <FaTag /> },
  { value: "number", label: "Number", icon: <FaHashtag /> },
  { value: "boolean", label: "Yes/No", icon: <FaCheckSquare /> },
  { value: "array", label: "List", icon: <FaList /> },
  { value: "date", label: "Date", icon: <FaCalendar /> },
];

// Unit options for number fields
const UNIT_OPTIONS = [
  { value: "", label: "None" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "lb", label: "Pounds (lb)" },
  { value: "oz", label: "Ounces (oz)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "l", label: "Liters (l)" },
  { value: "gal", label: "Gallons (gal)" },
  { value: "cm", label: "Centimeters (cm)" },
  { value: "m", label: "Meters (m)" },
  { value: "in", label: "Inches (in)" },
  { value: "ft", label: "Feet (ft)" },
  { value: "px", label: "Pixels (px)" },
  { value: "em", label: "Em (em)" },
  { value: "rem", label: "Rem (rem)" },
  { value: "%", label: "Percent (%)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
];

const AddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    // loading,
    // error,
    // category,
    categories,
    createCategory,
    updateCategory,
    getCategoryById,
    getAllCategories,
    addSubCategory,
    updateSubCategory,
    removeSubCategory,
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
    parent: "",
    sortOrder: 0,
    isFeatured: false,
    isActive: true,
    meta: {
      title: "",
      description: "",
      keywords: [],
    },
    subCategories: [],
    metaFields: [],
  });

  // UI state
  const [activeTab, setActiveTab] = useState("basic");
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [showSEOSection, setShowSEOSection] = useState(false);
  // const [keywordInput, setKeywordInput] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    subcategories: true,
    metafields: true,
  });
  const [subCategoryModal, setSubCategoryModal] = useState({
    isOpen: false,
    mode: "add", // 'add' or 'edit'
    data: null,
    index: null,
  });
  const [metaFieldModal, setMetaFieldModal] = useState({
    isOpen: false,
    mode: "add", // 'add' or 'edit'
    data: null,
    index: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: null, // 'subcategory' or 'metafield'
    index: null,
    name: "",
  });
  const [imagePreview, setImagePreview] = useState({
    icon: null,
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data on mount
  useEffect(() => {
    getAllCategories({ isActive: true, isArchived: false });
    if (isEditing && id) {
      loadCategory(id);
    }
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
        subCategories: data.subCategories || [],
        metaFields: data.metaFields || [],
      });
      setImagePreview({
        icon: data.icon,
        image: data.image,
      });
    } catch (err) {
      toast.error("Failed to load category");
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

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ==================== Subcategory Handlers ====================
  const openAddSubCategory = () => {
    setSubCategoryModal({
      isOpen: true,
      mode: "add",
      data: {
        name: "",
        slug: "",
        description: "",
        image: "",
        isActive: true,
        sortOrder: formData.subCategories.length + 1,
      },
      index: null,
    });
  };

  const openEditSubCategory = (index) => {
    setSubCategoryModal({
      isOpen: true,
      mode: "edit",
      data: { ...formData.subCategories[index] },
      index,
    });
  };

  const handleSubCategorySubmit = async () => {
    const { mode, data, index } = subCategoryModal;

    // Validate
    if (!data.name) {
      toast.error("Subcategory name is required");
      return;
    }

    // Generate slug if empty
    if (!data.slug && data.name) {
      data.slug = generateSlug(data.name);
    }

    try {
      if (isEditing) {
        // API call for existing category
        if (mode === "add") {
          await addSubCategory(id, data);
        } else {
          await updateSubCategory(id, formData.subCategories[index].slug, data);
        }

        // Reload category to get updated data
        await loadCategory(id);
      } else {
        // Local state update for new category
        if (mode === "add") {
          setFormData((prev) => ({
            ...prev,
            subCategories: [
              ...prev.subCategories,
              { ...data, _id: Date.now().toString() },
            ],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            subCategories: prev.subCategories.map((item, i) =>
              i === index ? { ...item, ...data } : item,
            ),
          }));
        }
      }

      toast.success(
        `Subcategory ${mode === "add" ? "added" : "updated"} successfully`,
      );
      setSubCategoryModal({
        isOpen: false,
        mode: "add",
        data: null,
        index: null,
      });
    } catch (err) {
      toast.error(err.message || `Failed to ${mode} subcategory`);
    }
  };

  const handleDeleteSubCategory = async () => {
    const { index } = deleteConfirm;

    try {
      if (isEditing) {
        await removeSubCategory(id, formData.subCategories[index].slug);
        await loadCategory(id);
      } else {
        setFormData((prev) => ({
          ...prev,
          subCategories: prev.subCategories.filter((_, i) => i !== index),
        }));
      }

      toast.success("Subcategory deleted successfully");
      setDeleteConfirm({ isOpen: false, type: null, index: null, name: "" });
    } catch (err) {
      toast.error(err.message || "Failed to delete subcategory");
    }
  };

  // ==================== Meta Field Handlers ====================
  const openAddMetaField = () => {
    setMetaFieldModal({
      isOpen: true,
      mode: "add",
      data: {
        key: "",
        label: "",
        type: "string",
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

    // Validate
    if (!data.key) {
      toast.error("Field key is required");
      return;
    }
    if (!data.label) {
      toast.error("Field label is required");
      return;
    }

    // Format key
    data.key = data.key.toLowerCase().replace(/[^a-z0-9_]/g, "_");

    try {
      if (isEditing) {
        // API call for existing category
        if (mode === "add") {
          await addMetaField(id, data);
        } else {
          await updateMetaField(id, formData.metaFields[index].key, data);
        }

        // Reload category to get updated data
        await loadCategory(id);
      } else {
        // Local state update for new category
        if (mode === "add") {
          setFormData((prev) => ({
            ...prev,
            metaFields: [
              ...prev.metaFields,
              { ...data, _id: Date.now().toString() },
            ],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            metaFields: prev.metaFields.map((item, i) =>
              i === index ? { ...item, ...data } : item,
            ),
          }));
        }
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
      toast.error(err.message || `Failed to ${mode} meta field`);
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
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name) {
        toast.error("Category name is required");
        setIsSubmitting(false);
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

      // Navigate back to list
      setTimeout(() => {
        navigate("/categories");
      }, 1500);
    } catch (err) {
      toast.error(
        err.message || `Failed to ${isEditing ? "update" : "create"} category`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tabs configuration
  const tabs = [
    { id: "basic", label: "Basic Info", icon: <FaInfoCircle /> },
    { id: "subcategories", label: "Subcategories", icon: <FaList /> },
    { id: "metafields", label: "Meta Fields", icon: <FaCog /> },
  ];

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
              ? "Update category details, subcategories, and meta fields"
              : "Add a new category to organize your products"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
          <button
            type="submit"
            form="category-form"
            disabled={isSubmitting}
            className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" /> Saving...
              </>
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
                ? "border-indigo-600 text-indigo-600"
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
          <CardWrapper
            title="Basic Information"
            className="mb-6"
            bodyClassName="p-5"
            headerClassName="p-4"
          >
            <WrapperBody.Grid cols={2} gap={6}>
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
                    className="w-full px-3 py-2 rounded-lg  focus:border-transparent"
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
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Auto-generate
                    </label>
                  </div>
                  {!autoGenerateSlug && (
                    <div className="relative">
                      <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        disabled={autoGenerateSlug}
                        className="w-full pl-10 pr-3 py-2 rounded-lg  focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-neutral-700/40 disabled:text-gray-400"
                        placeholder="electronics"
                      />
                    </div>
                  )}
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
                    className="w-full px-3 py-2 rounded-lg  focus:border-transparent"
                    placeholder="Describe this category..."
                  />
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Parent Category
                  </label>
                  <select
                    name="parent"
                    value={formData.parent}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg  focus:border-transparent"
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
                    className="w-full px-3 py-2 rounded-lg  focus:border-transparent"
                  />
                </div>
              </WrapperBody.Flex>

              {/* Right Column */}
              <WrapperBody.Flex direction="col" gap={4}>
                <MiniFileUpload
                  label="Icon"
                  imagePreview={imagePreview.icon}
                  alt="Icon Preview"
                  onChange={(e) => handleImageUpload("icon", e.target.files[0])}
                  requirements="Recommended: 64x64px SVG or PNG"
                />
                <MiniFileUpload
                  label="Cover Image"
                  imagePreview={imagePreview.image}
                  alt="Cover Image Preview"
                  onChange={(e) =>
                    handleImageUpload("image", e.target.files[0])
                  }
                  requirements=" Recommended: 1200x400px JPG or PNG"
                />

                {/* Status Toggles */}
                <WrapperBody.Card padding="md" border className="mt-2 w-full">
                  <WrapperBody.Flex direction="col" gap={3} align="stretch">
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
                </WrapperBody.Card>
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
                  <WrapperBody.Flex
                    direction="col"
                    gap={4}
                    className="pt-4 px-2"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        name="meta.title"
                        value={formData.meta.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg  focus:border-transparent"
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
                        className="w-full px-3 py-2 rounded-lg  focus:border-transparent"
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
                      suggestions={[
                        "electronics",
                        "gadget",
                        "tech",
                        "innovative",
                        "bestseller",
                        "new-arrival",
                        "premium",
                        "affordable",
                        "durable",
                        "portable",
                        "wireless",
                        "smart",
                      ]}
                      icon="keywords"
                      allowDuplicates={false}
                      styling={{
                        primaryColor: "purple",
                        numberBadgeGradient: "from-purple-500 to-purple-600",
                      }}
                    />
                  </WrapperBody.Flex>
                </motion.div>
              )}
            </AnimatePresence>
          </CardWrapper>
        )}

        {/* Tab: Subcategories */}
        {activeTab === "subcategories" && (
          <CardWrapper
            title="Subcategory Management"
            className="mb-6"
            bodyClassName="p-4"
            headerClassName="p-5"
          >
            <WrapperHeader
              title="Subcategories"
              description="Manage subcategories under this category"
              icon={<FaList />}
              isExpandable
              expanded={expandedSections.subcategories}
              toggleExpand={() => toggleSection("subcategories")}
              // padding
            >
              <button
                type="button"
                onClick={openAddSubCategory}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
              >
                <FaPlus /> Add Subcategory
              </button>
            </WrapperHeader>

            <AnimatePresence>
              {expandedSections.subcategories && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {formData.subCategories.length === 0 ? (
                    <WrapperBody.Card
                      padding="lg"
                      className="text-center mt-4"
                      border
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaList className="text-2xl text-gray-400" />
                      </div>
                      <WrapperBody.Title as="h3" className="text-lg mb-2">
                        No Subcategories Yet
                      </WrapperBody.Title>
                      <WrapperBody.Text muted className="mb-4">
                        Add subcategories to organize products within this
                        category
                      </WrapperBody.Text>
                      <button
                        type="button"
                        onClick={openAddSubCategory}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2"
                      >
                        <FaPlus /> Add Your First Subcategory
                      </button>
                    </WrapperBody.Card>
                  ) : (
                    <WrapperBody.Flex direction="col" gap={3} className="mt-4">
                      {formData.subCategories.map((sub, index) => (
                        <CardWrapper
                          key={sub._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          bodyClassName="flex items-center gap-3 p-4  hover:shadow-sm transition-shadow"
                          bgColor="primary"
                        >
                          <div className="cursor-move text-gray-400">
                            <FaGripVertical />
                          </div>

                          {sub.image && (
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}

                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {sub.name}
                              </h4>
                              {!sub.isActive && (
                                <span className="px-2 py-0.5 bg-gray-200 text-gray-400 rounded-full text-xs">
                                  Inactive
                                </span>
                              )}
                            </div>
                            {/* <p className="text-sm text-gray-400">{sub.slug}</p> */}
                            {sub.description && (
                              <p className="text-sm text-gray-300 mt-1 line-clamp-1">
                                {sub.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditSubCategory(index)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FaCog />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  type: "subcategory",
                                  index,
                                  name: sub.name,
                                })
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </CardWrapper>
                      ))}
                    </WrapperBody.Flex>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardWrapper>
        )}

        {/* Tab: Meta Fields */}
        {activeTab === "metafields" && (
          <CardWrapper
            title="Meta Field Management"
            className="mb-6"
            bodyClassName="p-4"
            headerClassName="p-5"
          >
            <WrapperHeader
              title="Custom Meta Fields"
              description="Define custom fields for products in this category"
              icon={<FaCog />}
              isExpandable
              expanded={expandedSections.metafields}
              toggleExpand={() => toggleSection("metafields")}
            >
              <button
                type="button"
                onClick={openAddMetaField}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm place-self-start"
              >
                <FaPlus /> Add Meta Field
              </button>
            </WrapperHeader>

            <AnimatePresence>
              {expandedSections.metafields && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {formData.metaFields.length === 0 ? (
                    <WrapperBody.Card
                      padding="lg"
                      className="text-center mt-4"
                      border
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCog className="text-2xl text-gray-400" />
                      </div>
                      <WrapperBody.Title as="h3" className="text-lg mb-2">
                        No Meta Fields Yet
                      </WrapperBody.Title>
                      <WrapperBody.Text muted className="mb-4">
                        Add custom fields to collect specific product attributes
                      </WrapperBody.Text>
                      <button
                        type="button"
                        onClick={openAddMetaField}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2"
                      >
                        <FaPlus /> Add Your First Meta Field
                      </button>
                    </WrapperBody.Card>
                  ) : (
                    <WrapperBody.Flex direction="col" gap={3} className="mt-4">
                      {formData.metaFields.map((field, index) => (
                        <CardWrapper
                          key={field._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          bodyClassName="flex items-center gap-3 p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="cursor-move text-gray-400">
                            <FaGripVertical />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {field.label}
                              </h4>
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                                {field.type}
                              </span>
                              {field.isRequired && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{field.key}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                              {field.isFilterable && (
                                <span className="flex items-center gap-1">
                                  <FaFilter /> Filterable
                                </span>
                              )}
                              {field.isSearchable && (
                                <span className="flex items-center gap-1">
                                  <FaSearch /> Searchable
                                </span>
                              )}
                              {field.unit && (
                                <span className="flex items-center gap-1">
                                  Unit: {field.unit}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditMetaField(index)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FaCog />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  type: "metafield",
                                  index,
                                  name: field.label,
                                })
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </CardWrapper>
                      ))}
                    </WrapperBody.Flex>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardWrapper>
        )}
      </form>

      {/* Subcategory Modal */}
      <AnimatePresence>
        {subCategoryModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() =>
              setSubCategoryModal({ ...subCategoryModal, isOpen: false })
            }
          >
            <CardWrapper
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-9/10 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <WrapperHeader
                title={`${subCategoryModal.mode === "add" ? "Add" : "Edit"} Subcategory`}
                onClose={() =>
                  setSubCategoryModal({ ...subCategoryModal, isOpen: false })
                }
                padding
                showDivider
              />

              <WrapperBody padding="lg" spacing="md">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={subCategoryModal.data?.name || ""}
                    onChange={(e) =>
                      setSubCategoryModal((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          name: e.target.value,
                          slug:
                            prev.data?.autoGenerateSlug !== false
                              ? generateSlug(e.target.value)
                              : prev.data?.slug,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg "
                    placeholder="e.g., Smartphones"
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
                        checked={
                          subCategoryModal.data?.autoGenerateSlug !== false
                        }
                        onChange={(e) =>
                          setSubCategoryModal((prev) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              autoGenerateSlug: e.target.checked,
                              slug:
                                e.target.checked && prev.data?.name
                                  ? generateSlug(prev.data.name)
                                  : prev.data?.slug,
                            },
                          }))
                        }
                        className="rounded border-gray-300 text-indigo-600"
                      />
                      Auto-generate
                    </label>
                  </div>
                  {!subCategoryModal.data?.autoGenerateSlug && (
                    <div className="relative">
                      <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={subCategoryModal.data?.slug || ""}
                        onChange={(e) =>
                          setSubCategoryModal((prev) => ({
                            ...prev,
                            data: { ...prev.data, slug: e.target.value },
                          }))
                        }
                        disabled={subCategoryModal.data?.autoGenerateSlug}
                        className="w-full pl-10 pr-3 py-2 rounded-lg  disabled:bg-gray-100"
                        placeholder="smartphones"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={subCategoryModal.data?.description || ""}
                    onChange={(e) =>
                      setSubCategoryModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, description: e.target.value },
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg "
                    placeholder="Describe this subcategory..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSubCategoryModal((prev) => ({
                            ...prev,
                            data: { ...prev.data, image: reader.result },
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                {/* Active Status */}
                <RadioCard
                  label="Active"
                  isChecked={subCategoryModal.data?.isActive !== false}
                  handleChange={(e) =>
                    setSubCategoryModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, isActive: e.target.checked },
                    }))
                  }
                />

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={subCategoryModal.data?.sortOrder || 0}
                    onChange={(e) =>
                      setSubCategoryModal((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          sortOrder: parseInt(e.target.value),
                        },
                      }))
                    }
                    min="0"
                    className="w-full px-3 py-2 rounded-lg "
                  />
                </div>
              </WrapperBody>

              <WrapperFooter padding="lg">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSubCategoryModal({
                        ...subCategoryModal,
                        isOpen: false,
                      })
                    }
                    className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubCategorySubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {subCategoryModal.mode === "add" ? "Add" : "Update"}
                  </button>
                </div>
              </WrapperFooter>
            </CardWrapper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meta Field Modal */}
      <AnimatePresence>
        {metaFieldModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() =>
              setMetaFieldModal({ ...metaFieldModal, isOpen: false })
            }
          >
            <CardWrapper
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <WrapperHeader
                title={`${metaFieldModal.mode === "add" ? "Add" : "Edit"} Meta Field`}
                onClose={() =>
                  setMetaFieldModal({ ...metaFieldModal, isOpen: false })
                }
                padding
                showDivider
              />

              <WrapperBody padding="lg" spacing="md">
                {/* Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Field Key *
                  </label>
                  <div className="relative">
                    <FaHashtag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={metaFieldModal.data?.key || ""}
                      onChange={(e) =>
                        setMetaFieldModal((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            key: e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9_]/g, "_"),
                          },
                        }))
                      }
                      className="w-full pl-10 pr-3 py-2 rounded-lg "
                      placeholder="e.g., screen_size"
                      pattern="[a-z][a-zA-Z0-9_]*"
                      title="Must start with a letter and contain only letters, numbers, or underscores"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Must start with a letter and contain only letters, numbers,
                    or underscores
                  </p>
                </div>

                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    value={metaFieldModal.data?.label || ""}
                    onChange={(e) =>
                      setMetaFieldModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, label: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg "
                    placeholder="e.g., Screen Size"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Field Type *
                  </label>
                  <select
                    value={metaFieldModal.data?.type || "string"}
                    onChange={(e) =>
                      setMetaFieldModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, type: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg "
                  >
                    {META_FIELD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit (for number type) */}
                {metaFieldModal.data?.type === "number" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Unit
                    </label>
                    <select
                      value={metaFieldModal.data?.unit || ""}
                      onChange={(e) =>
                        setMetaFieldModal((prev) => ({
                          ...prev,
                          data: { ...prev.data, unit: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg "
                    >
                      {UNIT_OPTIONS.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Placeholder */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={metaFieldModal.data?.placeholder || ""}
                    onChange={(e) =>
                      setMetaFieldModal((prev) => ({
                        ...prev,
                        data: { ...prev.data, placeholder: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg "
                    placeholder="e.g., Enter screen size"
                  />
                </div>

                {/* Options (for array type) */}
                {metaFieldModal.data?.type === "array" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Options
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add option and press Enter"
                        className="flex-1 px-3 py-2 rounded-lg "
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.target;
                            if (input.value.trim()) {
                              setMetaFieldModal((prev) => ({
                                ...prev,
                                data: {
                                  ...prev.data,
                                  options: [
                                    ...(prev.data?.options || []),
                                    input.value.trim(),
                                  ],
                                },
                              }));
                              input.value = "";
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {metaFieldModal.data?.options?.map((option, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center gap-2"
                        >
                          {option}
                          <button
                            type="button"
                            onClick={() =>
                              setMetaFieldModal((prev) => ({
                                ...prev,
                                data: {
                                  ...prev.data,
                                  options: prev.data?.options.filter(
                                    (_, i) => i !== index,
                                  ),
                                },
                              }))
                            }
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Default Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Default Value
                  </label>
                  {metaFieldModal.data?.type === "boolean" ? (
                    <select
                      value={
                        metaFieldModal.data?.defaultValue ? "true" : "false"
                      }
                      onChange={(e) =>
                        setMetaFieldModal((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            defaultValue: e.target.value === "true",
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg "
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : metaFieldModal.data?.type === "array" ? (
                    <select
                      multiple
                      value={metaFieldModal.data?.defaultValue || []}
                      onChange={(e) =>
                        setMetaFieldModal((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            defaultValue: Array.from(
                              e.target.selectedOptions,
                              (opt) => opt.value,
                            ),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg "
                    >
                      {metaFieldModal.data?.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        metaFieldModal.data?.type === "number"
                          ? "number"
                          : "text"
                      }
                      value={metaFieldModal.data?.defaultValue || ""}
                      onChange={(e) =>
                        setMetaFieldModal((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            defaultValue:
                              metaFieldModal.data?.type === "number"
                                ? parseFloat(e.target.value)
                                : e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg "
                      placeholder="Default value"
                    />
                  )}
                </div>

                {/* Settings Section */}
                <WrapperBody.Card padding="md" border className="mt-4">
                  <WrapperBody.Title as="h4" className="text-sm mb-3">
                    Field Settings
                  </WrapperBody.Title>

                  <WrapperBody.Flex direction="col" gap={3}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Required Field</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={metaFieldModal.data?.isRequired || false}
                          onChange={(e) =>
                            setMetaFieldModal((prev) => ({
                              ...prev,
                              data: {
                                ...prev.data,
                                isRequired: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Filterable (in storefront)
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={metaFieldModal.data?.isFilterable || false}
                          onChange={(e) =>
                            setMetaFieldModal((prev) => ({
                              ...prev,
                              data: {
                                ...prev.data,
                                isFilterable: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Searchable</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={metaFieldModal.data?.isSearchable || false}
                          onChange={(e) =>
                            setMetaFieldModal((prev) => ({
                              ...prev,
                              data: {
                                ...prev.data,
                                isSearchable: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Visible on Product Page</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            metaFieldModal.data?.isVisibleOnProductPage !==
                            false
                          }
                          onChange={(e) =>
                            setMetaFieldModal((prev) => ({
                              ...prev,
                              data: {
                                ...prev.data,
                                isVisibleOnProductPage: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </WrapperBody.Flex>
                </WrapperBody.Card>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={metaFieldModal.data?.sortOrder || 0}
                    onChange={(e) =>
                      setMetaFieldModal((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          sortOrder: parseInt(e.target.value),
                        },
                      }))
                    }
                    min="0"
                    className="w-full px-3 py-2 rounded-lg "
                  />
                </div>
              </WrapperBody>

              <WrapperFooter padding="lg">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setMetaFieldModal({ ...metaFieldModal, isOpen: false })
                    }
                    className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleMetaFieldSubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {metaFieldModal.mode === "add" ? "Add" : "Update"}
                  </button>
                </div>
              </WrapperFooter>
            </CardWrapper>
          </motion.div>
        )}
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
                    Delete{" "}
                    {deleteConfirm.type === "subcategory"
                      ? "Subcategory"
                      : "Meta Field"}
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
                    <p>
                      {deleteConfirm.type === "subcategory"
                        ? "Products using this subcategory will need to be reassigned."
                        : "Products using this meta field will lose this data."}
                    </p>
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
                <button
                  onClick={
                    deleteConfirm.type === "subcategory"
                      ? handleDeleteSubCategory
                      : handleDeleteMetaField
                  }
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </CardWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddCategory;
