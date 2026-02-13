import React from "react";
import { FaImage } from "react-icons/fa";

const MiniFileUpload = ({
  label,
  imagePreview,
  alt = "",
  onChange,
  requirements = "",
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-500 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-neutral-400/60 p-0.5">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaImage className="text-2xl text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onChange(e)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
          <p className="text-xs text-gray-300 mt-1">{requirements}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniFileUpload;
