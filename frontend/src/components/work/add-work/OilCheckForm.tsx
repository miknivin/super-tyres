// src/components/work/add-work/OilCheckForm.tsx
import { ChevronLeft, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  goToStep,
  updateOilCheckUp,
  clearError,
} from "../../../redux/slices/serviceEnquiryFormSlice";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
export type OilQuality = "Good" | "Average" | "Replace" | null;
export type OilLevel = "Max" | "Normal" | "Min" | "Immediately Fill" | null;

export interface OilInspectionData {
  quality?: OilQuality | null;
  level?: OilLevel | null;
  complaint?: string | null;
  completedAt?: string | null; // optional – can show timestamp if available
}

interface OilCheckFormProps {
  isViewMode?: boolean;
  data?: OilInspectionData | null;
}

// ────────────────────────────────────────────────
// Helper: color for quality badge
// ────────────────────────────────────────────────
const getQualityColor = (quality: OilQuality | null | undefined) => {
  if (!quality) return "bg-gray-100 text-gray-700 border-gray-300";
  switch (quality) {
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

// ────────────────────────────────────────────────
// Helper: color for level indicator
// ────────────────────────────────────────────────
const getLevelColor = (level: OilLevel | null | undefined) => {
  if (!level) return "bg-gray-100 text-gray-700";
  switch (level) {
    case "Max":
      return "bg-teal-100 text-teal-800";
    case "Normal":
      return "bg-green-100 text-green-800";
    case "Min":
      return "bg-yellow-100 text-yellow-800";
    case "Immediately Fill":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function OilCheckForm({
  isViewMode = false,
  data = null,
}: OilCheckFormProps) {
  const dispatch = useDispatch();

  // ────────────────────────────────────────────────
  // Edit mode: Redux state
  // ────────────────────────────────────────────────
  const { quality, level, complaint } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.oilCheckUp,
  );
  const customer = useSelector(
    (state: RootState) => state.serviceEnquiry.data.customer,
  );
  const errors = useSelector((state: RootState) => state.serviceEnquiry.errors);

  // ────────────────────────────────────────────────
  // View mode: use passed data
  // ────────────────────────────────────────────────
  const viewQuality = data?.quality;
  const viewLevel = data?.level;
  const viewComplaint = data?.complaint;

  // ── Edit mode handlers ────────────────────────────────────────────────────
  const handleQualityChange = (value: OilQuality) => {
    dispatch(updateOilCheckUp({ quality: value }));
    if (errors["oilCheckUp.quality"]) {
      dispatch(clearError({ field: "oilCheckUp.quality" }));
    }
  };

  const handleLevelChange = (value: OilLevel) => {
    dispatch(updateOilCheckUp({ level: value }));
    if (errors["oilCheckUp.level"]) {
      dispatch(clearError({ field: "oilCheckUp.level" }));
    }
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateOilCheckUp({ complaint: e.target.value }));
  };

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

        {/* Vehicle & Customer Info – ONLY in edit mode */}
        {!isViewMode && (
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
                      {customer.odometer
                        ? `${customer.odometer} km`
                        : "Not Set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Oil Check-Up Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-8">
            Oil Check-Up
            {/* {isViewMode && data?.completedAt && (
              <span className="block text-xs text-gray-500 mt-1">
                Completed: {new Date(data.completedAt).toLocaleString()}
              </span>
            )} */}
          </h2>

          {/* Oil Quality */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quality <span className="text-red-500">*</span>
            </h3>

            {isViewMode ? (
              <div
                className={`inline-block px-6 py-3 rounded-full border text-base font-medium ${getQualityColor(
                  viewQuality,
                )}`}
              >
                {viewQuality || "Not recorded"}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleQualityChange("Good")}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    quality === "Good"
                      ? "border-teal-600 bg-teal-50 text-teal-700 shadow-sm"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Good
                </button>
                <button
                  type="button"
                  onClick={() => handleQualityChange("Average")}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    quality === "Average"
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700 shadow-sm"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Average
                </button>
                <button
                  type="button"
                  onClick={() => handleQualityChange("Replace")}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    quality === "Replace"
                      ? "border-red-600 bg-red-50 text-red-700 shadow-sm"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Replace
                </button>
              </div>
            )}

            {!isViewMode && errors["oilCheckUp.quality"] && (
              <p className="text-red-500 text-xs mt-3 text-center">
                {errors["oilCheckUp.quality"]}
              </p>
            )}
          </div>

          {/* Oil Level */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Oil Level <span className="text-red-500">*</span>
            </h3>

            {isViewMode ? (
              <div
                className={`inline-block px-6 py-3 rounded-full border text-base font-medium ${getLevelColor(
                  viewLevel,
                )}`}
              >
                {viewLevel || "Not recorded"}
              </div>
            ) : (
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
                  <span className="text-sm text-gray-700">
                    Immediately Fill
                  </span>
                </label>
              </div>
            )}

            {!isViewMode && errors["oilCheckUp.level"] && (
              <p className="text-red-500 text-xs mt-3 text-center">
                {errors["oilCheckUp.level"]}
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
  );
}
