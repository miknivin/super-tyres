import React from "react";

export default function WorkTypeSelector() {
  const [selectedTypes, setSelectedTypes] = React.useState([3, 4]);

  const workTypes = [
    { id: 1, name: "Tyre Services" },
    { id: 2, name: "Alignment" },
    { id: 3, name: "Balancing" },
    { id: 4, name: "Oil Change" },
    { id: 5, name: "Battery Services" },
    { id: 6, name: "General Repair" },
    { id: 7, name: "Wash & Clean" },
    { id: 8, name: "PUC Test" },
  ];

  const toggleSelection = (id: number) => {
    setSelectedTypes((prev) =>
      prev.includes(id)
        ? prev.filter((typeId) => typeId !== id)
        : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Select Work Type
          </h1>
          <p className="text-sm text-gray-500">
            Choose the service you're assigned to start working
          </p>
        </div>

        {/* Grid of Work Types */}
        <div className="grid grid-cols-2 gap-4">
          {workTypes.map((workType) => {
            const isSelected = selectedTypes.includes(workType.id);
            return (
              <label
                key={workType.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer relative block"
              >
                {/* Hidden Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelection(workType.id)}
                  className="sr-only"
                />

                {/* Custom Radio Button Visual */}
                <div className="absolute top-4 left-4">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-teal-600 bg-teal-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Image Placeholder */}
                <div className="flex justify-center mb-4 mt-2">
                  <div className="w-32 h-24 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
     
                {/* Service Name */}
                <h3 className="text-center text-sm font-semibold text-gray-800">
                  {workType.name}
                </h3>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
