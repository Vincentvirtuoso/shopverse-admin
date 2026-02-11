import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiCheckCircle,
  FiUserCheck,
  FiUserX,
  FiTrendingUp,
  FiCalendar,
  FiMapPin,
  FiAward,
  FiDownload,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";
import { useCustomers } from "../hooks/useCustomers";
import Spinner from "../components/common/Spinner";
import StatsCard from "../components/common/StatsCard";
import CardWrapper from "../components/ui/CardWrapper";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "../utils/formatters";

const COLORS = [
  "#EF4444",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#F97316",
  "#6B7280",
];

const CustomerStats = () => {
  const { stats, isLoading, fetchCustomerStats, exportCustomers } =
    useCustomers();
  const { fetchCustomers: loading, fetchCustomerStats: fetchingCustomerStats } =
    isLoading;
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchCustomerStats(timeRange);
  }, [timeRange]);

  const handleExport = async () => {
    try {
      await exportCustomers("csv");
      toast.success("Statistics exported successfully");
    } catch (error) {
      console.log(error);

      toast.error("Export failed");
    }
  };

  if (loading || fetchingCustomerStats) {
    return (
      <div className="h-[calc(100vh-150px)] flex justify-center items-center">
        <Spinner size="2xl" borderWidth="3" backgroundOpacity="20" />
      </div>
    );
  }

  const overviewStats = stats?.overall || {};
  const trends = stats?.trends || {};
  const roleDistribution = stats?.roleDistribution || [];
  const registrations = stats?.registrationsOverTime || [];
  const geoDistribution = stats?.geographicalDistribution || [];
  const topCustomers = stats?.topCustomers || { bySpending: [], byOrders: [] };

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/customers"
                className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <FiArrowLeft className="text-gray-600 dark:text-gray-300" />
              </Link>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <FiTrendingUp className="text-red-600" />
                  Customer Analytics
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Deep insights into your customer behavior and growth
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <button
                onClick={handleExport}
                className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
              >
                <FiDownload />
                Export
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-2">
            {["overview", "growth", "geography", "topCustomers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-all relative whitespace-nowrap ${
                  activeTab === tab
                    ? "text-red-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {tab.replace(/([A-Z])/g, " $1").trim()}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={FiUsers}
                label="Total Customers"
                value={formatNumber(overviewStats.totalCustomers)}
                trend={trends.growthRate}
                trendLabel="vs last month"
                color="red"
              />
              <StatsCard
                icon={FiUserCheck}
                label="Active Customers"
                value={formatNumber(overviewStats.activeCustomers)}
                subtitle={`${overviewStats.inactiveCustomers} inactive`}
                color="green"
              />
              <StatsCard
                icon={FiCheckCircle}
                showIconBackground
                label="Verified Email"
                value={formatNumber(overviewStats.emailVerified)}
                change={
                  (overviewStats.emailVerified / overviewStats.totalCustomers) *
                  100
                }
                color="blue"
              />
              <StatsCard
                icon={FiShoppingBag}
                showIconBackground
                label="Avg. Order Value"
                value={formatCurrency(overviewStats.avgOrderValue)}
                subtitle={`${formatNumber(overviewStats.totalOrders)} total orders`}
                color="purple"
              />
              <StatsCard
                icon={FiDollarSign}
                showIconBackground
                label="Total Revenue"
                value={formatCurrency(overviewStats.totalSpent)}
                subtitle={`From ${formatNumber(overviewStats.customersWithOrders)} customers`}
                color="yellow"
              />
              <StatsCard
                icon={FiUsers}
                showIconBackground
                label="Customers with Orders"
                value={formatNumber(overviewStats.customersWithOrders)}
                change={
                  (overviewStats.customersWithOrders /
                    overviewStats.totalCustomers) *
                  100
                }
                color="indigo"
              />
              <StatsCard
                icon={FiUserX}
                showIconBackground
                label="Inactive Rate"
                value={formatPercentage(
                  (overviewStats.inactiveCustomers /
                    overviewStats.totalCustomers) *
                    100,
                )}
                color="orange"
              />
              <StatsCard
                icon={FiCalendar}
                showIconBackground
                label="This Month"
                value={formatNumber(trends.currentPeriodRegistrations)}
                trend={(
                  ((trends.currentPeriodRegistrations -
                    trends.previousPeriodRegistrations) /
                    trends.previousPeriodRegistrations) *
                  100
                ).toFixed(1)}
                color="teal"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Role Distribution */}
              <CardWrapper className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiUsers className="text-red-600" />
                  Role Distribution
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="_id"
                      >
                        {roleDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardWrapper>

              {/* Registration Trend */}
              <CardWrapper className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiTrendingUp className="text-red-600" />
                  Registration Trend
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(date) =>
                          new Date(date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#EF4444"
                        fill="#FEE2E2"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardWrapper>
            </div>
          </motion.div>
        )}

        {/* Growth Tab */}
        {activeTab === "growth" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <CardWrapper className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-red-600" />
                Customer Growth Over Time
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={registrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="New Customers"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardWrapper>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CardWrapper className="p-6 bg-linear-to-br from-red-500 to-red-600 text-white rounded-2xl">
                <h4 className="text-lg opacity-90 mb-2">Growth Rate</h4>
                <p className="text-4xl font-bold">{trends.growthRate}%</p>
                <p className="mt-2 opacity-80">vs previous period</p>
              </CardWrapper>
              <CardWrapper className="p-6 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl">
                <h4 className="text-lg opacity-90 mb-2">This Period</h4>
                <p className="text-4xl font-bold">
                  {formatNumber(trends.currentPeriodRegistrations)}
                </p>
                <p className="mt-2 opacity-80">new customers</p>
              </CardWrapper>
              <CardWrapper className="p-6 bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-2xl">
                <h4 className="text-lg opacity-90 mb-2">Previous Period</h4>
                <p className="text-4xl font-bold">
                  {formatNumber(trends.previousPeriodRegistrations)}
                </p>
                <p className="mt-2 opacity-80">new customers</p>
              </CardWrapper>
            </div>
          </motion.div>
        )}

        {/* Geography Tab */}
        {activeTab === "geography" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <CardWrapper className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiMapPin className="text-red-600" />
                Geographic Distribution
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={geoDistribution.slice(0, 10)}
                    layout="vertical"
                    margin={{ left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="_id.city"
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#EF4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardWrapper>
          </motion.div>
        )}

        {/* Top Customers Tab */}
        {activeTab === "topCustomers" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Spenders */}
              <CardWrapper className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiDollarSign className="text-red-600" />
                  Top Spenders
                </h3>
                <div className="space-y-4">
                  {topCustomers.bySpending?.map((customer, index) => (
                    <div
                      key={customer._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-700"
                              : index === 1
                                ? "bg-gray-200 text-gray-700"
                                : index === 2
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {customer.fullName ||
                              `${customer.firstName} ${customer.lastName}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">
                          {formatCurrency(customer.stats?.totalSpent)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.stats?.totalOrders} orders
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardWrapper>

              {/* Most Active */}
              <CardWrapper className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiAward className="text-red-600" />
                  Most Orders
                </h3>
                <div className="space-y-4">
                  {topCustomers.byOrders?.map((customer, index) => (
                    <div
                      key={customer._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-700"
                              : index === 1
                                ? "bg-gray-200 text-gray-700"
                                : index === 2
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {customer.fullName ||
                              `${customer.firstName} ${customer.lastName}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">
                          {customer.stats?.totalOrders} orders
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(customer.stats?.totalSpent)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardWrapper>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomerStats;
