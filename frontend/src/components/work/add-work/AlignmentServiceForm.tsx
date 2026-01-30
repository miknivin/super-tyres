// src/components/work/add-work/AlignmentServiceForm.tsx

import { Calendar, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store"; // ← adjust path if needed
import {
  goToStep,
  updateAlignment,
} from "../../../redux/slices/serviceEnquiryFormSlice"; // ← adjust path

export default function AlignmentServiceForm() {
  const dispatch = useDispatch();

  // Read current values from Redux
  const { lastServiceDate, complaint, inflationPressure } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.alignment,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto ">
        {/* Back Button – optional (ServiceLayout usually handles this) */}
        <button
          onClick={() => dispatch(goToStep(1))}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Services</span>
        </button>

        {/* Alignment Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
            Alignment
          </h2>

          {/* Last Service Date */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">
              Last service Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={lastServiceDate}
                onChange={(e) =>
                  dispatch(updateAlignment({ lastServiceDate: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          {/* Complaint Text Area */}
          <div className="mb-4">
            <textarea
              placeholder="Enter complaint/s"
              value={complaint}
              onChange={(e) =>
                dispatch(updateAlignment({ complaint: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Inflation Pressure Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
            Inflation Pressure
          </h3>
          <div className="flex justify-center gap-3">
            <button
              onClick={() =>
                dispatch(updateAlignment({ inflationPressure: "AIR" }))
              }
              className={`px-8 py-2.5 rounded-lg font-medium transition-colors ${
                inflationPressure === "AIR"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              AIR
            </button>
            <button
              onClick={() =>
                dispatch(updateAlignment({ inflationPressure: "NO" }))
              }
              className={`px-8 py-2.5 rounded-lg font-medium transition-colors ${
                inflationPressure === "NO"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              NO.
            </button>
          </div>
        </div>

        {/* No Back/Next buttons here – handled by ServiceLayout */}
      </div>
    </div>
  );
}
