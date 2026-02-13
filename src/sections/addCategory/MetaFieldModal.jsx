import React from "react";
import CardWrapper from "../../components/ui/CardWrapper";
import WrapperHeader from "../../components/common/WrapperHeader";
import WrapperBody from "../../components/common/WrapperBody";
import { FaTimes } from "react-icons/fa";
import WrapperFooter from "../../components/common/WrapperFooter";

const MetaFieldModal = ({
  isOpen,
  metaFieldModal,
  setMetaFieldModal,
  handleMetaFieldSubmit,
}) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={() => setMetaFieldModal({ ...metaFieldModal, isOpen: false })}
    >
      <CardWrapper
        className="rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900"
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

        <WrapperBody
          padding="lg"
          spacing="md"
          className="max-h-[calc(90vh-160px)] overflow-y-auto"
        >
          {/* Label & Key Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Field Type *
              </label>
              <select
                value={metaFieldModal.data?.type || "text"}
                onChange={(e) =>
                  setMetaFieldModal((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      type: e.target.value,
                      defaultValue: "",
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean (Yes/No)</option>
                <option value="select">Select (Dropdown)</option>
                <option value="array">Multi-Select (Chips)</option>
                <option value="date">Date</option>
                <option value="file">File Upload</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Label *
              </label>
              <input
                type="text"
                value={metaFieldModal.data?.label || ""}
                onChange={(e) => {
                  const { value } = e.target;
                  const updates = { label: value };
                  if (metaFieldModal.mode === "add") {
                    updates.key = value
                      .toLowerCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, "");
                  }
                  setMetaFieldModal((prev) => ({
                    ...prev,
                    data: { ...prev.data, ...updates },
                  }));
                }}
                className="w-full px-3 py-2 rounded-lg border"
                placeholder="e.g., Screen Size"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Field Key *
              </label>
              <input
                type="text"
                disabled={metaFieldModal.mode === "edit"}
                value={metaFieldModal.data?.key || ""}
                onChange={(e) =>
                  setMetaFieldModal((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      key: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_]/g, ""),
                    },
                  }))
                }
                className={`w-full px-3 py-2 rounded-lg border ${
                  metaFieldModal.mode === "edit"
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                placeholder="screen_size"
              />
            </div>
          </div>

          {/* Type & Unit Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metaFieldModal.data?.type === "number" && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={metaFieldModal.data?.unit || ""}
                  onChange={(e) =>
                    setMetaFieldModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, unit: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border"
                  placeholder="e.g., kg, cm, px"
                />
              </div>
            )}
          </div>

          {/* Options (for Select or Array) */}
          {(metaFieldModal.data?.type === "array" ||
            metaFieldModal.data?.type === "select") && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Menu Options
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  id="new-option-input"
                  placeholder="Add option and press Enter"
                  className="flex-1 px-3 py-2 rounded-lg border"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !metaFieldModal.data?.options?.includes(val)) {
                        setMetaFieldModal((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            options: [...(prev.data?.options || []), val],
                          },
                        }));
                        e.target.value = "";
                      }
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {metaFieldModal.data?.options?.map((option, index) => (
                  <span
                    key={index}
                    className="pl-3 pr-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {option}
                    <button
                      type="button"
                      onClick={() =>
                        setMetaFieldModal((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            options: prev.data.options.filter(
                              (_, i) => i !== index,
                            ),
                          },
                        }))
                      }
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description / Placeholder */}
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Placeholder / Help Text
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
              className="w-full px-3 py-2 rounded-lg border"
              placeholder="Helpful text for the user..."
            />
          </div>

          {/* Dynamic Default Value */}
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Default Value
            </label>
            {metaFieldModal.data?.type === "boolean" ? (
              <select
                value={String(metaFieldModal.data?.defaultValue ?? "false")}
                onChange={(e) =>
                  setMetaFieldModal((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      defaultValue: e.target.value === "true",
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border"
              >
                <option value="false">No (False)</option>
                <option value="true">Yes (True)</option>
              </select>
            ) : metaFieldModal.data?.type === "select" ? (
              <select
                value={metaFieldModal.data?.defaultValue || ""}
                onChange={(e) =>
                  setMetaFieldModal((prev) => ({
                    ...prev,
                    data: { ...prev.data, defaultValue: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border"
              >
                <option value="">None</option>
                {metaFieldModal.data?.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={
                  metaFieldModal.data?.type === "number" ? "number" : "text"
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
                className="w-full px-3 py-2 rounded-lg border"
              />
            )}
          </div>

          {/* Settings Toggle List */}
          <div className="space-y-3 pt-2">
            {[
              {
                id: "isRequired",
                label: "Required Field",
                desc: "User must provide a value",
              },
              {
                id: "isFilterable",
                label: "Filterable",
                desc: "Allow filtering by this field in store",
              },
              {
                id: "isSearchable",
                label: "Searchable",
                desc: "Include this field in product searches",
              },
              {
                id: "isVisibleOnProductPage",
                label: "Visible to Customers",
                desc: "Show on the product details page",
              },
            ].map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-300 dark:border-gray-400"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {setting.label}
                  </p>
                  <p className="text-xs text-gray-400">{setting.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={!!metaFieldModal.data?.[setting.id]}
                  onChange={(e) =>
                    setMetaFieldModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, [setting.id]: e.target.checked },
                    }))
                  }
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </WrapperBody>

        <WrapperFooter padding="md">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                setMetaFieldModal({ ...metaFieldModal, isOpen: false })
              }
              className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleMetaFieldSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all"
            >
              {metaFieldModal.mode === "add" ? "Add Field" : "Save Changes"}
            </button>
          </div>
        </WrapperFooter>
      </CardWrapper>
    </div>
  );
};

export default MetaFieldModal;
