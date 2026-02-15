import React from "react";
import { motion } from "framer-motion";
import { FaCog, FaPlus, FaInfoCircle, FaTshirt, FaBook } from "react-icons/fa";
import CardWrapper from "../../components/ui/CardWrapper";
import WrapperHeader from "../../components/common/WrapperHeader";
import MetaFields from "./MetaFields";
import { FiHome, FiSmartphone } from "react-icons/fi";
import { LuLightbulb } from "react-icons/lu";

const MetaFieldManagement = ({
  formData,
  setFormData,
  openAddMetaField,
  openEditMetaField,
  setDeleteConfirm,
}) => {
  return (
    <CardWrapper className="mb-6 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <WrapperHeader
        title="Meta Field Management"
        description="Custom product attributes"
        icon={<FaCog />}
        className="bg-gray-50/50 dark:bg-neutral-800/50 p-5"
      >
        <div className="flex items-center gap-3 place-self-end">
          {/* Helpful Info Tooltip */}
          <div className="group relative">
            <button
              type="button"
              className="text-gray-400 hover:text-indigo-500 transition-colors"
            >
              <FaInfoCircle size={20} />
            </button>

            {/* The "Secret" Info Card - Appears on Hover */}
            <div className="absolute -right-40 sm:right-0 top-8 w-80 p-5 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-60 pointer-events-none group-hover:pointer-events-auto">
              <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400">
                <LuLightbulb />
                <span className="font-bold text-sm uppercase tracking-wider">
                  Quick Guide
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Meta fields allow you to add custom data like{" "}
                <b>"Battery Life"</b> or <b>"Material"</b> to products. Fields
                marked as <i>filterable</i> will appear in the store sidebar.
              </p>

              <div className="space-y-2 border-t border-gray-50 dark:border-gray-700 pt-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Industry Examples:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <ExampleBadge
                    icon={<FiSmartphone />}
                    label="Electronics"
                    detail="RAM, CPU"
                    color="red"
                  />
                  <ExampleBadge
                    icon={<FaTshirt />}
                    label="Clothing"
                    detail="Fabric"
                    color="green"
                  />
                  <ExampleBadge
                    icon={<FiHome />}
                    label="Furniture"
                    detail="Material"
                    color="yellow"
                  />
                  <ExampleBadge
                    icon={<FaBook />}
                    label="Books"
                    detail="ISBN"
                    color="pink"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddMetaField}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 text-xs font-bold transition-all shadow-md shadow-red-100 dark:shadow-none"
          >
            <FaPlus size={10} /> ADD META FIELD
          </button>
        </div>
      </WrapperHeader>

      <div className="p-4 bg-white dark:bg-neutral-900">
        {formData.metaFields.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <FaCog className="text-2xl text-red-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white font-semibold">
              No Custom Fields
            </h3>
            <p className="text-sm text-gray-400 mb-6 text-center max-w-[280px]">
              Add specific attributes to help customers filter and compare
              products.
            </p>
            <button
              type="button"
              onClick={openAddMetaField}
              className="text-red-600 text-sm font-bold hover:underline"
            >
              Configure your first field &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Active Fields ({formData.metaFields.length})
              </span>
            </div>

            <MetaFields
              formData={formData}
              setFormData={setFormData}
              openEditMetaField={openEditMetaField}
              setDeleteConfirm={setDeleteConfirm}
            />
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

// Helper component for the Info Popover
const ExampleBadge = ({ icon, label, detail, color }) => (
  <div className="flex items-start gap-1.5 p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/50">
    <div className={`mt-0.5 text-${color}-500`}>{icon}</div>
    <div>
      <p className="text-[10px] font-bold leading-none mb-0.5">{label}</p>
      <p className="text-[9px] text-gray-400 leading-none">{detail}</p>
    </div>
  </div>
);

export default MetaFieldManagement;
