import {
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-60 bg-white dark:bg-neutral-900 border-b dark:border-gray-400/50 border-gray-200 h-22 flex items-center overflow-hidden">
      <div className="flex items-center justify-between px-6 flex-1">
        <div className="flex items-center space-x-4">
          {/* Toggle Sidebar Button - Desktop */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <FiChevronLeft size={20} />
            ) : (
              <FiChevronRight size={20} />
            )}
          </button>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden lg:block">
              <p className="font-medium">Admin User</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-300">
              <span className="font-bold text-red-700">AD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
