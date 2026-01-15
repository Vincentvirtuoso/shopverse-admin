import React, { useState } from "react";
import { FiBox, FiPackage, FiShield, FiInfo } from "react-icons/fi";
import { LuRuler, LuScale, LuCalculator, LuPencilRuler } from "react-icons/lu";

const PhysicalAttributes = ({
  formData,
  handleNestedChange,
  handleInputChange,
}) => {
  const [showVolume, setShowVolume] = useState(false);
  const [conversionMode, setConversionMode] = useState(null);

  const weightUnits = ["g", "kg", "lb", "oz"];
  const dimensionUnits = ["cm", "m", "in", "ft"];

  // Calculate package volume
  const calculateVolume = () => {
    const { length, width, height, unit } = formData.dimensions;
    if (!length || !width || !height) return null;

    const volume = length * width * height;
    let volumeInCm3 = volume;
    let displayUnit = "cm³";

    // Convert to cubic cm for consistent calculation
    switch (unit) {
      case "m":
        volumeInCm3 = volume * 1000000; // 1 m³ = 1,000,000 cm³
        displayUnit = "m³";
        break;
      case "in":
        volumeInCm3 = volume * 16.387; // 1 in³ = 16.387 cm³
        displayUnit = "in³";
        break;
      case "ft":
        volumeInCm3 = volume * 28316.8; // 1 ft³ = 28,316.8 cm³
        displayUnit = "ft³";
        break;
      default: // cm
        displayUnit = "cm³";
    }

    return {
      value: volume,
      cm3: volumeInCm3,
      displayUnit,
      formatted: volume.toFixed(2) + " " + displayUnit,
    };
  };

  const volume = calculateVolume();

  // Handle unit conversion
  const handleUnitConversion = (type, newUnit) => {
    const conversions = {
      weight: {
        g: { g: 1, kg: 0.001, lb: 0.00220462, oz: 0.035274 },
        kg: { g: 1000, kg: 1, lb: 2.20462, oz: 35.274 },
        lb: { g: 453.592, kg: 0.453592, lb: 1, oz: 16 },
        oz: { g: 28.3495, kg: 0.0283495, lb: 0.0625, oz: 1 },
      },
    };

    if (type === "weight" && formData.weight.value) {
      const currentValue = parseFloat(formData.weight.value);
      const currentUnit = formData.weight.unit;

      if (
        conversions.weight[currentUnit] &&
        conversions.weight[currentUnit][newUnit]
      ) {
        const newValue =
          currentValue * conversions.weight[currentUnit][newUnit];
        handleNestedChange("weight", "value", newValue.toFixed(2));
        handleNestedChange("weight", "unit", newUnit);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-linear-to-br from-red-50 to-cyan-50 dark:from-red-900/20 dark:to-cyan-900/20 rounded-xl">
            <FiPackage className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Physical Attributes
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Weight, dimensions, and warranty information
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Weight Section */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LuScale className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Weight
              </h3>
            </div>

            {formData.weight.value && (
              <div className="flex gap-2">
                {weightUnits.map(
                  (unit) =>
                    unit !== formData.weight.unit && (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => {
                          setConversionMode("weight");
                          handleUnitConversion("weight", unit);
                        }}
                        className="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 
                               rounded border border-gray-200 dark:border-gray-700 hover:border-red-300 
                               dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400"
                      >
                        Convert to {unit}
                      </button>
                    )
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight Value
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.weight.value || ""}
                  onChange={(e) =>
                    handleNestedChange("weight", "value", e.target.value)
                  }
                  min="0"
                  step="0.01"
                  placeholder="Enter weight"
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <LuScale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <div className=" relative group">
                <select
                  value={formData.weight.unit}
                  onChange={(e) =>
                    handleNestedChange("weight", "unit", e.target.value)
                  }
                  className="text-xs px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                >
                  {weightUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit === "g"
                        ? "Grams (g)"
                        : unit === "kg"
                        ? "Kilograms (kg)"
                        : unit === "lb"
                        ? "Pounds (lb)"
                        : "Ounces (oz)"}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-2 h-2 border-b-2 border-r-2 border-gray-400 transform rotate-45 group-focus:rotate-90"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dimensions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-linear-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                <LuRuler className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Dimensions
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Length", field: "length", icon: LuRuler },
                { label: "Width", field: "width", icon: LuRuler },
                { label: "Height", field: "height", icon: LuRuler },
              ].map((dim) => {
                const Icon = dim.icon;
                return (
                  <div key={dim.field} className="relative">
                    <input
                      type="number"
                      value={formData.dimensions[dim.field] || ""}
                      onChange={(e) =>
                        handleNestedChange(
                          "dimensions",
                          dim.field,
                          e.target.value
                        )
                      }
                      min="0"
                      step="0.01"
                      placeholder={dim.label}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 text-xs focus:border-transparent"
                    />
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-4.5 text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      {dim.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <div className="relative">
                <select
                  value={formData.dimensions.unit}
                  onChange={(e) =>
                    handleNestedChange("dimensions", "unit", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                >
                  {dimensionUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit === "cm"
                        ? "Centimeters (cm)"
                        : unit === "m"
                        ? "Meters (m)"
                        : unit === "in"
                        ? "Inches (in)"
                        : "Feet (ft)"}
                    </option>
                  ))}
                </select>
                <LuRuler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-2 h-2 border-b-2 border-r-2 border-gray-400 transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warranty Section */}
        <div className="">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
              <FiShield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Warranty & Protection
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Warranty Period
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 years manufacturer warranty"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Warranty Suggestions */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Common warranty options:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "1 year manufacturer",
                  "2 years manufacturer",
                  "3 years extended",
                  "Lifetime warranty",
                  "6 months warranty",
                  "No warranty",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      handleInputChange({
                        target: { name: "warranty", value: option },
                      })
                    }
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      formData.warranty === option
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Warranty Info */}
            <div className="mt-4 p-3 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <FiInfo className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clear warranty information helps build customer trust and can
                  reduce returns. Include duration, coverage, and any
                  limitations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalAttributes;
