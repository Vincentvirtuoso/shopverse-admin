import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";
import { useScreen } from "./hooks/useScreen";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";

const App = () => {
  const { screen, isMobile } = useScreen();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  // eslint-disable-next-line no-unused-vars
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <ScrollToTop />

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
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
          className="p-6"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default App;
