import { Clock, Phone } from "lucide-react";

// 1. Define props type (using `type` is very common & clean in 2024–2025 React/TS projects)
type VehicleDetailsCardProps = {
  vehicleNumber: string;
  name: string;
  phone: string;
  distance: string;
  step: number | string; // allow both — depends on your backend
  status: string;
};

// 2. Component (arrow function + destructuring + TypeScript)
const VehicleDetailsCard = ({
  vehicleNumber,
  name,
  phone,
  distance,
  step,
  status,
}: VehicleDetailsCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      {/* Top status bar */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <Clock className="w-4 h-4" />
          <span>Ongoing work</span>
        </div>

        {/* You had an empty div here — removed it.
            If you want something on the right later, just add it back */}
      </div>

      {/* Main content */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {vehicleNumber}
          </h2>
          <p className="text-gray-600 mb-1">{name}</p>

          <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
            <Phone className="w-4 h-4" />
            <span>{phone}</span>
          </div>

          <p className="text-gray-500 text-sm">{distance}</p>
          <p className="text-gray-500 text-sm mt-2">Step {step}</p>
        </div>

        {/* Status badge */}
        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
          {status}
        </span>
      </div>
    </div>
  );
};

export default VehicleDetailsCard;
