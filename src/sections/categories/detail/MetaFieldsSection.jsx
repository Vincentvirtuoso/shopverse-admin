import { useEffect, useMemo, useState } from "react";
import { LuList } from "react-icons/lu";
import { FaBan } from "react-icons/fa";

import CardWrapper from "../../../components/ui/CardWrapper";
import SectionHead from "../../../components/atoms/SectionHead";
import WrapperBody from "../../../components/common/WrapperBody";
import Btn from "../../../components/atoms/Btn";
import { META_TYPES } from "../../../assets/categoryDetail";
import MetaFieldRow from "./MetaFieldRow";
import AddMetaFieldModal from "./AddMetaFieldModal";

const MetaFieldsSection = ({ category, loadingStates, actions, toast }) => {
  const [addOpen, setAddOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [orderedIds, setOrderedIds] = useState([]);

  /**
   * Sort by sortOrder
   */
  const sorted = useMemo(() => {
    if (!category?.metaFields) return [];
    return [...category.metaFields].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [category?.metaFields]);

  /**
   * Sync orderedIds whenever backend order changes
   */
  useEffect(() => {
    setOrderedIds(sorted.map((f) => f._id));
  }, [sorted]);

  /**
   * Reorder Helpers
   */
  const moveUp = (i) => {
    if (i === 0) return;

    const next = [...orderedIds];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setOrderedIds(next);
  };

  const moveDown = (i) => {
    if (i === orderedIds.length - 1) return;

    const next = [...orderedIds];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setOrderedIds(next);
  };

  /**
   * Save reordered list
   */
  const saveOrder = async () => {
    try {
      await actions.reorderMetaFields(category._id, orderedIds);
      toast.success("Field order saved");
      setReordering(false);
    } catch {
      toast.error("Failed to reorder");
    }
  };

  /**
   * Determine what to render
   */
  const displayedFields = (reordering ? orderedIds : sorted.map((f) => f._id))
    .map((id) => sorted.find((f) => f._id === id))
    .filter(Boolean);

  const anyLoading =
    loadingStates.addMetaField ||
    loadingStates.updateMetaField ||
    loadingStates.renameMetaField ||
    loadingStates.removeMetaField ||
    loadingStates.reorderMetaFields;

  return (
    <CardWrapper className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <SectionHead
          icon={<LuList />}
          title="Meta Fields — Schema Builder"
          subtitle="Define product attributes. These become form fields in product creation."
        />

        <WrapperBody.Divider />

        <div className="flex gap-2 shrink-0 flex-wrap">
          {reordering ? (
            <>
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReordering(false);
                  setOrderedIds(sorted.map((f) => f._id));
                }}
              >
                Cancel
              </Btn>

              <Btn
                variant="success"
                size="sm"
                loading={loadingStates.reorderMetaFields}
                onClick={saveOrder}
              >
                Save Order
              </Btn>
            </>
          ) : (
            <>
              <Btn
                variant="secondary"
                size="sm"
                onClick={() => setReordering(true)}
                disabled={sorted.length < 2}
              >
                ↕ Reorder
              </Btn>

              <Btn
                variant="primary"
                size="sm"
                onClick={() => setAddOpen(true)}
                disabled={anyLoading}
              >
                + Add Field
              </Btn>
            </>
          )}
        </div>
      </div>

      {/* Type Legend */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {META_TYPES.map((t) => (
          <span
            key={t}
            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 border border-slate-700 font-mono"
          >
            {t}
          </span>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="py-10 sm:py-14 flex flex-col items-center gap-3 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
          <span className="text-3xl">
            <FaBan />
          </span>

          <p className="text-sm">No meta fields yet</p>

          <p className="text-xs text-center max-w-xs px-4 leading-relaxed">
            Meta fields define what product attributes exist for this category.
          </p>

          <Btn variant="secondary" size="sm" onClick={() => setAddOpen(true)}>
            + Add First Field
          </Btn>
        </div>
      ) : (
        <div className="space-y-2">
          {displayedFields.map((field, idx) => (
            <MetaFieldRow
              key={field._id}
              field={field}
              index={idx}
              totalCount={displayedFields.length}
              isExpanded={expandedId === field._id}
              isReordering={reordering}
              onToggleExpand={() =>
                setExpandedId((prev) => (prev === field._id ? null : field._id))
              }
              onMoveUp={() => moveUp(idx)}
              onMoveDown={() => moveDown(idx)}
              categoryId={category._id}
              loadingStates={loadingStates}
              actions={actions}
              toast={toast}
              allIds={sorted.map((f) => f._id)}
            />
          ))}
        </div>
      )}

      <AddMetaFieldModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        categoryId={category?._id}
        existingIds={sorted.map((f) => f._id)}
        loadingStates={loadingStates}
        actions={actions}
        toast={toast}
      />
    </CardWrapper>
  );
};

export default MetaFieldsSection;
