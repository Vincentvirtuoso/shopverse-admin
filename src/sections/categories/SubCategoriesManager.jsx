import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiSave,
  FiX,
  FiTrash2,
  FiCopy,
  FiMove,
  FiEye,
  FiEyeOff,
  FiImage,
  FiType,
  FiHash,
  FiLink,
  FiAlertCircle,
  FiInfo,
  FiUpload,
} from "react-icons/fi";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import CardWrapper from "../../components/ui/CardWrapper";
import ImageUpload from "../../components/ui/ImageUpload";
import toast from "react-hot-toast";
import WrapperBody from "../../components/common/WrapperBody";

// Inline Edit Component for SubCategory
const SubCategoryInlineEdit = ({
  subCategory,
  onSave,
  onCancel,
  onDelete,
  isNew = false,
}) => {
  const [editData, setEditData] = useState({
    name: subCategory.name || "",
    slug: subCategory.slug || "",
    description: subCategory.description || "",
    image: subCategory.image || "",
    sortOrder: subCategory.sortOrder || 0,
    isActive: subCategory.isActive ?? true,
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!editData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!editData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(editData.slug)) {
      newErrors.slug = "Slug must be lowercase alphanumeric with hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(editData, imageFile);
    }
  };

  const handleImageUpload = (file) => {
    setImageFile(file);
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditData({ ...editData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setEditData({ ...editData, image: "" });
  };

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-neutral-800 rounded-lg border-2 border-red-200 dark:border-red-900/50 shadow-lg p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isNew ? "Add New Subcategory" : "Edit Subcategory"}
        </h4>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Save"
          >
            <FiSave className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Cancel"
          >
            <FiX className="w-4 h-4" />
          </motion.button>
          {!isNew && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Image Upload */}
        <WrapperBody.Grid className="" cols="2">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Image (Optional)
            </label>
            <ImageUpload
              value={editData.image}
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
              className="mb-2"
            />
          </div>

          {/* Name and Slug */}
          <div className="">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditData({
                      ...editData,
                      name,
                      slug: isNew ? generateSlug(name) : editData.slug,
                    });
                  }}
                  className={`
                w-full px-3 py-2 
                bg-white dark:bg-neutral-800 
                border rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                text-gray-900 dark:text-gray-100
                ${errors.name ? "border-red-500" : "border-gray-300 dark:border-neutral-600"}
              `}
                  placeholder="e.g., Smartphones"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <FiAlertCircle /> {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editData.slug}
                  onChange={(e) =>
                    setEditData({ ...editData, slug: e.target.value })
                  }
                  className={`
                w-full px-3 py-2 
                bg-white dark:bg-neutral-800 
                border rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                text-gray-900 dark:text-gray-100
                ${errors.slug ? "border-red-500" : "border-gray-300 dark:border-neutral-600"}
              `}
                  placeholder="e.g., smartphones"
                />
                {errors.slug && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <FiAlertCircle /> {errors.slug}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                placeholder="Enter description..."
              />
            </div>
          </div>
        </WrapperBody.Grid>

        {/* Sort Order and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={editData.sortOrder}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  sortOrder: parseInt(e.target.value) || 0,
                })
              }
              className="w-24 px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Status
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={editData.isActive}
                onChange={(e) =>
                  setEditData({ ...editData, isActive: e.target.checked })
                }
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span>Active</span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SubCategoryCard = ({
  subCategory,
  onEdit,
  onDelete,
  onDuplicate,
  // index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
      className="group relative bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Image/Icon */}
        <div className="shrink-0">
          {subCategory.image ? (
            <img
              src={subCategory.image}
              alt={subCategory.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-linear-to-br from-red-100 to-purple-100 dark:from-red-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
              <FiImage className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {subCategory.name}
            </h4>
            {subCategory.isActive ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                <FiEye className="w-3 h-3" /> Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs">
                <FiEyeOff className="w-3 h-3" /> Inactive
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-2">
            {subCategory.slug}
          </p>

          {subCategory.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {subCategory.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDuplicate(subCategory)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Duplicate"
          >
            <FiCopy className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(subCategory)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(subCategory.slug)}
            className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Sort Order Badge */}
      <div className="absolute top-2 right-2 text-xs text-gray-400">
        #{subCategory.sortOrder || 0}
      </div>

      {/* Drag Handle */}
      <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2 cursor-move text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <FiMove className="w-4 h-4" />
      </div>
    </motion.div>
  );
};

// Main SubCategoriesManager Component
const SubCategoriesManager = ({
  categoryId,
  subCategories = [],
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
  loading = false,
}) => {
  const [items, setItems] = useState(subCategories);
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // Update local state when props change
  useState(() => {
    setItems(subCategories);
  }, [subCategories]);

  const handleAdd = async (subCategoryData, imageFile) => {
    try {
      // Handle image upload if needed
      let data = subCategoryData;
      if (imageFile) {
        const formData = new FormData();
        formData.append("data", JSON.stringify(subCategoryData));
        formData.append("image", imageFile);
        data = formData;
      }

      await onAdd(categoryId, data);
      setIsAdding(false);
      toast.success("Subcategory added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add subcategory");
    }
  };

  const handleUpdate = async (subCategoryData, imageFile) => {
    try {
      // Handle image upload if needed
      let data = subCategoryData;
      if (imageFile) {
        const formData = new FormData();
        formData.append("data", JSON.stringify(subCategoryData));
        formData.append("image", imageFile);
        data = formData;
      } else if (subCategoryData.image === "") {
        // Image was removed
        data = { ...subCategoryData, image: "" };
      }

      await onUpdate(categoryId, editingItem.slug, data);
      setEditingItem(null);
      toast.success("Subcategory updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update subcategory");
    }
  };

  const handleDelete = async (slug) => {
    try {
      await onRemove(categoryId, slug);
      setDeleteItem(null);
      toast.success("Subcategory deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete subcategory");
    }
  };

  const handleDuplicate = async (subCategory) => {
    const { _id, slug, ...subCategoryData } = subCategory;
    const duplicatedItem = {
      ...subCategoryData,
      name: `${subCategory.name} (Copy)`,
      slug: `${subCategory.slug}-copy-${Date.now()}`,
    };
    try {
      await onAdd(categoryId, duplicatedItem);
      toast.success("Subcategory duplicated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to duplicate subcategory");
    }
  };

  const handleReorder = async (newOrder) => {
    setItems(newOrder);
    try {
      await onReorder(
        categoryId,
        newOrder.map((item) => item._id || item.slug),
      );
    } catch (error) {
      // Revert on error
      setItems(subCategories);
      toast.error(error.message || "Failed to reorder subcategories");
    }
  };

  return (
    <CardWrapper className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FiImage className="text-red-600" />
            Subcategories
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage subcategories under this category
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus /> Add Subcategory
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <SubCategoryInlineEdit
            subCategory={{
              name: "",
              slug: "",
              description: "",
              image: "",
              sortOrder: items.length,
              isActive: true,
            }}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        )}
      </AnimatePresence>

      {/* Subcategories List */}
      {items.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="space-y-3"
        >
          <AnimatePresence initial={false}>
            {items.map((item, index) => (
              <Reorder.Item
                key={item._id || item.slug}
                value={item}
                className="relative"
              >
                {editingItem?._id === item._id ||
                editingItem?.slug === item.slug ? (
                  <SubCategoryInlineEdit
                    subCategory={item}
                    onSave={handleUpdate}
                    onCancel={() => setEditingItem(null)}
                    onDelete={() => setDeleteItem(item)}
                  />
                ) : (
                  <SubCategoryCard
                    subCategory={item}
                    index={index}
                    onEdit={setEditingItem}
                    onDelete={(slug) => setDeleteItem(item)}
                    onDuplicate={handleDuplicate}
                  />
                )}
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      ) : isAdding ? null : (
        <div className="text-center py-12">
          <FiInfo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Subcategories
          </h4>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add subcategories to organize products within this category
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => handleDelete(deleteItem.slug)}
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This will remove this subcategory and may affect associated products.`}
        type="danger"
        confirmText="Delete"
      />
    </CardWrapper>
  );
};

export default SubCategoriesManager;
