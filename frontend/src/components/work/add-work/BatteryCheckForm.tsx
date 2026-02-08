// src/components/work/add-work/BatteryCheckForm.tsx
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  goToStep,
  updateBatteryCheck,
  clearError,
} from "../../../redux/slices/serviceEnquiryFormSlice";

// ────────────────────────────────────────────────
// Type for view mode data (matches backend DTO)
// ────────────────────────────────────────────────
export type BatteryCondition = "Good" | "Average" | "Replace" | null;

export interface BatteryInspectionData {
  condition?: BatteryCondition | null;
  voltage?: number | null;
  specificGravity?: number | null;
  complaint?: string | null;
  completedAt?: string | null; // optional – can show if needed
}

interface BatteryCheckFormProps {
  isViewMode?: boolean;
  data?: BatteryInspectionData | null;
}

// Helper: get color class for condition badge in view mode
const getConditionColor = (condition: BatteryCondition | null | undefined) => {
  if (!condition) return "bg-gray-100 text-gray-700";
  switch (condition) {
    case "Good":
      return "bg-green-100 text-green-800 border-green-300";
    case "Average":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Replace":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function BatteryCheckForm({
  isViewMode = false,
  data = null,
}: BatteryCheckFormProps) {
  const dispatch = useDispatch();

  // ────────────────────────────────────────────────
  // Editable mode: read from Redux
  // ────────────────────────────────────────────────
  const { condition, voltage, specificGravity, complaint } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.batteryCheck,
  );
  const errors = useSelector((state: RootState) => state.serviceEnquiry.errors);

  // ────────────────────────────────────────────────
  // View mode: use passed data
  // ────────────────────────────────────────────────
  const viewCondition = data?.condition;
  const viewVoltage = data?.voltage;
  const viewSpecificGravity = data?.specificGravity;
  const viewComplaint = data?.complaint;

  // ── Helper: calculate dynamic slider color (only used in edit mode) ───────
  const getSliderColor = (value: number, min: number, max: number): string => {
    const percentage = ((value - min) / (max - min)) * 100;
    const darkness = Math.floor((percentage / 100) * 155) + 100;
    return `rgb(${255 - darkness}, ${255 - darkness}, ${255 - darkness})`;
  };

  // ── Edit mode handlers ────────────────────────────────────────────────────
  const handleConditionChange = (value: BatteryCondition) => {
    dispatch(updateBatteryCheck({ condition: value }));
    if (errors["batteryCheck.condition"]) {
      dispatch(clearError({ field: "batteryCheck.condition" }));
    }
  };

  const handleVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      dispatch(updateBatteryCheck({ voltage: val }));
      if (errors["batteryCheck.voltage"]) {
        dispatch(clearError({ field: "batteryCheck.voltage" }));
      }
    }
  };

  const handleSpecificGravityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      dispatch(updateBatteryCheck({ specificGravity: val }));
      if (errors["batteryCheck.specificGravity"]) {
        dispatch(clearError({ field: "batteryCheck.specificGravity" }));
      }
    }
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateBatteryCheck({ complaint: e.target.value }));
  };

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 p-6 min-h-100">
      <div className="mx-auto max-w-3xl">
        {/* Back button – only in edit mode */}
        {!isViewMode && (
          <button
            onClick={() => dispatch(goToStep(1))}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Services</span>
          </button>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-8">
              Battery Check-Up
              {/* {isViewMode && data?.completedAt && (
                <span className="block text-xs text-gray-500 mt-1">
                  Completed: {new Date(data.completedAt).toLocaleString()}
                </span>
              )} */}
            </h2>

            {/* Voltage */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voltage <span className="text-red-500">*</span>
              </label>

              {isViewMode ? (
                <div className="text-lg font-semibold text-gray-900">
                  {viewVoltage != null ? `${viewVoltage} V` : "—"}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700"></span>
                    <input
                      type="number"
                      value={voltage ?? ""}
                      onChange={handleVoltageChange}
                      step="0.1"
                      className={`w-20 px-2 py-1 text-sm font-semibold text-gray-900 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-center ${
                        errors["batteryCheck.voltage"]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  <input
                    type="range"
                    min="11.5"
                    max="13.0"
                    step="0.1"
                    value={voltage ?? 12.25}
                    onChange={handleVoltageChange}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      accentColor: getSliderColor(voltage ?? 12.25, 11.5, 13.0),
                    }}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>11.5V</span>
                    <span>13.0V</span>
                  </div>
                  {errors["batteryCheck.voltage"] && (
                    <p className="text-red-500 text-xs mt-2 text-center">
                      {errors["batteryCheck.voltage"]}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Specific Gravity */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Gravity <span className="text-red-500">*</span>
              </label>

              {isViewMode ? (
                <div className="text-lg font-semibold text-gray-900">
                  {viewSpecificGravity != null
                    ? viewSpecificGravity.toFixed(3)
                    : "—"}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700"></span>
                    <input
                      type="number"
                      value={specificGravity ?? ""}
                      onChange={handleSpecificGravityChange}
                      step="0.01"
                      className={`w-20 px-2 py-1 text-sm font-semibold text-gray-900 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-center ${
                        errors["batteryCheck.specificGravity"]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.3"
                    step="0.01"
                    value={specificGravity ?? 1.15}
                    onChange={handleSpecificGravityChange}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      accentColor: getSliderColor(
                        specificGravity ?? 1.15,
                        1.0,
                        1.3,
                      ),
                    }}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>1.0</span>
                    <span>1.3</span>
                  </div>
                  {errors["batteryCheck.specificGravity"] && (
                    <p className="text-red-500 text-xs mt-2 text-center">
                      {errors["batteryCheck.specificGravity"]}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Battery Condition */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Battery Condition <span className="text-red-500">*</span>
              </h3>

              {isViewMode ? (
                <div
                  className={`inline-block px-5 py-2.5 rounded-full border text-base font-medium ${getConditionColor(
                    viewCondition,
                  )}`}
                >
                  {viewCondition || "Not recorded"}
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleConditionChange("Good")}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                      condition === "Good"
                        ? "border-teal-600 bg-teal-50 text-teal-700 shadow-sm"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Good
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConditionChange("Average")}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                      condition === "Average"
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700 shadow-sm"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Average
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConditionChange("Replace")}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                      condition === "Replace"
                        ? "border-red-600 bg-red-50 text-red-700 shadow-sm"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Replace
                  </button>
                </div>
              )}

              {!isViewMode && errors["batteryCheck.condition"] && (
                <p className="text-red-500 text-xs mt-3 text-center">
                  {errors["batteryCheck.condition"]}
                </p>
              )}
            </div>

            {/* Complaint / Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint / Notes
              </label>

              {isViewMode ? (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px] text-gray-800 whitespace-pre-wrap">
                  {viewComplaint?.trim() || "No notes provided"}
                </div>
              ) : (
                <textarea
                  placeholder="Enter any observations or issues..."
                  value={complaint ?? ""}
                  onChange={handleComplaintChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
