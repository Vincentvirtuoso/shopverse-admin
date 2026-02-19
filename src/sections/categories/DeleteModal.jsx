import { LuTriangleAlert } from "react-icons/lu";
import Btn from "../../components/atoms/Btn";
import Modal from "../../components/atoms/Modal";

const DeleteModal = ({
  isOpen,
  setIsOpen,
  onConfirm,
  deletingItemName,
  loading,
}) => (
  <Modal
    open={isOpen}
    onClose={() => setIsOpen(false)}
    title="Delete Category"
    footer={
      <>
        <Btn
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(false)}
          disabled={loading}
        >
          Cancel
        </Btn>
        <Btn variant="danger" size="sm" onClick={onConfirm} loading={loading}>
          Delete
        </Btn>
      </>
    }
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="w-10 h-10 bg-red-900/40 rounded-lg flex items-center justify-center">
        <LuTriangleAlert className="text-red-400 text-sm" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-200">Are you sure?</p>
        <p className="text-xs text-slate-400 mt-1">
          This will permanently delete{" "}
          <span className="text-amber-400 font-semibold">
            "{deletingItemName}"
          </span>
        </p>
      </div>
    </div>

    <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-3 text-xs text-amber-300">
      <p className="font-bold mb-1">Products will be reassigned</p>
      <p>
        All products in this category will be moved to the fallback category (if
        set) or the global fallback.
      </p>
    </div>
  </Modal>
);

export default DeleteModal;
