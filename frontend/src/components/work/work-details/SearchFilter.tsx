
import { Search, SlidersHorizontal,  } from 'lucide-react';

// Component 1: Search and Filter
const SearchFilter = () => {
  return (
    <div className="flex items-center gap-3 p-4 bg-white">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by Vehicle number"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default SearchFilter;