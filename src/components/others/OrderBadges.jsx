import React from "react";
import {
  LuClock,
  LuCircleCheck,
  LuCircleX,
  LuCircleAlert,
  LuPackage,
  LuPackageCheck,
  LuTruck,
  LuHouse,
  LuRefreshCw,
  LuBan,
  LuCirclePause,
  LuDollarSign,
  LuLoader,
} from "react-icons/lu";

const statusConfig = {
  // Initial states
  pending: {
    label: "Pending",
    icon: LuClock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    dot: "bg-yellow-500",
  },
  payment_pending: {
    label: "Payment Pending",
    icon: LuDollarSign,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    dot: "bg-orange-500",
  },
  paid: {
    label: "Paid",
    icon: LuCircleCheck,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-500",
  },

  // Processing states
  processing: {
    label: "Processing",
    icon: LuLoader,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
  },
  ready_to_ship: {
    label: "Ready to Ship",
    icon: LuPackageCheck,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    dot: "bg-indigo-500",
  },

  // Shipping states
  shipped: {
    label: "Shipped",
    icon: LuPackage,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    dot: "bg-purple-500",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: LuTruck,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    dot: "bg-cyan-500",
  },

  // Completed states
  delivered: {
    label: "Delivered",
    icon: LuHouse,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-500",
  },
  completed: {
    label: "Completed",
    icon: LuCircleCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },

  // Problem states
  cancelled: {
    label: "Cancelled",
    icon: LuCircleX,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500",
  },
  refunded: {
    label: "Refunded",
    icon: LuRefreshCw,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    dot: "bg-orange-500",
  },
  on_hold: {
    label: "On Hold",
    icon: LuCirclePause,
    color: "text-yellow-600",
    bg: "bg-yellow-600/10",
    border: "border-yellow-600/20",
    dot: "bg-yellow-600",
  },
  failed: {
    label: "Failed",
    icon: LuCircleAlert,
    color: "text-red-600",
    bg: "bg-red-600/10",
    border: "border-red-600/20",
    dot: "bg-red-600",
  },
};

export const OrderStatusBadge = ({
  status,
  size = "md",
  showIcon = true,
  showDot = false,
  showLabel = true,
  className = "",
  ...props
}) => {
  const config = statusConfig[status] || {
    label: status?.replace(/_/g, " ") || "Unknown",
    icon: LuCircleAlert,
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    dot: "bg-gray-500",
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      badge: "px-2 py-0.5 text-xs",
      icon: "w-3 h-3",
      dot: "w-1.5 h-1.5",
    },
    md: {
      badge: "px-2.5 py-1 text-sm",
      icon: "w-4 h-4",
      dot: "w-2 h-2",
    },
    lg: {
      badge: "px-3 py-1.5 text-base",
      icon: "w-5 h-5",
      dot: "w-2.5 h-2.5",
    },
  };

  const styles = {
    pill: `${config.bg} ${config.color} ${config.border} border`,
    dot: `${config.dot}`,
    icon: `${config.color}`,
  };

  return (
    <div className="flex items-center gap-2">
      {showDot && (
        <span
          className={`rounded-full ${sizeClasses[size].dot} ${styles.dot}`}
        />
      )}

      <span
        className={`
          inline-flex items-center gap-1.5
          font-medium rounded-full
          ${sizeClasses[size].badge}
          ${styles.pill}
          ${className}
        `}
        {...props}
      >
        {showIcon && <Icon className={sizeClasses[size].icon} />}
        {showLabel && config.label}
      </span>
    </div>
  );
};

// Alternative minimal version without background
export const OrderStatusBadgeMinimal = ({
  status,
  size = "md",
  className = "",
}) => {
  const config = statusConfig[status] || {
    label: status?.replace(/_/g, " ") || "Unknown",
    color: "text-gray-500",
  };

  return (
    <span className={`font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  );
};

// Status timeline item
export const OrderStatusTimelineItem = ({
  status,
  timestamp,
  note,
  isLast = false,
}) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="relative flex items-start gap-3 pb-6">
      <div className="relative">
        <div
          className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${config.bg} ${config.color} border ${config.border}
        `}
        >
          <Icon className="w-4 h-4" />
        </div>
        {!isLast && (
          <div className="absolute top-8 left-4 w-0.5 h-full -translate-x-1/2 bg-gray-800" />
        )}
      </div>

      <div className="flex-1 pt-1">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
      </div>
    </div>
  );
};

// Status stepper for order tracking
export const OrderStatusStepper = ({ currentStatus, steps = [] }) => {
  const defaultSteps = ["pending", "processing", "shipped", "delivered"];

  const statusSteps = steps.length ? steps : defaultSteps;
  const currentIndex = statusSteps.indexOf(currentStatus);

  return (
    <div className="flex items-center w-full">
      {statusSteps.map((status, index) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-300
                ${
                  isCompleted
                    ? `${config.bg} ${config.color} border-2 ${config.border}`
                    : "bg-gray-800 text-gray-600 border border-gray-700"
                }
                ${isCurrent ? "ring-2 ring-offset-2 ring-offset-gray-900 " + config.color.replace("text", "ring") : ""}
              `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`
                text-xs mt-2 font-medium
                ${isCompleted ? config.color : "text-gray-600"}
              `}
              >
                {config.label}
              </span>
            </div>

            {index < statusSteps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 rounded-full bg-gray-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    index < currentIndex
                      ? config.color.replace("text", "bg")
                      : ""
                  }`}
                  style={{
                    width: index < currentIndex ? "100%" : "0%",
                    backgroundColor:
                      index < currentIndex ? "currentColor" : undefined,
                    color: config.color.replace("text-", ""),
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

import { LuWallet, LuArrowLeftRight, LuCreditCard } from "react-icons/lu";

const paymentStatusConfig = {
  pending: {
    label: "Pending",
    icon: LuClock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    dot: "bg-yellow-500",
    description: "Awaiting payment confirmation",
  },
  processing: {
    label: "Processing",
    icon: LuRefreshCw,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
    description: "Payment is being processed",
  },
  paid: {
    label: "Paid",
    icon: LuCircleCheck,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-500",
    description: "Payment completed successfully",
  },
  completed: {
    label: "Completed",
    icon: LuCircleCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
    description: "Transaction completed",
  },
  refunded: {
    label: "Refunded",
    icon: LuRefreshCw,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    dot: "bg-orange-500",
    description: "Payment has been refunded",
  },
  partially_refunded: {
    label: "Partially Refunded",
    icon: LuArrowLeftRight,
    color: "text-yellow-600",
    bg: "bg-yellow-600/10",
    border: "border-yellow-600/20",
    dot: "bg-yellow-600",
    description: "Partial refund has been issued",
  },
  failed: {
    label: "Failed",
    icon: LuCircleX,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500",
    description: "Payment failed",
  },
  cancelled: {
    label: "Cancelled",
    icon: LuBan,
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    dot: "bg-gray-500",
    description: "Payment was cancelled",
  },
  expired: {
    label: "Expired",
    icon: LuCircleAlert,
    color: "text-gray-600",
    bg: "bg-gray-600/10",
    border: "border-gray-600/20",
    dot: "bg-gray-600",
    description: "Payment link expired",
  },
  authorized: {
    label: "Authorized",
    icon: LuCreditCard,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    dot: "bg-indigo-500",
    description: "Payment authorized, not captured",
  },
  captured: {
    label: "Captured",
    icon: LuDollarSign,
    color: "text-green-600",
    bg: "bg-green-600/10",
    border: "border-green-600/20",
    dot: "bg-green-600",
    description: "Payment captured successfully",
  },
  voided: {
    label: "Voided",
    icon: LuBan,
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    dot: "bg-gray-500",
    description: "Payment has been voided",
  },
  disputed: {
    label: "Disputed",
    icon: LuCircleAlert,
    color: "text-red-600",
    bg: "bg-red-600/10",
    border: "border-red-600/20",
    dot: "bg-red-600",
    description: "Payment disputed by customer",
  },
};

const paymentMethodConfig = {
  paystack: {
    label: "Paystack",
    icon: LuCreditCard,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  cash_on_delivery: {
    label: "Cash on Delivery",
    icon: LuWallet,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  stripe: {
    label: "Stripe",
    icon: LuCreditCard,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  paypal: {
    label: "PayPal",
    icon: LuDollarSign,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  bank_transfer: {
    label: "Bank Transfer",
    icon: LuArrowLeftRight,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  card: {
    label: "Card",
    icon: LuCreditCard,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
};

export const PaymentStatusBadge = ({
  status,
  method,
  size = "md",
  showIcon = true,
  showDot = false,
  showLabel = true,
  showMethod = false,
  className = "",
  ...props
}) => {
  const config = paymentStatusConfig[status] || {
    label: status?.replace(/_/g, " ") || "Unknown",
    icon: LuCircleAlert,
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    dot: "bg-gray-500",
  };

  const methodConfig = paymentMethodConfig[method] || null;
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      badge: "px-2 py-0.5 text-xs",
      icon: "w-3 h-3",
      dot: "w-1.5 h-1.5",
    },
    md: {
      badge: "px-2.5 py-1 text-sm",
      icon: "w-4 h-4",
      dot: "w-2 h-2",
    },
    lg: {
      badge: "px-3 py-1.5 text-base",
      icon: "w-5 h-5",
      dot: "w-2.5 h-2.5",
    },
  };

  return (
    <div className="flex items-center gap-2">
      {showDot && (
        <span
          className={`rounded-full ${sizeClasses[size].dot} ${config.dot}`}
        />
      )}

      <span
        className={`
          inline-flex items-center gap-1.5
          font-medium rounded-full
          ${sizeClasses[size].badge}
          ${config.bg} ${config.color} ${config.border} border
          ${className}
        `}
        {...props}
      >
        {showIcon && <Icon className={sizeClasses[size].icon} />}
        {showLabel && config.label}
      </span>

      {showMethod && methodConfig && (
        <span
          className={`
            inline-flex items-center gap-1.5
            font-medium rounded-full
            ${sizeClasses[size].badge}
            ${methodConfig.bg} ${methodConfig.color} border border-gray-700
            ml-1
          `}
        >
          {showIcon && <methodConfig.icon className={sizeClasses[size].icon} />}
          {methodConfig.label}
        </span>
      )}
    </div>
  );
};

// Compact version for tables
export const PaymentStatusCompact = ({ status, className = "" }) => {
  const config = paymentStatusConfig[status] || paymentStatusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

// Payment method badge
export const PaymentMethodBadge = ({
  method,
  size = "md",
  showIcon = true,
  className = "",
}) => {
  const config = paymentMethodConfig[method] || {
    label: method?.replace(/_/g, " ") || "Unknown",
    icon: LuCreditCard,
    color: "text-gray-500",
    bg: "bg-gray-500/10",
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full
        ${sizeClasses[size]}
        ${config.bg} ${config.color} border border-gray-700
        ${className}
      `}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />}
      {config.label}
    </span>
  );
};

// Payment summary card
export const PaymentSummaryCard = ({ payment }) => {
  const statusConfig =
    paymentStatusConfig[payment?.status] || paymentStatusConfig.pending;
  const methodConfig = paymentMethodConfig[payment?.method] || null;
  const StatusIcon = statusConfig.icon;
  const MethodIcon = methodConfig?.icon || LuCreditCard;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-400">
          Payment Information
        </h4>
        <PaymentStatusBadge status={payment?.status} size="sm" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg ${methodConfig?.bg || "bg-gray-700"} flex items-center justify-center`}
            >
              <MethodIcon
                className={`w-4 h-4 ${methodConfig?.color || "text-gray-400"}`}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm font-medium">
                {methodConfig?.label ||
                  payment?.method?.replace(/_/g, " ") ||
                  "N/A"}
              </p>
            </div>
          </div>

          {payment?.transactionId && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="text-xs font-mono text-gray-400">
                #{payment.transactionId.slice(-8)}
              </p>
            </div>
          )}
        </div>

        {payment?.paidAt && (
          <div className="flex items-center gap-2 text-sm">
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            <span className="text-gray-300">
              Paid on{" "}
              {new Date(payment.paidAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {payment?.status === "refunded" && payment?.refundedAt && (
          <div className="flex items-center gap-2 text-sm text-orange-500">
            <LuRefreshCw className="w-4 h-4" />
            <span>
              Refunded on {new Date(payment.refundedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
