import { useEffect } from "react";
import { useState } from "react";
import { TYPE_COLOR } from "../../../assets/categoryDetail";
import Badge from "../../../components/atoms/Badge";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa";
import { Input } from "../../../components/atoms/FormComponents";
import Btn from "../../../components/atoms/Btn";
import { FiCheck, FiX } from "react-icons/fi";
import WrapperBody from "../../../components/common/WrapperBody";
import Modal from "../../../components/atoms/Modal";
import MetaFieldEditForm from "./MetaFieldEditForm";

const MetaFieldRow = ({
  field,
  index,
  totalCount,
  isExpanded,
  isReordering,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  categoryId,
  loadingStates,
  actions,
  toast,
  allKeys,
}) => {
  const [editForm, setEditForm] = useState({ ...field });
  const [renameMode, setRenameMode] = useState(false);
  const [newKey, setNewKey] = useState(field.key);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditForm({ ...field });
    setNewKey(field.key);
  }, [field]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await actions.updateMetaField(categoryId, field.key, {
        label: editForm.label,
        type: editForm.type,
        unit: editForm.unit,
        placeholder: editForm.placeholder,
        options: editForm.options,
        defaultValue: editForm.defaultValue,
        isRequired: editForm.isRequired,
        isFilterable: editForm.isFilterable,
        isSearchable: editForm.isSearchable,
        isVisibleOnProductPage: editForm.isVisibleOnProductPage,
      });
      toast.success(`"${field.key}" updated`);
      onToggleExpand();
    } catch {
      toast.error("Failed to update field");
    } finally {
      setSaving(false);
    }
  };

  const handleRenameKey = async () => {
    const t = newKey.trim();
    if (!t || t === field.key) {
      setRenameMode(false);
      return;
    }
    if (allKeys.includes(t)) {
      toast.error("Key already exists");
      return;
    }
    if (!/^[a-z][a-zA-Z0-9_]*$/.test(t)) {
      toast.error("Invalid key format");
      return;
    }
    try {
      await actions.renameMetaFieldKey(categoryId, field.key, t);
      toast.success("Key renamed");
      setRenameMode(false);
    } catch {
      toast.error("Failed to rename key");
    }
  };

  const handleDelete = async () => {
    try {
      await actions.removeMetaField(categoryId, field.key);
      toast.success(`"${field.key}" removed`);
    } catch {
      toast.error("Failed to remove field");
    }
    setConfirmDelete(false);
  };

  return (
    <div
      className={`rounded-xl border transition-colors ${
        isExpanded
          ? "border-amber-800/50 bg-neutral-950/70"
          : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-700"
      }`}
    >
      {/* Row Header */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
        {/* Reorder arrows */}
        {isReordering && (
          <div className="flex flex-col gap-0.5 shrink-0">
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              className="text-slate-600 hover:text-amber-400 disabled:opacity-20 transition-colors text-[11px] leading-none p-0.5"
            >
              <FaAngleUp />
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === totalCount - 1}
              className="text-slate-600 hover:text-amber-400 disabled:opacity-20 transition-colors text-[11px] leading-none p-0.5"
            >
              <FaAngleDown />
            </button>
          </div>
        )}

        <span className="text-[10px] text-slate-600 font-mono w-4 text-right shrink-0">
          {index + 1}
        </span>

        {/* Key / inline rename */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {renameMode ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="text-xs h-7 py-0 w-36 sm:w-44"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameKey();
                  if (e.key === "Escape") setRenameMode(false);
                }}
              />
              <Btn
                variant="success"
                size="xs"
                loading={loadingStates.renameMetaField}
                onClick={handleRenameKey}
              >
                <FiCheck />
              </Btn>
              <Btn
                variant="ghost"
                size="xs"
                onClick={() => setRenameMode(false)}
              >
                <FiX />
              </Btn>
            </div>
          ) : (
            <button
              onClick={() => {
                setRenameMode(true);
                setNewKey(field.key);
              }}
              title="Click to rename key"
              className="font-mono text-xs sm:text-sm text-amber-400 hover:text-amber-300 transition-colors text-left"
            >
              {field.key}
            </button>
          )}
          <Badge color={TYPE_COLOR[field.type] || "slate"}>{field.type}</Badge>
          {field.isRequired && <Badge color="red">req</Badge>}
          {field.isFilterable && <Badge color="blue">filter</Badge>}
          <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
            {field.label}
          </span>
        </div>

        {/* Row actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleExpand}
            disabled={isReordering}
            className="text-slate-500 hover:text-slate-300 text-[11px] px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30 whitespace-nowrap flex items-center gap-2"
          >
            {isExpanded ? <FaAngleUp size={16} /> : <FaAngleDown size={16} />}
            <span className="hidden sm:inline ml-1">
              {isExpanded ? "Close" : "Edit"}
            </span>
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={isReordering}
            className="text-red-600 hover:text-red-400 text-[11px] px-2 py-1 rounded-lg hover:bg-red-950/30 transition-colors disabled:opacity-30"
          >
            <span className="hidden sm:inline">Delete</span>
            <span className="sm:hidden">✕</span>
          </button>
        </div>
      </div>

      {/* Expanded Edit Panel */}
      {isExpanded && !isReordering && (
        <div className="px-3 sm:px-4 py-4">
          <WrapperBody.Divider className="-mt-2" />
          {/* Label shown for mobile (hidden in row) */}
          <p className="text-[11px] text-slate-500 mb-3 sm:hidden">
            {field.label}
          </p>
          <MetaFieldEditForm
            form={editForm}
            onChange={(k, v) => setEditForm((p) => ({ ...p, [k]: v }))}
          />
          <div className="flex justify-end gap-2 mt-4 flex-wrap">
            <Btn variant="ghost" size="sm" onClick={onToggleExpand}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              loading={saving}
              onClick={handleSave}
            >
              Save Field
            </Btn>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete Meta Field"
        footer={
          <>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Btn>
            <Btn
              variant="danger"
              size="sm"
              loading={loadingStates.removeMetaField}
              onClick={handleDelete}
            >
              Delete
            </Btn>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-300">
            Delete meta field{" "}
            <code className="text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">
              {field.key}
            </code>{" "}
            ("{field.label}")?
          </p>
          <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-xl">
            <p className="text-[11px] text-red-400 leading-relaxed">
              ⚠ This removes the field from the product schema. Existing product
              values are preserved, but the field won't appear in admin creation
              forms.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MetaFieldRow;
