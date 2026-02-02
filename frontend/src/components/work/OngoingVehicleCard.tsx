// src/components/vehicle-service/OngoingVehicleCard.tsx
import { Link } from "react-router-dom";
import type { Vehicle } from "../../types/vehicle";

interface Props {
  vehicle: Vehicle;
}

export default function OngoingVehicleCard({ vehicle }: Props) {
  const isAwaiting =
    (vehicle.status && vehicle.status.toLowerCase() === "pending") ||
    (vehicle.status && vehicle.status.toLowerCase() === "awaiting");
  const isOngoing =
    (vehicle.status && vehicle.status.toLowerCase() === "ongoing") ||
    (vehicle.status && vehicle.status.toLowerCase() === "in progress");

  return (
    <>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{vehicle.plate}</h3>
          <p className="text-gray-700 mt-0.5">{vehicle.owner}</p>
          <p className="text-gray-600 text-sm mt-0.5">{vehicle.phone}</p>
        </div>
        {vehicle.timeBadge && (
          <span className="text-xs bg-cyan-100 text-cyan-700 px-2.5 py-1 rounded-full font-medium">
            {vehicle.timeBadge}
          </span>
        )}
      </div>

      {/* Image placeholder — replace with real <img> when available */}
      <div className="bg-gray-100 h-40 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm">
        Vehicle Image
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
        <span>{vehicle.odometer}</span>
        <span className="text-gray-300">|</span>
        {vehicle.services && <span>{vehicle.services}</span>}
      </div>

      <div className="flex gap-3">
        <button
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${
            isAwaiting
              ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
              : isOngoing
                ? "bg-cyan-50 text-cyan-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {isAwaiting
            ? "Awaiting approval"
            : isOngoing
              ? "Ongoing"
              : vehicle.status}
        </button>
        <Link
          to={`/work/${vehicle.id}`} // ← now uses real enquiry.id
          className="flex-1 py-2.5 text-center bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          Continue
        </Link>
      </div>
    </>
  );
}
