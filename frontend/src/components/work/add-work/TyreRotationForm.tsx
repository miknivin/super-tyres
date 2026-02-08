// src/components/work/add-work/TyreRotationForm.tsx
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  goToStep,
  updateTyreRotation,
} from "../../../redux/slices/serviceEnquiryFormSlice";
import FourTyreRotation from "../../../assets/services/rotation-types/4-tyre.jpeg";
import UnidirectionalRotation from "../../../assets/services/rotation-types/unidirectional.jpeg";
import FiveTyreRotation from "../../../assets/services/rotation-types/5tyre.jpeg";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type RotationType = "4-tyre" | "unidirectional" | "5-tyre" | null;

export interface TyreRotationInspectionData {
  rotationType?: RotationType | null;
  complaint?: string | null;
  completedAt?: string | null; // optional – can show if completed
}

interface TyreRotationFormProps {
  isViewMode?: boolean;
  data?: TyreRotationInspectionData | null;
}

// ────────────────────────────────────────────────
// Helper: get label for rotation type in view mode
// ────────────────────────────────────────────────
const getRotationLabel = (type: RotationType | null | undefined): string => {
  switch (type) {
    case "4-tyre":
      return "4 Tyre Rotation";
    case "unidirectional":
      return "Unidirectional Tyres";
    case "5-tyre":
      return "5 Tyre Rotation";
    default:
      return "Not selected";
  }
};

export default function TyreRotationForm({
  isViewMode = false,
  data = null,
}: TyreRotationFormProps) {
  const dispatch = useDispatch();

  // ────────────────────────────────────────────────
  // Edit mode: Redux state
  // ────────────────────────────────────────────────
  const { rotationType, complaint } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.tyreRotation,
  );

  // ────────────────────────────────────────────────
  // View mode: use passed data
  // ────────────────────────────────────────────────
  const viewRotationType = data?.rotationType;
  const viewComplaint = data?.complaint;

  // ── Edit mode handlers ────────────────────────────────────────────────────
  const handleRotationSelect = (type: RotationType) => {
    dispatch(updateTyreRotation({ rotationType: type }));
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateTyreRotation({ complaint: e.target.value }));
  };

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 p-6 min-h-[400px]">
      <div className="mx-auto max-w-4xl">
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

        {/* Tyre Rotation Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-8">
            Tyre Rotation
          </h2>

          {/* Rotation Type Selection / Display */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 text-center">
              Selected Rotation Pattern
            </h3>

            {isViewMode ? (
              <div className="max-w-xs mx-auto">
                <div
                  className={`flex flex-col items-center p-5 rounded-lg border-2 ${
                    viewRotationType
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {viewRotationType === "4-tyre" && (
                      <img
                        src={FourTyreRotation}
                        alt="4 Tyre Rotation"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {viewRotationType === "unidirectional" && (
                      <img
                        src={UnidirectionalRotation}
                        alt="Unidirectional Tyres"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {viewRotationType === "5-tyre" && (
                      <img
                        src={FiveTyreRotation}
                        alt="5 Tyre Rotation"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {!viewRotationType && (
                      <span className="text-gray-400 text-sm">
                        No pattern selected
                      </span>
                    )}
                  </div>
                  <span className="text-base font-medium text-gray-900">
                    {getRotationLabel(viewRotationType)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {/* 4 Tyre Rotation */}
                <button
                  type="button"
                  onClick={() => handleRotationSelect("4-tyre")}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    rotationType === "4-tyre"
                      ? "border-teal-600 bg-teal-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={FourTyreRotation}
                      alt="4 Tyre Rotation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">
                    4 Tyre Rotation
                  </span>
                </button>

                {/* Unidirectional Tyres */}
                <button
                  type="button"
                  onClick={() => handleRotationSelect("unidirectional")}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    rotationType === "unidirectional"
                      ? "border-teal-600 bg-teal-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={UnidirectionalRotation}
                      alt="Unidirectional Tyres"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">
                    Unidirectional Tyres
                  </span>
                </button>

                {/* 5 Tyre Rotation */}
                <button
                  type="button"
                  onClick={() => handleRotationSelect("5-tyre")}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    rotationType === "5-tyre"
                      ? "border-teal-600 bg-teal-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={FiveTyreRotation}
                      alt="5 Tyre Rotation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">
                    5 Tyre Rotation
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Complaint / Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint / Notes
            </label>

            {isViewMode ? (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px] text-gray-800 whitespace-pre-wrap">
                {viewComplaint?.trim() || "No complaints or notes provided"}
              </div>
            ) : (
              <textarea
                placeholder="Enter complaint/s related to tyre rotation"
                value={complaint ?? ""}
                onChange={handleComplaintChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
              />
            )}
          </div>

          {/* Optional action button – only in edit mode */}
          {!isViewMode && (
            <div className="flex justify-end mt-6">
              <button className="px-6 py-2.5 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors">
                Add complaint/s
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
