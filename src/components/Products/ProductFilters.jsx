import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

import {
  skinImpurities,
  skinTypes,
  sortOptions,
} from "../../Pages/utils/Productdata";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const productTypes = [
  "all",
  "cleanser",
  "serum",
  "exfoliant",
  "moisturizer",
  "toner",
  "treatment",
];
const severityTypes = ["all", "mild", "moderate", "severe"];
const bodyParts = [
  "all",
  "arm",
  "back",
  "neck",
  "legs",
  "feet",
  "back",
  "abdomen",
  "hands",
];
const dateRanges = [
  { value: "all", label: "All Dates" },
  { value: "week", label: "Last Week" },
  { value: "month", label: "Last Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "Last Year" },
];

const FilterDropdown = ({
  label,
  value,
  options,
  isOpen,
  setIsOpen,
  onSelect,
}) => (
  <div>
    <p className="text-sm font-medium mb-2">{label}</p>
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-md flex items-center justify-between w-full"
      >
        <span>{value === "all" ? `All ${label}s` : capitalize(value)}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value || option}
              onClick={() => {
                onSelect(option.value || option);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                value === (option.value || option) ? "bg-blue-50" : ""
              }`}
            >
              {option.label ||
                (option === "all" ? `All ${label}s` : capitalize(option))}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const ProductFilters = ({ filters, onFilterChange }) => {
  const [openStates, setOpenStates] = useState({
    sort: false,
    impurity: false,
    skinType: false,
    type: false,
    severity: false,
    dateRange: false,
  });

  const toggleOpen = (key) =>
    setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <h2 className="text-2xl font-bold">Skincare Products</h2>
        <div className="relative w-full md:w-auto">
          <button
            onClick={() => toggleOpen("sort")}
            className="px-4 py-2 border rounded-md flex items-center justify-between w-full md:w-auto"
          >
            <span>
              Sort by:{" "}
              {sortOptions.find((opt) => opt.value === filters.sortOrder)
                ?.label || "Sort by"}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openStates.sort ? "rotate-180" : ""
              }`}
            />
          </button>
          {openStates.sort && (
            <div className="absolute right-0 mt-2 w-full md:w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFilterChange("sortOrder", option.value);
                      toggleOpen("sort");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">Area:</p>
        <div className="flex border rounded-md overflow-hidden">
          {["face", "body"].map((area) => (
            <button
              key={area}
              onClick={() => {
                onFilterChange("area", area);
                onFilterChange("bodyPart", "all");
              }}
              className={`px-4 py-2 text-sm ${
                filters.area === area
                  ? "bg-cyan-800 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {capitalize(area)}
            </button>
          ))}
        </div>
      </div>

      {filters.area === "body" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Body Part:</p>
          <div className="flex flex-wrap gap-2">
            {bodyParts.map((part) => (
              <button
                key={part}
                onClick={() => onFilterChange("bodyPart", part)}
                className={`px-4 py-2 rounded-full text-sm border ${
                  filters.bodyPart === part
                    ? "bg-cyan-800 text-white border-cyan-800"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {part === "all" ? "All Body Parts" : capitalize(part)}
              </button>
            ))}
          </div>
        </div>
      )}

      {filters.area === "face" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <FilterDropdown
            label="Product Type"
            value={filters.type}
            options={productTypes}
            isOpen={openStates.type}
            setIsOpen={() => toggleOpen("type")}
            onSelect={(v) => onFilterChange("type", v)}
          />

          <FilterDropdown
            label="Skin Impurity"
            value={filters.impurity}
            options={skinImpurities}
            isOpen={openStates.impurity}
            setIsOpen={() => toggleOpen("impurity")}
            onSelect={(v) => onFilterChange("impurity", v)}
          />

          <FilterDropdown
            label="Severity"
            value={filters.severity}
            options={severityTypes}
            isOpen={openStates.severity}
            setIsOpen={() => toggleOpen("severity")}
            onSelect={(v) => onFilterChange("severity", v)}
          />

          <FilterDropdown
            label="Skin Type"
            value={filters.skinType}
            options={skinTypes}
            isOpen={openStates.skinType}
            setIsOpen={() => toggleOpen("skinType")}
            onSelect={(v) => onFilterChange("skinType", v)}
          />

          <FilterDropdown
            label="Date Range"
            value={filters.dateRange}
            options={dateRanges}
            isOpen={openStates.dateRange}
            setIsOpen={() => toggleOpen("dateRange")}
            onSelect={(v) => onFilterChange("dateRange", v)}
          />
        </div>
      )}
    </div>
  );
};
