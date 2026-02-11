import { motion, AnimatePresence } from "framer-motion";
import { FaNairaSign } from "react-icons/fa6";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiCheckCircle,
  FiXCircle,
  FiCreditCard,
  FiHeart,
  FiSettings,
} from "react-icons/fi";
import { MdStore } from "react-icons/md";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import CardWrapper from "../components/ui/CardWrapper";

const CustomerDetailsModal = ({ customer, isOpen, onClose }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 bg-opacity-50 -z-10"
          onClick={onClose}
        />

        <div className="flex items-center justify-center min-h-screen p-4 z-20">
          <CardWrapper
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-5xl max-h-[95vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-400/40 relative bg-linear-to-r from-red-50 to-yellow-50 dark:from-red-400/20 dark:to-yellow-400/20">
              <div className="flex items-center gap-4">
                <img
                  src={customer.profileImage}
                  alt={customer.firstName}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                      <FiUser />
                      {customer.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        customer.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.isActive ? <FiCheckCircle /> : <FiXCircle />}
                      {customer.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      Customer ID: {customer._id}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute right-2 top-2"
              >
                <FiX className="text-2xl text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-130px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Info */}
                  <CardWrapper
                    className="bg-white rounded-xl border border-gray-400/40 p-5"
                    title="Contact Information"
                  >
                    <div className="space-y-4 mt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                          <FiMail className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{customer.email}</p>
                          {customer.isEmailVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <FiCheckCircle /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                              <FiXCircle /> Not Verified
                            </span>
                          )}
                        </div>
                      </div>

                      {customer.phoneNumber && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg  flex items-center justify-center">
                            <FiPhone className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">
                              {customer.phoneNumber}
                            </p>
                            {customer.isPhoneVerified ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <FiCheckCircle /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                                <FiXCircle /> Not Verified
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardWrapper>

                  {/* Stats */}
                  <CardWrapper className="bg-white rounded-xl border border-gray-400/40 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiShoppingBag className="text-purple-600" />
                      Customer Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-700">
                          {customer.stats.totalOrders}
                        </div>
                        <div className="text-sm text-purple-600">
                          Total Orders
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-700 flex items-center justify-center">
                          <FaNairaSign />
                          {customer.stats.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600">
                          Total Spent
                        </div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-xl">
                        <div className="text-2xl font-bold text-red-700">
                          {customer.stats.loginCount}
                        </div>
                        <div className="text-sm text-red-600">Login Count</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-xl">
                        <div className="text-2xl font-bold text-yellow-700">
                          {customer.wishlist?.length || 0}
                        </div>
                        <div className="text-sm text-yellow-600">
                          Wishlist Items
                        </div>
                      </div>
                    </div>
                  </CardWrapper>

                  {/* Addresses */}
                  {customer.addresses && customer.addresses.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-400/40 p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiMapPin className="text-red-600" />
                        Addresses
                      </h3>
                      <div className="space-y-3">
                        {customer.addresses.map((address, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border border-gray-400/40 ${
                              address.isDefault
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium capitalize">
                                    {address.type}
                                  </span>
                                  {address.isDefault && (
                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {address.street}, {address.city}
                                  <br />
                                  {address.state}, {address.country}{" "}
                                  {address.postalCode}
                                </p>
                                {address.phone && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Phone: {address.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Account Status */}
                  <div className="bg-white rounded-xl border border-gray-400/40 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Account Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email Verified</span>
                        {customer.isEmailVerified ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <FiXCircle className="text-red-500" />
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Phone Verified</span>
                        {customer.isPhoneVerified ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <FiXCircle className="text-red-500" />
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Last Login</span>
                        <span className="font-medium">
                          {customer.stats.lastLogin
                            ? new Date(
                                customer.stats.lastLogin,
                              ).toLocaleDateString()
                            : "Never"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-medium">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seller Profile */}
                  {customer.sellerProfile && (
                    <div className="bg-white rounded-xl border border-gray-400/40 p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MdStore className="text-green-600" />
                        Seller Profile
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Store Name</p>
                          <p className="font-medium">
                            {customer.sellerProfile.storeName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Business Type</p>
                          <p className="font-medium">
                            {customer.sellerProfile.businessType}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              customer.sellerProfile.isVerifiedSeller
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {customer.sellerProfile.isVerifiedSeller
                              ? "Verified Seller"
                              : "Pending Verification"}
                          </span>
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Rating: {customer.sellerProfile.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences */}
                  <div className="bg-white rounded-xl border border-gray-400/40 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiSettings className="text-gray-600" />
                      Preferences
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currency</span>
                        <span className="font-medium">
                          {customer.preferences.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Email Notifications
                        </span>
                        {customer.preferences.emailNotifications ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <FiXCircle className="text-red-500" />
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Marketing Emails</span>
                        {customer.preferences.marketingEmails ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <FiXCircle className="text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl p-5 w-full mt-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 bg-white border border-gray-400/40 rounded-lg hover:bg-gray-50 text-center">
                    <FiMail className="inline-block mb-1" />
                    <div className="text-sm">Send Email</div>
                  </button>
                  <button className="p-3 bg-white border border-gray-400/40 rounded-lg hover:bg-gray-50 text-center">
                    <FiShoppingBag className="inline-block mb-1" />
                    <div className="text-sm">View Orders</div>
                  </button>
                  <button className="p-3 bg-white border border-gray-400/40 rounded-lg hover:bg-gray-50 text-center">
                    <FiCreditCard className="inline-block mb-1" />
                    <div className="text-sm">Transactions</div>
                  </button>
                  <button className="p-3 bg-white border border-gray-400/40 rounded-lg hover:bg-gray-50 text-center">
                    <FiHeart className="inline-block mb-1" />
                    <div className="text-sm">Wishlist</div>
                  </button>
                </div>
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CustomerDetailsModal;
