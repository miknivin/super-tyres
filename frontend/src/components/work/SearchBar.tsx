// src/components/vehicle-service/SearchBar.tsx
import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  return (
    <div className=" mt-3">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center px-3 py-3 gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Vehicle number"
          className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
        />
        <SlidersHorizontal className="w-5 h-5 text-teal-600" />
      </div>
    </div>
  );
}
