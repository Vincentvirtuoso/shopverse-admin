import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSortAmountUp, FaSortAmountDown, FaFolder } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import CardWrapper from "./CardWrapper";
import { toggleIdInArray } from "../../utils/helpers";
import Spinner from "../common/Spinner";

// Dropdown Menu Component
const DropdownMenu = ({
  trigger,
  items,
  position = "right",
  size = "md",
  className = "",
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    left: "right-0",
    right: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  const sizeClasses = {
    sm: "min-w-32 py-1 text-sm",
    md: "min-w-44 py-1.5 text-base",
    lg: "min-w-50 py-2 text-lg",
  };

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && items && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                absolute ${index > 1 ? "bottom-full" : "top-5"} z-20 mt-2 
                ${positionClasses[position]}
                ${sizeClasses[size]}
                bg-white dark:bg-neutral-800 
                rounded-lg shadow-xl 
                border border-gray-200 dark:border-neutral-700
                ${className}
              `}
            >
              {items.map((item, index) => (
                <DropdownItem key={index} {...item} setIsOpen={setIsOpen} />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const DropdownItem = ({
  label,
  icon: Icon,
  onClick,
  type = "default",
  divider = false,
  disabled = false,
  className = "",
  setIsOpen,
  loading,
  closeAfter = true,
  loadingText,
  showIf,
}) => {
  const show = showIf?.();
  console.log(closeAfter);

  const typeClasses = {
    default:
      "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700",
    danger:
      "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
    success:
      "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20",
    warning:
      "text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20",
  };

  if (divider) {
    return <hr className="my-1 border-gray-200 dark:border-neutral-700" />;
  }

  if (!show) return null;

  return (
    <button
      onClick={() => {
        if (closeAfter) {
          setIsOpen(false);
        }
        onClick();
      }}
      disabled={disabled}
      className={`
        w-full text-left px-4 py-2 
        flex items-center gap-2
        transition-colors duration-150 text-xs
        ${typeClasses[type]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {loading ? (
        <Spinner
          label={loadingText ? loadingText : `Running "${label}" action`}
          color="white"
          labelPosition="right"
          labelSize="xs"
          size="xs"
          labelAnimation="pulse"
        />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          <span className="flex-1">{label}</span>
        </>
      )}
    </button>
  );
};

// Main TableView Component
const TableView = ({
  // Data
  data = [],
  selectedItems = [],
  onSelectionChange,

  // Columns configuration
  columns = [],

  // Sorting
  sortConfig = { field: null, order: "asc" },
  onSort,

  // Selection
  onSelectAll,
  rowKey = "_id",

  // Actions
  actions = [],
  bulkActions = [],

  // Status toggle
  // onStatusToggle,
  // statusField = "isActive",

  // // Featured toggle
  // onFeaturedToggle,
  // featuredField = "isFeatured",
  className = "",
  tableClassName = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  imageFallback: ImageFallback = FaFolder,
  emptyState = {
    icon: FaFolder,
    title: "No data found",
    description: "Try adjusting your filters or add new items.",
  },

  // Loading state
  loading = false,
  loadingComponent,

  // Animations
  animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { delay: 0.05 },
  },

  // Expandable rows
  // expandable = false,
  // renderExpandedRow,
  expandedRows = [],
  // onExpandRow,

  // Sticky header
  stickyHeader = false,
}) => {
  const allSelected = data.length > 0 && selectedItems.length === data.length;
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < data.length;

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll();
    } else if (onSelectionChange) {
      const newSelection = allSelected ? [] : data.map((item) => item[rowKey]);
      onSelectionChange(newSelection);
    }
  };

  const handleSelectItem = (id) => {
    if (!onSelectionChange) return;

    const newSelection = toggleIdInArray(selectedItems, id);
    onSelectionChange(newSelection);
  };

  const handleSort = (field) => {
    if (onSort) {
      const order =
        sortConfig.field === field && sortConfig.order === "asc"
          ? "desc"
          : "asc";
      onSort({ field, order });
    }
  };

  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.order === "asc" ? (
      <FaSortAmountUp />
    ) : (
      <FaSortAmountDown />
    );
  };

  const finalActions = actions.length > 0 ? actions : [];

  if (loading) {
    return (
      loadingComponent || (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
        </div>
      )
    );
  }

  if (data.length === 0) {
    const EmptyIcon = emptyState.icon;
    return (
      <CardWrapper className="p-12 text-center">
        <EmptyIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          {emptyState.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {emptyState.description}
        </p>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      className={`rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && bulkActions.length > 0 && (
        <div className="bg-gray-50 dark:bg-neutral-800 px-6 py-3 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {bulkActions.map((action, index) => (
              <button
                key={index}
                onClick={() => action.onClick(selectedItems)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium flex-1
                  flex items-center justify-center gap-2
                  transition-colors duration-150
                  ${action.className || "bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"}
                `}
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`overflow-x-auto ${stickyHeader ? "relative" : ""}`}>
        <table
          className={`min-w-full divide-y divide-gray-200 dark:divide-neutral-700 ${tableClassName}`}
        >
          <thead
            className={`
            bg-gray-50 dark:bg-neutral-800 
            whitespace-nowrap
            ${stickyHeader ? "sticky top-0 z-10" : ""}
            ${headerClassName}
          `}
          >
            <tr>
              {/* Selection Column */}
              {onSelectionChange && (
                <th className="px-6 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = someSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </th>
              )}

              {/* Image/Icon Column (if configured) */}
              {columns.some((col) => col.type === "image") && (
                <th className="px-6 py-3 w-16"></th>
              )}

              {/* Dynamic Columns */}
              {columns.map((column, index) => (
                <th
                  key={column.field || index}
                  className={`
                    px-6 py-3 text-left text-xs font-medium 
                    text-gray-500 dark:text-gray-400 
                    uppercase tracking-wider
                    ${column.sortable ? "cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" : ""}
                    ${column.className || ""}
                  `}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && renderSortIcon(column.field)}
                  </div>
                </th>
              ))}

              {/* Actions Column */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 bg-white dark:bg-neutral-900">
            <AnimatePresence>
              {data.map((item, index) => (
                <motion.tr
                  key={item[rowKey]}
                  initial={animations.initial}
                  animate={animations.animate}
                  exit={animations.exit}
                  transition={{
                    delay: index * (animations.transition?.delay || 0.05),
                  }}
                  className={`
                    group hover:bg-gray-50 dark:hover:bg-neutral-800
                    transition-colors duration-150
                    ${rowClassName}
                    ${expandedRows.includes(item[rowKey]) ? "bg-gray-50 dark:bg-neutral-800" : ""}
                  `}
                >
                  {/* Selection Cell */}
                  {onSelectionChange && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item[rowKey])}
                        onChange={() => {
                          console.log("rowKey value:", item[rowKey]);
                          console.log("is array:", Array.isArray(item[rowKey]));
                          handleSelectItem(item[rowKey]);
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                  )}

                  {/* Image Cell */}
                  {columns.some((col) => col.type === "image") && (
                    <td className="px-6 py-4">
                      <div className={"flex items-center justify-center"}>
                        {item.icon || item.image ? (
                          <div>
                            <img
                              src={item.icon || item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-contain shrink-0"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-linear-to-br from-red-100 to-purple-100 dark:from-red-900/40 dark:to-purple-900/40 rounded-lg flex items-center justify-center ">
                            {
                              <ImageFallback className="text-red-600 dark:text-red-400" />
                            }
                          </div>
                        )}
                      </div>
                    </td>
                  )}

                  {/* Dynamic Cells */}
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 ${column.cellClassName || ""} ${cellClassName}`}
                    >
                      {column.render ? column.render(item) : item[column.field]}
                    </td>
                  ))}

                  {/* Actions Cell */}
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu
                      trigger={
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                          title="Actions"
                        >
                          <FiMoreVertical />
                        </motion.button>
                      }
                      items={finalActions.map((action) => ({
                        ...action,
                        onClick: () => action.onClick(item),
                        showIf: () => action.showIf?.(item) ?? true,
                        closeAfter: action.closeAfter
                          ? action.closeAfter
                          : true,
                      }))}
                      key={index}
                      index={index}
                      position="left"
                    />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
};

export default TableView;
