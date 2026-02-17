import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaRandom,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFolder,
  FaBars,
  FaBan,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCategory } from "../hooks/useCategory";
import CardWrapper from "../components/ui/CardWrapper";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import {
  FiCheck,
  FiEdit,
  FiEye,
  FiFolder,
  FiRefreshCcw,
  FiTrash,
  FiX,
} from "react-icons/fi";
import { useActiveFilters } from "../hooks/useActiveFilters";
import { manageCatfilterConfig } from "../assets/filterConfigs";
import FilterTags from "../components/common/FilterTags";
import TableView from "../components/ui/TableView";
import CategoryGridView from "../sections/categories/CategoryGridView";

const ManageCategories = () => {
  const {
    loadingStates,
    // error,
    categories,
    pagination,
    getAllCategories,
    deleteCategory,
    updateCategoryStatus,
    reorderCategories,
    setFallbackCategory,
    // clearError,
  } = useCategory();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    isActive: null,
    isFeatured: null,
    parent: null,
  });
  const [sortConfig, setSortConfig] = useState({
    field: "sortOrder",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryForFallback, setCategoryForFallback] = useState(null);
  const [
    //isDragging
    _,
    setIsDragging,
  ] = useState(false);
  const [selectedFallback, setSelectedFallback] = useState("");
  const [viewMode, setViewMode] = useState("table");

  const toggleSelectAll = (selectMode) => {
    if (
      selectedCategories.length === filteredCategories.length ||
      selectMode === "unselect"
    ) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((cat) => cat._id));
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    fetchCategories();
    toggleSelectAll("unselect");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortConfig, filters]);

  const fetchCategories = async () => {
    try {
      await getAllCategories({
        page: currentPage,
        limit: pageSize,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
        search: searchTerm,
        ...filters,
      });
    } catch (err) {
      console.log(err);

      toast.error("Failed to fetch categories");
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        toggleSelectAll("unselect");
        fetchCategories();
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    if (!categories) {
      setFilteredCategories([]);
      return;
    }

    let filtered = [...categories];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(term) ||
          cat.slug.toLowerCase().includes(term),
      );
    }

    if (filters.isActive !== null) {
      filtered = filtered.filter((cat) => cat.isActive === filters.isActive);
    }

    if (filters.isFeatured !== null) {
      filtered = filtered.filter(
        (cat) => cat.isFeatured === filters.isFeatured,
      );
    }

    filtered.sort((a, b) => {
      let aVal = a[sortConfig.field];
      let bVal = b[sortConfig.field];

      if (sortConfig.field === "name") {
        aVal = a.name?.toLowerCase() || "";
        bVal = b.name?.toLowerCase() || "";
      } else if (sortConfig.field === "productCount") {
        aVal = a.productCount || 0;
        bVal = b.productCount || 0;
      }

      if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCategories(filtered);
  }, [categories, searchTerm, filters, sortConfig]);

  const handleSort = (field, order) => {
    setSortConfig((prev) => ({
      field,
      order: order
        ? order
        : prev.field === field && prev.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateCategoryStatus(id, !currentStatus);
      toast.success(`Category ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (err) {
      console.log(err);

      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete._id);
      toast.success("Category deleted successfully");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  const handleFallbackClick = (category) => {
    setCategoryForFallback(category);
    setShowFallbackModal(true);
  };

  const handleFallbackConfirm = async (fallbackId) => {
    try {
      await setFallbackCategory(categoryForFallback._id, fallbackId);
      toast.success("Fallback category set successfully");
      setShowFallbackModal(false);
      setCategoryForFallback(null);
    } catch (err) {
      toast.error(err.message || "Failed to set fallback category");
    }
  };

  const handleReorder = async (newOrder) => {
    setFilteredCategories(newOrder);
    try {
      const ids = newOrder.map((cat) => cat._id);
      await reorderCategories(ids);
      toast.success("Categories reordered");
    } catch (err) {
      console.log(err);
      fetchCategories();
      toast.error("Failed to reorder categories");
    } finally {
      setIsDragging(false);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedCategories.length === 0) {
      toast.error("Please select categories first");
      return;
    }

    switch (action) {
      case "activate":
        selectedCategories.forEach((id) => handleToggleStatus(id, false));
        break;
      case "deactivate":
        selectedCategories.forEach((id) => handleToggleStatus(id, true));
        break;
      case "delete":
        // Show confirmation for bulk delete
        break;
      default:
        break;
    }
  };

  const { activeFilters, clearAllFilters, hasActiveFilters } = useActiveFilters(
    {
      filters,
      setFilters,
      config: manageCatfilterConfig,
    },
  );

  // Render table view
  const columns = [
    {
      type: "image",
    },
    {
      field: "name",
      header: "Name",
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {item.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Level {item.level || 0}
          </div>
        </div>
      ),
    },
    {
      field: "metaFields",
      header: "Meta Fields",
      render: (item) => (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
          {item.metaFields?.length || 0}
        </span>
      ),
    },
    {
      field: "isActive",
      header: "Status",
      render: (item) => (
        <button
          onClick={() => handleToggleStatus(item._id)}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {item.isActive ? (
            <FaCheck className="mr-1 text-xs" />
          ) : (
            <FiX className="mr-1 text-xs" />
          )}
          {item.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      field: "isFeatured",
      header: "Featured",
      render: (item) => (
        <span className="flex place-content-center">
          {item.isFeatured ? <FaStar className="text-yellow-500" /> : "NO"}
        </span>
      ),
    },
  ];

  const customActions = [
    {
      label: "Edit Category",
      icon: FiEdit,
      onClick: (item) => navigate(`/category/${item._id}/edit`),
    },
    {
      label: "View Details",
      icon: FiEye,
      onClick: (item) => navigate(`/category/${item._id}`),
    },
    // {
    //   label: "Duplicate",
    //   icon: FaCopy,
    //   onClick: (item) => duplicateCategory(item),
    //   type: "default",
    // },
    { divider: true },
    {
      label: "Deactivate",
      icon: FaBan,
      onClick: (item) => handleToggleStatus(item),
      type: "warning",
    },
    {
      label: "Activate",
      icon: FaCheck,
      onClick: (item) => handleToggleStatus(item),
      type: "success",
    },
    {
      label: "Delete",
      icon: FiTrash,
      onClick: (item) => handleDeleteClick(item),
      type: "danger",
    },
  ];

  const bulkActions = [
    {
      label: "Delete All",
      icon: FaTrash,
      onClick: (selectedIds) => handleBulkAction("delete", selectedIds),
      className:
        "whitespace-nowrap bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400",
    },
    {
      label: "Activate All",
      icon: FaCheck,
      onClick: (selectedIds) => handleBulkAction("activate", selectedIds),
      className:
        "whitespace-nowrap bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      label: "Deactivate All",
      icon: FaBan,
      onClick: (selectedIds) => handleBulkAction("deactivate", selectedIds),
      className:
        "whitespace-nowrap bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ];

  // Render delete confirmation modal
  const renderDeleteModal = () => (
    <AnimatePresence>
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Category
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{categoryToDelete?.name}"?
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">
                    Products will be reassigned
                  </p>
                  <p>
                    All products in this category will be moved to the fallback
                    category (if set) or the global fallback.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render fallback modal
  const renderFallbackModal = () => {
    const availableFallbacks =
      categories?.filter(
        (cat) =>
          cat._id !== categoryForFallback?._id &&
          cat.isActive &&
          !cat.isArchived,
      ) || [];

    return (
      <AnimatePresence>
        {showFallbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFallbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaRandom className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Set Fallback Category
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose where to move products when "
                    {categoryForFallback?.name}" is deleted
                  </p>
                </div>
              </div>

              <select
                value={selectedFallback}
                onChange={(e) => setSelectedFallback(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-6"
              >
                <option value="">Use global fallback</option>
                {availableFallbacks.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name} {!cat.isActive && "(Inactive)"}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFallbackModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleFallbackConfirm(selectedFallback)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  if (loadingStates.fetchCategories && !categories.length) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Spinner label="Loading Categories" labelAnimation="typing" size="xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=""
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your product categories and meta fields
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Bulk actions */}
          {selectedCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-600 rounded-lg p-1"
            >
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-600/60 rounded-md transition-colors"
              >
                <FiCheck className="inline mr-1" /> Activate
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-3 py-1.5 text-sm bg-orange-600 text-white hover:bg-orange-600/60 rounded-md transition-colors"
              >
                <FiX className="inline mr-1" /> Deactivate
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-600/60 rounded-md transition-colors"
              >
                <FaTrash className="inline mr-1" /> Delete
              </button>
            </motion.div>
          )}

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-neutral-600 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-neutral-500/90 shadow"
                  : "text-gray-400"
              }`}
            >
              <FaBars />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-neutral-500/90 shadow"
                  : "text-gray-400"
              }`}
            >
              <FaFolder />
            </button>
          </div>

          {/* Add category button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/categories/new")}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-pink-600 to-red-600 text-white rounded-lg hover:from-pink-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Add Category
          </motion.button>
          {/* Add category button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchCategories()}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-neutral-600 to-slate-600 text-white rounded-lg hover:from-neutral-700 hover:to-slate-700 transition-all shadow-lg hover:shadow-xl"
          >
            <FiRefreshCcw /> Reload
          </motion.button>
        </div>
      </div>

      {/* Filters and Search */}
      <CardWrapper className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border  rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-gray-200 dark:border-gray-400/40 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700/50"
            }`}
          >
            <FaFilter /> Filters
          </button>

          {/* Sort dropdown */}
          <select
            value={`${sortConfig.field}:${sortConfig.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(":");
              setSortConfig({ field, order });
            }}
            className="px-4 py-2 border  rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="sortOrder:asc">Sort Order (Ascending)</option>
            <option value="sortOrder:desc">Sort Order (Descending)</option>
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
          </select>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-300/40 px-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={
                      filters.isActive === null
                        ? ""
                        : filters.isActive.toString()
                    }
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isActive: e.target.value
                          ? e.target.value === "true"
                          : null,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg"
                  >
                    <option value="">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Featured
                  </label>
                  <select
                    value={
                      filters.isFeatured === null
                        ? ""
                        : filters.isFeatured.toString()
                    }
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isFeatured: e.target.value
                          ? e.target.value === "true"
                          : null,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg"
                  >
                    <option value="">All</option>
                    <option value="true">Featured</option>
                    <option value="false">Not Featured</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Parent Category
                  </label>
                  <select
                    value={filters.parent || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        parent: e.target.value || null,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg"
                  >
                    <option value="">All</option>
                    {categories
                      ?.filter((cat) => !cat.parent)
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Clear filters */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() =>
                    setFilters({
                      isActive: null,
                      isFeatured: null,
                      parent: null,
                    })
                  }
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardWrapper>

      {/* Categories display */}
      {loadingStates.fetchCategories && categories.length > 0 && (
        <div className="h-24 flex items-center justify-center">
          <Spinner
            label={"Fetching filtered categories..."}
            labelAnimation="pulse"
            size="lg"
          />
        </div>
      )}

      {hasActiveFilters && (
        <FilterTags
          activeFilters={activeFilters}
          showRemoveAll
          onRemoveAll={clearAllFilters}
        />
      )}
      {viewMode === "table" ? (
        <TableView
          data={categories}
          selectedItems={selectedCategories}
          onSelectionChange={setSelectedCategories}
          columns={columns}
          onSelectAll={toggleSelectAll}
          sortConfig={sortConfig}
          onSort={handleSort}
          actions={customActions}
          bulkActions={bulkActions}
          rowKey="_id"
          // loading={loading}
          imageFallback={FiFolder}
          // loadingComponent={<Spinner size="lg" />}
        />
      ) : (
        <CategoryGridView
          filteredCategories={filteredCategories}
          handleDeleteClick={handleDeleteClick}
          onReorder={handleReorder}
          handleFallbackClick={handleFallbackClick}
        />
      )}

      {/* Empty state */}
      {filteredCategories.length === 0 &&
        !loadingStates.fetchCategories &&
        viewMode === "grid" && (
          <CardWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 rounded-xl shadow-sm mt-4"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFolder className="text-4xl text-gray-400 dark:text-gray-100" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No categories found
            </h3>
            <p className="text-gray-300 mb-6">
              {searchTerm ||
              filters.isActive !== null ||
              filters.isFeatured !== null
                ? "Try adjusting your filters"
                : "Get started by creating your first category"}
            </p>
            {searchTerm ||
            filters.isActive !== null ||
            filters.isFeatured !== null ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    isActive: null,
                    isFeatured: null,
                    parent: null,
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Clear filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/categories/new")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Add Category
              </button>
            )}
          </CardWrapper>
        )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                const distance = Math.abs(page - currentPage);
                return (
                  distance === 0 ||
                  distance === 1 ||
                  page === 1 ||
                  page === pagination.totalPages
                );
              })
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="px-3 py-2">...</span>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page
                            ? "bg-red-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-red-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={currentPage === pagination.totalPages}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronRight />
            </button>
          </div>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      )}

      {renderDeleteModal()}
      {renderFallbackModal()}
    </motion.div>
  );
};

export default ManageCategories;
