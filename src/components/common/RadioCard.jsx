import React from "react";
import WrapperBody from "./WrapperBody";

const RadioCard = ({
  icon,
  label,
  isChecked,
  handleChange,
  name,
  colors,
  iconType = "change-color",
  iconAlt = null,
}) => {
  const Icon = icon;
  const IconAlt = iconAlt;
  const { checked = "text-yellow-400", unChecked = "text-gray-300" } =
    colors || {};
  return (
    <WrapperBody.Flex
      key={name}
      justify="between"
      align="center"
      gap={4}
      className=""
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
        <span className="text-sm font-medium">{label}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-400 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
      </label>
    </WrapperBody.Flex>
  );
};

export default RadioCard;
