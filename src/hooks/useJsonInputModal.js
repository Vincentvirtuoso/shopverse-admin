import { useState, useCallback } from "react";

export const useJsonInputModal = () => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    fieldPath: null,
    initialValue: null,
    title: "Edit JSON",
    onSaveCallback: null,
  });

  const openJsonInput = useCallback((fieldPath, initialValue, options = {}) => {
    setModalConfig({
      isOpen: true,
      fieldPath,
      initialValue,
      title:
        options.title ||
        (fieldPath ? `Edit ${fieldPath.join(" → ")}` : "Edit JSON"),
      onSaveCallback: options.onSave || null,
    });
  }, []);

  const closeJsonInput = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    openJsonInput,
    closeJsonInput,
    modalConfig,
  };
};
