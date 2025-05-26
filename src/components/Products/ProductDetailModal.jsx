import { X, Star, Clock, Droplet, AlertTriangle } from "lucide-react";

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const severityClasses = {
    mild: "bg-green-100 text-green-800",
    moderate: "bg-yellow-100 text-yellow-800",
    severe: "bg-red-100 text-red-800",
  };

  const renderIngredients = () => (
    <ul className="space-y-1 list-disc list-inside text-gray-700">
      {product.ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ))}
    </ul>
  );
  const renderCautions = () => {
    if (!product.cautions) {
      return <p className="text-gray-500">No specific warnings</p>;
    }

    const cautionsArray =
      typeof product.cautions === "string"
        ? [product.cautions]
        : product.cautions;

    return (
      <ul className="space-y-2">
        {cautionsArray.map((caution, index) => (
          <li key={index} className="flex items-start text-yellow-700">
            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{caution}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center backdrop-blur-md justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl border-1 w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-500 mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">Added</span>
                </div>
                <div>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Usage Instructions</h3>
              <p className="text-gray-700">{product.usage}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Active Ingredients</h3>
              {renderIngredients()}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Warnings</h3>
              {renderCautions()}
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  severityClasses[product.severity]
                }`}
              >
                {product.severity}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {product.type}
              </span>
              {product.area === "face" ? (
                <>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {product.skinType}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {product.impurity}
                  </span>
                </>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                  {product.bodyPart}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
