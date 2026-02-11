import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiUserCheck,
  FiDollarSign,
  FiShoppingBag,
  FiCheckCircle,
  FiTrendingUp,
  FiBarChart2,
  FiArrowRight,
} from "react-icons/fi";
import StatsCard from "../../components/common/StatsCard";
import { useCustomers } from "../../hooks/useCustomers";

const StatsCards = () => {
  const navigate = useNavigate();
  const { customers, loading, fetchCustomerStats } = useCustomers();
  const [customerStats, setCustomerStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetchCustomerStats();
      console.log(res);

      setCustomerStats(res);
    };
    fetchStats();
  }, [fetchCustomerStats]);

  // Calculate stats from customers data
  const { overall, topCustomers } = customerStats || {};
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: overall?.activeCustomers || 0,
    verifiedCustomers: overall?.emailVerified || 0,
    avgOrders: overall?.avgOrderValue || 0,
    topSpender: topCustomers?.bySpending || [],
  };

  const cards = [
    {
      label: "Total Customers",
      value: loading ? "..." : stats.totalCustomers || 0,
      icon: <FiUsers className="text-2xl" />,
      iconColor: { bg: "bg-blue-500" },
      change: "+12%",
      trend: "up",
    },
    {
      label: "Active Customers",
      value: loading ? "..." : stats.activeCustomers || 0,
      icon: <FiUserCheck className="text-2xl" />,
      iconColor: { bg: "bg-green-500" },
      change: "+8%",
      trend: "up",
    },
    {
      label: "Verified Customers",
      value: loading ? "..." : stats.verifiedCustomers || 0,
      icon: <FiCheckCircle className="text-2xl" />,
      iconColor: { bg: "bg-indigo-500" },
      change: "+15%",
      trend: "up",
    },
  ];

  const topSpenders = stats.topSpender.map((customer, index) => ({
    key: `top-spender-${index}`,
    label: `${customer.firstName} ${customer.lastName}`,
    value: loading ? "..." : `$${customer?.stats?.totalSpent || 0}`,
    icon: <FiDollarSign className="text-2xl" />,
    iconColor: { bg: "bg-yellow-500" },
  }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <StatsCard {...card} index={index} key={index} showIconBackground />
        ))}
      </div>

      {/* View Full Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-100 dark:border-red-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500 rounded-lg">
                <FiBarChart2 className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Customer Analytics & Insights
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View comprehensive statistics, trends, and detailed analytics
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/customers/stats")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
            >
              View Full Statistics
              <FiArrowRight className="text-lg" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default StatsCards;
