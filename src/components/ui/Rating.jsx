import React from "react";
import { FiStar } from "react-icons/fi";

function Rating({ selectedProduct, vertical = false }) {
  return (
    <div
      className={`flex items-center gap-2 bg-gray-50 dark:bg-neutral-800 px-4 py-2 ${
        vertical ? "flex-col rounded-xl" : "rounded-full"
      }`}
    >
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={16}
            className={
              i < Math.floor(selectedProduct.rating || 0)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300 dark:text-gray-600"
            }
          />
        ))}
      </div>
      <div>
        <span className="font-semibold">
          {selectedProduct.rating?.toFixed(1) || "0.0"}
        </span>
        <span className="text-gray-400 ml-1">
          ({selectedProduct.reviewCount || 0})
        </span>
      </div>
    </div>
  );
}

export default Rating;
