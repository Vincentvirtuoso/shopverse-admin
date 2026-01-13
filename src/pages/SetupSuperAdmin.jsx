import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
  FiSmartphone,
  FiBriefcase,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const SetupSuperAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    businessType: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    match: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Update password criteria in real-time
    if (name === "password") {
      setPasswordCriteria({
        length: value.length >= 8,
        lowercase: /(?=.*[a-z])/.test(value),
        uppercase: /(?=.*[A-Z])/.test(value),
        number: /(?=.*\d)/.test(value),
        match: value === formData.confirmPassword,
      });
    }

    if (name === "confirmPassword") {
      setPasswordCriteria({
        ...passwordCriteria,
        match: value === formData.password,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal Info Validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (
      formData.phoneNumber &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = "Password needs a lowercase letter";
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = "Password needs an uppercase letter";
      }
      if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password needs a number";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Business Info Validation
    if (!formData.storeName.trim()) {
      newErrors.storeName = "Store name is required";
    }
    if (!formData.businessType) {
      newErrors.businessType = "Please select a business type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    try {
      setLoading(true);

      // Prepare data for super admin creation
      const superAdminData = {
        ...formData,
        role: "super_admin",
        isEmailVerified: true,
        sellerProfile: {
          storeName: formData.storeName,
          businessType: formData.businessType,
          isVerifiedSeller: true,
        },
      };

      delete superAdminData.confirmPassword;

      const response = await api.post("/setup/super-admin", superAdminData);

      if (response.data.success) {
        setSuccess("Super Admin account created successfully!");

        // Auto-login after success
        setTimeout(async () => {
          try {
            const loginResponse = await api.post("/api/auth/login", {
              email: formData.email,
              password: formData.password,
            });

            if (loginResponse.data.success) {
              navigate("/dashboard");
            }
          } catch (loginError) {
            navigate("/auth");
          }
        }, 1500);
      }
    } catch (err) {
      setErrors({
        submit:
          err.response?.data?.message || "Setup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const businessTypes = [
    "Retail",
    "E-commerce",
    "Wholesale",
    "Dropshipping",
    "Manufacturing",
    "Services",
    "Other",
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-red-600 to-pink-600 rounded-2xl mb-6">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shopverse Super Admin Setup
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete this one-time setup to create your primary administrator
            account with full system access.
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Personal Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <FiUser className="mr-2 text-red-600" />
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Enter the primary administrator's details
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                        errors.firstName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" /> {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                        errors.lastName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" /> {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="admin@shopverse.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Nigeria)
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSmartphone className="h-5 w-5 text-gray-400" />
                    </div>

                    <input
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition ${
                        errors.phoneNumber
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="+234 801 234 5678"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>

                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" /> {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Business Info */}
                <div className="pt-4 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <FiBriefcase className="mr-2 text-red-600" />
                    Business Information
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Tell us about your business
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store/Business Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiBriefcase className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="storeName"
                          type="text"
                          name="storeName"
                          value={formData.storeName}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                            errors.storeName
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="Shopverse Main Store"
                        />
                      </div>
                      {errors.storeName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="mr-1" /> {errors.storeName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type *
                      </label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition appearance-none ${
                          errors.businessType
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.businessType && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="mr-1" />{" "}
                          {errors.businessType}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Security */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <FiLock className="mr-2 text-red-600" />
                    Account Security
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Create a strong password for your super admin account
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.confirmPassword}
                    </p>
                  )}
                  {formData.confirmPassword && (
                    <div className="mt-2">
                      <div
                        className={`text-sm flex items-center ${
                          passwordCriteria.match
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                            passwordCriteria.match
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {passwordCriteria.match ? (
                            <FiCheck className="w-3 h-3" />
                          ) : (
                            <FiAlertCircle className="w-3 h-3" />
                          )}
                        </div>
                        {passwordCriteria.match
                          ? "✓ Passwords match"
                          : "✗ Passwords do not match"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="mt-8 p-4 bg-linear-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <FiShield className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-red-800">
                        Super Admin Security Notice
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        This account will have complete administrative control
                        over your entire Shopverse platform. Store the
                        credentials securely and limit access to trusted
                        personnel only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error and Success Messages */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-2" />
                  {errors.submit}
                </p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-sm text-green-600 flex items-center">
                  <FiCheckCircle className="mr-2" />
                  {success}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-10"
            >
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3.5 px-6 rounded-xl font-medium text-white transition-all text-sm
                  ${
                    loading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Creating Super Admin Account...
                  </div>
                ) : (
                  <>Create Super Admin Account</>
                )}
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                By clicking above, you agree that this is a one-time setup
                process and cannot be undone.
              </p>
            </motion.div>
          </div>
        </motion.form>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at support@shopverse.com
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This setup creates the primary administrator account with full
            system privileges.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SetupSuperAdmin;
