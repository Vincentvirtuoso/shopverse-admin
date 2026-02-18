import React, { useState, useMemo } from "react";
import {
  LuChevronRight,
  LuChevronDown,
  LuFolder,
  LuFolderOpen,
  LuTrash2,
  LuPlus,
  LuStar,
  LuArchive,
} from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const buildCategoryTree = (categories) => {
  const map = new Map();

  categories.forEach((cat) => {
    map.set(cat._id, { ...cat, children: [] });
  });

  const roots = [];

  categories.forEach((cat) => {
    const node = map.get(cat._id);
    const parentId = cat.parent?._id ?? cat.parent ?? null;
    const isRoot = !parentId || cat.level === 0;

    if (!isRoot && map.has(parentId)) {
      map.get(parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sort = (nodes) => {
    nodes.sort((a, b) => {
      const diff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => n.children.length && sort(n.children));
  };

  sort(roots);
  return roots;
};

const CategoryTreeNode = ({
  category,
  level = 0,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onAddSubcategory,
  isExpanded,
  onToggle,
  maxDepth = 3,
}) => {
  const hasChildren = category.children?.length > 0;
  const canAddChild = (category.level ?? level) < maxDepth;
  const navigate = useNavigate();

  return (
    <div>
      <div
        className={[
          "group flex items-center gap-1 py-2 px-2 rounded-lg transition-colors duration-150 cursor-pointer",
          isSelected
            ? "bg-neutral-700 ring-1 ring-neutral-500"
            : "hover:bg-neutral-800",
        ].join(" ")}
        style={{ marginLeft: `${level * 22}px` }}
        onClick={() => onSelect?.(category)}
      >
        {/* Expand / collapse */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            hasChildren && onToggle(category._id);
          }}
          className={[
            "w-6 h-6 shrink-0 flex items-center justify-center rounded hover:bg-neutral-600 transition-colors",
            !hasChildren ? "invisible" : "",
          ].join(" ")}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <LuChevronDown className="w-4 h-4 text-neutral-400" />
          ) : (
            <LuChevronRight className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {/* Folder icon */}
        {isExpanded && hasChildren ? (
          <LuFolderOpen className="w-5 h-5 shrink-0 text-yellow-500" />
        ) : (
          <LuFolder
            className={`w-5 h-5 shrink-0 ${
              level === 0 ? "text-yellow-500" : "text-neutral-400"
            }`}
          />
        )}

        {/* Name + badges */}
        <div className="flex-1 min-w-0 ml-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-medium truncate text-sm ${
                isSelected ? "text-white" : "text-neutral-100"
              }`}
            >
              {category.name}
            </span>

            {category.isFeatured && (
              <span
                title="Featured"
                className="flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs"
              >
                <LuStar className="w-3 h-3" />
              </span>
            )}
            {!category.isActive && (
              <span className="px-1.5 py-0.5 text-xs bg-neutral-700 text-neutral-400 rounded-full">
                Inactive
              </span>
            )}
            {category.isArchived && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                <LuArchive className="w-3 h-3" />
                Archived
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-y-1 text-xs text-neutral-500 mt-0.5 flex-wrap gap-x-3">
            <span
              className="hover:text-red-500 duration-300 hover:underline"
              onClick={() =>
                navigate(`/category/`, { state: { slug: category.slug } })
              }
            >
              /{category.slug}
            </span>
            {category.metaFields?.length > 0 && (
              <span>{category.metaFields.length} meta fields</span>
            )}
            {category.sortOrder != null && (
              <span>Order: {category.sortOrder}</span>
            )}
          </div>
        </div>

        {/* Actions — visible on hover / when selected */}
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {canAddChild && onAddSubcategory && (
            <button
              onClick={() => onAddSubcategory(category)}
              className="p-1.5 rounded-lg hover:bg-green-500/20 text-neutral-400 hover:text-green-400 transition-colors"
              title="Add subcategory"
            >
              <LuPlus className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(category)}
              className="p-1.5 rounded-lg hover:bg-blue-500/20 text-neutral-400 hover:text-blue-400 transition-colors"
              title="Edit category"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(category)}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
              title="Delete category"
            >
              <LuTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {category.children.map((child) => (
            <CategoryTreeNodeWrapper
              key={child._id}
              category={child}
              level={level + 1}
              isSelected={isSelected}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubcategory={onAddSubcategory}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryTreeNodeWrapper = ({
  category,
  level,
  expandedNodes,
  onToggleNode,
  ...rest
}) => {
  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpanded =
    expandedNodes != null ? !!expandedNodes[category._id] : localExpanded;

  const handleToggle = (id) => {
    setLocalExpanded((v) => !v);
    onToggleNode?.(id, !localExpanded);
  };

  return (
    <CategoryTreeNode
      category={category}
      level={level}
      isExpanded={isExpanded}
      onToggle={handleToggle}
      {...rest}
    />
  );
};

const CategoryHierarchyView = ({
  categories = [],
  onEdit,
  onDelete,
  onAddSubcategory,
  selectedCategoryId,
  onSelectCategory,
  expandedNodes,
  onToggleNode,
  loading = false,
  maxDepth = 3,
}) => {
  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories],
  );

  const rootCount = categoryTree.length;
  const activeCount = categories.filter(
    (c) => c.isActive && !c.isArchived,
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-neutral-900 rounded-lg border border-neutral-700">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400" />
          <span className="text-sm text-neutral-400">Loading categories…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-neutral-900 rounded-lg border border-neutral-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-neutral-800 border-b border-neutral-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h3 className="text-sm font-semibold dark:text-neutral-100 text-neutral-900">
            Category Hierarchy
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {categories.length} total &bull; {rootCount} root
            {rootCount !== 1 ? "s" : ""} &bull; {activeCount} active &bull; max
            depth {maxDepth}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <LuFolderOpen className="w-3.5 h-3.5 text-yellow-500" /> Open
          </span>
          <span className="flex items-center gap-1">
            <LuFolder className="w-3.5 h-3.5 text-neutral-400" /> Closed
          </span>
        </div>
      </div>

      {/* Tree */}
      <div className="p-3 overflow-y-auto max-h-[600px]">
        {categoryTree.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500 gap-3">
            <LuFolder className="w-10 h-10 opacity-30" />
            <p className="text-sm">No categories found.</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {categoryTree.map((node) => (
              <CategoryTreeNodeWrapper
                key={node._id}
                category={node}
                level={0}
                expandedNodes={expandedNodes}
                onToggleNode={onToggleNode}
                isSelected={selectedCategoryId === node._id}
                onSelect={(cat) => onSelectCategory?.(cat._id)}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddSubcategory={onAddSubcategory}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer legend */}
      <div className="px-4 py-2 bg-neutral-800 border-t border-neutral-700">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
          <span>Hover a row to reveal actions</span>
          <span className="hidden sm:inline w-px h-3 bg-neutral-600" />
          <span>Click to select</span>
          <span className="hidden sm:inline w-px h-3 bg-neutral-600" />
          <span>
            <LuPlus className="inline w-3 h-3 mr-0.5" />
            Add sub &bull; <FiEdit2 className="inline w-3 h-3 mr-0.5" />
            Edit &bull; <LuTrash2 className="inline w-3 h-3 mr-0.5" />
            Delete
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryHierarchyView;
