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
  availabilityType: "inStock",
  unit: "piece",
  sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
  isBestSeller: false,
  isFeatured: false,
  isNewArrival: true,
  tags: [],
  weight: { value: "", unit: "g" },
  specifications: {
    color: "",
    weight: "",
    dimensions: "",
    warranty: "1 year",
    connectivity: "",
    batteryLife: "",
  },
  dimensions: { length: "", width: "", height: "" },
  shippingInfo: {
    dimensions: { length: "", width: "", height: "" },
    weight: "",
    isFreeShipping: false,
    deliveryTime: "3-5 business days",
    shippingClass: "",
  },
  meta: {
    title: "",
    description: "",
    slug: "",
  },
};

const sections = [
  { id: "basic", label: "Basic Info", icon: FiInfo },
  { id: "pricing", label: "Pricing", icon: FiDollarSign },
  { id: "inventory", label: "Inventory", icon: FiPackage },
  { id: "media", label: "Media", icon: FiImage },
  { id: "attributes", label: "Attributes", icon: FiTag },
  { id: "shipping", label: "Shipping", icon: FiTruck },
  { id: "seo", label: "SEO", icon: FiSettings },
  { id: "variants", label: "Variants", icon: FiLayers },
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

const generateSKU = (prefix = "PROD") => {
  const timestamp = Date.now();
  const randomInt = [20, 36, 16, 22, 8, 10];
  const random = Math.floor(Math.random() * 1000);
  const uniquePart = timestamp
    .toString(randomInt[Math.floor(Math.random() * randomInt.length)])
    .toUpperCase()
    .slice(-6);
  return `${prefix}-${uniquePart}-${random.toString().padStart(3, "0")}`;
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
