import { useMemo } from "react";

const createFilterItem = ({
  key,
  value,
  filterConfig,
  index,
  transformLabel,
  customRemoveHandler,
  setFilters,
}) => {
  // Resolve label
  let label;

  if (transformLabel) {
    label = transformLabel(key, value);
  } else if (filterConfig.formatLabel) {
    label = filterConfig.formatLabel(value);
  } else if (typeof value === "boolean") {
    label = `${filterConfig.label || key}: ${value ? "Yes" : "No"}`;
  } else if (value && typeof value === "object" && value.label) {
    label = `${filterConfig.label || key}: ${value.label}`;
  } else {
    label = `${filterConfig.label || key}: ${value}`;
  }

  const onRemove = customRemoveHandler
    ? () => customRemoveHandler(key, value, index)
    : () => {
        setFilters((prev) => {
          const currentValue = prev[key];

          if (Array.isArray(currentValue) && index !== undefined) {
            return {
              ...prev,
              [key]: currentValue.filter((_, i) => i !== index),
            };
          }

          return {
            ...prev,
            [key]: filterConfig.clearValue ?? null,
          };
        });
      };

  return {
    type: key,
    label,
    value,
    onRemove,
    className: filterConfig.className,
    icon: filterConfig.icon,
  };
};

// Enhanced hook with more features
export const useActiveFilters = ({
  filters,
  setFilters,
  config = {},
  excludeKeys = [],
  transformLabel,
  customRemoveHandler,
}) => {
  const activeFilters = useMemo(() => {
    if (!filters) return [];

    const items = [];

    Object.entries(filters).forEach(([key, value]) => {
      // Skip excluded keys
      if (excludeKeys.includes(key)) return;

      // Skip empty values
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        value === "null" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }

      const filterConfig = config[key] || {};

      // Handle arrays
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          items.push(
            createFilterItem({
              key,
              value: item,
              filterConfig,
              index,
              transformLabel,
              customRemoveHandler,
              setFilters,
            }),
          );
        });
        return;
      }

      items.push(
        createFilterItem({
          key,
          value,
          filterConfig,
          transformLabel,
          customRemoveHandler,
          setFilters,
        }),
      );
    });

    return items;
  }, [
    filters,
    setFilters,
    config,
    excludeKeys,
    transformLabel,
    customRemoveHandler,
  ]);

  const clearAllFilters = useMemo(() => {
    return () => {
      const clearedFilters = {};
      Object.keys(filters || {}).forEach((key) => {
        if (!excludeKeys.includes(key)) {
          clearedFilters[key] = config[key]?.clearValue ?? null;
        }
      });
      setFilters((prev) => ({ ...prev, ...clearedFilters }));
    };
  }, [filters, setFilters, config, excludeKeys]);

  const hasActiveFilters = activeFilters.length > 0;

  return {
    activeFilters,
    clearAllFilters,
    hasActiveFilters,
  };
};
