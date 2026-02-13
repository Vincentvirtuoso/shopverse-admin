import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiEdit2,
  FiHash,
  FiTag,
  FiList,
  FiInfo,
  FiAlertCircle,
  FiCheck,
  FiCode,
} from "react-icons/fi";

const MultiInput = ({
  label,
  name,
  value = [],
  addItem,
  removeItem,
  onChange,
  placeholder = "Type and press Enter...",
  mode = "individual",
  allowModeSwitch = true,
  maxItems = 10,
  minItems = 0,
  maxLength = 120,
  minLength = 2,
  helperText = "",
  suggestions = [],
  error = "",
  required = false,
  icon = "list",
  showCounter = true,
  allowDuplicates = false,
  validateItem = null,
  emptyStateMessage = "No items added yet. Add your first one above.",
  styling = {},
  showSuggestions = false,
  handleJsonEdit,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [currentMode, setCurrentMode] = useState(mode);
  const [validationError, setValidationError] = useState("");

  const defaultStyling = {
    primaryColor: "blue",
    itemBgGradient:
      "from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/30",
    numberBadgeGradient: "from-blue-500 to-blue-600",
    ...styling,
  };

  // Icon mapping
  const iconMap = {
    tag: FiTag,
    hash: FiHash,
    list: FiList,
  };
  const IconComponent = iconMap[icon] || FiList;

  // Process input based on mode
  const processInput = (input) => {
    if (!input.trim()) return [];

    if (currentMode === "comma-separated") {
      return input
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length >= minLength);
    }

    return [input.trim()];
  };

  // Validate individual item
  const validateSingleItem = (item) => {
    if (!item || item.length < minLength) {
      return `Item must be at least ${minLength} characters`;
    }

    if (item.length > maxLength) {
      return `Item cannot exceed ${maxLength} characters`;
    }

    if (
      !allowDuplicates &&
      value.some((v) => v.toLowerCase() === item.toLowerCase())
    ) {
      return "This item already exists";
    }

    if (validateItem) {
      const customError = validateItem(item);
      if (customError) return customError;
    }

    return null;
  };

  // Add items
  const addItems = () => {
    const items = processInput(inputValue);

    if (items.length === 0) {
      setValidationError("Please enter a valid item");
      return;
    }

    // Check max items limit
    if (value.length + items.length > maxItems) {
      setValidationError(`Maximum ${maxItems} items allowed`);
      return;
    }

    // Validate all items
    const validItems = [];
    for (const item of items) {
      const error = validateSingleItem(item);
      if (error) {
        setValidationError(error);
        return;
      }
      validItems.push(item);
    }

    if (addItem) {
      validItems.forEach((item) => addItem(item));
    } else {
      onChange([...value, ...validItems]);
    }
    setInputValue("");
    setValidationError("");
  };

  const handleRemoveItem = (item) => {
    if (removeItem) {
      removeItem(item);
    } else {
      const newItems = value.filter((v) => v !== item);
      onChange(newItems);
    }
  };

  // Edit item
  const editItem = (index) => {
    setInputValue(value[index]);
    handleRemoveItem(value[index]);
  };

  const editAsJson = () => {
    handleJsonEdit?.(value);
  };

  // Add suggestion
  const addSuggestion = (suggestion) => {
    if (value.length >= maxItems) {
      setValidationError(`Maximum ${maxItems} items allowed`);
      return;
    }

    const error = validateSingleItem(suggestion);
    if (!error) {
      if (addItem) {
        addItem(suggestion);
      } else {
        onChange([...value, suggestion]);
      }
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItems();
    }
  };

  // Get remaining count
  const remainingCount = maxItems - value.length;
  const isAtLimit = value.length >= maxItems;
  const meetsMinimum = value.length >= minItems;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <label className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
            <IconComponent
              className={`w-5 h-5 text-${defaultStyling.primaryColor}-600 dark:text-${defaultStyling.primaryColor}-400`}
            />
            {label}
            {required && <span className="text-red-500 text-sm">*</span>}
          </label>

          <div className="flex items-center gap-2">
            {/* JSON Edit Button */}
            {handleJsonEdit && (
              <button
                type="button"
                onClick={editAsJson}
                className={`p-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 text-xs
                  bg-${defaultStyling.primaryColor}-50 text-${defaultStyling.primaryColor}-600 
                  dark:bg-${defaultStyling.primaryColor}-900/30 dark:text-${defaultStyling.primaryColor}-400
                  hover:bg-${defaultStyling.primaryColor}-100 dark:hover:bg-${defaultStyling.primaryColor}-900/50`}
                title="Edit as JSON"
              >
                <FiCode className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            )}

            {allowModeSwitch && (
              <button
                type="button"
                onClick={() =>
                  setCurrentMode(
                    currentMode === "individual"
                      ? "comma-separated"
                      : "individual",
                  )
                }
                className={`px-3 py-1 rounded-full font-medium transition-all text-xs ${
                  currentMode === "individual"
                    ? `bg-${defaultStyling.primaryColor}-100 text-${defaultStyling.primaryColor}-700 dark:bg-${defaultStyling.primaryColor}-900/30 dark:text-${defaultStyling.primaryColor}-300`
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {currentMode === "individual" ? "Single" : "Separated"}
              </button>
            )}
          </div>
        </div>

        {helperText && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {helperText}
          </p>
        )}

        {/* Mode explanation */}
        <div
          className={`flex items-start gap-2 p-3 rounded-lg bg-${defaultStyling.primaryColor}-50 dark:bg-${defaultStyling.primaryColor}-900/20 border border-${defaultStyling.primaryColor}-100 dark:border-${defaultStyling.primaryColor}-800`}
        >
          <FiInfo
            className={`w-4 h-4 text-${defaultStyling.primaryColor}-600 dark:text-${defaultStyling.primaryColor}-400 shrink-0 mt-0.5`}
          />
          <p
            className={`text-xs text-${defaultStyling.primaryColor}-700 dark:text-${defaultStyling.primaryColor}-300`}
          >
            {currentMode === "individual"
              ? "Press Enter or click Add to insert one item at a time"
              : "Separate multiple items with commas (e.g., item1, item2, item3) then press Enter"}
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="relative">
        <div className="flex items-stretch shadow-sm rounded-lg overflow-hidden">
          <div className="relative flex-1">
            <input
              type="text"
              name={name}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setValidationError("");
              }}
              onKeyDown={handleKeyPress}
              disabled={isAtLimit}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                border border-r-0 border-gray-200 dark:border-gray-700 
                disabled:bg-gray-100 dark:disabled:bg-gray-700 focus:ring-0 focus:border-amber-200 disabled:cursor-not-allowed rounded-lg rounded-r-none
                ${
                  error || validationError
                    ? "border-red-300 dark:border-red-700"
                    : ""
                }`}
              placeholder={
                isAtLimit ? `Maximum ${maxItems} items reached` : placeholder
              }
            />
          </div>

          <button
            type="button"
            onClick={addItems}
            disabled={!inputValue.trim() || isAtLimit}
            className={`px-6 font-medium transition-all duration-200 flex items-center gap-2 text-sm
              ${
                inputValue.trim() && !isAtLimit
                  ? `bg-${defaultStyling.primaryColor}-500 text-white hover:bg-${defaultStyling.primaryColor}-600`
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
          >
            <FiPlus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Quick JSON Edit Button for Mobile */}
        {handleJsonEdit && value.length > 0 && (
          <button
            type="button"
            onClick={editAsJson}
            className="sm:hidden w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium
              bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300
              hover:bg-gray-200 dark:hover:bg-gray-700
              flex items-center justify-center gap-2"
          >
            <FiCode className="w-4 h-4" />
            Edit All Items as JSON ({value.length} items)
          </button>
        )}

        {/* Counter and info */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3 text-xs">
            {showCounter && (
              <>
                <span
                  className={`px-2 py-1 rounded font-medium ${
                    inputValue.length > maxLength
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {currentMode === "individual"
                    ? `${inputValue.length}/${maxLength} chars`
                    : `${processInput(inputValue).length} items`}
                </span>

                <span
                  className={`px-2 py-1 rounded font-medium ${
                    isAtLimit
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : meetsMinimum
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {value.length}/{maxItems} items
                  {!meetsMinimum && minItems > 0 && ` (min: ${minItems})`}
                </span>
              </>
            )}

            {remainingCount > 0 && remainingCount <= 3 && (
              <span className="text-orange-600 dark:text-orange-400">
                {remainingCount} slot{remainingCount !== 1 ? "s" : ""} remaining
              </span>
            )}
          </div>

          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                setValidationError("");
              }}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Validation Error */}
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20"
          >
            <FiAlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              {validationError}
            </p>
          </motion.div>
        )}
      </div>

      {/* External Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <FiAlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        </motion.div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {value.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Added Items ({value.length})
              </span>

              {/* Batch Edit Button */}
              {handleJsonEdit && value.length > 0 && (
                <button
                  type="button"
                  onClick={editAsJson}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 
                    flex items-center gap-1.5 font-medium
                    bg-${defaultStyling.primaryColor}-50 text-${defaultStyling.primaryColor}-600 
                    dark:bg-${defaultStyling.primaryColor}-900/30 dark:text-${defaultStyling.primaryColor}-400
                    hover:bg-${defaultStyling.primaryColor}-100 dark:hover:bg-${defaultStyling.primaryColor}-900/50`}
                >
                  <FiCode className="w-3.5 h-3.5" />
                  Batch Edit JSON
                </button>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              {value.map((item, index) => (
                <motion.div
                  key={`${item}-${index}`}
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg bg-linear-to-r ${defaultStyling.itemBgGradient} border border-gray-100 dark:border-gray-700 hover:border-${defaultStyling.primaryColor}-200 dark:hover:border-${defaultStyling.primaryColor}-700 transition-colors group`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`shrink-0 w-7 h-7 rounded-md bg-linear-to-br ${defaultStyling.numberBadgeGradient} flex items-center justify-center shadow-sm`}
                      >
                        <span className="text-xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-800 dark:text-gray-200 truncate">
                        {item}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        type="button"
                        onClick={() => editItem(index)}
                        className={`p-1.5 text-gray-400 hover:text-${defaultStyling.primaryColor}-600 hover:bg-${defaultStyling.primaryColor}-50 dark:hover:bg-${defaultStyling.primaryColor}-900/20 rounded transition-colors`}
                        title="Edit item"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Remove item"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                <IconComponent className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {emptyStateMessage}
              </p>
              {handleJsonEdit && (
                <button
                  type="button"
                  onClick={editAsJson}
                  className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium
                    bg-${defaultStyling.primaryColor}-50 text-${defaultStyling.primaryColor}-600 
                    dark:bg-${defaultStyling.primaryColor}-900/30 dark:text-${defaultStyling.primaryColor}-400
                    hover:bg-${defaultStyling.primaryColor}-100 dark:hover:bg-${defaultStyling.primaryColor}-900/50
                    flex items-center gap-2`}
                >
                  <FiCode className="w-4 h-4" />
                  Add Items via JSON
                </button>
              )}
              {minItems > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  At least {minItems} item{minItems !== 1 ? "s" : ""} required
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && value.length === 0 && showSuggestions && (
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <FiInfo className="w-4 h-4" />
            Need inspiration? Try these:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 8).map((suggestion, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addSuggestion(suggestion)}
                disabled={isAtLimit}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all
                  ${
                    isAtLimit
                      ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : `border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-${defaultStyling.primaryColor}-300 hover:text-${defaultStyling.primaryColor}-600 dark:hover:border-${defaultStyling.primaryColor}-700 dark:hover:text-${defaultStyling.primaryColor}-400 hover:bg-${defaultStyling.primaryColor}-50 dark:hover:bg-${defaultStyling.primaryColor}-900/20`
                  }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Validation Status */}
      {required && (
        <div className="flex items-center gap-2 text-xs">
          {meetsMinimum ? (
            <>
              <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-medium">
                Requirement met
              </span>
            </>
          ) : (
            <>
              <FiAlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                {minItems > 0
                  ? `Add at least ${minItems - value.length} more item${
                      minItems - value.length !== 1 ? "s" : ""
                    }`
                  : "This field is required"}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiInput;
