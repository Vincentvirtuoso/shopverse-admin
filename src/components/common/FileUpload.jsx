import { useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiUpload, FiX } from "react-icons/fi";

const FileUpload = ({
  label,
  name,
  value = [],
  onChange,
  multiple = false,
  accept = "image/*",
  maxFiles = 5,
  maxSizeMB = 5,
  error,
}) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size
    const oversizedFiles = files.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed ${maxSizeMB}MB limit`);
      return;
    }

    // Validate total files
    if (multiple && value.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (multiple) {
      onChange([...value, ...files]);
    } else {
      onChange([files[0]]);
    }

    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length > 0) {
        handleFileChange({ target: { files } });
      }
    },
    [multiple, value, maxFiles, maxSizeMB]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const removeFile = (index) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const previewUrls = value.map((file) =>
    file instanceof File ? URL.createObjectURL(file) : file
  );

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
          ${
            error
              ? "border-red-300 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
          }
          dark:bg-gray-800/50 cursor-pointer`}
      >
        <input
          type="file"
          id={name}
          name={name}
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FiUpload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {multiple
                ? "Click or drag to upload images"
                : "Click or drag to upload image"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {multiple
                ? `PNG, JPG, GIF, WEBP up to ${maxSizeMB}MB each (max ${maxFiles} files)`
                : `PNG, JPG, GIF, WEBP up to ${maxSizeMB}MB`}
            </p>
          </div>

          {multiple && value.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {value.length} of {maxFiles} files selected
            </p>
          )}
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}

      {previewUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4"
        >
          {previewUrls.map((url, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              {index === 0 && !multiple && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Main
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
