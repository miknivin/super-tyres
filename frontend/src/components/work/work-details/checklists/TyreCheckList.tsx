
// src/components/checklists/TyreChecklist.tsx
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import InfoCard from "../../../shared/InfoCard";
import { useChecklistForm } from "../../../../hooks/useChecklistForm";

// Type for this checklist's items
interface TyreChecklistItems {
  correctTyreSizeVerified: boolean;
  noBeadSidewallDamage: boolean;
  correctInflation: boolean;
  wheelNutsTorqued: boolean;
}

// Props from parent (ChecklistIndex)
interface TyreChecklistProps {
  enquiryId: string;
}

const TyreChecklist: React.FC<TyreChecklistProps> = ({ enquiryId }) => {
  const {
    formState,
    technicianNotes,
    setTechnicianNotes,
    toggleItem,
    submitChecklist,
    isSubmitting,
    isChecklistLoading,
    isEnquiryLoading,
    isEnquiryError,
    enquiry,
  } = useChecklistForm<TyreChecklistItems>({
    enquiryId,
    checklistType: "tyre-technician-checklist",

    // Default / empty state
    initialState: {
      correctTyreSizeVerified: false,
      noBeadSidewallDamage: false,
      correctInflation: false,
      wheelNutsTorqued: false,
    },

    // Mapping: local state key → backend response field name
    fieldMapping: {
      correctTyreSizeVerified: "correctTyreSizeVerified",
      noBeadSidewallDamage: "noBeadSidewallDamage",
      correctInflation: "correctInflation",
      wheelNutsTorqued: "wheelNutsTorqued",
    },

    // Optional: change to false if you don't want auto-navigation on success
    onSuccessNavigate: true,
  });

  // ────────────────────────────────────────────────
  // Loading / Error states
  // ────────────────────────────────────────────────
  if (isChecklistLoading || isEnquiryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading tyre checklist...</div>
      </div>
    );
  }

  if ( isEnquiryError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-red-600 text-center">
          Failed to load tyre checklist
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          to={`/work/${enquiryId}`}
          className="flex items-center mb-6 text-teal-600 hover:text-teal-700"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back to Enquiry</span>
        </Link>

        {/* Vehicle info card – assuming you fetch it separately */}
        {enquiry && (
          <InfoCard
            vehicleNumber={enquiry.vehicleNo}
            customerName={enquiry.customerName}
            phoneNumber={enquiry.customerPhone}
            distance={enquiry.odometer ? `${enquiry.odometer} km` : "N/A"}
            status={enquiry.status}
            currentStep={3}
            totalSteps={5}
          />
        )}

        {/* Checklist section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-center text-gray-900 font-semibold text-lg mb-6">
            Tyre Checklist
          </h2>

          {/* Toggle switches */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Correct tyre size</span>
              <button
                type="button"
                onClick={() => toggleItem("correctTyreSizeVerified")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.correctTyreSizeVerified ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.correctTyreSizeVerified
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">
                No bead / sidewall damage
              </span>
              <button
                type="button"
                onClick={() => toggleItem("noBeadSidewallDamage")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.noBeadSidewallDamage ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.noBeadSidewallDamage ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Correct inflation</span>
              <button
                type="button"
                onClick={() => toggleItem("correctInflation")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.correctInflation ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.correctInflation
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">
                Wheel nut torque correct
              </span>
              <button
                type="button"
                onClick={() => toggleItem("wheelNutsTorqued")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.wheelNutsTorqued ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.wheelNutsTorqued ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Complaints textarea */}
          <div className="mb-6">
            <textarea
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              placeholder="Enter complaint/s..."
              className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={submitChecklist}
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TyreChecklist;
