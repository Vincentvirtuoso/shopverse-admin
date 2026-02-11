// sections/customersPage/CustomerTableView.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { MdStore } from "react-icons/md";
import { formatNaira } from "../../utils/helpers";

const CustomerTableView = ({
  customers,
  selectedCustomers,
  onSelectAll,
  onSelectToggle,
  onView,
  onStatusChange,
  onDelete,
}) => {
  const allSelected =
    customers.length > 0 && selectedCustomers.length === customers.length;

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-6 overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="py-4 px-4 text-left">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={allSelected}
                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Orders
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Joined
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map((customer, index) => (
              <motion.tr
                key={customer._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer._id)}
                    onChange={() => onSelectToggle(customer._id)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        customer.profileImage ||
                        "https://via.placeholder.com/40"
                      }
                      alt={customer.firstName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{customer._id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FiMail className="text-gray-400" size={14} />
                      {customer.email}
                    </div>
                    {customer.phoneNumber && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FiPhone className="text-gray-400" size={14} />
                        {customer.phoneNumber}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        customer.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {customer.isActive ? <FiCheckCircle /> : <FiXCircle />}
                      {customer.isActive ? "Active" : "Inactive"}
                    </span>
                    {customer.isEmailVerified && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        <FiCheckCircle />
                        Verified
                      </span>
                    )}
                    {customer.role === "seller" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        <MdStore />
                        Seller
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {customer.stats?.totalOrders || 0}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      orders
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-center">
                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {formatNaira(customer.stats?.totalSpent || 0)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(customer.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(customer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() =>
                        onStatusChange(customer._id, !customer.isActive)
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        customer.isActive
                          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      }`}
                      title={customer.isActive ? "Deactivate" : "Activate"}
                    >
                      {customer.isActive ? (
                        <FiXCircle size={18} />
                      ) : (
                        <FiCheckCircle size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this customer?")) {
                          onDelete(customer._id, { permanent: true });
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CustomerTableView;
