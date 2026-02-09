// src/components/vehicle-service/SearchBar.tsx  (or ServiceFilter.tsx)
"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Drawer from "../ui/Drawer";
import ServiceEnquiryFilterForm from "./ServiceEnquiryFilterForm";
import { useSearchParams } from "react-router-dom";

export default function ServiceFilter() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Check if any filter is active
  const isFilterApplied = [
    "keyword",
    "createdFrom",
    "createdTo",
    "updatedFrom",
    "updatedTo",
    "minOdometer",
    "maxOdometer",
  ].some((key) => {
    const value = searchParams.get(key);
    return value !== null && value.trim() !== "";
  });

  // Callback to close drawer when apply/clear is clicked
  const handleFilterAction = () => {
    setIsFilterOpen(false);
  };

  return (
    <>
      <div className="mt-3 flex justify-between gap-1.5">
        {/* Search input */}
        <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 flex items-center px-3 py-3 gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Vehicle number"
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        {/* Filter button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-white relative rounded-xl shadow-sm border border-gray-200 flex items-center px-3 py-3 gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="w-5 h-5 text-teal-600" />

          {isFilterApplied && (
            <>
              <div className="w-3 h-3 bg-teal-400 rounded-full absolute top-0 -right-1 animate-ping z-10" />
              <div className="w-2 h-2 bg-teal-400 rounded-full absolute top-0 -right-1 z-20 mt-0.5" />
            </>
          )}
        </button>
      </div>

      {/* Drawer */}
      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Vehicles"
        position="right"
        width="w-80 sm:w-96"
        icon={<SlidersHorizontal className="w-5 h-5 text-teal-600" />}
      >
        <div className="py-2">
          <ServiceEnquiryFilterForm
            onApply={handleFilterAction}
            onClear={handleFilterAction} // optional: close on clear too
          />
        </div>
      </Drawer>
    </>
  );
}
