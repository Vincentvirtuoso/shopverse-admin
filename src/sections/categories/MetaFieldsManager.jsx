import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiSave,
  FiX,
  FiTrash2,
  FiCopy,
  FiChevronUp,
  FiChevronDown,
  FiSettings,
  FiType,
  FiHash,
  FiCheckSquare,
  FiCalendar,
  FiList,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiFilter,
  FiStar,
  FiMove,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import CardWrapper from "../../components/ui/CardWrapper";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import toast from "react-hot-toast";
import MetaFieldModal from "../addCategory/MetaFieldModal";

// Field type configurations
const fieldTypeConfig = {
  text: {
    icon: FiType,
    color: "blue",
    label: "Text",
    description: "Single line text input",
  },
  number: {
    icon: FiHash,
    color: "green",
    label: "Number",
    description: "Numeric values",
  },
  boolean: {
    icon: FiCheckSquare,
    color: "purple",
    label: "Boolean",
    description: "True/False checkbox",
  },
  array: {
    icon: FiList,
    color: "orange",
    label: "Array",
    description: "List of values",
  },
  date: {
    icon: FiCalendar,
    color: "red",
    label: "Date",
    description: "Date picker",
  },
};

const MetaFieldInlineEdit = ({
  field,
  onSave,
  onCancel,
  onDelete,
  loading,
  isNew = false,
}) => {
  const [editData, setEditData] = useState({
    key: field.key || "",
    label: field.label || "",
    type: field.type || "text",
    unit: field.unit || "",
    placeholder: field.placeholder || "",
    options: field.options || [],
    defaultValue: field.defaultValue || "",
    isRequired: field.isRequired || false,
    isFilterable: field.isFilterable || false,
    isSearchable: field.isSearchable || false,
    isVisibleOnProductPage: field.isVisibleOnProductPage ?? true,
    sortOrder: field.sortOrder || 0,
  });
  const [errors, setErrors] = useState({});
  const [optionsInput, setOptionsInput] = useState(
    field.options?.join(", ") || "",
  );

  const validate = () => {
    const newErrors = {};

    if (!editData.key.trim()) {
      newErrors.key = "Key is required";
    } else if (!/^[a-z][a-zA-Z0-9_]*$/.test(editData.key)) {
      newErrors.key =
        "Key must start with a letter and contain only letters, numbers, or underscores";
    }

    if (!editData.label.trim()) {
      newErrors.label = "Label is required";
    }

    if (!editData.type) {
      newErrors.type = "Type is required";
    }

    if (editData.type === "array" && editData.options.length === 0) {
      newErrors.options = "Options are required for array type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(editData);
    }
  };

  const handleOptionsChange = (value) => {
    setOptionsInput(value);
    const options = value
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt);
    setEditData({ ...editData, options });
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
          {isNew ? "Add New Meta Field" : "Edit Meta Field"}
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
        {/* Key and Label */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editData.key}
              onChange={(e) =>
                setEditData({ ...editData, key: e.target.value })
              }
              className={`
                w-full px-3 py-2 
                bg-white dark:bg-neutral-800 
                border rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                text-gray-900 dark:text-gray-100
                ${errors.key ? "border-red-500" : "border-gray-300 dark:border-neutral-600"}
              `}
              placeholder="e.g., screen_size"
            />
            {errors.key && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <FiAlertCircle /> {errors.key}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editData.label}
              onChange={(e) =>
                setEditData({ ...editData, label: e.target.value })
              }
              className={`
                w-full px-3 py-2 
                bg-white dark:bg-neutral-800 
                border rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                text-gray-900 dark:text-gray-100
                ${errors.label ? "border-red-500" : "border-gray-300 dark:border-neutral-600"}
              `}
              placeholder="e.g., Screen Size"
            />
            {errors.label && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <FiAlertCircle /> {errors.label}
              </p>
            )}
          </div>
        </div>

        {/* Type and Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={editData.type}
              onChange={(e) =>
                setEditData({ ...editData, type: e.target.value })
              }
              className={`
                w-full px-3 py-2 
                bg-white dark:bg-neutral-800 
                border rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                text-gray-900 dark:text-gray-100
                ${errors.type ? "border-red-500" : "border-gray-300 dark:border-neutral-600"}
              `}
            >
              {Object.entries(fieldTypeConfig).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <FiAlertCircle /> {errors.type}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Unit (Optional)
            </label>
            <input
              type="text"
              value={editData.unit}
              onChange={(e) =>
                setEditData({ ...editData, unit: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              placeholder="e.g., GB, ml, kg"
            />
          </div>
        </div>

        {/* Placeholder */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Placeholder (Optional)
          </label>
          <input
            type="text"
            value={editData.placeholder}
            onChange={(e) =>
              setEditData({ ...editData, placeholder: e.target.value })
            }
            className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            placeholder="e.g., Enter screen size..."
          />
        </div>

        {/* Options for array type */}
        {editData.type === "array" && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Options (comma-separated) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={optionsInput}
              onChange={(e) => handleOptionsChange(e.target.value)}
              className={`
                w-full px-3 py-2 
                bg-white dark:bg-neutral-800 
                border rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent
                text-gray-900 dark:text-gray-100
                ${errors.options ? "border-red-500" : "border-gray-300 dark:border-neutral-600"}
              `}
              placeholder="e.g., Small, Medium, Large"
            />
            {errors.options && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <FiAlertCircle /> {errors.options}
              </p>
            )}
          </div>
        )}

        {/* Default Value */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Default Value (Optional)
          </label>
          {editData.type === "boolean" ? (
            <select
              value={editData.defaultValue}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  defaultValue: e.target.value === "true",
                })
              }
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="">None</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          ) : editData.type === "array" ? (
            <select
              value={editData.defaultValue}
              onChange={(e) =>
                setEditData({ ...editData, defaultValue: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="">None</option>
              {editData.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={editData.type === "number" ? "number" : "text"}
              value={editData.defaultValue}
              onChange={(e) =>
                setEditData({ ...editData, defaultValue: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              placeholder={`Default ${editData.type} value...`}
            />
          )}
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={editData.isRequired}
              onChange={(e) =>
                setEditData({ ...editData, isRequired: e.target.checked })
              }
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span>Required</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={editData.isFilterable}
              onChange={(e) =>
                setEditData({ ...editData, isFilterable: e.target.checked })
              }
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span>Filterable</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={editData.isSearchable}
              onChange={(e) =>
                setEditData({ ...editData, isSearchable: e.target.checked })
              }
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span>Searchable</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={editData.isVisibleOnProductPage}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  isVisibleOnProductPage: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span>Visible on Product Page</span>
          </label>
        </div>

        {/* Sort Order */}
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
      </div>
    </motion.div>
  );
};

const MetaFieldCard = ({
  field,
  onEdit,
  onDelete,
  onDuplicate,
  index,
  total,
}) => {
  const FieldIcon = fieldTypeConfig[field.type]?.icon || FiType;
  const color = fieldTypeConfig[field.type]?.color || "gray";

  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    green:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    purple:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    orange:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
      className="group relative bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}
            >
              <FieldIcon className="inline w-3 h-3 mr-1" />
              {fieldTypeConfig[field.type]?.label || field.type}
            </span>
            {field.isRequired && (
              <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">
                Required
              </span>
            )}
          </div>

          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {field.label}
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-2">
            {field.key}
          </p>

          {field.unit && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Unit: {field.unit}
            </p>
          )}

          {field.placeholder && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Placeholder: "{field.placeholder}"
            </p>
          )}

          {field.defaultValue !== null && field.defaultValue !== "" && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Default: {field.defaultValue.toString()}
            </p>
          )}

          {field.options && field.options.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Options:
              </p>
              <div className="flex flex-wrap gap-1">
                {field.options.map((opt, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-700 rounded text-xs"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Feature Indicators */}
          <div className="flex flex-wrap gap-2 mt-3">
            {field.isFilterable && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <FiFilter className="w-3 h-3" /> Filterable
              </span>
            )}
            {field.isSearchable && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <FiSearch className="w-3 h-3" /> Searchable
              </span>
            )}
            {field.isVisibleOnProductPage ? (
              <span className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                <FiEye className="w-3 h-3" /> Visible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <FiEyeOff className="w-3 h-3" /> Hidden
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDuplicate(field)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Duplicate"
          >
            <FiCopy className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(field)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(field.key)}
            className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Sort Order Badge */}
      <div className="absolute top-2 right-2 text-xs text-gray-400">
        #{index || field.sortOrder || 0}
      </div>

      {/* Drag Handle */}
      <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2 cursor-move text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <FiMove className="w-4 h-4" />
      </div>
    </motion.div>
  );
};

// Main MetaFieldsManager Component
const MetaFieldsManager = ({
  categoryId,
  metaFields = [],
  onAdd,
  onUpdate,
  onRemove,
  onRename,
  onReorder,
  loading = {},
}) => {
  const [fields, setFields] = useState(metaFields);
  const [editingField, setEditingField] = useState(null);
  const [deleteField, setDeleteField] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    field: null,
    data: null,
  });
  const { removeMetaField, updateMetaField, addMetaField } = loading || {};

  // Update local state when props change
  useState(() => {
    setFields(metaFields);
  }, [metaFields]);

  const handleAdd = async (fieldData) => {
    try {
      await onAdd(categoryId, fieldData);
      setModal({ isOpen: false, type: null, field: null, data: null });
      toast.success("Meta field added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add meta field");
    }
  };

  const handleUpdate = async (fieldData) => {
    try {
      // Check if key changed
      if (editingField.key !== fieldData.key) {
        // First rename the key
        await onRename(categoryId, editingField.key, fieldData.key);
        // Then update the field data
        await onUpdate(categoryId, fieldData.key, fieldData);
      } else {
        await onUpdate(categoryId, fieldData.key, fieldData);
      }
      setEditingField(null);
      toast.success("Meta field updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update meta field");
    }
  };

  const handleDelete = async (key) => {
    try {
      await onRemove(categoryId, key);
      setDeleteField(null);
      toast.success("Meta field deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete meta field");
    }
  };

  const handleDuplicate = async (field) => {
    const { _id, ...fieldData } = field;
    const duplicatedField = {
      ...fieldData,
      key: `${field.key}_copy`,
      label: `${field.label} (Copy)`,
    };
    try {
      await onAdd(categoryId, duplicatedField);
      toast.success("Meta field duplicated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to duplicate meta field");
    }
  };

  const handleReorder = async (newOrder) => {
    setFields(newOrder);
    try {
      await onReorder(
        categoryId,
        newOrder.map((f) => f.key),
      );
    } catch (error) {
      // Revert on error
      setFields(metaFields);
      toast.error(error.message || "Failed to reorder meta fields");
    }
  };

  return (
    <CardWrapper className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FiSettings className="text-red-600" />
            Meta Fields
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Define custom fields for products in this category
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setModal({
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
                sortOrder: metaFields?.length + 1 || 0,
                loading: addMetaField,
              },
              index: null,
            });
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus /> Add Meta Field
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {modal.isOpen && (
          <MetaFieldModal
            isOpen={modal.isOpen}
            metaFieldModal={modal}
            setMetaFieldModal={setModal}
            handleMetaFieldSubmit={handleAdd}
          />
        )}
      </AnimatePresence>

      {/* Fields List */}
      {fields.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={fields}
          onReorder={handleReorder}
          className="space-y-3"
        >
          <AnimatePresence initial={false}>
            {fields.map((field, index) => (
              <Reorder.Item key={field.key} value={field} className="relative">
                {editingField?.key === field.key ? (
                  <MetaFieldInlineEdit
                    field={field}
                    onSave={handleUpdate}
                    onCancel={() => setEditingField(null)}
                    onDelete={() => setDeleteField(field)}
                    loading={updateMetaField}
                  />
                ) : (
                  <MetaFieldCard
                    field={field}
                    index={index}
                    total={fields.length}
                    onEdit={setEditingField}
                    onDelete={(key) => setDeleteField(field)}
                    onDuplicate={handleDuplicate}
                  />
                )}
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      ) : (
        <div className="text-center py-12">
          <FiInfo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Meta Fields
          </h4>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add custom fields to collect specific product information
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteField}
        onClose={() => setDeleteField(null)}
        onConfirm={() => handleDelete(deleteField.key)}
        title="Delete Meta Field"
        message={`Are you sure you want to delete "${deleteField?.label}"? This will remove this field from all products in this category.`}
        type="danger"
        size="sm"
        confirmText="Delete"
        loading={removeMetaField}
      />
    </CardWrapper>
  );
};

export default MetaFieldsManager;
