const calculateShippingEstimate = (weight, dimensions) => {
  if (
    !weight.value ||
    !dimensions.length ||
    !dimensions.width ||
    !dimensions.height
  ) {
    return "Enter measurements";
  }

  const weightKg =
    weight.unit === "g"
      ? weight.value / 1000
      : weight.unit === "lb"
      ? weight.value * 0.453592
      : weight.value;

  const volume = dimensions.length * dimensions.width * dimensions.height;

  let baseCost = 5.99;

  if (weightKg > 5) baseCost += 3;
  if (weightKg > 10) baseCost += 5;
  if (volume > 1000) baseCost += 2;

  return `$${baseCost.toFixed(2)}`;
};

export const formatUnitAbbreviation = (unit) => {
  if (!unit) return "";

  const unitMap = {
    // Weight units
    kg: "kg",
    kilogram: "kg",
    kilograms: "kg",
    g: "g",
    gram: "g",
    grams: "g",
    lb: "lb",
    pound: "lb",
    pounds: "lb",
    oz: "oz",
    ounce: "oz",
    ounces: "oz",

    // Volume units
    liter: "L",
    litre: "L",
    liters: "L",
    litres: "L",
    l: "L",
    ml: "ml",
    milliliter: "ml",
    millilitre: "ml",
    milliliters: "ml",
    millilitres: "ml",

    // Count units
    piece: "pc",
    pieces: "pcs",
    pc: "pc",
    pcs: "pcs",
    pair: "pr",
    pairs: "prs",
    pr: "pr",
    prs: "prs",
    set: "set",
    sets: "sets",
  };

  const normalizedUnit = unit.toLowerCase().trim();
  return unitMap[normalizedUnit] || unit.toLowerCase();
};

export const getSmartUnit = (quantity, unit) => {
  if (!unit) return "pc";

  const normalizedUnit = unit.toLowerCase().trim();
  const absQuantity = Math.abs(quantity || 0);

  switch (normalizedUnit) {
    case "piece":
    case "pc":
      return absQuantity === 1 ? "pc" : "pcs";

    case "pieces":
    case "pcs":
      return "pcs";

    case "pair":
    case "pr":
      return absQuantity === 1 ? "pr" : "prs";

    case "pairs":
    case "prs":
      return "prs";

    case "set":
      return absQuantity === 1 ? "set" : "sets";

    case "sets":
      return "sets";

    default:
      return formatUnitAbbreviation(unit);
  }
};

const formatNaira = (value) => {
  if (!value && value !== 0) return "";
  const num = parseFloat(value);
  if (isNaN(num)) return value;

  // Format with Nigerian-style commas (no decimals for large amounts)
  if (num >= 1000) {
    return num.toLocaleString("en-NG", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
  }
  return num.toString();
};

const convertToNairaWords = (amount) => {
  if (!amount && amount !== 0) return "";

  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) return "";
  if (num === 0) return "Zero Naira";

  const units = ["", "Thousand", "Million", "Billion"];
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertChunk = (chunk) => {
    let words = "";
    const hundred = Math.floor(chunk / 100);
    const remainder = chunk % 100;

    if (hundred > 0) {
      words += ones[hundred] + " Hundred";
      if (remainder > 0) words += " and ";
    }

    if (remainder >= 10 && remainder <= 19) {
      words += teens[remainder - 10];
    } else {
      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;

      if (ten > 0) {
        words += tens[ten];
        if (one > 0) words += "-";
      }

      if (one > 0) {
        words += ones[one];
      }
    }

    return words.trim();
  };

  let words = "";
  let tempAmount = Math.floor(num);
  let chunkIndex = 0;

  while (tempAmount > 0) {
    const chunk = tempAmount % 1000;
    if (chunk > 0) {
      let chunkWords = convertChunk(chunk);
      if (units[chunkIndex]) {
        chunkWords += " " + units[chunkIndex];
      }
      words = chunkWords + (words ? " " + words : "");
    }
    tempAmount = Math.floor(tempAmount / 1000);
    chunkIndex++;
  }

  // Add "Naira" and handle kobo
  const kobo = Math.round((num - Math.floor(num)) * 100);
  let result = words + (words ? " Naira" : "");

  if (kobo > 0) {
    result += " and " + convertChunk(kobo) + " Kobo";
  } else if (words) {
    result += " Only";
  }

  return result;
};

function separateCamelCase(str, options = {}) {
  if (!str || typeof str !== "string") return str || "";

  const {
    separator = " ",
    preserveAcronyms = true,
    capitalizeFirst = false,
    lowercaseFirst = false,
  } = options;

  if (str.length <= 1) return str;

  let result = str.replace(/([a-z])([A-Z])/g, `$1${separator}$2`);

  if (preserveAcronyms) {
    result = result.replace(/([A-Z]+)([A-Z][a-z])/g, `$1${separator}$2`);
  } else {
    result = result.replace(/([A-Z]+)/g, (match) =>
      match.split("").join(separator)
    );
  }

  result = result.replace(/([a-zA-Z])(\d)/g, `$1${separator}$2`);
  result = result.replace(/(\d)([a-zA-Z])/g, `$1${separator}$2`);

  if (capitalizeFirst) {
    result = result
      .split(separator)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(separator);
  } else if (lowercaseFirst) {
    result = result
      .split(separator)
      .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
      .join(separator);
  }

  result = result.replace(new RegExp(`${separator}+`, "g"), separator);

  return result.trim();
}

// Alternative: Simple one-liner version
// function simpleSeparate(str, separator = ' ') {
//   if (!str) return '';
//   return str
//     .replace(/([a-z])([A-Z])/g, `$1${separator}$2`)
//     .replace(/([A-Z]+)([A-Z][a-z])/g, `$1${separator}$2`)
//     .replace(/([a-zA-Z])(\d)/g, `$1${separator}$2`)
//     .replace(/(\d)([a-zA-Z])/g, `$1${separator}$2`);
// }

// // Examples and test cases:
// const examples = [
//   'phoneCamera',
//   'iPhone15ProMax',
//   'getUserData',
//   'HTMLParser',
//   'JSONData

export {
  calculateShippingEstimate,
  convertToNairaWords,
  formatNaira,
  separateCamelCase,
};
