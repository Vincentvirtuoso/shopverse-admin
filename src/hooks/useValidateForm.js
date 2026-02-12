import { isValidCategory } from "../assets/addProducts";

const useValidateForm = (form, setErrors, mainImage, additionalImages) => {
  const validateForm = (step, general = false) => {
    const errors = {};

    const shouldValidate = (s) => general || step === s;

    const trim = (v) => v?.trim?.() ?? "";

    const isNumber = (v) => !isNaN(parseFloat(v));

    const addError = (key, message) => {
      if (!errors[key]) errors[key] = message;
    };

    if (shouldValidate(0)) {
      const name = trim(form.name);
      const brand = trim(form.brand);
      const description = trim(form.description);
      const category = trim(form.category);

      if (!name) addError("name", "Product name is required");
      else if (name.length < 3)
        addError("name", "Product name must be at least 3 characters long");
      else if (name.length > 100)
        addError("name", "Product name cannot exceed 100 characters");

      if (!brand) addError("brand", "Brand is required");
      else if (brand.length < 2)
        addError("brand", "Brand name must be at least 2 characters long");
      else if (brand.length > 50)
        addError("brand", "Brand name cannot exceed 50 characters");

      if (!description) addError("description", "Description is required");
      else if (description.length < 10)
        addError(
          "description",
          "Description must be at least 10 characters long",
        );
      else if (description.length > 5000)
        addError("description", "Description cannot exceed 5000 characters");

      if (!category) addError("category", "Category is required");
      else if (!isValidCategory(category))
        addError("category", "Please select a valid category");
    }

    if (shouldValidate(1)) {
      const price = parseFloat(form.price);
      const originalPrice = parseFloat(form.originalPrice);

      if (!form.price) addError("price", "Price is required");
      else if (!isNumber(form.price))
        addError("price", "Price must be a valid number");
      else if (price <= 0) addError("price", "Price must be greater than 0");
      else if (!/^\d+(\.\d{1,2})?$/.test(form.price.toString()))
        addError("price", "Price must have at most 2 decimal places");

      if (form.originalPrice) {
        if (!isNumber(form.originalPrice))
          addError("originalPrice", "Original price must be a valid number");
        else if (originalPrice <= 0)
          addError("originalPrice", "Original price must be greater than 0");
        else if (originalPrice < price)
          addError(
            "originalPrice",
            "Original price must be greater than or equal to the current price",
          );
        else if (originalPrice > price * 10)
          addError(
            "originalPrice",
            "Original price seems unusually high compared to current price",
          );
      }

      if (form.stock !== undefined) {
        if (form.stock < 0) addError("stock", "Stock cannot be negative");
        else if (!Number.isInteger(Number(form.stock)))
          addError("stock", "Stock must be a whole number");
      }

      if (trim(form.sku)) {
        const sku = trim(form.sku);

        if (sku.length < 3)
          addError("sku", "SKU must be at least 3 characters");
        else if (sku.length > 50)
          addError("sku", "SKU cannot exceed 50 characters");
        else if (!/^[A-Za-z0-9-_.]+$/.test(sku))
          addError(
            "sku",
            "SKU can only contain letters, numbers, hyphens, underscores, and periods",
          );
      }
    }

    if (shouldValidate(2) && form.dimensions) {
      const { length, weight } = form.dimensions;

      if (length && (length <= 0 || length > 500))
        addError("dimensions", "Length must be between 0 and 500 cm");

      if (weight && (weight <= 0 || weight > 1000))
        addError("dimensions", "Weight must be between 0 and 1000 kg");
    }

    if (shouldValidate(3)) {
      if (!mainImage || mainImage.length === 0)
        addError("images", "Main image is required");

      if (!additionalImages || additionalImages.length === 0)
        addError("images", "At least additional one product image is required");
      else if (additionalImages.length > 10)
        addError("images", "Maximum of 10 images allowed");
    }
    if (shouldValidate(4)) {
      if (form.features?.length === 0) {
        addError("features", "Minimum of 3 features allowed");
      }
    }

    setErrors(errors);

    const isValid = Object.keys(errors).length === 0;

    if (!isValid) {
      console.warn(
        `Validation failed for step ${step} (${
          Object.keys(errors).length
        } errors):`,
        errors,
      );
    }

    return isValid;
  };

  return { validateForm };
};

export default useValidateForm;
