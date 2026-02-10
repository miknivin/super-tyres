/* eslint-disable react-hooks/set-state-in-effect */
// src/components/vehicle-service/ServiceFilter.tsx
"use client";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"; // ← add Loader2
import { useSearchParams } from "react-router-dom";
import Drawer from "./Drawer";
import ServiceEnquiryFilterForm from "../work/ServiceEnquiryFilterForm";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";

export default function ServiceFilter() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Controlled keyword state (initialized from URL)
  const [keyword, setKeyword] = useState(
    () => searchParams.get("keyword") ?? "",
  );

  // NEW: track whether debounce is waiting to fire
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Keep input in sync with URL (back/forward, external updates)
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") ?? "";
    setKeyword(urlKeyword);
  }, [searchParams]);

  // Detect if ANY filter is applied (for badge indicator)
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

  const handleFilterAction = () => {
    setIsFilterOpen(false);
  };

  // Debounced URL update (single source of truth)
  const updateKeywordInUrl = useDebouncedCallback((value: string) => {
    setSearchParams((prev) => {
      const trimmed = value.trim();
      if (!trimmed) {
        prev.delete("keyword");
      } else {
        prev.set("keyword", trimmed);
      }
      // Reset pagination when filter changes
      prev.delete("page");
      return prev;
    });

    // IMPORTANT: turn off spinner AFTER the real update happens
    setIsDebouncing(false);
  }, 800);

  return (
    <>
      <div className="mt-3 flex justify-between gap-1.5">
        {/* 🔍 Search input */}
        <div className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm">
          {/* Spinner or Search icon */}
          {isDebouncing ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}

          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              const value = e.target.value;
              setKeyword(value); // instant UI update
              setIsDebouncing(true); // show spinner immediately
              updateKeywordInUrl(value); // schedule URL update
            }}
            placeholder="Search by Vehicle number"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>

        {/* ⚙️ Filter button */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          aria-label="Open filters"
          className="relative flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <SlidersHorizontal className="h-5 w-5 text-teal-600" />
          {isFilterApplied && (
            <>
              <span className="absolute -right-1 top-0 z-10 h-3 w-3 animate-ping rounded-full bg-teal-400" />
              <span className="absolute -right-1 top-0 z-20 mt-0.5 h-2 w-2 rounded-full bg-teal-400" />
            </>
          )}
        </button>
      </div>

      {/* 🧩 Filter Drawer */}
      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Vehicles"
        position="right"
        width="w-80 sm:w-96"
        icon={<SlidersHorizontal className="h-5 w-5 text-teal-600" />}
      >
        <div className="py-2">
          <ServiceEnquiryFilterForm
            onApply={handleFilterAction}
            onClear={handleFilterAction}
          />
        </div>
      </Drawer>
    </>
  );
}
