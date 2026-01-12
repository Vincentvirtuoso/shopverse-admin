import { useState } from "react";
import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";
import FileUpload from "../../../components/common/FileUpload";

const MediaUploadSection = ({
  mainImage,
  setMainImage,
  additionalImages,
  setAdditionalImages,
}) => {
  // const [videos, setVideos] = useState([]);
  const [errors, setErrors] = useState({});

  return (
    <motion.div
      key="media"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      {/* Image Guidelines Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Image Guidelines for Best Results
            </h4>
          </div>
          <div className="space-y-2">
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Use a clean, neutral background when possible</li>
              <li>• Show multiple angles to give customers a complete view</li>
              <li>• Supported formats: PNG, JPG, GIF, WEBP, AVIF</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Product Image */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Main Product Image
          </h3>
          <span className="text-red-500 text-sm font-medium">Required</span>
        </div>

        <FileUpload
          name="mainImage"
          value={mainImage}
          onChange={setMainImage}
          multiple={false}
          maxSizeMB={5}
          error={errors.mainImage}
          required={true}
          helperText="This will be the primary image displayed in search results and product listings"
        />
      </div>

      {/* Additional Images */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-purple-600 dark:bg-purple-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Additional Images
          </h3>
          <span className="text-gray-500 text-sm">Optional</span>
        </div>

        <FileUpload
          name="additionalImages"
          value={additionalImages}
          onChange={setAdditionalImages}
          multiple={true}
          maxFiles={5}
          maxSizeMB={5}
          helperText="Showcase different angles, details, features, or use cases. Customers are more likely to purchase when they can see multiple views."
        />
      </div>

      {/* Video Upload - Commented Out */}

      {/* <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-green-600 dark:bg-green-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Product Videos
          </h3>
          <span className="text-gray-500 text-sm">Optional</span>
        </div>

        <FileUpload
          name="videos"
          value={videos}
          onChange={setVideos}
          multiple={true}
          maxFiles={3}
          maxSizeMB={50}
          accept="video/*"
          helperText="Upload product demonstration videos or 360° views. Videos help customers understand your product better."
        />
      </div> */}
    </motion.div>
  );
};

export default MediaUploadSection;
