import { useState } from "react";
import Btn from "../../../components/atoms/Btn";
import Modal from "../../../components/atoms/Modal";
import { FieldLabel, Input } from "../../../components/atoms/FormComponents";

const RenameModal = ({ category, loadingStates, actions, toast }) => {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");

  const handle = async () => {
    if (!val.trim()) return;
    try {
      await actions.renameCategory(category._id, val.trim());
      toast.success("Category renamed");
      setOpen(false);
    } catch {
      toast.error("Failed to rename");
    }
  };

  return (
    <>
      <Btn
        variant="secondary"
        size="sm"
        onClick={() => {
          setVal(category?.name || "");
          setOpen(true);
        }}
      >
        Rename
      </Btn>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Rename Category"
        footer={
          <>
            <Btn variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              loading={loadingStates.renameCategory}
              onClick={handle}
            >
              Save
            </Btn>
          </>
        }
      >
        <div>
          <FieldLabel required>New Name</FieldLabel>
          <Input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Category name…"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />
          <p className="text-[11px] text-slate-500 mt-2">
            Renaming recalculates the slug automatically on the backend.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default RenameModal;
