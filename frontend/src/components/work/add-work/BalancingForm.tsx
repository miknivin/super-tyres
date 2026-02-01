// src/components/work/add-work/BalancingForm.tsx
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  goToStep,
  updateBalancing,
  clearError,
} from "../../../redux/slices/serviceEnquiryFormSlice";
import balancing from "../../../assets/services/balancing-illustration.png";

export default function BalancingForm() {
  const dispatch = useDispatch();

  // ────────────────────────────────────────────────
  // Read data & errors from Redux
  // ────────────────────────────────────────────────
  const { weights, complaint } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.balancing,
  );

  const errors = useSelector((state: RootState) => state.serviceEnquiry.errors);

  // ── Helper to update weights ───────────────────────────────────────────────
  const handleWeightChange = (
    position: "frontLeft" | "frontRight" | "rearLeft" | "rearRight",
    value: string,
  ) => {
    const numValue = value === "" ? undefined : Number(value);

    dispatch(
      updateBalancing({
        weights: {
          ...weights,
          [position]: numValue,
        },
      }),
    );

    // Clear error for this weight field on change
    const errorKey = `balancing.weights.${position}`;
    if (errors[errorKey]) {
      dispatch(clearError({ field: errorKey }));
    }
  };

  // ── Helper to update complaint (optional field – no validation) ────────────
  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateBalancing({ complaint: e.target.value }));

    // Optional: clear any future complaint error if added later
    if (errors["balancing.complaint"]) {
      dispatch(clearError({ field: "balancing.complaint" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
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
            <img
              className="w-full"
              src={balancing}
              alt="Balancing illustration"
            />
          </div>
        </div>

        {/* Balancing Weights Section – mandatory */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Balancing Weights (gm)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {/* Front Left */}
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">
                Front Left <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={weights.frontLeft ?? ""}
                onChange={(e) =>
                  handleWeightChange("frontLeft", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center ${
                  errors["balancing.weights.frontLeft"]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors["balancing.weights.frontLeft"] && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  {errors["balancing.weights.frontLeft"]}
                </p>
              )}
            </div>

            {/* Front Right */}
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">
                Front Right <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={weights.frontRight ?? ""}
                onChange={(e) =>
                  handleWeightChange("frontRight", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center ${
                  errors["balancing.weights.frontRight"]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors["balancing.weights.frontRight"] && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  {errors["balancing.weights.frontRight"]}
                </p>
              )}
            </div>

            {/* Rear Left */}
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">
                Rear Left <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={weights.rearLeft ?? ""}
                onChange={(e) => handleWeightChange("rearLeft", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center ${
                  errors["balancing.weights.rearLeft"]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors["balancing.weights.rearLeft"] && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  {errors["balancing.weights.rearLeft"]}
                </p>
              )}
            </div>

            {/* Rear Right */}
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">
                Rear Right <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={weights.rearRight ?? ""}
                onChange={(e) =>
                  handleWeightChange("rearRight", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center ${
                  errors["balancing.weights.rearRight"]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors["balancing.weights.rearRight"] && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  {errors["balancing.weights.rearRight"]}
                </p>
              )}
            </div>
          </div>

          {/* Complaint / Notes – NOT mandatory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint / Notes{" "}
              <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <textarea
              placeholder="Enter any complaints or observations..."
              value={complaint}
              onChange={handleComplaintChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
            />
            {/* No error display here – field is optional */}
          </div>
        </div>

        {/* No Back/Next buttons here – handled by ServiceLayout */}
      </div>
    </div>
  );
}
