import React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiUserCheck,
  FiDollarSign,
  FiShoppingBag,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: <FiUsers className="text-2xl" />,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers,
      icon: <FiUserCheck className="text-2xl" />,
      color: "bg-green-500",
      change: "+8%",
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}M`,
      icon: <FiDollarSign className="text-2xl" />,
      color: "bg-purple-500",
      change: "+23%",
      trend: "up",
    },
    {
      title: "Verified Customers",
      value: stats.verifiedCustomers,
      icon: <FiCheckCircle className="text-2xl" />,
      color: "bg-indigo-500",
      change: "+15%",
      trend: "up",
    },
    {
      title: "Top Spender",
      value: `₦${stats.topSpender?.stats?.totalSpent?.toLocaleString() || 0}M`,
      subtitle: stats.topSpender?.firstName || "N/A",
      icon: <FiTrendingUp className="text-2xl" />,
      color: "bg-red-500",
      change: "",
      trend: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 border border-gray-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </p>
              {card.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              )}
              {card.change && (
                <div className="flex items-center gap-1 mt-2">
                  <span
                    className={`text-xs ${
                      card.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-500">from last month</span>
                </div>
              )}
            </div>
            <div className={`${card.color} text-white p-3 rounded-xl`}>
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
