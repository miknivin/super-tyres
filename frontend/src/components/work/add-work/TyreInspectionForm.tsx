// src/components/work/add-work/TyreInspectionForm.tsx

import { Minus, Plus, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store"; // adjust path according to your structure
import {
  clearError,
  goToStep,
  updateTyreInspection,
} from "../../../redux/slices/serviceEnquiryFormSlice"; // adjust path

// ── Type definition ────────────────────────────────────────────────────────
export type TyrePosition =
  | "frontLeft"
  | "frontRight"
  | "rearLeft"
  | "rearRight"
  | null;

export default function TyreInspectionForm() {
  const dispatch = useDispatch();

  // Get current form data from Redux
  const { selectedTyre, tyres, selectedComplaints, customComplaint } =
    useSelector((state: RootState) => state.serviceEnquiry.data.tyreInspection);
  const errors = useSelector((state: RootState) => state.serviceEnquiry.errors);
  // Get values for currently selected tyre (fallback to defaults if not set)
  const currentValues = selectedTyre ? tyres[selectedTyre] : null;

  const treadDepth = currentValues?.treadDepth ?? "Good";
  const tyrePressure = currentValues?.tyrePressure ?? 33;

  // ── Helper to update the currently selected tyre's values ──────────────────
  const updateCurrentTyre = (
    updates: Partial<{
      treadDepth: "Good" | "Average" | "Replace";
      tyrePressure: number;
    }>,
  ) => {
    if (selectedTyre) {
      dispatch(updateTyreInspection({ tyre: selectedTyre, values: updates }));
      const tyreKey = `tyreInspection.tyres.${selectedTyre}`;
      if (errors[tyreKey]) {
        dispatch(clearError({ field: tyreKey }));
      }
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectTyre = (position: TyrePosition) => {
    dispatch(updateTyreInspection({ selectedTyre: position }));
  };

  const handleToggleComplaint = (complaint: string) => {
    const updated = selectedComplaints.includes(complaint)
      ? selectedComplaints.filter((c) => c !== complaint)
      : [...selectedComplaints, complaint];

    dispatch(updateTyreInspection({ selectedComplaints: updated }));
  };

  const handleCustomComplaintChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(updateTyreInspection({ customComplaint: e.target.value }));
  };

  const complaintsList = [
    "Irregular wear",
    "Cup/Damage",
    "Run Flat mark",
    "Damage/Bulge",
    "Puncture",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        {/* Back button – optional (ServiceLayout usually handles navigation) */}
        <button
          onClick={() => dispatch(goToStep(1))}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back to Services</span>
        </button>

        {/* ── Car view + tyre selection ────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6 border border-gray-100">
          <div className="relative max-w-120 mx-auto">
            <img
              src="https://ik.imagekit.io/c1jhxlxiy/Screenshot_2026-01-22_235620-removebg-preview.png"
              alt="Car top view"
              className="w-full h-auto object-contain"
            />

            {/* Checkboxes on tyres */}
            <div className="absolute top-[14%] left-[9%]">
              <input
                type="checkbox"
                checked={selectedTyre === "frontLeft"}
                onChange={() => handleSelectTyre("frontLeft")}
                className="w-5 h-5 accent-teal-600 cursor-pointer"
              />
            </div>
            <div className="absolute top-[14%] right-[9%]">
              <input
                type="checkbox"
                checked={selectedTyre === "frontRight"}
                onChange={() => handleSelectTyre("frontRight")}
                className="w-5 h-5 accent-teal-600 cursor-pointer"
              />
            </div>
            <div className="absolute bottom-[14%] left-[9%]">
              <input
                type="checkbox"
                checked={selectedTyre === "rearLeft"}
                onChange={() => handleSelectTyre("rearLeft")}
                className="w-5 h-5 accent-teal-600 cursor-pointer"
              />
            </div>
            <div className="absolute bottom-[14%] right-[9%]">
              <input
                type="checkbox"
                checked={selectedTyre === "rearRight"}
                onChange={() => handleSelectTyre("rearRight")}
                className="w-5 h-5 accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Tyre position buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {(
              ["frontLeft", "frontRight", "rearLeft", "rearRight"] as const
            ).map((pos) => (
              <button
                key={pos}
                onClick={() => handleSelectTyre(pos)}
                className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  selectedTyre === pos
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pos
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tyre-specific inspection fields ──────────────────────────────── */}
        {selectedTyre ? (
          <div className="space-y-6">
            {/* Tread Depth */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Tread Depth –{" "}
                {selectedTyre
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .toUpperCase()}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["Good", "Average", "Replace"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateCurrentTyre({ treadDepth: status })}
                    className={`py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                      treadDepth === status
                        ? status === "Good"
                          ? "border-teal-600 bg-teal-50 text-teal-700 shadow-sm"
                          : status === "Average"
                            ? "border-yellow-500 bg-yellow-50 text-yellow-700 shadow-sm"
                            : "border-red-600 bg-red-50 text-red-700 shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              {errors[`tyreInspection.tyres.${selectedTyre}`] && (
                <p className="text-red-500 text-xs mt-3 text-center">
                  {errors[`tyreInspection.tyres.${selectedTyre}`]}
                </p>
              )}
            </div>

            {/* Tyre Pressure */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Tyre Pressure –{" "}
                {selectedTyre
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .toUpperCase()}{" "}
                (PSI)
              </h3>
              <div className="flex items-center justify-center sm:justify-start gap-5">
                <button
                  onClick={() =>
                    updateCurrentTyre({
                      tyrePressure: Math.max(0, tyrePressure - 1),
                    })
                  }
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Decrease pressure"
                >
                  <Minus size={20} className="text-gray-700" />
                </button>

                <div className="text-center min-w-20">
                  <div className="text-3xl font-bold text-gray-900">
                    {tyrePressure}
                  </div>
                  <div className="text-sm text-gray-500">PSI</div>
                </div>

                <button
                  onClick={() =>
                    updateCurrentTyre({ tyrePressure: tyrePressure + 1 })
                  }
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Increase pressure"
                >
                  <Plus size={20} className="text-gray-700" />
                </button>
              </div>
              {errors[`tyreInspection.tyres.${selectedTyre}.tyrePressure`] && (
                <p className="text-red-500 text-xs mt-3 text-center">
                  {errors[`tyreInspection.tyres.${selectedTyre}.tyrePressure`]}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-800">
            Please select a tyre position to inspect
          </div>
        )}

        {/* ── Complaints (global for the inspection) ────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Complaints / Observations
          </h3>

          <input
            type="text"
            placeholder="Enter additional notes (optional)"
            value={customComplaint}
            onChange={handleCustomComplaintChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />

          <div className="flex flex-wrap gap-2.5 mb-5">
            {complaintsList.map((item) => (
              <button
                key={item}
                onClick={() => handleToggleComplaint(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedComplaints.includes(item)
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
