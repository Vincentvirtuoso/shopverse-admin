// components/ui/ImageUpload.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

const ImageUpload = ({
  label,
  value,
  onUpload,
  onRemove,
  className = "",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
}) => {
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-neutral-700"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center gap-2 text-xs"
              title="Remove"
            >
              <FiX /> Remove
            </motion.button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center
            cursor-pointer transition-colors
            ${
              isDragging
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500"
            }
          `}
        >
          <FiImage className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            PNG, JPG, GIF up to {maxSize / (1024 * 1024)}MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
