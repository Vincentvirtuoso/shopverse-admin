import React, { useState, useEffect } from "react";

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

  // Format initial value when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        if (initialValue) {
          // If it's already an object, stringify it prettily
          if (typeof initialValue === "object") {
            setJsonText(JSON.stringify(initialValue, null, 2));
          }
          // If it's a string, try to parse then re-stringify for formatting
          else {
            const parsed = JSON.parse(initialValue);
            setJsonText(JSON.stringify(parsed, null, 2));
          }
        } else {
          setJsonText("{}");
        }
        setError("");
        setIsValid(true);
      } catch (err) {
        // If invalid JSON, just show the raw string
        setJsonText(initialValue || "{}");
        setError("Invalid JSON format");
        setIsValid(false);
      }
    }
  }, [isOpen, initialValue]);

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonText(value);

    try {
      JSON.parse(value);
      setError("");
      setIsValid(true);
    } catch (err) {
      setError("Invalid JSON syntax");
      setIsValid(false);
    }
  };

  const handleSave = () => {
    try {
      const parsedJson = JSON.parse(jsonText);

      // If setForm is provided, directly update the form state
      if (setForm && fieldPath) {
        setForm((prev) => {
          const newForm = { ...prev };

          // Navigate through the field path to set the value
          if (fieldPath.length === 1) {
            newForm[fieldPath[0]] = parsedJson;
          } else if (fieldPath.length === 2) {
            newForm[fieldPath[0]] = {
              ...newForm[fieldPath[0]],
              [fieldPath[1]]: parsedJson,
            };
          } else if (fieldPath.length === 3) {
            newForm[fieldPath[0]] = {
              ...newForm[fieldPath[0]],
              [fieldPath[1]]: {
                ...newForm[fieldPath[0]]?.[fieldPath[1]],
                [fieldPath[2]]: parsedJson,
              },
            };
          }

          return newForm;
        });
      }

      // Call onSave callback with parsed JSON
      onSave(parsedJson);
      onClose();
    } catch (err) {
      setError("Cannot save: Invalid JSON");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* JSON Editor */}
        <div className="p-4 flex-1 overflow-auto">
          <textarea
            value={jsonText}
            onChange={handleJsonChange}
            className={`w-full h-96 font-mono text-sm p-3 border rounded focus:outline-none focus:ring-2 ${
              error
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
            }`}
            spellCheck={false}
          />

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {!error && jsonText && (
            <p className="mt-2 text-sm text-green-600">✓ Valid JSON</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`px-4 py-2 text-sm font-medium text-white rounded ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonInputModal;
