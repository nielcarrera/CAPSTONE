import { CircleDot } from "lucide-react";

const severityClasses = {
  mild: "bg-green-100 text-green-800 border-green-200",
  moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  severe: "bg-red-100 text-red-800 border-red-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

const typeIcons = {
  cleanser: "❖",
  serum: "◉",
  exfoliant: "◎",
  moisturizer: "⦿",
  sunscreen: "◙",
  mask: "⟐",
  toner: "▣",
  treatment: "⚕",
  default: "■",
};

export const ProductCard = ({ product, onClick }) => (
  <div
    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col"
    onClick={onClick}
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      <div className="absolute top-2 right-2">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            severityClasses[product.severity] || severityClasses.default
          }`}
        >
          <CircleDot className="w-3 h-3 mr-1" />
          {product.severity}
        </span>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{product.brand}</span>
        <span className="text-xs border px-2 py-1 rounded-md">
          {typeIcons[product.type] || typeIcons.default} {product.type}
        </span>
      </div>
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
        {product.description}
      </p>
      <div className="mt-2 text-xs text-gray-500">
        <div className="flex items-center">
          <span className="font-medium">Added: </span>
          <span className="ml-1">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {/* Show area (face/body part) */}
        <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full">
          {product.area
            ? product.area.charAt(0).toUpperCase() + product.area.slice(1)
            : "Unknown Area"}
        </span>
        {/* If face, show impurity and skin type */}
        {product.area === "face" && (
          <>
            {product.impurity && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {product.impurity}
              </span>
            )}
            {product.skinType && (
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                {product.skinType}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);
