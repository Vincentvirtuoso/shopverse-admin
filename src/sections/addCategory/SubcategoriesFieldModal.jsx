import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLink, FiImage, FiX, FiCheckCircle } from "react-icons/fi";
import CardWrapper from "../../components/ui/CardWrapper";
import WrapperHeader from "../../components/common/WrapperHeader";
import WrapperBody from "../../components/common/WrapperBody";
import WrapperFooter from "../../components/common/WrapperFooter";
import Spinner from "../../components/common/Spinner";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import ImageUpload from "../../components/ui/ImageUpload";
import RadioCard from "../../components/common/RadioCard";

// Animation Variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", duration: 0.5, bounce: 0.3 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

const SubcategoriesFieldModal = ({
  setSubCategoryModal,
  subCategoryModal,
  generateSlug,
  loadingStates,
  handleSubCategorySubmit,
}) => {
  const { mode, data, isOpen } = subCategoryModal;
  const isSaving =
    loadingStates.addSubCategory || loadingStates.updateSubCategory;

  const closeModal = () =>
    setSubCategoryModal({ ...subCategoryModal, isOpen: false });

  // useBodyScrollLock(isOpen);
  if (!isOpen) return null;

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-100 p-4"
      onClick={closeModal}
    >
      <CardWrapper
        as={motion.div}
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
        className="shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <WrapperHeader
          title={`${mode === "add" ? "Create New" : "Edit"} Subcategory`}
          onClose={closeModal}
          className="px-6 py-4 border-b bg-white dark:bg-neutral-800/80 border-gray-100 dark:border-gray-700"
        />

        <WrapperBody className="p-6 space-y-5 overflow-y-auto h-[calc(90vh-150px)]">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400">
              Subcategory Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={data?.name || ""}
              onChange={(e) =>
                setSubCategoryModal((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    name: e.target.value,
                    slug:
                      prev.data?.autoGenerateSlug !== false
                        ? generateSlug(e.target.value)
                        : prev.data?.slug,
                  },
                }))
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-700 focus:ring-2  outline-none transition-all"
              placeholder="e.g., Wireless Headphones"
            />
          </div>

          {/* Slug Field with Toggle */}
          <div className="space-y-1.5 p-4 bg-cyan-50/50 dark:bg-cyan-800/20 rounded-xl border border-cyan-100 dark:border-cyan-600/70">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
                <FiLink /> URL Slug
              </label>
              <button
                type="button"
                onClick={() =>
                  setSubCategoryModal((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      autoGenerateSlug: !(
                        prev.data?.autoGenerateSlug !== false
                      ),
                    },
                  }))
                }
                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                  data?.autoGenerateSlug !== false
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                AUTO-SYNC {data?.autoGenerateSlug !== false ? "ON" : "OFF"}
              </button>
            </div>
            <input
              type="text"
              value={data?.slug || ""}
              readOnly={data?.autoGenerateSlug !== false}
              onChange={(e) =>
                setSubCategoryModal((prev) => ({
                  ...prev,
                  data: { ...prev.data, slug: e.target.value },
                }))
              }
              className="w-full bg-transparent text-sm font-mono text-gray-600 dark:text-gray-300 outline-none pt-1"
              placeholder="url-friendly-slug"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Description
            </label>
            <textarea
              value={data?.description || ""}
              onChange={(e) =>
                setSubCategoryModal((prev) => ({
                  ...prev,
                  data: { ...prev.data, description: e.target.value },
                }))
              }
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-700 focus:ring-2  outline-none transition-all resize-none"
              placeholder="Briefly describe this section..."
            />
          </div>

          {/* Image & Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload */}
            <ImageUpload
              label="Preview Image"
              value={data?.image}
              onUpload={(file) => {
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    setSubCategoryModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, image: reader.result },
                    }));
                  reader.readAsDataURL(file);
                }
              }}
              onRemove={() =>
                setSubCategoryModal((prev) => ({
                  ...prev,
                  data: { ...prev.data, image: null },
                }))
              }
            />

            {/* Config Box */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Display Priority
                </label>
                <input
                  type="number"
                  value={data?.sortOrder || 0}
                  onChange={(e) =>
                    setSubCategoryModal((prev) => ({
                      ...prev,
                      data: {
                        ...prev.data,
                        sortOrder: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-700 outline-none"
                />
              </div>

              <RadioCard
                icon={FiCheckCircle}
                label="ACTIVE STATUS"
                isChecked={data?.isActive}
                handleChange={() =>
                  setSubCategoryModal((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      isActive: !(prev.data?.isActive !== false),
                    },
                  }))
                }
                name="status"
                colors={{
                  checked: "text-green-400",
                  unChecked: "text-gray-400",
                }}
              />
            </div>
          </div>
        </WrapperBody>

        <WrapperFooter className="px-6 py-4 bg-gray-50 dark:bg-neutral-800/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            Discard
          </button>

          {isSaving ? (
            <Spinner label="Saving Changes..." labelPosition="right" />
          ) : (
            <button
              type="button"
              onClick={handleSubCategorySubmit}
              className="px-8 py-2.5 bg-cyan-600 text-white text-sm font-bold rounded-xl hover:bg-cyan-700 shadow-lg shadow-cyan-200 dark:shadow-none transition-all active:scale-95"
            >
              {mode === "add" ? "Create Subcategory" : "Save Updates"}
            </button>
          )}
        </WrapperFooter>
      </CardWrapper>
    </motion.div>
  );
};

export default SubcategoriesFieldModal;
