import { motion } from "framer-motion";
import { FiUsers, FiBarChart2, FiPackage, FiDollarSign } from "react-icons/fi";
import StatsCard from "../components/common/StatsCard";
import CardWrapper from "../components/ui/CardWrapper";
import WrapperHeader from "../components/common/WrapperHeader";

const Home = () => {
  const statsCards = [
    {
      label: "Total Revenue",
      value: "₦45,231,090",
      change: "+20.1%",
      icon: <FiDollarSign />,
    },
    {
      label: "Total Orders",
      value: "2,350",
      change: "+12.5%",
      icon: <FiPackage />,
    },
    {
      label: "Active Customers",
      value: "1,234",
      change: "+5.2%",
      icon: <FiUsers />,
    },
    {
      label: "Conversion Rate",
      value: "3.2%",
      change: "-1.2%",
      icon: <FiBarChart2 />,
    },
  ];

  const recentOrders = [
    {
      id: "#ORD001",
      customer: "John Doe",
      amount: "$299",
      status: "Delivered",
    },
    {
      id: "#ORD002",
      customer: "Jane Smith",
      amount: "$499",
      status: "Processing",
    },
    {
      id: "#ORD003",
      customer: "Robert Johnson",
      amount: "$199",
      status: "Pending",
    },
    {
      id: "#ORD004",
      customer: "Sarah Williams",
      amount: "$899",
      status: "Delivered",
    },
  ];

  return (
    <div className="p-2">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
          Hello Alex!
        </h1>
        <p className="text-gray-400">
          Welcome back, here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} index={index} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <CardWrapper>
            <WrapperHeader title="Recent Orders" showDivider padding />

            <div className="p-6 overflow-hidden overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-50 text-sm">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t  border-gray-100 dark:border-gray-300/80"
                    >
                      <td className="py-4 font-medium">{order.id}</td>
                      <td className="py-4">{order.customer}</td>
                      <td className="py-4 font-medium">{order.amount}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardWrapper>
        </div>

        <div className="space-y-6">
          <CardWrapper className="p-6" title="Store Performance">
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="text-sm font-medium">3.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full w-2/3"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Avg. Order Value</span>
                  <span className="text-sm font-medium">$124.50</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </CardWrapper>

          {/* Recent Activity */}
          <CardWrapper className="p-6">
            <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                "New order received",
                "Product added to inventory",
                "Customer support ticket resolved",
                "Store settings updated",
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500"></div>
                  <div>
                    <p className="text-sm">{activity}</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
};

export default Home;
