import TruncatedTextWithTooltip from "../common/TruncatedTextWithTooltip";

const ProductVariants = ({ variants = [] }) => {
  console.log(variants);

  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Product Variants
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attributes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {variants.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  No variants added
                </td>
              </tr>
            ) : (
              variants.map((variant, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {variant.name || `Variant ${index + 1}`}
                    </div>
                    {variant.sku && (
                      <div className="text-xs text-gray-900 dark:text-white mt-1">
                        SKU:
                        <TruncatedTextWithTooltip
                          value={variant.sku}
                          className="ml-1 text-gray-500"
                          maxLength={20}
                          tooltipStyle="text-[10px] min-w-[20px] max-w-[180px]"
                        />
                        {/* {variant.sku} */}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₦{variant.price?.toLocaleString() || "0"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        variant.stockCount > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {variant.stockCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {variant.attributes &&
                      Object.keys(variant.attributes).length > 0 ? (
                        Object.entries(variant.attributes).map(
                          ([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center px-2 py-1 text-xs rounded bg-gray-100 text-gray-800"
                            >
                              {key}: {value}
                            </span>
                          ),
                        )
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductVariants;
