import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import {
  FiKey,
  FiPlus,
  FiTrash2,
  FiType,
  FiCode,
  FiEdit2,
} from "react-icons/fi";
import WrapperHeader from "./WrapperHeader";

const SpecificationsInput = ({
  title = "Product Specifications",
  specifications,
  onSpecificationsChange,
  handleJsonEditField,
}) => {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [errors, setErrors] = useState({});

  const specsMap = useMemo(() => {
    if (!specifications) return new Map();
    if (specifications instanceof Map) return new Map(specifications);
    if (typeof specifications === "object") {
      return new Map(Object.entries(specifications));
    }
    return new Map();
  }, [specifications]);

  const handleAddSpecification = useCallback(() => {
    const validationErrors = {};

    if (!newKey.trim()) {
      validationErrors.key = "Key is required";
    } else if (newKey.length > 50) {
      validationErrors.key = "Key must be less than 50 characters";
    } else if (specsMap.has(newKey)) {
      validationErrors.key = "This key already exists";
    }

    if (!newValue.trim()) {
      validationErrors.value = "Value is required";
    } else if (newValue.length > 200) {
      validationErrors.value = "Value must be less than 200 characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedSpecs = Object.fromEntries(specsMap);
    updatedSpecs[newKey.trim()] = newValue.trim();

    onSpecificationsChange(updatedSpecs);

    setNewKey("");
    setNewValue("");
    setErrors({});
  }, [newKey, newValue, specsMap, onSpecificationsChange]);

  const handleRemoveSpecification = useCallback(
    (key) => {
      specsMap.delete(key);
      onSpecificationsChange(new Map(specsMap));
    },
    [specsMap, onSpecificationsChange],
  );

  const handleEditSpecification = useCallback(
    (key, value) => {
      setNewKey(key);
      setNewValue(value);
      handleRemoveSpecification(key);
    },
    [handleRemoveSpecification],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        handleAddSpecification();
      }
    },
    [handleAddSpecification],
  );

  const getSpecsAsObject = useCallback(() => {
    return Object.fromEntries(specsMap);
  }, [specsMap]);

  const handleJsonEdit = useCallback(() => {
    if (handleJsonEditField) {
      handleJsonEditField(getSpecsAsObject());
    }
  }, [handleJsonEditField, getSpecsAsObject]);

  return (
    <div className="space-y-4 p-5" title={title}>
      <div className="flex items-center justify-between">
        <WrapperHeader
          title={title}
          showDivider
          className="flex-1 pb-2"
          description={
            <button
              type="button"
              onClick={handleJsonEdit}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              title="Edit as JSON"
            >
              <FiCode size={16} />
              <span className="inline">Edit as JSON</span>
            </button>
          }
        />
      </div>

      {/* Add new specification */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiKey className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={newKey}
              onChange={(e) => {
                setNewKey(e.target.value);
                if (errors.key) setErrors((prev) => ({ ...prev, key: "" }));
              }}
              onKeyDown={handleKeyDown}
              placeholder="Key/Title (e.g., 'Weight')"
              className={`pl-10 w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.key ? "border-red-500" : "border-gray-300"
              } text-xs`}
            />
          </div>
          {errors.key && (
            <p className="mt-1 text-xs text-red-600">{errors.key}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiType className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value);
                if (errors.value) setErrors((prev) => ({ ...prev, value: "" }));
              }}
              onKeyDown={handleKeyDown}
              placeholder="Value (e.g., '1.2kg')"
              className={`pl-10 w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.value ? "border-red-500" : "border-gray-300"
              } text-xs`}
            />
          </div>
          {errors.value && (
            <p className="mt-1 text-xs text-red-600">{errors.value}</p>
          )}
        </div>

        <div className="md:col-span-1">
          <button
            onClick={handleAddSpecification}
            disabled={!newKey.trim() || !newValue.trim()}
            className="w-full h-full flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <FiPlus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* Specifications list */}
      {specifications && specifications.size > 0 ? (
        <div className="space-y-3">
          {Array.from(specifications.entries()).map(([key, value], index) => (
            <motion.div
              key={key + index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between group p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {key}
                  </span>
                  <span className="text-gray-400">:</span>
                  <span className="text-gray-600 dark:text-gray-300 truncate">
                    {value}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditSpecification(key, value)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Edit specification ${key}`}
                  title="Edit specification"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  onClick={() => handleRemoveSpecification(key)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Remove specification ${key}`}
                  title="Remove specification"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <FiKey className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
            No specifications added
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Add key specifications to help customers understand your product
            better
          </p>
          {handleJsonEditField && (
            <button
              onClick={handleJsonEdit}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <FiCode size={16} />
              Add via JSON
            </button>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>Use clear, descriptive keys (e.g., "Battery Life", "Dimensions")</p>
        <p>Keep values concise and informative</p>
        <p>Press Ctrl+Enter to quickly add specifications</p>
      </div>
    </div>
  );
};

export default SpecificationsInput;
