import { motion } from "framer-motion";

const Tabs = ({ tabs, activeTab, onChange, className = "" }) => {
  return (
    <div
      className={`border-b border-gray-200 dark:border-neutral-700 ${className}`}
    >
      <nav className="flex pb-2 -mb-px space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm
                transition-all duration-200 whitespace-nowrap
                ${
                  isActive
                    ? "border-red-500 text-red-600 dark:text-red-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-neutral-600"
                }
              `}
            >
              {Icon && (
                <Icon
                  className={`
                  w-5 h-5 mr-2
                  ${
                    isActive
                      ? "text-red-500"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                  }
                `}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
