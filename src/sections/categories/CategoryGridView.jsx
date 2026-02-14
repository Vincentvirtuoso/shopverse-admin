import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaGripVertical, FaRandom, FaLayerGroup, FaTag } from "react-icons/fa";
import {
  FiEdit,
  FiFolder,
  FiTrash,
  FiExternalLink,
  FiTag,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import WrapperBody from "../../components/common/WrapperBody";

const CategoryGridView = ({
  filteredCategories,
  handleDeleteClick,
  onReorder,
  handleFallbackClick,
}) => {
  const navigate = useNavigate();

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Call the parent function with the new order
    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable
        droppableId="categories"
        direction="horizontal"
        type="category"
      >
        {(provided) => (
          <WrapperBody.Grid
            {...provided.droppableProps}
            ref={provided.innerRef}
            gap={6}
            cols="3-md-lg"
            // className=" gap-6"
          >
            {filteredCategories.map((category, index) => (
              <Draggable
                key={category._id}
                draggableId={category._id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...provided.draggableProps.style,
                    }}
                    className={`group bg-white dark:bg-neutral-700 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 ${
                      snapshot.isDragging
                        ? "ring-2 ring-red-500 shadow-2xl z-50"
                        : ""
                    }`}
                  >
                    {/* Header Image / Gradient */}
                    <div className="relative h-24 bg-linear-to-br from-slate-100 to-slate-200 dark:from-neutral-600 dark:to-neutral-700 rounded-t-xl overflow-hidden">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover mix-blend-overlay opacity-40"
                        />
                      )}

                      {/* Drag Handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-3 left-3 p-1.5 bg-white/80 dark:bg-gray-900/50 backdrop-blur-md rounded-md cursor-grab active:cursor-grabbing hover:bg-white transition-colors"
                      >
                        <FaGripVertical className="text-gray-600 dark:text-gray-300 text-sm" />
                      </div>

                      {/* Status Badges */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md ${
                            category.isActive
                              ? "bg-green-100/80 text-green-700 border border-green-200"
                              : "bg-gray-100/80 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {category.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4">
                      {/* Icon Overlap */}
                      <div className="relative -mt-8 mb-3 flex justify-between items-end">
                        <div className="p-1 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                          {category.icon || category.icon ? (
                            <img
                              src={category.icon || category.image}
                              className="w-12 h-12 rounded-md object-cover"
                              alt=""
                            />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/30 rounded-md">
                              <FiFolder className="text-red-600 dark:text-red-400 text-xl" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 mb-1 flex items-center gap-1 uppercase">
                          <FaLayerGroup /> Level {category.level || 0}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-bold text-gray-900 text-lg dark:text-white truncate group-hover:text-red-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                          <FaTag className="text-[10px]" /> /{category.slug}
                        </p>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                          <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">
                            Sub-categories
                          </p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {category.subCategories?.length || 0}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                          <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">
                            Meta Fields
                          </p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {category.metaFields?.length || 0}
                          </p>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() =>
                            navigate(`/categories/${category._id}`)
                          }
                          className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                        >
                          Details <FiExternalLink />
                        </button>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleFallbackClick(category)}
                            title="Set Fallback"
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                          >
                            <FaRandom size={14} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/categories/edit/${category._id}`)
                            }
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <FiTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </WrapperBody.Grid>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CategoryGridView;
