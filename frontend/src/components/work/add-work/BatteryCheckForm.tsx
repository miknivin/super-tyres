// src/components/work/add-work/BatteryCheckForm.tsx

import { ChevronLeft, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store"; // adjust path
import { goToStep, updateBatteryCheck } from "../../../redux/slices/serviceEnquiryFormSlice"; // adjust path

export type BatteryCondition = "Good" | "Average" | "Replace" | null;

export default function BatteryCheckForm() {
  const dispatch = useDispatch();

  // Read from Redux
  const { condition, voltage, specificGravity, complaint } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.batteryCheck,
  );

  // ── Helper: calculate dynamic slider color ────────────────────────────────
  const getSliderColor = (value: number, min: number, max: number): string => {
    const percentage = ((value - min) / (max - min)) * 100;
    const darkness = Math.floor((percentage / 100) * 155) + 100; // 100–255
    return `rgb(${255 - darkness}, ${255 - darkness}, ${255 - darkness})`;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleConditionChange = (value: BatteryCondition) => {
    dispatch(updateBatteryCheck({ condition: value }));
  };

  const handleVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      dispatch(updateBatteryCheck({ voltage: val }));
    }
  };

  const handleSpecificGravityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      dispatch(updateBatteryCheck({ specificGravity: val }));
    }
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateBatteryCheck({ complaint: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-md">
        {/* Back Button – optional (ServiceLayout handles navigation) */}
        <button
          onClick={() => dispatch(goToStep(1))}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Services</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Vehicle and Customer Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-bold text-gray-900">
                KL 57 M 8478
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
                <p className="text-sm text-gray-700 font-medium">Mirshad</p>
                <p className="text-xs text-gray-500">+91 807 812 345</p>
                <p className="text-xs text-gray-500">25,5400 km</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Service Details
                </h3>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service date</span>
                    <span className="text-gray-900">12/02/2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">km</span>
                    <span className="text-gray-900">58,000 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Battery Check-Up Section */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
              Battery Check-Up
            </h2>

            {/* Voltage */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Voltage
                </span>
                <input
                  type="number"
                  value={voltage}
                  onChange={handleVoltageChange}
                  step="0.1"
                  className="w-20 px-2 py-1 text-sm font-semibold text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                />
              </div>
              <input
                type="range"
                min="11.5"
                max="13.0"
                step="0.1"
                value={voltage}
                onChange={handleVoltageChange}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: getSliderColor(voltage, 11.5, 13.0),
                }}
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>11.5V</span>
                <span>13.0V</span>
              </div>
            </div>

            {/* Specific Gravity */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Specific Gravity
                </span>
                <input
                  type="number"
                  value={specificGravity}
                  onChange={handleSpecificGravityChange}
                  step="0.01"
                  className="w-20 px-2 py-1 text-sm font-semibold text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                />
              </div>
              <input
                type="range"
                min="1.0"
                max="1.3"
                step="0.01"
                value={specificGravity}
                onChange={handleSpecificGravityChange}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: getSliderColor(specificGravity, 1.0, 1.3),
                }}
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>1.0</span>
                <span>1.3</span>
              </div>
            </div>

            {/* Battery Condition */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Battery Condition
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleConditionChange("Good")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    condition === "Good"
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Good
                </button>
                <button
                  onClick={() => handleConditionChange("Average")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    condition === "Average"
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Average
                </button>
                <button
                  onClick={() => handleConditionChange("Replace")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    condition === "Replace"
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Replace
                </button>
              </div>
            </div>

            {/* Complaint Text Area */}
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

        {/* No Back/Next buttons – handled by ServiceLayout */}
      </div>
    </div>
  );
}
