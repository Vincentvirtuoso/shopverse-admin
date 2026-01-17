import React, { useState, useEffect } from "react";
import { FaNairaSign } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { convertToNairaWords, formatNaira } from "../../util/helpers";
import { LuAsterisk } from "react-icons/lu";

const PriceInput = ({
  label = "Selling Price",
  required = false,
  name = "price",
  value,
  onChange,
  error,
  placeholder = "0",
  showAmountInWords = false,
  currency = "NGN",
  step = 1000,
  min = 0,
  max = 10000000,
  className = "",
  description = "This is the price customers will pay",
  showRequiredBadge = true,
  ...props
}) => {
  const [formattedValue, setFormattedValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [amountInWords, setAmountInWords] = useState("");

  // Format value for display with commas
  useEffect(() => {
    if (value || value === 0 || value === "") {
      const formatted = formatNaira(value);
      setFormattedValue(formatted);

      // Update amount in words
      const words = convertToNairaWords(value);
      setAmountInWords(words);

      // Set display value (remove commas for input)
      if (value === "" || value === 0) {
        setDisplayValue("");
      } else {
        const num = parseFloat(value);
        setDisplayValue(isNaN(num) ? value : num.toString());
      }
    }
  }, [value]);

  const handleInputChange = (e) => {
    let inputValue = e.target.value.replace(/,/g, "");

    // Allow empty or just a minus sign for negative numbers
    if (inputValue === "" || inputValue === "-") {
      onChange({ target: { name, value: inputValue } });
      return;
    }

    // Validate numeric input
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      // Apply min/max constraints
      if (num < min) {
        onChange({ target: { name, value: min.toString() } });
      } else if (num > max) {
        onChange({ target: { name, value: max.toString() } });
      } else {
        onChange({ target: { name, value: num.toString() } });
      }
    }
  };

  const handleBlur = () => {
    if (value || value === 0) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        // Round to nearest step if applicable
        if (step && step > 0) {
          const rounded = Math.round(num / step) * step;
          onChange({ target: { name, value: rounded.toString() } });
        }

        // Ensure it's not below min
        if (num < min) {
          onChange({ target: { name, value: min.toString() } });
        }
      }
    }
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case "NGN":
        return <FaNairaSign className="w-4 h-4" />;
      case "USD":
        return <span className="font-semibold">$</span>;
      case "EUR":
        return <span className="font-semibold">€</span>;
      case "GBP":
        return <span className="font-semibold">£</span>;
      default:
        return <span className="font-semibold">₦</span>;
    }
  };

  // const getCurrencyName = () => {
  //   switch (currency) {
  //     case "NGN":
  //       return "Naira";
  //     case "USD":
  //       return "Dollars";
  //     case "EUR":
  //       return "Euros";
  //     case "GBP":
  //       return "Pounds";
  //     default:
  //       return "Naira";
  //   }
  // };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 ">
        {label}
        {required && (
          <span className="text-red-500 text-xs">
            <LuAsterisk />
          </span>
        )}
      </label>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div
            className={`w-4 h-4 flex items-center justify-center ${
              error
                ? "text-red-500"
                : "text-gray-400 group-focus-within:text-red-500 transition-colors"
            }`}
          >
            {getCurrencySymbol()}
          </div>
        </div>

        {/* Hidden input for actual value */}
        <input
          type="number"
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          step={step}
          min={min}
          max={max}
          className="sr-only"
          aria-hidden="true"
          {...props}
        />

        {/* Visible formatted input */}
        <div className="relative">
          <input
            type="text"
            value={formattedValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
              error
                ? "border-red-500 bg-red-50/50 dark:bg-red-900/10"
                : "border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700/50"
            } 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
            focus:ring-2 focus:ring-red-500/40 focus:border-red-500
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-all duration-200 font-medium text-right`}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            inputMode="numeric"
          />

          {/* Currency badge on right side */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Amount in words display */}
      {showAmountInWords && amountInWords && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start text-xs">
            <span className="font-medium whitespace-nowrap text-gray-700 dark:text-gray-300 mr-2">
              In words:
            </span>
            <span className="italic">{amountInWords}</span>
          </div>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          id={`${name}-error`}
          className="flex items-start space-x-2 text-sm text-red-600 dark:text-red-400"
        >
          <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Description and range info */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          Range: {formatNaira(min)} - {formatNaira(max)} {currency}
        </div>
      </div>

      {/* Quick amount buttons (optional) */}
      {currency === "NGN" && (
        <div className="flex flex-wrap gap-2 pt-1">
          {[1000, 5000, 10000, 50000, 100000, 500000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() =>
                onChange({ target: { name, value: quickAmount.toString() } })
              }
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {formatNaira(quickAmount)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceInput;
