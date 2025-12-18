import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiMessageSquare,
  FiEdit3,
  FiEdit2,
} from "react-icons/fi";
import { MdStore, MdOutlineAdminPanelSettings } from "react-icons/md";

const CustomerCard = ({ customer, onSelect, isSelected, onSelectToggle }) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case "seller":
        return <MdStore className="text-green-600" />;
      case "admin":
      case "super_admin":
        return <MdOutlineAdminPanelSettings className="text-purple-600" />;
      default:
        return <FiUser className="text-red-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "seller":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "super_admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      className={`bg-white rounded-xl shadow-sm border border-gray-500/20 overflow-hidden h-full flex flex-col ${
        isSelected ? "ring-2 ring-red-500" : ""
      }`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-500/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelectToggle}
                className="mt-1"
              />
              <img
                src={customer.profileImage}
                alt={`${customer.firstName} ${customer.lastName}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
              />
            </div>
          </div>
          <div className="flex-1 flex gap-2 flex-wrap">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg lg:text-xl line-clamp-1">
                {customer.firstName} {customer.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getRoleColor(
                    customer.role
                  )}`}
                >
                  {getRoleIcon(customer.role)}
                  {customer.role.replace("_", " ")}
                </span>
                {customer.sellerProfile?.isVerifiedSeller && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    <FiCheckCircle />
                    Verified Seller
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  customer.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {customer.isActive ? <FiCheckCircle /> : <FiXCircle />}
                {customer.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Joined: {new Date(customer.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <FiMail className="text-gray-400" />
            <span className="text-sm truncate">{customer.email}</span>
            {customer.isEmailVerified && (
              <FiCheckCircle className="text-green-500 ml-auto" />
            )}
          </div>

          {customer.phoneNumber && (
            <div className="flex items-center gap-2 text-gray-600">
              <FiPhone className="text-gray-400" />
              <span className="text-sm">{customer.phoneNumber}</span>
              {customer.isPhoneVerified && (
                <FiCheckCircle className="text-green-500 ml-auto" />
              )}
            </div>
          )}

          {customer.addresses?.[0] && (
            <div className="flex items-start gap-2 text-gray-600">
              <FiMapPin className="text-gray-400 mt-1" />
              <span className="text-sm">
                {customer.addresses[0].city}, {customer.addresses[0].country}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="bg-gray-50 p-3 rounded-lg flex-1">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FiShoppingBag className="text-gray-400" />
                <span className="text-xs">Orders</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {customer.stats.totalOrders}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex-1">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FiDollarSign className="text-gray-400" />
                <span className="text-xs">Total Spent</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                ₦{customer.stats.totalSpent.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t bg-gray-50 border-gray-500/20">
        <div className="flex justify-between">
          <button
            onClick={() => onSelect(customer)}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            View Details
          </button>
          <div className="flex gap-2">
            <button
              className="text-gray-400 hover:text-green-600"
              title="Message"
            >
              <FiMessageSquare />
            </button>
            <button className="text-gray-400 hover:text-red-600" title="Edit">
              <FiEdit2 />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;
