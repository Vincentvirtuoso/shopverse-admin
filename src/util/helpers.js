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

export { calculateShippingEstimate };
