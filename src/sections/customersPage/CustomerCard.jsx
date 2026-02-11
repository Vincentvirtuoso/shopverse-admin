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
  FiEdit2,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";
import { MdStore, MdOutlineAdminPanelSettings } from "react-icons/md";
import CardWrapper from "../../components/ui/CardWrapper";
import { FaNairaSign } from "react-icons/fa6";
import {
  FaEnvelopeOpen,
  FaSms,
  FaUserEdit,
  FaUserShield,
  FaWallet,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";

const CustomerCard = ({
  customer,
  onSelect,
  isSelected,
  onSelectToggle,
  updateCustomerStatus,
  loadingStates = {
    sendEmail: false,
    sendSMS: false,
    updatingCustomerStatus: false,
  },
  deleteCustomer,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const messageDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);
  const messageButtonRef = useRef(null);
  const settingsButtonRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside message dropdown and its button
      if (
        openDropdown === "message" &&
        messageDropdownRef.current &&
        !messageDropdownRef.current.contains(event.target) &&
        messageButtonRef.current &&
        !messageButtonRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }

      // Check if click is outside settings dropdown and its button
      if (
        openDropdown === "settings" &&
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && openDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [openDropdown]);

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

  const handleMessageClick = (e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === "message" ? null : "message");
  };

  const handleSettingsClick = (e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === "settings" ? null : "settings");
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove customer")) {
      deleteCustomer(id);
    }
  };

  const handleActionClick = async (action) => {
    switch (action) {
      case "sendEmail":
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          toast.success("Email sent successfully");
        } catch (error) {
          toast.error("Failed to send email");
        } finally {
          setOpenDropdown(null);
        }
        break;

      case "sendSMS":
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          toast.success("SMS sent successfully");
        } catch (error) {
          toast.error("Failed to send SMS");
        } finally {
          setOpenDropdown(null);
        }
        break;

      case "activateUser":
        console.log("Activate user:", customer);
        try {
          await updateCustomerStatus(customer._id, true);
        } catch (error) {
          console.log(error);
        } finally {
          setOpenDropdown(null);
        }
        break;

      case "inactivateUser":
        console.log("Inactivate user:", customer);
        try {
          await updateCustomerStatus(customer._id, false);
        } catch (error) {
          console.log(error);
        } finally {
          setOpenDropdown(null);
        }
        break;

      default:
        break;
    }
  };

  return (
    <CardWrapper
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      className={`bg-white rounded-xl shadow-sm border border-gray-500/20 overflow-hidden h-full flex flex-col ${
        isSelected ? "ring-2 ring-red-500" : ""
      }`}
      key={customer?._id}
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
              {customer?.profileImage &&
              customer?.profileImage !== "default-avatar.jpg" ? (
                <img
                  src={customer?.profileImage}
                  alt={`${customer?.firstName} ${customer?.lastName}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-lg font-semibold border-2 border-white shadow">
                  {customer?.firstName?.[0] || "U"}
                  {customer?.lastName?.[0] || "N"}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex gap-2 flex-wrap">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-lg lg:text-xl line-clamp-1">
                {customer?.firstName} {customer?.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getRoleColor(
                    customer?.role,
                  )}`}
                >
                  {getRoleIcon(customer?.role)}
                  {customer?.role}
                </span>
                {customer?.sellerProfile?.isVerifiedSeller && (
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
                  customer?.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {customer?.isActive ? <FiCheckCircle /> : <FiXCircle />}
                {customer?.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-xs text-gray-300 mt-1">
                Joined: {new Date(customer?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <FiMail className="text-gray-400" />
            <span className="text-sm truncate">{customer?.email}</span>
            {customer?.verified && (
              <FiCheckCircle className="text-green-500 ml-auto" />
            )}
          </div>

          {customer?.phoneNumber && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FiPhone className="text-gray-400" />
              <span className="text-sm">{customer?.phoneNumber}</span>
              {customer?.isPhoneVerified && (
                <FiCheckCircle className="text-green-500 ml-auto" />
              )}
            </div>
          )}

          {customer?.addresses?.[0] && (
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <FiMapPin className="text-gray-400 mt-1" />
              <span className="text-sm">
                {customer?.addresses[0].city}, {customer?.addresses[0].country}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <CardWrapper className="bg-gray-50 p-3 rounded-lg flex-1">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <FiShoppingBag className="text-gray-400" />
                <span className="text-xs">Orders</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                {customer?.stats?.totalOrders || 0}
              </div>
            </CardWrapper>
            <CardWrapper className="bg-gray-50 p-3 rounded-lg flex-1">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <FaWallet className="text-gray-400" />
                <span className="text-xs">Total Spent</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                ₦{customer?.stats?.totalSpent.toLocaleString() || 0}
              </div>
            </CardWrapper>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t bg-neutral-50 dark:bg-neutral-500 border-gray-500/20 dark:border-transparent relative">
        <div className="flex justify-between">
          <button
            onClick={() => onSelect(customer)}
            className="rounded-full bg-red-500 hover:bg-red-800 font-medium px-4 py-2 text-xs text-white"
          >
            View Details
          </button>
          <div className="flex gap-2 items-center">
            {/* Delete custome */}
            <button
              className="text-gray-400 dark:text-gray-300 -mt-1 hover:text-red-400"
              onClick={() => handleDelete(customer._id)}
            >
              <FiTrash2 size={18} />
            </button>
            {/* Message Dropdown */}
            <div className="relative">
              <button
                ref={messageButtonRef}
                className={`text-gray-400 dark:text-gray-300 hover:text-green-400 p-1 transition-all duration-200 transform ${
                  loadingStates.sendEmail || loadingStates.sendSMS
                    ? "animate-glow text-green-600"
                    : ""
                }`}
                title="Message"
                onClick={handleMessageClick}
              >
                <FiMessageSquare size={18} />
              </button>

              {/* Dropdown with animation */}
              <div
                ref={messageDropdownRef}
                className={`absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out transform origin-bottom-right ${
                  openDropdown === "message"
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible pointer-events-none"
                }`}
              >
                <button
                  onClick={() => handleActionClick("sendEmail")}
                  disabled={loadingStates.sendEmail}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
        transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 
        hover:pl-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:pl-4
        ${loadingStates.sendEmail ? "bg-gray-50 dark:bg-gray-700/50" : ""}`}
                >
                  {loadingStates.sendEmail ? (
                    <Spinner
                      size="sm"
                      borderWidth="2"
                      label="Sending Email"
                      labelPosition="right"
                      labelAnimation="pulse"
                    />
                  ) : (
                    <>
                      <FaEnvelopeOpen className="mr-2 inline-block transition-transform group-hover:rotate-12" />
                      Send Email
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleActionClick("sendSMS")}
                  disabled={loadingStates.sendSMS}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
        transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 
        hover:pl-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:pl-4
        ${loadingStates.sendSMS ? "bg-gray-50 dark:bg-gray-700/50" : ""}`}
                >
                  {loadingStates.sendSMS ? (
                    <Spinner
                      size="sm"
                      borderWidth="2"
                      label="Sending SMS"
                      labelPosition="right"
                      labelAnimation="pulse"
                    />
                  ) : (
                    <>
                      <FaSms className="mr-2 inline-block transition-transform group-hover:scale-110" />
                      Send SMS
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                ref={settingsButtonRef}
                className={`text-gray-400 dark:text-gray-300 hover:text-blue-400 p-1 transition-all duration-200 transform hover:scale-110 ${
                  loadingStates.updatingCustomerStatus
                    ? "animate-pulse text-red-600"
                    : ""
                }`}
                title="Settings"
                onClick={handleSettingsClick}
              >
                <FiSettings
                  size={18}
                  className="transition-transform duration-500 hover:rotate-180"
                />
              </button>

              <div
                ref={settingsDropdownRef}
                className={`absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out transform origin-bottom-right ${
                  openDropdown === "settings"
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible pointer-events-none"
                }`}
              >
                {!customer?.isActive ? (
                  <button
                    onClick={() => handleActionClick("activateUser")}
                    disabled={loadingStates.updatingCustomerStatus}
                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
          transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 
          hover:pl-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:pl-4
          ${loadingStates.updatingCustomerStatus ? "bg-gray-50 dark:bg-gray-700/50" : ""}`}
                  >
                    {loadingStates.updatingCustomerStatus ? (
                      <Spinner
                        size="sm"
                        borderWidth="2"
                        label="Activating"
                        labelPosition="right"
                        labelAnimation="pulse"
                      />
                    ) : (
                      <>
                        <FaUserShield className="mr-2 inline-block transition-transform group-hover:scale-110" />
                        Activate User
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleActionClick("inactivateUser")}
                    disabled={loadingStates.updatingCustomerStatus}
                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
          transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 
          hover:pl-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:pl-4
          ${loadingStates.updatingCustomerStatus ? "bg-gray-50 dark:bg-gray-700/50" : ""}`}
                  >
                    {loadingStates.updatingCustomerStatus ? (
                      <Spinner
                        size="sm"
                        borderWidth="2"
                        label="Inactivating"
                        labelPosition="right"
                        labelAnimation="pulse"
                      />
                    ) : (
                      <>
                        <FaUserEdit className="mr-2 inline-block transition-transform group-hover:rotate-12" />
                        Inactivate User
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default CustomerCard;
