import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaList,
  FaPlus,
  FaGripVertical,
  FaTrash,
  FaCog,
  FaRegFolderOpen,
} from "react-icons/fa";
import CardWrapper from "../../components/ui/CardWrapper";
import WrapperHeader from "../../components/common/WrapperHeader";
import WrapperBody from "../../components/common/WrapperBody";

const SubcategoryManagement = ({
  formData,
  expandedSections,
  openAddSubCategory,
  openEditSubCategory,
  setDeleteConfirm,
  onReorderSubcategories,
}) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formData.subCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderSubcategories(items);
  };

  return (
    <CardWrapper className="mb-6 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <WrapperHeader
        title="Subcategories"
        description="Organize your category hierarchy"
        icon={<FaList />}
        className="bg-gray-50/50 dark:bg-neutral-800/50 p-5"
      >
        <button
          type="button"
          onClick={openAddSubCategory}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 text-xs font-bold transition-all shadow-md shadow-red-100 dark:shadow-none place-self-start"
        >
          <FaPlus size={10} /> ADD SUBCATEGORY
        </button>
      </WrapperHeader>

      <AnimatePresence>
        {expandedSections.subcategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-neutral-900">
              {formData.subCategories.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <FaRegFolderOpen className="text-2xl text-red-400" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-semibold">
                    Empty Nest
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 text-center max-w-[250px]">
                    Organize your products by adding specific sub-sections here.
                  </p>
                  <button
                    type="button"
                    onClick={openAddSubCategory}
                    className="text-red-600 text-sm font-bold hover:underline"
                  >
                    Create your first one &rarr;
                  </button>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="subcategories-list">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3"
                      >
                        {formData.subCategories.map((sub, index) => (
                          <Draggable
                            key={sub._id || `sub-${index}`}
                            draggableId={sub._id || `sub-${index}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center gap-4 p-3 bg-white dark:bg-gray-800 border rounded-xl transition-all ${
                                  snapshot.isDragging
                                    ? "border-red-500 shadow-xl ring-2 ring-red-50 bg-red-50/10 z-50"
                                    : "border-gray-100 dark:border-gray-700 shadow-sm"
                                }`}
                              >
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-gray-300 hover:text-red-400 cursor-grab active:cursor-grabbing p-1"
                                >
                                  <FaGripVertical />
                                </div>

                                {/* Thumb */}
                                <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                                  {sub.image ? (
                                    <img
                                      src={sub.image}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 uppercase font-bold text-[10px]">
                                      No Img
                                    </div>
                                  )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                      {sub.name}
                                    </h4>
                                    {!sub.isActive && (
                                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded uppercase font-bold tracking-tighter">
                                        Hidden
                                      </span>
                                    )}
                                  </div>
                                  {sub.description ? (
                                    <p className="text-xs text-gray-500 truncate">
                                      {sub.description}
                                    </p>
                                  ) : (
                                    <p className="text-xs text-gray-400 italic font-mono">
                                      /{sub.slug}
                                    </p>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => openEditSubCategory(index)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  >
                                    <FaCog size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteConfirm({
                                        isOpen: true,
                                        type: "subcategory",
                                        index,
                                        name: sub.name,
                                      })
                                    }
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardWrapper>
  );
};

export default SubcategoryManagement;
