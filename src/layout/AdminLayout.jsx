import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/common/Navbar";
import { useScreen } from "../hooks/useScreen";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import Sidebar from "../components/common/Sidebar";
import { Toaster } from "react-hot-toast";

const AdminLayout = () => {
  const { screen, isMobile } = useScreen();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-800 dark:text-white">
      {/* Mobile Menu Button */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <ScrollToTop />

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          isMobile ? "" : isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Top Navigation Bar */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className=""
        >
          <Outlet />
        </motion.div>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            border: "#bbb",
            zIndex: 9999,
          },
          success: { iconTheme: { primary: "#fb2c36", secondary: "#fff" } },
          duration: 4000,
        }}
      />
    </div>
  );
};

export default AdminLayout;
