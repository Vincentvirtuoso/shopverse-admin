import {
  FiPackage,
  FiTag,
  FiDollarSign,
  FiLayers,
  FiSettings,
  FiImage,
  FiTruck,
  FiInfo,
} from "react-icons/fi";
const initialProduct = {
  id: Date.now(),
  name: "",
  brand: "",
  price: 0,
  originalPrice: 0,
  discount: 0,
  rating: 0,
  reviewCount: 0,
  shortDescription: "",
  description: "",
  image: "",
  images: [],
  category: "",
  subCategory: "",
  inStock: true,
  stockCount: 0,
  availabilityType: "in-stock",
  unit: "piece",
  sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
  isBestSeller: false,
  isFeatured: false,
  isNewArrival: true,
  features: [],
  tags: [],
  weight: { value: "", unit: "g" },
  specifications: new Map(),
  dimensions: { length: 0, width: 0, height: 0, unit: "cm" },
  shippingInfo: {
    dimensions: { length: 0, width: 0, height: 0 },
    weight: 0,
    isFreeShipping: false,
    deliveryTime: "3-5 business days",
    shippingClass: "",
  },
  meta: {
    title: "",
    description: "",
    keywords: "",
  },
};

const sections = [
  {
    id: "basic",
    label: "Basic Info",
    icon: FiInfo,
    description:
      "Enter general information about the product, such as name, brand, category, sub-category, and a detailed description.",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: FiDollarSign,
    description:
      "Set the product price, original price, discounts, and any special pricing rules or offers.",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: FiPackage,
    description:
      "Manage stock levels, SKU codes, availability status, and track how many items are currently in stock.",
  },
  {
    id: "media",
    label: "Media",
    icon: FiImage,
    description:
      "Upload product images and videos, set the main image, and manage image galleries for better visual representation.",
  },
  {
    id: "attributes",
    label: "Attributes",
    icon: FiTag,
    description:
      "Add product features, tags, and other custom attributes that describe this product in detail.",
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: FiTruck,
    description:
      "Configure shipping options including delivery time, shipping class, free shipping eligibility, and packaging details.",
  },
  {
    id: "seo",
    label: "SEO",
    icon: FiSettings,
    description:
      "Optimize your product for search engines by setting meta title, description, and keywords.",
  },
  {
    id: "variants",
    label: "Variants",
    icon: FiLayers,
    description:
      "Manage product variants such as different sizes, colors, or models, including their prices, SKUs, and stock levels.",
  },
];

const unitOptions = [
  { value: "piece", label: "Piece" },
  { value: "pair", label: "Pair" },
  { value: "set", label: "Set" },
  { value: "kg", label: "Kilogram" },
  { value: "g", label: "Gram" },
  { value: "lb", label: "Pound" },
  { value: "oz", label: "Ounce" },
  { value: "liter", label: "Liter" },
  { value: "ml", label: "Milliliter" },
];

const weightUnitOptions = [
  { value: "g", label: "Grams (g)" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "lb", label: "Pounds (lb)" },
  { value: "oz", label: "Ounces (oz)" },
];

const dimensionUnitOptions = [
  { value: "cm", label: "Centimeters (cm)" },
  { value: "m", label: "Meters (m)" },
  { value: "in", label: "Inches (in)" },
  { value: "ft", label: "Feet (ft)" },
];

const isValidCategory = (category) => {
  const validCategories = [
    "electronics",
    "clothing",
    "home",
    "books",
    "sports",
    "beauty",
    "toys",
    "automotive",
    "food",
    "other",
  ];
  return validCategories.includes(category.toLowerCase());
};

const generateSKU = ({
  prefix = "PROD",
  isVariant = false,
  title = "",
} = {}) => {
  const timestamp = Date.now();
  const randomBases = [20, 36, 16, 22, 8, 10];
  const randomBase =
    randomBases[Math.floor(Math.random() * randomBases.length)];
  const randomInt = Math.floor(Math.random() * 1000);

  const uniquePart = timestamp.toString(randomBase).toUpperCase().slice(-6);

  const titlePart = title
    ? title.replace(/\s+/g, "").slice(0, 3).toUpperCase()
    : "";

  const variantPrefix = isVariant ? "VAR" : "";

  const skuParts = [
    prefix,
    variantPrefix,
    titlePart,
    uniquePart,
    randomInt.toString().padStart(3, "0"),
  ]
    .filter(Boolean)
    .join("-");

  return skuParts;
};

export {
  weightUnitOptions,
  dimensionUnitOptions,
  unitOptions,
  sections,
  isValidCategory,
  generateSKU,
};
export default initialProduct;
