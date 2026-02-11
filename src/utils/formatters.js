export const formatCurrency = (value) => {
  if (!value && value !== 0) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value) => {
  if (!value && value !== 0) return "0";
  return new Intl.NumberFormat("en-US").format(value);
};

export const formatPercentage = (value) => {
  if (!value && value !== 0) return "0%";
  return `${value.toFixed(1)}%`;
};

export const formatDate = (date, format = "medium") => {
  if (!date) return "";
  const d = new Date(date);

  switch (format) {
    case "short":
      return d.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      });
    case "long":
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "medium":
    default:
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  }
};
