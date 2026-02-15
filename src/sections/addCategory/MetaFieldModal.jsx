import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCode,
  FaCheck,
  FaInfoCircle,
  FaKeyboard,
} from "react-icons/fa";
import CardWrapper from "../../components/ui/CardWrapper";
import WrapperHeader from "../../components/common/WrapperHeader";
import WrapperBody from "../../components/common/WrapperBody";
import WrapperFooter from "../../components/common/WrapperFooter";
import RadioCard from "../../components/common/RadioCard";
import { FiEdit } from "react-icons/fi";

const MetaFieldModal = ({
  isOpen,
  metaFieldModal,
  setMetaFieldModal,
  handleMetaFieldSubmit,
}) => {
  if (!isOpen) return null;

  const updateData = (updates) => {
    setMetaFieldModal((prev) => ({
      ...prev,
      data: { ...prev.data, ...updates },
    }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md"
      onClick={() => setMetaFieldModal({ ...metaFieldModal, isOpen: false })}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <CardWrapper className="rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <WrapperHeader
            title={
              metaFieldModal.mode === "add"
                ? "Create Meta Field"
                : "Edit Meta Field"
            }
            description="Configure how product data is collected and displayed"
            onClose={() =>
              setMetaFieldModal({ ...metaFieldModal, isOpen: false })
            }
            padding
            showDivider
            className="bg-gray-50/50 dark:bg-gray-800/50"
          />

          <WrapperBody
            padding="lg"
            className="h-[calc(90vh-200px)] overflow-y-auto custom-scrollbar"
          >
            {/* --- SECTION: BASIC CONFIG --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <FaKeyboard className="text-red-500" /> Display Label
                </label>
                <input
                  type="text"
                  autoFocus
                  value={metaFieldModal.data?.label || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const updates = { label: val };
                    if (metaFieldModal.mode === "add") {
                      updates.key = val
                        .toLowerCase()
                        .replace(/\s+/g, "_")
                        .replace(/[^a-z0-9_]/g, "");
                    }
                    updateData(updates);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="e.g. Battery Capacity"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <FaCode className="text-red-500" /> API / Field Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={metaFieldModal.mode === "edit"}
                    value={metaFieldModal.data?.key || ""}
                    onChange={(e) =>
                      updateData({
                        key: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_]/g, ""),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/50 text-gray-500 font-mono text-sm disabled:opacity-70"
                  />
                  {metaFieldModal.mode === "add" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">
                      Auto
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* --- SECTION: DATA TYPE --- */}
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-5 mb-8 border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Field Type
                  </label>
                  <select
                    value={metaFieldModal.data?.type || "text"}
                    onChange={(e) =>
                      updateData({
                        type: e.target.value,
                        defaultValue: "",
                        options: [],
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none"
                  >
                    <option value="text">Short Text</option>
                    <option value="number">Numeric Value</option>
                    <option value="boolean">Boolean Switch</option>
                    <option value="select">Dropdown Menu</option>
                    <option value="array">Multiple Tags</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {metaFieldModal.data?.type === "number"
                      ? "Unit (optional)"
                      : "Placeholder"}
                  </label>
                  <input
                    type="text"
                    value={
                      metaFieldModal.data?.type === "number"
                        ? metaFieldModal.data?.unit || ""
                        : metaFieldModal.data?.placeholder || ""
                    }
                    onChange={(e) =>
                      updateData(
                        metaFieldModal.data?.type === "number"
                          ? { unit: e.target.value }
                          : { placeholder: e.target.value },
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none"
                    placeholder={
                      metaFieldModal.data?.type === "number"
                        ? "e.g. mAh, kg, cm"
                        : "Instructional text..."
                    }
                  />
                </div>
              </div>

              {/* Options logic for Select/Array */}
              {["select", "array"].includes(metaFieldModal.data?.type) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    Menu Options
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Type option and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (
                            val &&
                            !metaFieldModal.data?.options?.includes(val)
                          ) {
                            updateData({
                              options: [
                                ...(metaFieldModal.data?.options || []),
                                val,
                              ],
                            });
                            e.target.value = "";
                          }
                        }
                      }}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none text-sm"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {metaFieldModal.data?.options?.map((opt, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm font-medium border border-red-100 dark:border-red-800"
                      >
                        {opt}
                        <button
                          onClick={() =>
                            updateData({
                              options: metaFieldModal.data.options.filter(
                                (_, idx) => idx !== i,
                              ),
                            })
                          }
                        >
                          <FaTimes size={12} className="hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* --- SECTION: BEHAVIOR --- */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">
                Field Settings & Visibility
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "isRequired",
                    label: "Required",
                    sub: "Mandatory input",
                  },
                  {
                    id: "isFilterable",
                    label: "Filterable",
                    sub: "Appears in sidebar",
                  },
                  {
                    id: "isSearchable",
                    label: "Searchable",
                    sub: "Global search index",
                  },
                  {
                    id: "isVisibleOnProductPage",
                    label: "Publicly Visible",
                    sub: "Visible to customers",
                  },
                ].map((s) => (
                  <>
                    <RadioCard
                      {...s}
                      isChecked={!!metaFieldModal.data?.[s.id]}
                      key={s.id}
                      handleChange={(e) =>
                        updateData({ [s.id]: e.target.checked })
                      }
                    />
                  </>
                ))}
              </div>
            </div>
          </WrapperBody>

          <WrapperFooter className="bg-gray-50/50 dark:bg-gray-800/50 p-6">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setMetaFieldModal({ ...metaFieldModal, isOpen: false })
                }
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleMetaFieldSubmit}
                className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-all flex items-center gap-2"
              >
                <FaCheck />{" "}
                {metaFieldModal.mode === "add"
                  ? "Create Field"
                  : "Update Field"}
              </button>
            </div>
          </WrapperFooter>
        </CardWrapper>
      </motion.div>
    </div>
  );
};

export default MetaFieldModal;
