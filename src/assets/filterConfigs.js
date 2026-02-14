const manageCatfilterConfig = {
  search: {
    label: "Search",
  },
  parent: {
    label: "Parent",
    formatLabel: (val) => `Parent: ${val}`,
  },
  isActive: {
    label: "Active",
    formatLabel: (val) => `Active: ${val ? "Yes" : "No"}`,
  },
  isFeatured: {
    label: "Featured",
    formatLabel: (val) => `Featured: ${val ? "Yes" : "No"}`,
  },
};

export { manageCatfilterConfig };
