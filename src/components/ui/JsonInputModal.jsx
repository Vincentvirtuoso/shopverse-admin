// components/JsonInputModal.jsx
import React, { useState, useEffect } from "react";
import CardWrapper from "./CardWrapper";
import WrapperHeader from "../common/WrapperHeader";
import WrapperFooter from "../common/WrapperFooter";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

const JsonInputModal = ({
  isOpen,
  onClose,
  onSave,
  title = "Edit JSON",
  initialValue = "",
  fieldPath = null,
  setForm = null,
}) => {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);

  const getNestedValue = (obj, path) => {
    if (!path || path.length === 0) return obj;

    let value = obj;
    for (const key of path) {
      if (value instanceof Map) {
        value = value.get(key);
      } else if (value && typeof value === "object") {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value;
  };

  useEffect(() => {
    if (isOpen) {
      try {
        let valueToSet = initialValue;

        // If initialValue is not provided but fieldPath and setForm are provided,
        // try to get the current value from the form
        if (!initialValue && setForm && fieldPath) {
          setForm((prev) => {
            const currentValue = getNestedValue(prev, fieldPath);
            valueToSet = currentValue || {};
            return prev; // Don't modify, just read
          });
        }

        if (valueToSet) {
          if (typeof valueToSet === "object") {
            // Handle Map objects
            if (valueToSet instanceof Map) {
              setJsonText(
                JSON.stringify(Object.fromEntries(valueToSet), null, 2),
              );
            } else {
              setJsonText(JSON.stringify(valueToSet, null, 2));
            }
          } else {
            try {
              const parsed = JSON.parse(valueToSet);
              setJsonText(JSON.stringify(parsed, null, 2));
            } catch {
              setJsonText(valueToSet);
            }
          }
        } else {
          setJsonText("{}");
        }
        setError("");
        setIsValid(true);
      } catch (err) {
        console.log(err);
        setJsonText(initialValue || "{}");
        setError("Invalid JSON format");
        setIsValid(false);
      }
    }
  }, [isOpen, initialValue, fieldPath, setForm]);

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonText(value);

    try {
      JSON.parse(value);
      setError("");
      setIsValid(true);
    } catch (err) {
      console.log(err);
      setError("Invalid JSON syntax");
      setIsValid(false);
    }
  };

  const updateNestedField = (obj, path, value) => {
    if (!path || path.length === 0) return value;

    const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

    if (path.length === 1) {
      newObj[path[0]] = value;
    } else {
      const [current, ...rest] = path;

      if (newObj[current] instanceof Map) {
        newObj[current] = new Map(newObj[current]);
        if (rest.length === 1) {
          newObj[current].set(rest[0], value);
        } else {
          const nestedValue = newObj[current].get(rest[0]) || {};
          newObj[current].set(
            rest[0],
            updateNestedField(nestedValue, rest.slice(1), value),
          );
        }
      } else {
        newObj[current] = updateNestedField(newObj[current] || {}, rest, value);
      }
    }

    return newObj;
  };

  const handleSave = () => {
    try {
      const parsedJson = JSON.parse(jsonText);

      if (setForm && fieldPath) {
        setForm((prev) => {
          return updateNestedField(prev, fieldPath, parsedJson);
        });
      }

      onSave(parsedJson);
      onClose();
    } catch (err) {
      console.log(err);
      setError("Cannot save: Invalid JSON");
    }
  };

  const handleSaveFullForm = () => {
    try {
      const parsedJson = JSON.parse(jsonText);

      if (setForm) {
        setForm(parsedJson);
      }

      onSave(parsedJson);
      onClose();
    } catch (err) {
      console.log(err);
      setError("Cannot save: Invalid JSON");
    }
  };

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const displayPath = fieldPath ? fieldPath.join(" → ") : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50">
      <CardWrapper className="rounded-lg shadow-xl w-9/10 max-w-3xl max-h-[90vh] flex flex-col">
        <WrapperHeader
          title={displayPath ? `${title} - ${displayPath}` : title}
          onClose={onClose}
          padding
          showDivider
        />

        <div className="p-4 flex-1 overflow-auto">
          <textarea
            value={jsonText}
            onChange={handleJsonChange}
            className={`w-full h-96 font-mono text-sm p-3 border rounded focus:outline-none focus:ring-2 ${
              error
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300/50 focus:ring-blue-200 focus:border-blue-500"
            }`}
            spellCheck={false}
          />

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {!error && jsonText && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              ✓ Valid JSON
            </p>
          )}
        </div>

        <WrapperFooter className="flex justify-end gap-2 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-400/50 dark:text-gray-100 rounded hover:bg-gray-200 dark:hover:bg-gray-400/70"
          >
            Cancel
          </button>

          {fieldPath ? (
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`px-4 py-2 text-sm font-medium text-white rounded ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Update Field
            </button>
          ) : (
            <button
              onClick={handleSaveFullForm}
              disabled={!isValid}
              className={`px-4 py-2 text-sm font-medium text-white rounded ${
                isValid
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Update Entire Form
            </button>
          )}
        </WrapperFooter>
      </CardWrapper>
    </div>
  );
};

export default JsonInputModal;
