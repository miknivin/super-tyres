import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import InfoCard from '../../../shared/InfoCard';

// Import your already-typed InfoCard component

// Type for the checklist state object
interface ChecklistItems {
  correctTyreSize: boolean;
  noBeadDamage: boolean;
  correctInflation: boolean;
  wheelNutTorque: boolean;
}

// You can also define vehicle data type if you want stricter checking
interface VehicleData {
  vehicleNumber: string;
  customerName: string;
  phoneNumber: string;
  distance: string;
  status: string;
  currentStep: number;
  totalSteps: number;
}

const TyreChecklist: React.FC = () => {
  // Vehicle data (you can later move this to props or context)
  const vehicleData: VehicleData = {
    vehicleNumber: "KL 57 M 8478",
    customerName: "Mrshad",
    phoneNumber: "+91 987 312 345",
    distance: "23.5609 km",
    status: "Awaiting approval",
    currentStep: 3,
    totalSteps: 5,
  };

  const [checklistItems, setChecklistItems] = useState<ChecklistItems>({
    correctTyreSize: true,
    noBeadDamage: false,
    correctInflation: false,
    wheelNutTorque: false,
  });

  const [complaints, setComplaints] = useState<string>('');

  // Typed toggle function — only allows valid checklist keys
  const toggleItem = (item: keyof ChecklistItems) => {
    setChecklistItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <ChevronLeft className="w-5 h-5 text-teal-600 mr-2" />
          <span className="text-teal-600 text-sm font-medium">
            Tyre Technician Checklist
          </span>
        </div>

        {/* Reusable InfoCard component */}
        <InfoCard
          vehicleNumber={vehicleData.vehicleNumber}
          customerName={vehicleData.customerName}
          phoneNumber={vehicleData.phoneNumber}
          distance={vehicleData.distance}
          status={vehicleData.status}
          currentStep={vehicleData.currentStep}
          totalSteps={vehicleData.totalSteps}
        />

        {/* Checklist section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-center text-gray-900 font-semibold text-lg mb-6">
            Tyre Checklist
          </h2>

          {/* Toggle switches */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Correct tyre size</span>
              <button
                type="button"
                onClick={() => toggleItem('correctTyreSize')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  checklistItems.correctTyreSize ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.correctTyreSize ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">No bead / sidewall damage</span>
              <button
                type="button"
                onClick={() => toggleItem('noBeadDamage')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  checklistItems.noBeadDamage ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.noBeadDamage ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Correct inflation</span>
              <button
                type="button"
                onClick={() => toggleItem('correctInflation')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  checklistItems.correctInflation ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.correctInflation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Wheel nut torque correct</span>
              <button
                type="button"
                onClick={() => toggleItem('wheelNutTorque')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  checklistItems.wheelNutTorque ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.wheelNutTorque ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Complaints */}
          <div className="mb-6">
            <textarea
              value={complaints}
              onChange={(e) => setComplaints(e.target.value)}
              placeholder="Enter complaint/s..."
              className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Submit button */}
          <button
            type="button"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            // You can later add: disabled={!allItemsChecked}
          >
            Confirmed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TyreChecklist;