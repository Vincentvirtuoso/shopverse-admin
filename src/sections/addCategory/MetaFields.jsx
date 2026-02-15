import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import WrapperBody from "../../components/common/WrapperBody";
import {
  FaCalculator,
  FaCheckSquare, // For Boolean
  FaCopy,
  FaExclamationCircle,
  FaFile,
  FaFilter,
  FaFont,
  FaGripVertical,
  FaList,
  FaRuler,
  FaSearch,
  FaChevronDown, // For Select
} from "react-icons/fa";
import { FiCalendar, FiSettings, FiTrash } from "react-icons/fi";
import CardWrapper from "../../components/ui/CardWrapper";
import toast from "react-hot-toast";

const MetaFields = ({
  formData,
  setFormData,
  openEditMetaField,
  setDeleteConfirm,
}) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formData.metaFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormData((prev) => ({
      ...prev,
      metaFields: items.map((item, idx) => ({ ...item, sortOrder: idx })),
    }));
  };

  const getFieldTypeStyles = (type) => {
    const styles = {
      text: {
        borderColor: "#3B82F6",
        bg: "#EFF6FF",
        color: "#1E40AF",
        icon: FaFont,
      },
      number: {
        borderColor: "#10B981",
        bg: "#ECFDF5",
        color: "#065F46",
        icon: FaCalculator,
      },
      array: {
        borderColor: "#8B5CF6",
        bg: "#F5F3FF",
        color: "#5B21B6",
        icon: FaList,
      },
      select: {
        borderColor: "#6366F1",
        bg: "#EEF2FF",
        color: "#3730A3",
        icon: FaChevronDown,
      },
      file: {
        borderColor: "#F59E0B",
        bg: "#FEF3C7",
        color: "#92400E",
        icon: FaFile,
      },
      date: {
        borderColor: "#EC4899",
        bg: "#FDF2F8",
        color: "#9D174D",
        icon: FiCalendar,
      },
      boolean: {
        borderColor: "#06B6D4",
        bg: "#ECFEFF",
        color: "#0891B2",
        icon: FaCheckSquare,
      },
    };
    return (
      styles[type] || {
        borderColor: "#6B7280",
        bg: "#F3F4F6",
        color: "#374151",
        icon: FaFont,
      }
    );
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied "${label}" to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <WrapperBody.Flex direction="col" gap={3} className="mt-2">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="metafields-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {formData.metaFields.map((field, index) => {
                const typeStyles = getFieldTypeStyles(field.type);
                const TypeIcon = typeStyles.icon;
                const draggableId = String(field._id || field.key || index);

                return (
                  <Draggable
                    key={draggableId}
                    draggableId={draggableId}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          userSelect: "none",
                        }}
                      >
                        <CardWrapper
                          className={`border-l-4 transition-all ${
                            snapshot.isDragging
                              ? "shadow-2xl ring-4 ring-blue-500/20 border-l-blue-500 scale-[1.02]"
                              : "hover:shadow-md"
                          }`}
                          bodyClassName="flex items-center gap-3 p-4 bg-white dark:bg-neutral-800 rounded-lg"
                          style={{
                            borderLeftColor: snapshot.isDragging
                              ? undefined
                              : typeStyles.borderColor,
                          }}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-400 hover:text-gray-600 p-2 cursor-grab active:cursor-grabbing"
                          >
                            <FaGripVertical className="text-lg" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                {field.label}
                              </h4>
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold flex items-center gap-1"
                                style={{
                                  backgroundColor: typeStyles.bg,
                                  color: typeStyles.color,
                                }}
                              >
                                <TypeIcon /> {field.type}
                              </span>
                              {field.isRequired && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
                                  <FaExclamationCircle /> Required
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                                {field.key}
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(field.key, "field key")
                                }
                                type="button"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <FaCopy className="text-xs" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditMetaField(index)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Settings"
                            >
                              <FiSettings className="text-xl" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  type: "metafield",
                                  index,
                                  name: field.label,
                                  message: `Are you sure you want to delete the field "${field.label}"?`,
                                })
                              }
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash className="text-xl" />
                            </button>
                          </div>
                        </CardWrapper>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {formData.metaFields.length === 0 && (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <p className="font-medium">No meta fields added yet</p>
          <p className="text-sm">
            Customize your products by adding unique fields.
          </p>
        </div>
      )}
    </WrapperBody.Flex>
  );
};

export default MetaFields;
