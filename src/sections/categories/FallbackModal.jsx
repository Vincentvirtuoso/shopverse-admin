import Btn from "../../components/atoms/Btn";
import { SelectField } from "../../components/atoms/FormComponents";
import Modal from "../../components/atoms/Modal";

const FallbackModal = ({
  categories,
  categoryForFallback,
  selectedFallback,
  showFallbackModal,
  setShowFallbackModal,
  handleFallbackConfirm,
  setSelectedFallback,
  loading,
}) => {
  const availableFallbacks =
    categories?.filter(
      (cat) =>
        cat._id !== categoryForFallback?._id && cat.isActive && !cat.isArchived,
    ) || [];

  return (
    <Modal
      open={showFallbackModal}
      onClose={() => setShowFallbackModal(false)}
      title="Set Fallback Category"
      footer={
        <>
          <Btn
            variant="secondary"
            size="sm"
            onClick={() => setShowFallbackModal(false)}
            disabled={loading}
          >
            Cancel
          </Btn>
          <Btn
            variant="primary"
            size="sm"
            onClick={() => handleFallbackConfirm(selectedFallback)}
            loading={loading}
          >
            Save
          </Btn>
        </>
      }
    >
      <div className="mb-4">
        <p className="text-xs text-slate-400">
          Choose where to move products when{" "}
          <span className="text-amber-400 font-semibold">
            "{categoryForFallback?.name}"
          </span>{" "}
          is deleted.
        </p>
      </div>

      <SelectField
        value={selectedFallback}
        onChange={(e) => setSelectedFallback(e.target.value)}
      >
        <option value="">Use global fallback</option>
        {availableFallbacks.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </SelectField>
    </Modal>
  );
};

export default FallbackModal;
