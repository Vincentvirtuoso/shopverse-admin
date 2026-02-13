import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import MultiInput from "../../../components/common/MultiInput";
import SpecificationsInput from "../../../components/common/SpecificationsInput";
import WrapperBody from "../../../components/common/WrapperBody";

const AttributesSection = ({
  addFeature,
  form,
  addTag,
  removeFeature,
  removeTag,
  onSpecificationsChange,
  handleJsonEditField,
  setNotification,
}) => {
  const specifications = useMemo(() => {
    if (!form?.specifications) return new Map();

    if (form.specifications instanceof Map) return new Map(form.specifications);

    if (typeof form.specifications === "object") {
      return new Map(Object.entries(form.specifications));
    }

    return new Map();
  }, [form.specifications]);

  const handleSpecificationsChange = useCallback(
    (newSpecs) => {
      onSpecificationsChange(newSpecs);
    },
    [onSpecificationsChange],
  );

  return (
    <motion.div
      key="attributes"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      <WrapperBody.Grid cols="2-xl">
        {/* Tags Input */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <MultiInput
            label="Product Tags"
            name="tags"
            value={form.tags}
            addItem={addTag}
            removeItem={removeTag}
            placeholder="Add tags (comma-separated)..."
            mode="comma-separated"
            allowModeSwitch={true}
            maxItems={15}
            minItems={0}
            maxLength={30}
            minLength={2}
            helperText="Tags help customers find your product. Use comma-separated values for bulk entry."
            suggestions={[
              "electronics",
              "gadget",
              "tech",
              "innovative",
              "bestseller",
              "new-arrival",
              "premium",
              "affordable",
              "durable",
              "portable",
              "wireless",
              "smart",
            ]}
            icon="tag"
            allowDuplicates={false}
            styling={{
              primaryColor: "purple",
              numberBadgeGradient: "from-purple-500 to-purple-600",
            }}
            handleJsonEdit={(currentValue) => {
              handleJsonEditField(["tags"], currentValue, setNotification);
            }}
          />
        </div>

        {/* Features Input */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <MultiInput
            label="Product Features"
            name="features"
            value={form.features}
            addItem={addFeature}
            removeItem={removeFeature}
            placeholder="Enter a product feature..."
            mode="comma-separated"
            allowModeSwitch={true}
            maxItems={8}
            minItems={3}
            maxLength={100}
            helperText="Add 3-8 key features that highlight your product's main benefits"
            suggestions={[
              "Long battery life",
              "Water resistant",
              "Easy to use",
              "Premium materials",
              "Fast charging",
              "Lightweight design",
              "Durable construction",
              "Energy efficient",
              "Noise cancelling",
              "Multi-device connectivity",
              "Voice assistant compatible",
              "Touch screen display",
            ]}
            required={true}
            icon="list"
            styling={{
              primaryColor: "blue",
              numberBadgeGradient: "from-blue-500 to-blue-600",
            }}
            handleJsonEdit={(currentValue) => {
              handleJsonEditField(["features"], currentValue, setNotification);
            }}
          />
        </div>
      </WrapperBody.Grid>

      {/* Specifications Input */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <SpecificationsInput
          specifications={specifications}
          onSpecificationsChange={handleSpecificationsChange}
          handleJsonEditField={(currentValue) =>
            handleJsonEditField(["specifications"], currentValue)
          }
        />
      </div>
    </motion.div>
  );
};

export default AttributesSection;
