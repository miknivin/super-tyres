// src/components/vehicle-service/CompletedVehicleCard.tsx

import type { Vehicle } from "../../types/vehicle";

interface Props {
  vehicle: Vehicle;
}

export default function CompletedVehicleCard({ vehicle }: Props) {
  return (
    <>
      {vehicle.success && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-lg font-bold">✓</span>
          </div>
          <span className="text-green-600 font-medium">Successful</span>
        </div>
      )}

      <div className="mb-3">
        <h3 className="font-bold text-gray-900">{vehicle.plate}</h3>
        <p className="text-gray-700 mt-1">{vehicle.owner}</p>
        <p className="text-gray-600 mt-0.5">{vehicle.phone}</p>
        <p className="text-gray-600 mt-1 text-sm">{vehicle.mileage}</p>
      </div>

      <div className="flex gap-3 mt-5">
        <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-200 transition-colors">
          Add Service
        </button>
        <button className="flex-1 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium">
          View
        </button>
      </div>
    </>
  );
}