import { motion } from "framer-motion";
import WrapperHeader from "../common/WrapperHeader";

const CardWrapper = ({ className = "", title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-neutral-600 rounded-xl shadow-sm border border-gray-200 dark:border-gray-400/50 text-gray-200 ${className}`}
    >
      {title && <WrapperHeader title={title} showDivider />}
      {children}
    </motion.div>
  );
};

export default CardWrapper;
