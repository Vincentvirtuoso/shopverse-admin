import React from "react";
import WrapperBody from "./WrapperBody";

const RadioCard = ({
  icon,
  label,
  isChecked,
  handleChange,
  name,
  sub,
  colors = {
    checked: "text-yellow-400",
    unChecked: "text-gray-300",
  },
  iconType = "change-color",
  iconAlt = null,
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
      className="border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 group p-4 rounded-2xl"
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
          {sub && <p className="text-[10px] text-gray-400 uppercase">{sub}</p>}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all group-hover:dark:bg-neutral-600 group-hover:peer-checked:bg-red-600 peer-checked:bg-red-600"></div>
      </label>
    </WrapperBody.Flex>
  );
};

export default RadioCard;
