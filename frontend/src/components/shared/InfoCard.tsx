import React from "react";

// Option 1: Using interface (most common in modern React + TS projects)
interface InfoCardProps {
  vehicleNumber: string;
  customerName: string;
  phoneNumber: string;
  distance: string; // e.g. "12.4 km" — keep as string for display
  status: string;
  currentStep: number;
  totalSteps: number;
}

// Option 2: You could also use type alias
// type InfoCardProps = { ...same fields... };

const InfoCard: React.FC<InfoCardProps> = ({
  vehicleNumber,
  customerName,
  phoneNumber,
  distance,
  status,
  //   currentStep,
  //   totalSteps,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {vehicleNumber}
          </h1>
          <p className="text-gray-600 text-sm mb-1">{customerName}</p>
          <p className="text-gray-500 text-xs mb-1">{phoneNumber}</p>
          <p className="text-gray-400 text-xs">{distance}</p>
        </div>

        <span className="bg-teal-50 text-teal-600 text-xs font-medium px-3 py-1 rounded-full">
          {status}
        </span>
      </div>

      {/* <p className="text-gray-500 text-sm">
        Step {currentStep} of {totalSteps}
      </p> */}
    </div>
  );
};

export default InfoCard;
