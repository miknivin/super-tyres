// src/components/work/add-work/TyreRotationForm.tsx

import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store"; // adjust path
import {
  goToStep,
  updateTyreRotation,
} from "../../../redux/slices/serviceEnquiryFormSlice";
import FourTyreRotation from "../../../assets/services/rotation-types/4-tyre.jpeg";
import UnidirectionalRotation from "../../../assets/services/rotation-types/unidirectional.jpeg";
import FiveTyreRotation from "../../../assets/services/rotation-types/5tyre.jpeg";
type RotationType = "4-tyre" | "unidirectional" | "5-tyre" | null;

export default function TyreRotationForm() {
  const dispatch = useDispatch();

  // Read data from Redux
  const { rotationType, complaint } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.tyreRotation,
  );

  // Handlers dispatch partial updates
  const handleRotationSelect = (type: RotationType) => {
    dispatch(updateTyreRotation({ rotationType: type }));
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateTyreRotation({ complaint: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Back Button (handled by layout) */}
        <button
          onClick={() => dispatch(goToStep(1))}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Services</span>
        </button>

        {/* Tyre Rotation Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
            Tyre Rotation
          </h2>

          {/* Rotation Type Selection */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 4 Tyre Rotation */}
            <button
              onClick={() => handleRotationSelect("4-tyre")}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                rotationType === "4-tyre"
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <img src={FourTyreRotation} alt="" />
              </div>
              <span className="text-xs text-gray-700 font-medium text-center">
                4 Tyre Rotation
              </span>
            </button>

            {/* Unidirectional Tyres */}
            <button
              onClick={() => handleRotationSelect("unidirectional")}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                rotationType === "unidirectional"
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <img src={UnidirectionalRotation} alt="" />
              </div>
              <span className="text-xs text-gray-700 font-medium text-center">
                Unidirectional Tyres
              </span>
            </button>

            {/* 5 Tyre Rotation */}
            <button
              onClick={() => handleRotationSelect("5-tyre")}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                rotationType === "5-tyre"
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <img src={FiveTyreRotation} alt="" />
              </div>
              <span className="text-xs text-gray-700 font-medium text-center">
                5 Tyre Rotation
              </span>
            </button>
          </div>

          {/* Complaint Text Area */}
          <div className="mb-4">
            <textarea
              placeholder="Enter complaint/s related to tyre rotation"
              value={complaint}
              onChange={handleComplaintChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Optional: You can keep this button for UX, but data is already saved live */}
          <div className="flex justify-end">
            <button className="px-6 py-2.5 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors">
              Add complaint/s
            </button>
          </div>
        </div>

        {/* Back/Next buttons are handled by ServiceLayout – no need to duplicate */}
      </div>
    </div>
  );
}
