import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiSearch, FiCheck, FiTag } from "react-icons/fi";
import { useCategory } from "../../hooks/useCategory";
import Spinner from "../../components/common/Spinner";

const CategorySelector = ({ selectedCategory, onCategoryChange, errors }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([]);

  const { getAllCategories, loadingStates } = useCategory();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories({ isActive: true, limit: 100 });

      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedData = filteredCategories.find(
    (cat) => cat._id === selectedCategory?._id,
  );
  useEffect(() => {
    console.log("selectedCategory", selectedCategory);
    console.log("selselectedData", selectedData);
  }, [selectedCategory, selectedData, onCategoryChange]);

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-bold text-neutral-600 dark:text-neutral-400 ml-1">
        Category <span className="text-red-500">*</span>
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-left bg-white dark:bg-neutral-800 border rounded-xl flex items-center justify-between transition-all
          ${errors?.category ? "border-red-500" : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 shadow-sm"}`}
      >
        <div className="flex items-center gap-3 truncate">
          <FiTag
            className={selectedData ? "text-red-500" : "text-neutral-400"}
          />
          <span
            className={
              selectedData
                ? "text-neutral-900 dark:text-white font-medium"
                : "text-neutral-400"
            }
          >
            {selectedData ? selectedData.name : "Choose a category..."}
          </span>
        </div>
        <FiChevronDown
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                    placeholder="Search all categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loadingStates.fetchCategories ? (
                <Spinner />
              ) : (
                filteredCategories.length > 0 && (
                  <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => {
                          onCategoryChange(cat);
                          setIsOpen(false);
                        }}
                        className={`w-full p-3 text-left rounded-xl flex items-center justify-between group transition-colors
                      ${selectedCategory === cat._id ? "bg-red-50 dark:bg-red-900/20" : "hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}
                      >
                        <div>
                          <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                            {cat.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 uppercase tracking-tighter">
                            {cat.fullSlug}
                          </div>
                        </div>
                        {selectedCategory === cat._id && (
                          <FiCheck className="text-red-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {errors?.category && (
        <p className="text-xs text-red-500 ml-1">{errors.category}</p>
      )}
    </div>
  );
};

export default CategorySelector;
