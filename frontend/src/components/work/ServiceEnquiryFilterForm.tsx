/* eslint-disable react-hooks/set-state-in-effect */
// src/components/work/ServiceEnquiryFilterForm.tsx

import { type ChangeEvent } from "react";
import { Calendar } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

interface ServiceEnquiryFilterFormProps {
  onApply?: () => void;
  onClear?: () => void;
}

export default function ServiceEnquiryFilterForm({
  onApply,
  onClear,
}: ServiceEnquiryFilterFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    keyword: searchParams.get("keyword") || "",
    createdFrom: searchParams.get("createdFrom") || "",
    createdTo: searchParams.get("createdTo") || "",
    updatedFrom: searchParams.get("updatedFrom") || "",
    updatedTo: searchParams.get("updatedTo") || "",
    minOdometer: searchParams.get("minOdometer") || "",
    maxOdometer: searchParams.get("maxOdometer") || "",
  });

  useEffect(() => {
    setFormData({
      keyword: searchParams.get("keyword") || "",
      createdFrom: searchParams.get("createdFrom") || "",
      createdTo: searchParams.get("createdTo") || "",
      updatedFrom: searchParams.get("updatedFrom") || "",
      updatedTo: searchParams.get("updatedTo") || "",
      minOdometer: searchParams.get("minOdometer") || "",
      maxOdometer: searchParams.get("maxOdometer") || "",
    });
  }, [searchParams]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    const newParams = new URLSearchParams(searchParams);

    if (formData.keyword.trim()) {
      newParams.set("keyword", formData.keyword.trim());
    } else {
      newParams.delete("keyword");
    }

    if (formData.createdFrom)
      newParams.set("createdFrom", formData.createdFrom);
    else newParams.delete("createdFrom");

    if (formData.createdTo) newParams.set("createdTo", formData.createdTo);
    else newParams.delete("createdTo");

    if (formData.updatedFrom)
      newParams.set("updatedFrom", formData.updatedFrom);
    else newParams.delete("updatedFrom");

    if (formData.updatedTo) newParams.set("updatedTo", formData.updatedTo);
    else newParams.delete("updatedTo");

    if (formData.minOdometer)
      newParams.set("minOdometer", formData.minOdometer);
    else newParams.delete("minOdometer");

    if (formData.maxOdometer)
      newParams.set("maxOdometer", formData.maxOdometer);
    else newParams.delete("maxOdometer");

    newParams.set("page", "1");

    setSearchParams(newParams);

    // Close drawer
    onApply?.();
  };

  const handleClear = () => {
    setFormData({
      keyword: "",
      createdFrom: "",
      createdTo: "",
      updatedFrom: "",
      updatedTo: "",
      minOdometer: "",
      maxOdometer: "",
    });

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("keyword");
    newParams.delete("createdFrom");
    newParams.delete("createdTo");
    newParams.delete("updatedFrom");
    newParams.delete("updatedTo");
    newParams.delete("minOdometer");
    newParams.delete("maxOdometer");
    newParams.set("page", "1");

    setSearchParams(newParams);

    // Close drawer (optional – comment out if you want to keep drawer open after clear)
    onClear?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        {/* Keyword */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Keyword Search
          </label>
          <input
            type="text"
            name="keyword"
            value={formData.keyword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Vehicle No, Customer Name, Phone, City, Pincode..."
          />
        </div>

        {/* Created Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Created From
            </label>
            <div className="relative">
              <input
                type="date"
                name="createdFrom"
                value={formData.createdFrom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Created To
            </label>
            <div className="relative">
              <input
                type="date"
                name="createdTo"
                value={formData.createdTo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Updated Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Updated From
            </label>
            <div className="relative">
              <input
                type="date"
                name="updatedFrom"
                value={formData.updatedFrom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Updated To
            </label>
            <div className="relative">
              <input
                type="date"
                name="updatedTo"
                value={formData.updatedTo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Odometer Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Min Odometer (km)
            </label>
            <input
              type="number"
              name="minOdometer"
              value={formData.minOdometer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Minimum reading"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Max Odometer (km)
            </label>
            <input
              type="number"
              name="maxOdometer"
              value={formData.maxOdometer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Maximum reading"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6 sticky bottom-0 bg-white pt-4 -mx-1 px-1">
          <button
            onClick={handleApply}
            className="flex-1 bg-teal-600 text-white py-2.5 rounded-md hover:bg-teal-700 transition-colors font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
