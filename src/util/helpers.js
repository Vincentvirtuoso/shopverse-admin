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

export { calculateShippingEstimate };
