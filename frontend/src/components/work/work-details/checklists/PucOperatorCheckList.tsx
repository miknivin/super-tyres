import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import InfoCard from '../../../shared/InfoCard';

interface ChecklistItems {
  engineWarmed: boolean;
  probeInsertedCorrectly: boolean;
  certificatePrintedUploaded: boolean;
}

const PUCOperatorChecklist: React.FC = () => {
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
    engineWarmed: false,
    probeInsertedCorrectly: false,
    certificatePrintedUploaded: false
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
          <span className="text-teal-600 text-sm font-medium">PUC Operator Checklist</span>
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
            PUC Operator Checklist
          </h2>

          {/* Checklist Items */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Engine Warmed</span>
              <button
                onClick={() => toggleItem('engineWarmed')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  checklistItems.engineWarmed ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.engineWarmed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Probe inserted Correctly</span>
              <button
                onClick={() => toggleItem('probeInsertedCorrectly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  checklistItems.probeInsertedCorrectly ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.probeInsertedCorrectly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Certificate Printed & Uploaded</span>
              <button
                onClick={() => toggleItem('certificatePrintedUploaded')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  checklistItems.certificatePrintedUploaded ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checklistItems.certificatePrintedUploaded ? 'translate-x-6' : 'translate-x-1'
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

export default PUCOperatorChecklist;
