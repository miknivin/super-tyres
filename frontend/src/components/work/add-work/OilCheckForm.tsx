// src/components/work/add-work/OilCheckForm.tsx
import { ChevronLeft, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  goToStep,
  updateOilCheckUp,
  clearError,
} from "../../../redux/slices/serviceEnquiryFormSlice";

export type OilQuality = "Good" | "Average" | "Replace" | null;
export type OilLevel = "Max" | "Normal" | "Min" | "Immediately Fill" | null;

export default function OilCheckForm() {
  const dispatch = useDispatch();

  // ────────────────────────────────────────────────
  // Read data & errors from Redux
  // ────────────────────────────────────────────────
  const { quality, level, complaint } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.oilCheckUp,
  );

  const customer = useSelector(
    (state: RootState) => state.serviceEnquiry.data.customer,
  );
  const errors = useSelector((state: RootState) => state.serviceEnquiry.errors);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleQualityChange = (value: OilQuality) => {
    dispatch(updateOilCheckUp({ quality: value }));

    // Clear quality error on change
    if (errors["oilCheckUp.quality"]) {
      dispatch(clearError({ field: "oilCheckUp.quality" }));
    }
  };

  const handleLevelChange = (value: OilLevel) => {
    dispatch(updateOilCheckUp({ level: value }));

    // Clear level error on change
    if (errors["oilCheckUp.level"]) {
      dispatch(clearError({ field: "oilCheckUp.level" }));
    }
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateOilCheckUp({ complaint: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Back Button */}
        <button
          onClick={() => dispatch(goToStep(1))}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Services</span>
        </button>

        {/* Vehicle and Customer Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-gray-900">
              {customer.vehicleNo || "Vehicle Number Not Set"}
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Customer Details
              </h3>
              <p className="text-sm text-gray-700 font-medium">
                {customer.name || "Not Set"}
              </p>
              <p className="text-xs text-gray-500">
                {customer.phone || "Not Set"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Service Details
              </h3>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service date</span>
                  <span>
                    {customer.serviceDate
                      ? new Date(customer.serviceDate).toLocaleDateString()
                      : "Not Set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Odometer</span>
                  <span>
                    {customer.odometer ? `${customer.odometer} km` : "Not Set"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Oil Check-Up Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
            Oil Check-Up
          </h2>

          {/* Oil Quality */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quality <span className="text-red-500">*</span>
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleQualityChange("Good")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  quality === "Good"
                    ? "border-teal-600 bg-teal-50 text-teal-700"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                Good
              </button>
              <button
                onClick={() => handleQualityChange("Average")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  quality === "Average"
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                Average
              </button>
              <button
                onClick={() => handleQualityChange("Replace")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  quality === "Replace"
                    ? "border-red-600 bg-red-50 text-red-700"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                Replace
              </button>
            </div>
            {errors["oilCheckUp.quality"] && (
              <p className="text-red-500 text-xs mt-3 text-center">
                {errors["oilCheckUp.quality"]}
              </p>
            )}
          </div>

          {/* Oil Level */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Oil Level <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="oilLevel"
                    checked={level === "Max"}
                    onChange={() => handleLevelChange("Max")}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-teal-600 peer-checked:border-[5px] transition-all"></div>
                  <span className="text-sm text-gray-700">Max</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="oilLevel"
                    checked={level === "Normal"}
                    onChange={() => handleLevelChange("Normal")}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-teal-600 peer-checked:border-[5px] transition-all"></div>
                  <span className="text-sm text-gray-700">Normal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="oilLevel"
                    checked={level === "Min"}
                    onChange={() => handleLevelChange("Min")}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-teal-600 peer-checked:border-[5px] transition-all"></div>
                  <span className="text-sm text-gray-700">Min</span>
                </label>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="oilLevel"
                  checked={level === "Immediately Fill"}
                  onChange={() => handleLevelChange("Immediately Fill")}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-teal-600 peer-checked:border-[5px] transition-all"></div>
                <span className="text-sm text-gray-700">Immediately Fill</span>
              </label>
            </div>
            {errors["oilCheckUp.level"] && (
              <p className="text-red-500 text-xs mt-3 text-center">
                {errors["oilCheckUp.level"]}
              </p>
            )}
          </div>

          {/* Complaint Text Area – optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint / Notes
            </label>
            <textarea
              placeholder="Enter any observations or issues..."
              value={complaint}
              onChange={handleComplaintChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
