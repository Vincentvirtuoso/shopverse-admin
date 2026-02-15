import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiChevronLeft,
  FiSettings,
  FiList,
  FiTag,
  FiLayers,
  FiEye,
  FiEyeOff,
  FiStar,
  FiArchive,
  FiTrash2,
  FiCopy,
  FiPlus,
  FiImage,
  FiLink,
  FiType,
  FiHash,
  FiAlertCircle,
  FiInfo,
  FiRefreshCw,
} from "react-icons/fi";
import { useCategory } from "../hooks/useCategory";
import CardWrapper from "../components/ui/CardWrapper";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import Tabs from "../components/ui/Tabs";
import ImageUpload from "../components/ui/ImageUpload";
import MetaFieldsManager from "../sections/categories/MetaFieldsManager";

// Inline Edit Field Component
const InlineEditField = ({
  value,
  onSave,
  type = "text",
  label,
  icon: Icon,
  placeholder = "Enter value...",
  className = "",
  multiline = false,
  options = [],
  validate,
  formatValue,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (validate) {
      const validationError = validate(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      await onSave(editValue);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to save");
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError("");
  };

  const displayValue = formatValue ? formatValue(value) : value;

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          {type === "textarea" || multiline ? (
            <textarea
              value={editValue || ""}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className={`
                flex-1 px-3 py-2 
                bg-white dark:bg-neutral-800 
                border border-gray-300 dark:border-neutral-600 
                rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                text-gray-900 dark:text-gray-100
                ${error ? "border-red-500" : ""}
                ${className}
              `}
              rows={3}
              disabled={disabled}
              autoFocus
            />
          ) : type === "select" ? (
            <select
              value={editValue || ""}
              onChange={(e) => setEditValue(e.target.value)}
              className={`
                flex-1 px-3 py-2 
                bg-white dark:bg-neutral-800 
                border border-gray-300 dark:border-neutral-600 
                rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                text-gray-900 dark:text-gray-100
                ${error ? "border-red-500" : ""}
                ${className}
              `}
              disabled={disabled}
            >
              <option value="">Select...</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={editValue || ""}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className={`
                flex-1 px-3 py-2 
                bg-white dark:bg-neutral-800 
                border border-gray-300 dark:border-neutral-600 
                rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                text-gray-900 dark:text-gray-100
                ${error ? "border-red-500" : ""}
                ${className}
              `}
              disabled={disabled}
              autoFocus
            />
          )}
          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Save"
              disabled={disabled}
            >
              <FiSave />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCancel}
              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Cancel"
              disabled={disabled}
            >
              <FiX />
            </motion.button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <FiAlertCircle /> {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="group relative flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <div className="flex-1">
        {label && (
          <span className="text-xs text-gray-500 dark:text-gray-400 block">
            {label}
          </span>
        )}
        <span className="text-gray-900 dark:text-gray-100">
          {displayValue || "—"}
        </span>
      </div>
      {!disabled && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded transition-all"
          title="Edit"
        >
          <FiEdit2 className="w-3 h-3" />
        </motion.button>
      )}
    </div>
  );
};

// Status Toggle Component
const StatusToggle = ({ isActive, onToggle, disabled = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(!isActive)}
      disabled={disabled}
      className={`
        relative inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200
        ${
          isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {isActive ? (
        <>
          <FiEye className="mr-1" /> Active
        </>
      ) : (
        <>
          <FiEyeOff className="mr-1" /> Inactive
        </>
      )}
    </motion.button>
  );
};

// Featured Toggle Component
const FeaturedToggle = ({ isFeatured, onToggle, disabled = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(!isFeatured)}
      disabled={disabled}
      className={`
        relative inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200
        ${
          isFeatured
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <FiStar className={`mr-1 ${isFeatured ? "fill-current" : ""}`} />
      {isFeatured ? "Featured" : "Not Featured"}
    </motion.button>
  );
};

// Main Category Detail Component
const CategoryDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loading,
    error,
    category,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
    createCategory,
    renameMetaFieldKey,
    // setFallbackCategory,
    addMetaField,
    updateMetaField,
    removeMetaField,
    clearError,
  } = useCategory();

  const [activeTab, setActiveTab] = useState("general");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localCategory, setLocalCategory] = useState(null);

  // Load category data
  useEffect(() => {
    const loadCategory = async () => {
      try {
        let response;
        if (slug) {
          response = await getCategoryBySlug(slug);
        } else if (id) {
          response = await getCategoryById(id);
        }
        setLocalCategory(response?.data || null);
      } catch (err) {
        toast.error(err.message || "Failed to load category");
      }
    };

    if (id || slug) {
      loadCategory();
    }
  }, [id, slug, getCategoryById, getCategoryBySlug]);

  useEffect(() => {
    setLocalCategory(category);
  }, [category]);

  const handleUpdateField = async (field, value) => {
    if (!localCategory) return;

    setIsSaving(true);
    try {
      const updated = await updateCategory(localCategory._id, {
        [field]: value,
      });
      setLocalCategory(updated.data);
      toast.success(`${field} updated successfully`);
    } catch (err) {
      toast.error(err.message || `Failed to update ${field}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusToggle = async (newStatus) => {
    if (!localCategory) return;

    try {
      await updateCategoryStatus(localCategory._id, newStatus);
      setLocalCategory((prev) => ({ ...prev, isActive: newStatus }));
      toast("success", `Category ${newStatus ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleFeaturedToggle = async (newFeatured) => {
    if (!localCategory) return;

    try {
      await updateCategory(localCategory._id, { isFeatured: newFeatured });
      setLocalCategory((prev) => ({ ...prev, isFeatured: newFeatured }));
      toast("success", `Category ${newFeatured ? "featured" : "unfeatured"}`);
    } catch (err) {
      toast.error(err.message || "Failed to update featured status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(localCategory._id);
      toast.success("Category deleted successfully");
      navigate("/categories");
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  const handleArchive = async () => {
    try {
      await updateCategory(localCategory._id, {
        isArchived: true,
        archivedAt: new Date(),
      });
      toast.success("Category archived successfully");
      navigate("/categories");
    } catch (err) {
      toast.error(err.message || "Failed to archive category");
    }
  };

  const handleDuplicate = async () => {
    try {
      const { _id, slug, ...rest } = localCategory;
      const newCategory = {
        ...rest,
        name: `${rest.name} (Copy)`,
        slug: `${rest.slug}-copy-${Date.now()}`,
      };
      const response = await createCategory(newCategory);
      navigate(`/categories/${response.data._id}`);
      toast.success("Category duplicated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to duplicate category");
    }
  };

  const handleImageUpload = async (file, type = "image") => {
    const formData = new FormData();
    formData.append(type, file);
    formData.append("data", JSON.stringify({ [type]: file }));

    try {
      const response = await updateCategory(localCategory._id, formData);
      setLocalCategory(response.data);
      toast.success(`${type} uploaded successfully`);
    } catch (err) {
      toast.error(err.message || `Failed to upload ${type}`);
    }
  };

  const handleImageRemove = async (type = "image") => {
    try {
      const response = await updateCategory(localCategory._id, { [type]: "" });
      setLocalCategory(response.data);
      toast.success(`${type} removed successfully`);
    } catch (err) {
      toast.error(err.message || `Failed to remove ${type}`);
    }
  };

  if (loading && !localCategory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FiAlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Error Loading Category
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
        <button
          onClick={clearError}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!localCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FiInfo className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Category Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The category you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/categories")}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  const tabs = [
    {
      id: "general",
      label: "General",
      icon: FiSettings,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <CardWrapper className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FiInfo className="text-red-600" />
              Basic Information
            </h3>
            <div className="space-y-4">
              <InlineEditField
                label="Name"
                value={localCategory.name}
                onSave={(val) => handleUpdateField("name", val)}
                icon={FiType}
                validate={(val) => !val?.trim() && "Name is required"}
              />
              <InlineEditField
                label="Slug"
                value={localCategory.slug}
                onSave={(val) => handleUpdateField("slug", val)}
                icon={FiLink}
                validate={(val) => {
                  if (!val?.trim()) return "Slug is required";
                  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val))
                    return "Slug must be lowercase alphanumeric with hyphens";
                }}
              />
              <InlineEditField
                label="Description"
                value={localCategory.description}
                onSave={(val) => handleUpdateField("description", val)}
                icon={FiEdit2}
                multiline
                type="textarea"
              />
            </div>
          </CardWrapper>

          {/* Media */}
          <CardWrapper className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FiImage className="text-red-600" />
              Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                label="Category Image"
                value={localCategory.image}
                onUpload={(file) => handleImageUpload(file, "image")}
                onRemove={() => handleImageRemove("image")}
              />
              <ImageUpload
                label="Category Icon"
                value={localCategory.icon}
                onUpload={(file) => handleImageUpload(file, "icon")}
                onRemove={() => handleImageRemove("icon")}
              />
            </div>
          </CardWrapper>

          {/* Hierarchy */}
          <CardWrapper className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FiLayers className="text-red-600" />
              Hierarchy
            </h3>
            <div className="space-y-4">
              <InlineEditField
                label="Level"
                value={localCategory.level}
                onSave={(val) => handleUpdateField("level", parseInt(val))}
                icon={FiHash}
                type="number"
                validate={(val) => {
                  const num = parseInt(val);
                  if (isNaN(num) || num < 0 || num > 3)
                    return "Level must be between 0 and 3";
                }}
              />
              <InlineEditField
                label="Sort Order"
                value={localCategory.sortOrder}
                onSave={(val) => handleUpdateField("sortOrder", parseInt(val))}
                icon={FiHash}
                type="number"
              />
            </div>
          </CardWrapper>

          {/* Status */}
          <CardWrapper className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FiEye className="text-red-600" />
              Status & Visibility
            </h3>
            <div className="flex flex-wrap gap-4">
              <StatusToggle
                isActive={localCategory.isActive}
                onToggle={handleStatusToggle}
              />
              <FeaturedToggle
                isFeatured={localCategory.isFeatured}
                onToggle={handleFeaturedToggle}
              />
            </div>
          </CardWrapper>
        </motion.div>
      ),
    },
    {
      id: "metafields",
      label: "Meta Fields",
      icon: FiTag,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <MetaFieldsManager
            categoryId={localCategory._id}
            metaFields={localCategory.metaFields || []}
            onAdd={addMetaField}
            onUpdate={updateMetaField}
            onRemove={removeMetaField}
            onRename={(oldKey, newKey) =>
              renameMetaFieldKey(localCategory._id, oldKey, newKey)
            }
          />
        </motion.div>
      ),
    },
    {
      id: "seo",
      label: "SEO",
      icon: FiEye,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <CardWrapper className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Meta Information
            </h3>
            <div className="space-y-4">
              <InlineEditField
                label="Meta Title"
                value={localCategory.meta?.title}
                onSave={(val) =>
                  handleUpdateField("meta", {
                    ...localCategory.meta,
                    title: val,
                  })
                }
                icon={FiType}
              />
              <InlineEditField
                label="Meta Description"
                value={localCategory.meta?.description}
                onSave={(val) =>
                  handleUpdateField("meta", {
                    ...localCategory.meta,
                    description: val,
                  })
                }
                icon={FiEdit2}
                multiline
              />
              <div className="space-y-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Meta Keywords
                </label>
                <div className="flex flex-wrap gap-2">
                  {(localCategory.meta?.keywords || []).map(
                    (keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded-lg text-sm"
                      >
                        {keyword}
                        <button
                          onClick={() => {
                            const newKeywords =
                              localCategory.meta.keywords.filter(
                                (_, i) => i !== index,
                              );
                            handleUpdateField("meta", {
                              ...localCategory.meta,
                              keywords: newKeywords,
                            });
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ),
                  )}
                  <button
                    onClick={() => {
                      const keyword = prompt("Enter keyword:");
                      if (keyword) {
                        const newKeywords = [
                          ...(localCategory.meta?.keywords || []),
                          keyword,
                        ];
                        handleUpdateField("meta", {
                          ...localCategory.meta,
                          keywords: newKeywords,
                        });
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FiPlus className="w-3 h-3" /> Add Keyword
                  </button>
                </div>
              </div>
            </div>
          </CardWrapper>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/categories")}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <FiChevronLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {localCategory.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated:{" "}
                  {new Date(localCategory.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between flex-1">
              <div className="flex items-center gap-2">
                {/* Action Buttons */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDuplicate}
                  className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2"
                  title="Duplicate"
                >
                  <FiCopy />
                  <span className="hidden sm:inline">Duplicate</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowArchiveModal(true)}
                  className="px-3 py-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors flex items-center gap-2"
                  title="Archive"
                >
                  <FiArchive />
                  <span className="hidden sm:inline">Archive</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                  title="Delete"
                >
                  <FiTrash2 />
                  <span className="hidden sm:inline">Delete</span>
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/category/${id || slug}/edit`)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FiEdit2 />
                <span>Full Edit</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        <AnimatePresence mode="wait">
          {tabs.find((t) => t.id === activeTab)?.content}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${localCategory.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchive}
        title="Archive Category"
        message={`Are you sure you want to archive "${localCategory.name}"? Archived categories can be restored later.`}
        confirmText="Archive"
        cancelText="Cancel"
        type="warning"
      />

      {/* Saving Indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-neutral-800 shadow-lg rounded-lg px-4 py-2 flex items-center gap-2">
          <FiRefreshCw className="animate-spin text-red-600" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Saving...
          </span>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
