// sections/customersPage/StatsPreview.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";
import CardWrapper from "../../components/ui/CardWrapper";
import { formatCurrency, formatNumber } from "../../utils/formatters";

const StatsPreview = ({ stats, loading }) => {
  const overview = stats?.overall || {};
  const trends = stats?.trends || {};

  const statCards = [
    {
      icon: FiUsers,
      label: "Total Customers",
      value: formatNumber(overview.totalCustomers),
      trend: trends.growthRate,
      color: "red",
    },
    {
      icon: FiUserCheck,
      label: "Active",
      value: formatNumber(overview.activeCustomers),
      subtext: `${overview.inactiveCustomers || 0} inactive`,
      color: "green",
    },
    {
      icon: FiShoppingBag,
      label: "Avg. Order",
      value: formatCurrency(overview.avgOrderValue),
      subtext: `${formatNumber(overview.totalOrders)} orders`,
      color: "blue",
    },
    {
      icon: FiDollarSign,
      label: "Total Revenue",
      value: formatCurrency(overview.totalSpent),
      subtext: `${formatNumber(overview.customersWithOrders)} buyers`,
      color: "purple",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <CardWrapper key={i} className="p-5 animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </CardWrapper>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to="/admin/customers/stats">
            <CardWrapper className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all group cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  {stat.subtext && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.subtext}
                    </p>
                  )}
                </div>
                <div
                  className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <stat.icon
                    className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-xl`}
                  />
                </div>
              </div>
              {stat.trend && (
                <div className="mt-3 flex items-center gap-1">
                  <FiTrendingUp
                    className={`text-sm ${
                      stat.trend >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      stat.trend >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend >= 0 ? "+" : ""}
                    {stat.trend.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    vs last month
                  </span>
                </div>
              )}
            </CardWrapper>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsPreview;
