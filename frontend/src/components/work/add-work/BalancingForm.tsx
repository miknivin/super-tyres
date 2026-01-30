// src/components/work/add-work/BalancingForm.tsx

import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store"; // adjust path
import { goToStep, updateBalancing } from "../../../redux/slices/serviceEnquiryFormSlice"; // adjust path
import balancing from "../../../assets/services/balancing-illustration.png";
interface BalanceWeights {
  frontLeft: string;
  frontRight: string;
  rearLeft: string;
  rearRight: string;
}

export default function BalancingForm() {
  const dispatch = useDispatch();

  // Read data from Redux
  const { weights, complaint } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.balancing,
  );

  // Helper to update weights
  const handleWeightChange = (
    position: keyof BalanceWeights,
    value: string,
  ) => {
    dispatch(
      updateBalancing({
        weights: {
          ...weights,
          [position]: value,
        },
      }),
    );
  };

  // Helper to update complaint
  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateBalancing({ complaint: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Back Button – optional (ServiceLayout handles navigation) */}
        <button
          onClick={() => dispatch(goToStep(1))}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Services</span>
        </button>

        {/* Balancing Diagram */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 max-w-2xl mx-auto">
          <div className="relative w-full aspect-4/3 flex items-center justify-center">
            <img className="w-full" src={balancing} alt="" />
          </div>
        </div>

        {/* Balancing Weights Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Balancing Weights (gm)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {/* Front Left */}
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">
                Front Left
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={weights.frontLeft}
                  onChange={(e) =>
                    handleWeightChange("frontLeft", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Front Right */}
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">
                Front Right
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={weights.frontRight}
                  onChange={(e) =>
                    handleWeightChange("frontRight", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Rear Left */}
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">
                Rear Left
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={weights.rearLeft}
                  onChange={(e) =>
                    handleWeightChange("rearLeft", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Rear Right */}
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">
                Rear Right
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={weights.rearRight}
                  onChange={(e) =>
                    handleWeightChange("rearRight", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Complaint Text Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint / Notes
            </label>
            <textarea
              placeholder="Enter any complaints or observations..."
              value={complaint}
              onChange={handleComplaintChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* No Back/Next buttons here – handled by ServiceLayout */}
      </div>
    </div>
  );
}
