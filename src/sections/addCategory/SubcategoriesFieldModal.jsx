import React from "react";
import CardWrapper from "../../components/ui/CardWrapper";
import WrapperHeader from "../../components/common/WrapperHeader";
import { motion } from "framer-motion";
import WrapperBody from "../../components/common/WrapperBody";
import { FiLink } from "react-icons/fi";
import RadioCard from "../../components/common/RadioCard";
import WrapperFooter from "../../components/common/WrapperFooter";
import Spinner from "../../components/common/Spinner";

const SubcategoriesFieldModal = ({
  setSubCategoryModal,
  subCategoryModal,
  generateSlug,
  loadingStates,
  handleSubCategorySubmit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() =>
        setSubCategoryModal({ ...subCategoryModal, isOpen: false })
      }
    >
      <CardWrapper
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-9/10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <WrapperHeader
          title={`${subCategoryModal.mode === "add" ? "Add" : "Edit"} Subcategory`}
          onClose={() =>
            setSubCategoryModal({ ...subCategoryModal, isOpen: false })
          }
          padding
          showDivider
        />

        <WrapperBody padding="lg" spacing="md">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={subCategoryModal.data?.name || ""}
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
              className="w-full px-3 py-2 rounded-lg "
              placeholder="e.g., Smartphones"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-400">
                Slug
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={subCategoryModal.data?.autoGenerateSlug !== false}
                  onChange={(e) =>
                    setSubCategoryModal((prev) => ({
                      ...prev,
                      data: {
                        ...prev.data,
                        autoGenerateSlug: e.target.checked,
                        slug:
                          e.target.checked && prev.data?.name
                            ? generateSlug(prev.data.name)
                            : prev.data?.slug,
                      },
                    }))
                  }
                  className="rounded border-gray-300 text-indigo-600"
                />
                Auto-generate
              </label>
            </div>
            {!subCategoryModal.data?.autoGenerateSlug && (
              <div className="relative">
                <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={subCategoryModal.data?.slug || ""}
                  onChange={(e) =>
                    setSubCategoryModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, slug: e.target.value },
                    }))
                  }
                  disabled={subCategoryModal.data?.autoGenerateSlug}
                  className="w-full pl-10 pr-3 py-2 rounded-lg  disabled:bg-gray-100"
                  placeholder="smartphones"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={subCategoryModal.data?.description || ""}
              onChange={(e) =>
                setSubCategoryModal((prev) => ({
                  ...prev,
                  data: { ...prev.data, description: e.target.value },
                }))
              }
              rows={3}
              className="w-full px-3 py-2 rounded-lg "
              placeholder="Describe this subcategory..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSubCategoryModal((prev) => ({
                      ...prev,
                      data: { ...prev.data, image: reader.result },
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {/* Active Status */}
          <RadioCard
            label="Active"
            isChecked={subCategoryModal.data?.isActive !== false}
            handleChange={(e) =>
              setSubCategoryModal((prev) => ({
                ...prev,
                data: { ...prev.data, isActive: e.target.checked },
              }))
            }
          />

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={subCategoryModal.data?.sortOrder || 0}
              onChange={(e) =>
                setSubCategoryModal((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    sortOrder: parseInt(e.target.value),
                  },
                }))
              }
              min="0"
              className="w-full px-3 py-2 rounded-lg "
            />
          </div>
        </WrapperBody>

        <WrapperFooter padding="lg">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                setSubCategoryModal({
                  ...subCategoryModal,
                  isOpen: false,
                })
              }
              className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-50"
            >
              Cancel
            </button>
            {loadingStates.addSubCategory || loadingStates.updateSubCategory ? (
              <Spinner
                label="Saving"
                labelPosition="right"
                labelAnimation="pulse"
              />
            ) : (
              <button
                type="button"
                onClick={handleSubCategorySubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {subCategoryModal.mode === "add" ? "Add" : "Update"}
              </button>
            )}
          </div>
        </WrapperFooter>
      </CardWrapper>
    </motion.div>
  );
};

export default SubcategoriesFieldModal;
