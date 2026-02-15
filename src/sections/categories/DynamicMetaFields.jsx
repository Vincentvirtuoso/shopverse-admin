import React, { useEffect, useState } from "react";
import { FiInfo, FiHash, FiCalendar, FiType, FiLayers } from "react-icons/fi";

const DynamicMetaFields = ({ category, values = {}, onChange, errors }) => {
  const [metaFields, setMetaFields] = useState([]);

  useEffect(() => {
    if (category?.metaFields) {
      setMetaFields(
        [...category.metaFields].sort(
          (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
        ),
      );
    }
  }, [category]);

  if (!category || metaFields.length === 0) return null;

  const renderField = (field) => {
    const value = values[field.key] ?? field.defaultValue ?? "";
    const error = errors?.[`metaFields.${field.key}`];
    const inputClasses = `w-full px-4 py-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-900/50 transition-all focus:ring-2 focus:ring-red-500/20 outline-none
      ${error ? "border-red-500" : "border-neutral-200 dark:border-neutral-700 focus:border-red-500"}`;

    switch (field.type) {
      case "boolean":
        return (
          <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-max">
            {[true, false].map((bool) => (
              <button
                key={String(bool)}
                type="button"
                onClick={() => onChange(field.key, bool)}
                className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  value === bool
                    ? "bg-white dark:bg-neutral-700 shadow-sm text-red-600"
                    : "text-neutral-500"
                }`}
              >
                {bool ? "Yes" : "No"}
              </button>
            ))}
          </div>
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={inputClasses}
          >
            <option value="">Choose {field.label}...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <div className="relative">
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={inputClasses}
            />
            {field.unit && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 uppercase">
                {field.unit}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-neutral-50/50 dark:bg-neutral-900/30 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 mt-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg text-red-600">
          <FiLayers size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Specifications
          </h3>
          <p className="text-xs text-neutral-400">
            Attributes specific to {category.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {metaFields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              {field.label}{" "}
              {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            {renderField(field)}
            {errors?.[`metaFields.${field.key}`] && (
              <p className="text-[10px] text-red-500 font-medium italic">
                {errors[`metaFields.${field.key}`]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicMetaFields;
