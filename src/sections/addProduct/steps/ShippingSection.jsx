import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiTruck,
  FiClock,
  FiBox,
  FiCheckCircle,
  FiCalendar,
  FiTag,
  FiHash,
} from "react-icons/fi";
import {
  dimensionUnitOptions,
  weightUnitOptions,
} from "../../../assets/addProducts";
import { LuRuler, LuScale } from "react-icons/lu";

const ShippingSection = ({ form, handleChange, setForm }) => {
  // Calculate package volume
  const packageVolume = useMemo(() => {
    const { length, width, height, unit } = form.dimensions;
    if (!length || !width || !height) return null;

    const volume = length * width * height;
    let formattedVolume = volume.toFixed(2);
    let volumeUnit = "cm³";

    switch (unit) {
      case "m":
        volumeUnit = "m³";
        formattedVolume = (volume / 1000000).toFixed(4);
        break;
      case "in":
        volumeUnit = "in³";
        break;
      case "ft":
        volumeUnit = "ft³";
        break;
    }

    return `${formattedVolume} ${volumeUnit}`;
  }, [form.dimensions]);

  // Determine shipping class by weight
  const getSuggestedShippingClass = useCallback(() => {
    const weight = form.weight.value;
    if (!weight) return null;

    if (weight < 500) return "Standard";
    if (weight < 2000) return "Express";
    if (weight < 10000) return "Heavy Item";
    return "Freight";
  }, [form.weight.value]);

  // Handle unit conversions
  const handleUnitConversion = useCallback(
    (field, newUnit) => {
      const conversions = {
        weight: {
          g: 1,
          kg: 1000,
          lb: 453.592,
          oz: 28.3495,
        },
        dimensions: {
          cm: 1,
          m: 100,
          in: 2.54,
          ft: 30.48,
        },
      };

      if (field === "weight") {
        const oldValue = form.weight.value;
        const oldUnit = form.weight.unit;
        const newValue =
          oldValue *
          (conversions.weight[oldUnit] / conversions.weight[newUnit]);

        setForm((prev) => ({
          ...prev,
          weight: {
            ...prev.weight,
            value: newValue.toFixed(2),
            unit: newUnit,
          },
        }));
      } else if (field === "dimensions") {
        const oldValues = { ...form.dimensions };
        const oldUnit = oldValues.unit;
        const conversionFactor =
          conversions.dimensions[oldUnit] / conversions.dimensions[newUnit];

        setForm((prev) => ({
          ...prev,
          dimensions: {
            length: (oldValues.length * conversionFactor).toFixed(2),
            width: (oldValues.width * conversionFactor).toFixed(2),
            height: (oldValues.height * conversionFactor).toFixed(2),
            unit: newUnit,
          },
        }));
      }
    },
    [form, setForm]
  );

  // Shipping time options
  const deliveryTimeOptions = [
    { value: "1-2 days", label: "1-2 Business Days", icon: FiClock },
    { value: "2-3 days", label: "2-3 Business Days", icon: FiCalendar },
    { value: "3-5 days", label: "3-5 Business Days", icon: FiCalendar },
    { value: "5-7 days", label: "5-7 Business Days", icon: FiCalendar },
    { value: "7-10 days", label: "7-10 Business Days", icon: FiCalendar },
    { value: "10-14 days", label: "10-14 Business Days", icon: FiCalendar },
    { value: "custom", label: "Custom Delivery", icon: FiClock },
  ];

  // Shipping class options with icons
  const shippingClassOptions = [
    {
      label: "Standard",
      value: "standard",
      icon: FiTruck,
      description: "Regular ground shipping",
      color: "from-gray-500 to-gray-600",
    },
    {
      label: "Express",
      value: "express",
      icon: FiTruck,
      description: "Fast delivery (2-3 days)",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Overnight",
      value: "overnight",
      icon: FiTruck,
      description: "Next day delivery",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Free Shipping",
      value: "free",
      icon: FiTruck,
      description: "Free delivery",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Heavy Item",
      value: "heavy",
      icon: FiPackage,
      description: "For items over 5kg",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Fragile",
      value: "fragile",
      icon: FiBox,
      description: "Extra care needed",
      color: "from-red-500 to-rose-500",
    },
    {
      label: "International",
      value: "international",
      icon: FiTruck,
      description: "Overseas shipping",
      color: "from-indigo-500 to-violet-500",
    },
  ];

  return (
    <motion.div
      key="shipping"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      {/* Package Dimensions & Weight Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
          <FiPackage className="text-blue-500" />
          Package Dimensions & Weight
        </h3>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Weight Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <LuScale className="text-gray-400" />
                Product Weight
              </label>
              {form.weight.value > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    handleUnitConversion(
                      "weight",
                      form.weight.unit === "g"
                        ? "kg"
                        : form.weight.unit === "kg"
                        ? "lb"
                        : form.weight.unit === "lb"
                        ? "oz"
                        : "g"
                    )
                  }
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Convert to{" "}
                  {form.weight.unit === "g"
                    ? "kg"
                    : form.weight.unit === "kg"
                    ? "lb"
                    : form.weight.unit === "lb"
                    ? "oz"
                    : "g"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <div className="relative">
                  <input
                    type="number"
                    name="weight.value"
                    value={form.weight.value || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter weight"
                  />
                  <LuScale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {form.weight.value > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    Equivalent to:
                    {form.weight.unit === "g" &&
                      ` ${(form.weight.value / 1000).toFixed(3)} kg`}
                    {form.weight.unit === "kg" &&
                      ` ${(form.weight.value * 1000).toFixed(0)} g`}
                    {form.weight.unit === "lb" &&
                      ` ${(form.weight.value * 16).toFixed(1)} oz`}
                    {form.weight.unit === "oz" &&
                      ` ${(form.weight.value / 16).toFixed(3)} lb`}
                  </p>
                )}
              </div>
              <div>
                <div className="relative">
                  <select
                    name="weight.unit"
                    value={form.weight.unit}
                    onChange={(e) => {
                      handleChange(e);
                      if (form.weight.value) {
                        handleUnitConversion("weight", e.target.value);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {weightUnitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Weight-based suggestions */}
            {form.weight.value > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Suggested shipping class:{" "}
                  <span className="font-semibold">
                    {getSuggestedShippingClass()}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Dimensions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <LuRuler className="text-gray-400" />
                Package Dimensions
              </label>
              {packageVolume && (
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Volume: {packageVolume}
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Length", name: "dimensions.length", icon: LuRuler },
                  { label: "Width", name: "dimensions.width", icon: LuRuler },
                  { label: "Height", name: "dimensions.height", icon: LuRuler },
                ].map((dimension) => (
                  <div
                    key={dimension.name}
                    className="relative min-w-25 max-w-40 text-xs flex-1"
                  >
                    <input
                      type="number"
                      name={dimension.name}
                      value={
                        form.dimensions[dimension.name.split(".")[1]] || ""
                      }
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={dimension.label.charAt(0)}
                    />
                    <dimension.icon className="absolute left-3 bottom-1/2 transform -translate-y-1/2 text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      {dimension.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <select
                    name="dimensions.unit"
                    value={form.dimensions.unit}
                    onChange={(e) => {
                      handleChange(e);
                      if (
                        form.dimensions.length &&
                        form.dimensions.width &&
                        form.dimensions.height
                      ) {
                        handleUnitConversion("dimensions", e.target.value);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {dimensionUnitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <LuRuler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {form.dimensions.length &&
                  form.dimensions.width &&
                  form.dimensions.height && (
                    <button
                      type="button"
                      onClick={() =>
                        handleUnitConversion(
                          "dimensions",
                          form.dimensions.unit === "cm"
                            ? "in"
                            : form.dimensions.unit === "in"
                            ? "ft"
                            : form.dimensions.unit === "ft"
                            ? "m"
                            : "cm"
                        )
                      }
                      className="px-3 py-3 text-xs font-medium bg-gray-100 dark:bg-gray-800 
                             text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      Convert
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-6">
          <FiTruck className="text-green-500" />
          Shipping Information
        </h3>

        <div className="grid grid-cols-1 gap-8">
          {/* Free Shipping Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer p-4 rounded-lg dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    form.shippingInfo.isFreeShipping
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <FiTruck
                    className={`w-5 h-5 ${
                      form.shippingInfo.isFreeShipping
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Free Shipping
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Offer free shipping to customers
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.shippingInfo.isFreeShipping || false}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      shippingInfo: {
                        ...prev.shippingInfo,
                        isFreeShipping: e.target.checked,
                      },
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`block w-14 h-7 rounded-full ${
                    form.shippingInfo.isFreeShipping
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
                <div
                  className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${
                    form.shippingInfo.isFreeShipping
                      ? "transform translate-x-7"
                      : ""
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <FiClock className="text-gray-400" />
              Delivery Time
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
              {deliveryTimeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        shippingInfo: {
                          ...prev.shippingInfo,
                          deliveryTime: option.value,
                        },
                      }))
                    }
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all
                      ${
                        form.shippingInfo.deliveryTime === option.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700"
                      }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium text-center">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom delivery time input */}
            {form.shippingInfo.deliveryTime === "custom" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={form.shippingInfo.customDeliveryTime || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      shippingInfo: {
                        ...prev.shippingInfo,
                        customDeliveryTime: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter custom delivery time (e.g., 5-7 working days)"
                />
              </div>
            )}
          </div>
        </div>

        {/* Shipping Class Selection */}
        <div className="mt-8">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            <FiTag className="text-gray-400" />
            Shipping Class
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {shippingClassOptions.map((option) => {
              const Icon = option.icon;
              const isSelected =
                form.shippingInfo.shippingClass === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      shippingInfo: {
                        ...prev.shippingInfo,
                        shippingClass: option.value,
                      },
                    }))
                  }
                  className={`p-4 rounded-xl border transition-all duration-300 text-left
                    ${
                      isSelected
                        ? `border-transparent bg-linear-to-r ${option.color} text-white shadow-lg`
                        : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? "text-white" : "text-gray-400"
                      }`}
                    />
                    {isSelected && <FiCheckCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4
                      className={`font-semibold ${
                        isSelected
                          ? "text-white"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {option.label}
                    </h4>
                    <p
                      className={`text-xs mt-1 ${
                        isSelected
                          ? "text-white/90"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Shipping Notes */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Additional Shipping Notes (Optional)
          </label>
          <textarea
            value={form.shippingInfo.notes || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                shippingInfo: {
                  ...prev.shippingInfo,
                  notes: e.target.value,
                },
              }))
            }
            rows="3"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Add any special shipping instructions, restrictions, or notes..."
            maxLength="500"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Special handling instructions for carriers
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {(form.shippingInfo.notes || "").length}/500
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShippingSection;
