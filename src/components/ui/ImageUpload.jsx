import { useState, useRef, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiImage, FiCrop, FiScissors } from "react-icons/fi";
import Cropper from "react-easy-crop";
import { useApi } from "../../hooks/useApi";
import Spinner from "../common/Spinner";
import { useEffect } from "react";

const ImageUpload = ({
  label,
  value,
  onUpload,
  onRemove,
  className = "",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
}) => {
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Crop States
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { callApi } = useApi();

  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onRemove();
  };

  const handleRemoveBackground = async () => {
    const headers = { "Content-Type": "multipart/form-data" };

    if (!preview) return;
    setIsProcessing(true);
    setError("");
    const blob = await fetch(preview).then((res) => res.blob());

    try {
      const formData = new FormData();
      formData.append("image", blob, "image.png");
      const response = await callApi("/image/remove-bg", "POST", formData, {
        headers,
      });

      const { url, success, error = "" } = response;
      console.log(response);

      if (success) {
        setPreview(url);
        onUpload(url);
      } else {
        throw new Error(error || "Failed to remove background");
      }
    } catch (err) {
      setError(err?.error || err?.message || "Failed to remove background");
    } finally {
      setIsProcessing(false);
    }
  };

  const onCropComplete = useCallback((_area, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
      setPreview(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setError(null);
  }, [preview, onUpload]);

  return (
    <div className={`flex flex-col relative ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase">
          {label}
        </label>
      )}
      <div className="flex flex-col items-center justify-center w-full">
        {preview ? (
          <div className="flex flex-col gap-3">
            <div className="relative group w-64 h-64">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg border-2 border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowCropper(true)}
                  className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                  title="Crop"
                >
                  <FiCrop />
                </button>
                <button
                  onClick={handleRemove}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Remove"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleRemoveBackground}
                disabled={isProcessing}
                className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <Spinner
                    label="Processing"
                    labelAnimation="typing"
                    size="sm"
                    labelPosition="right"
                    color="primary"
                  />
                ) : (
                  <>
                    <FiScissors /> Remove Bg
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileChange(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors w-64 h-64 ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-500"
            }`}
          >
            <FiImage className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm text-center">Click to upload</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Cropping Modal */}
      <AnimatePresence>
        {showCropper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden w-full max-w-lg"
            >
              <div className="relative h-80 w-full bg-neutral-200">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-1/2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCropper(false)}
                    className="px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCrop}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return canvas.toDataURL("image/jpeg");
}

export default ImageUpload;
