import { FaRandom } from "react-icons/fa";
import { useState } from "react";
import Modal from "../../components/atoms/Modal";
import Btn from "../../components/atoms/Btn";
import { LuMove } from "react-icons/lu";
import { SelectField } from "../../components/atoms/FormComponents";

const MoveCategoryModal = ({
  open,
  onClose,
  categories = [],
  categoryForMoving,
  handleMoveCategoryConfirm,
  loading,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const availableCategories =
    categories?.filter(
      (cat) =>
        cat._id !== categoryForMoving?._id && cat.isActive && !cat.isArchived,
    ) || [];

  const handleConfirm = () => {
    const targetCategory = availableCategories.find(
      (cat) => cat._id === selectedCategoryId,
    );
    if (targetCategory) {
      handleMoveCategoryConfirm(targetCategory);
    } else {
      handleMoveCategoryConfirm({ _id: null, name: "root" });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Move "${categoryForMoving?.name}" Category`}
      footer={
        <>
          <Btn variant="secondary" size="lg" onClick={onClose}>
            Cancel
          </Btn>
          <Btn
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            loading={loading}
          >
            Save
          </Btn>
        </>
      }
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
          <LuMove className="text-amber-600 text-xl" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-400">
            Choose where to move products
          </p>
        </div>
      </div>

      <SelectField
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
      >
        <option value="">Move to root category</option>
        {availableCategories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name} {!cat.isActive && "(Inactive)"}
          </option>
        ))}
      </SelectField>
    </Modal>
  );
};

export default MoveCategoryModal;
