import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import InfoCard from '../../../shared/InfoCard';

interface ChecklistItems {
  wheelCleaned: boolean;
  weightFixedSecurely: boolean;
  finalRecheckDone: boolean;
}

const BalancingChecklist: React.FC = () => {
  // Vehicle data
  const vehicleData = {
    vehicleNumber: "KL 57 M 8478",
    customerName: "Mrshad",
    phoneNumber: "+91 987 312 345",
    distance: "23.5609 km",
    status: "Awaiting approval",
    currentStep: 3,
    totalSteps: 5
  };

  const [checklistItems, setChecklistItems] = useState<ChecklistItems>({
    wheelCleaned: false,
    weightFixedSecurely: false,
    finalRecheckDone: false
  });
  
  const [complaints, setComplaints] = useState<string>('');

  const toggleItem = (item: keyof ChecklistItems) => {
    setChecklistItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <ChevronLeft className="w-5 h-5 text-teal-600 mr-2" />
          <span className="text-teal-600 text-sm font-medium">Balancing Technician Checklist</span>
        </div>

        {/* Info Card */}
        <InfoCard
          vehicleNumber={vehicleData.vehicleNumber}
          customerName={vehicleData.customerName}
          phoneNumber={vehicleData.phoneNumber}
          distance={vehicleData.distance}
          status={vehicleData.status}
          currentStep={vehicleData.currentStep}
          totalSteps={vehicleData.totalSteps}
        />

        {/* Checklist Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-center text-gray-900 font-semibold text-lg mb-6">
            Balancing Checklist
          </h2>

          {/* Checklist Items */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Wheel Cleaned</span>
              <button
                onClick={() => toggleItem('wheelCleaned')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  checklistItems.wheelCleaned ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.wheelCleaned ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Weight Fixed Securely</span>
              <button
                onClick={() => toggleItem('weightFixedSecurely')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  checklistItems.weightFixedSecurely ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.weightFixedSecurely ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Final Recheck Done</span>
              <button
                onClick={() => toggleItem('finalRecheckDone')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  checklistItems.finalRecheckDone ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.finalRecheckDone ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Complaints Input */}
          <div className="mb-6">
            <textarea
              value={complaints}
              onChange={(e) => setComplaints(e.target.value)}
              placeholder="Enter complaint/s"
              className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Confirm Button */}
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors">
            Confirmed
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalancingChecklist;
