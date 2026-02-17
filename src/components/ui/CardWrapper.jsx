import { motion } from "framer-motion";
import WrapperHeader from "../common/WrapperHeader";
import WrapperFooter from "../common/WrapperFooter";

const CardWrapper = ({
  className = "",
  title,
  footer,
  children,
  description = "",
  bodyClassName = "",
  headerClassName = "",
  padding = false,
  headerProps = {},
  showDivider = false,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...props}
      className={`bg-white dark:bg-neutral-600 rounded-xl shadow-sm border border-gray-200 dark:border-gray-400/50 overflow-hidden ${className} ${padding && "p-6"}`}
    >
      {title && (
        <WrapperHeader
          title={title}
          className={headerClassName}
          description={description}
          showDivider={showDivider}
          {...headerProps}
        />
      )}

      {/* Body */}
      <div className={`text-gray-700 dark:text-gray-200 ${bodyClassName}`}>
        {children}
      </div>

      {/* Footer */}
      {footer && <WrapperFooter>{footer}</WrapperFooter>}
    </motion.div>
  );
};

export default CardWrapper;
