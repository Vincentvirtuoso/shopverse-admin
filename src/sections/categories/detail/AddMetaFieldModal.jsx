import { useState } from "react";
import MetaFieldEditForm from "./MetaFieldEditForm";
import Modal from "../../../components/atoms/Modal";
import Btn from "../../../components/atoms/Btn";
import { FieldLabel, Input } from "../../../components/atoms/FormComponents";

const AddMetaFieldModal = ({
  open,
  onClose,
  categoryId,
  existingKeys,
  loadingStates,
  actions,
  toast,
}) => {
  const blank = {
    key: "",
    label: "",
    type: "text",
    unit: "",
    placeholder: "",
    options: [],
    defaultValue: null,
    isRequired: false,
    isFilterable: false,
    isSearchable: false,
    isVisibleOnProductPage: true,
  };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  const change = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.key.trim()) e.key = "Required";
    else if (!/^[a-z][a-zA-Z0-9_]*$/.test(form.key.trim()))
      e.key = "Start with a letter; letters/numbers/underscores only";
    else if (existingKeys.includes(form.key.trim()))
      e.key = "Key already exists";
    if (!form.label.trim()) e.label = "Required";
    if (form.type === "select" && (!form.options || form.options.length === 0))
      e.options = "At least one option required for select type";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      await actions.addMetaField(categoryId, {
        ...form,
        key: form.key.trim(),
        label: form.label.trim(),
      });
      toast.success(`Field "${form.key}" added`);
      setForm(blank);
      setErrors({});
      onClose();
    } catch {
      toast.error("Failed to add field");
    }
  };

  const handleClose = () => {
    setForm(blank);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Meta Field"
      footer={
        <>
          <Btn variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Btn>
          <Btn
            variant="primary"
            size="sm"
            loading={loadingStates.addMetaField}
            onClick={handleSubmit}
          >
            Add Field
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Key</FieldLabel>
            <div className="relative">
              <Input
                value={form.key}
                onChange={(e) =>
                  change(
                    "key",
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  )
                }
                placeholder="e.g. screen_size"
                className={
                  errors.key ? "border-red-600 focus:border-red-500" : ""
                }
              />{" "}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">
                Auto
              </span>
            </div>
            {errors.key && (
              <p className="text-[11px] text-red-400 mt-1">{errors.key}</p>
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              snake_case, unique in this category
            </p>
          </div>
        </div>
        <MetaFieldEditForm form={form} onChange={change} />
        {errors.options && (
          <p className="text-[11px] text-red-400">{errors.options}</p>
        )}
      </div>
    </Modal>
  );
};

export default AddMetaFieldModal;
