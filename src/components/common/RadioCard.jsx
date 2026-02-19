import React from "react";
import WrapperBody from "./WrapperBody";
import Toggle from "../atoms/Toggle";

const RadioCard = ({
  icon,
  label,
  isChecked,
  handleChange,
  disabled,
  name,
  sub,
  colors = {
    checked: "text-yellow-400",
    unChecked: "text-gray-300",
  },
  iconType = "change-color",
  iconAlt = null,
  showStatusText = false,
}) => {
  const Icon = icon;
  const IconAlt = iconAlt;
  const { checked, unChecked } = colors || {};
  return (
    <WrapperBody.Flex
      key={name}
      justify="between"
      align="center"
      gap={4}
      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 group p-4 rounded-2xl"
    >
      <div className="flex items-center gap-2">
        {Icon &&
          (iconType === "change-color" && !iconAlt ? (
            <Icon className={isChecked ? checked : unChecked} />
          ) : isChecked ? (
            <Icon className={`${checked}`} />
          ) : (
            <IconAlt className={`${unChecked}`} />
          ))}
        <div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
            {label}
          </p>
          {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {showStatusText && (
          <span
            className={`text-xs font-bold ${
              isChecked ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            {isChecked ? "On" : "Off"}
          </span>
        )}
        <Toggle
          checked={isChecked}
          onChange={(val) => handleChange(val, name)}
          disabled={disabled}
        />
      </div>
    </WrapperBody.Flex>
  );
};

export default RadioCard;
