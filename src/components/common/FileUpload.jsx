import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiX,
  FiImage,
  FiInfo,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

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
  helperText,
  required = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    e.target.value = "";
  };

  const processFiles = (files) => {
    // Validate file types
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      setUploadStatus({
        type: "error",
        message: "Some files were rejected. Only image files are accepted.",
      });
      setTimeout(() => setUploadStatus(null), 3000);
    }

    // Validate file size
    const oversizedFiles = validFiles.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setUploadStatus({
        type: "error",
        message: `${oversizedFiles.length} file(s) exceed ${maxSizeMB}MB limit`,
      });
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    // Validate total files
    if (multiple && value.length + validFiles.length > maxFiles) {
      setUploadStatus({
        type: "error",
        message: `Maximum ${maxFiles} files allowed. You can add ${
          maxFiles - value.length
        } more.`,
      });
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    if (validFiles.length > 0) {
      if (multiple) {
        onChange([...value, ...validFiles]);
      } else {
        onChange([validFiles[0]]);
      }
      setUploadStatus({
        type: "success",
        message: `${validFiles.length} file(s) uploaded successfully`,
      });
      setTimeout(() => setUploadStatus(null), 2000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (index) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const previewUrls = value.map((file) =>
    file instanceof File ? URL.createObjectURL(file) : file
  );

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {helperText && (
        <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1">
          {helperText}
        </p>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-[1.02]"
              : error
              ? "border-red-300 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/70"
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

        <div className="space-y-4">
          <div className="flex justify-center">
            <div
              className={`p-4 rounded-full transition-colors ${
                dragActive ? "bg-blue-500" : "bg-blue-100 dark:bg-blue-900/30"
              }`}
            >
              <FiUpload
                className={`w-8 h-8 transition-colors ${
                  dragActive ? "text-white" : "text-blue-600 dark:text-blue-400"
                }`}
              />
            </div>
          </div>

          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {dragActive ? (
                "Drop your files here"
              ) : (
                <>
                  <span className="text-blue-600 dark:text-blue-400">
                    Click to upload
                  </span>
                  {" or drag and drop"}
                </>
              )}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              PNG, JPG, GIF or WEBP
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {multiple
                ? `Up to ${maxSizeMB}MB per file (max ${maxFiles} files)`
                : `Maximum file size: ${maxSizeMB}MB`}
            </p>
          </div>

          {multiple && value.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FiCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {value.length} of {maxFiles} files
              </span>
            </div>
          )}
        </div>
      </div>

      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-3 rounded-lg ${
            uploadStatus.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
          }`}
        >
          {uploadStatus.type === "success" ? (
            <FiCheck className="w-4 h-4 flex-shrink-0" />
          ) : (
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{uploadStatus.message}</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20"
        >
          <FiAlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        </motion.div>
      )}

      {previewUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Uploaded Files
            </p>
            {multiple && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
              >
                Remove All
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <div className="aspect-square">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-medium truncate mb-1">
                      {value[index]?.name || `Image ${index + 1}`}
                    </p>
                    {value[index]?.size && (
                      <p className="text-white/80 text-xs">
                        {formatFileSize(value[index].size)}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg hover:scale-110"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>

                {index === 0 && !multiple && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                    Primary
                  </div>
                )}

                {index === 0 && multiple && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                    Main
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
