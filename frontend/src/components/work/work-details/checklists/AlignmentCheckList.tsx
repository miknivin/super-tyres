// src/components/checklists/AlignmentChecklist.tsx
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import InfoCard from "../../../shared/InfoCard";
import { useChecklistForm } from "../../../../hooks/useChecklistForm";

// Type for this checklist's items (matches backend AlignmentChecklistRecord)
interface AlignmentChecklistItems {
  suspensionChecked: boolean;
  steeringCentered: boolean;
  beforeAfterReportPrinted: boolean;
}

// Props from parent (ChecklistIndex)
interface AlignmentChecklistProps {
  enquiryId: string;
}

const AlignmentChecklist: React.FC<AlignmentChecklistProps> = ({
  enquiryId,
}) => {
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
  } = useChecklistForm<AlignmentChecklistItems>({
    enquiryId,
    checklistType: "alignment-technician-checklist",

    initialState: {
      suspensionChecked: false,
      steeringCentered: false,
      beforeAfterReportPrinted: false,
    },

    fieldMapping: {
      suspensionChecked: "suspensionChecked",
      steeringCentered: "steeringCentered",
      beforeAfterReportPrinted: "beforeAfterReportPrinted",
    },

    onSuccessNavigate: true,
  });

  if (isChecklistLoading || isEnquiryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading alignment checklist...</div>
      </div>
    );
  }

  if (isEnquiryError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-red-600 text-center">
          Failed to load alignment checklist
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

        {/* Vehicle info card – replace with real data fetch if needed */}
        <InfoCard
          vehicleNumber={enquiry?.vehicleNo ?? "KL 07 DA 932"}
          customerName={enquiry?.customerName ?? "Nivin"}
          phoneNumber={enquiry?.customerPhone ?? "+91 9497505820"}
          distance={enquiry?.odometer ? `${enquiry.odometer} km` : "N/A"}
          status={enquiry?.status ?? "Pending"}
          currentStep={3}
          totalSteps={5}
        />

        {/* Checklist section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-center text-gray-900 font-semibold text-lg mb-6">
            Alignment Checklist
          </h2>

          {/* Toggle switches */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Suspension Checked</span>
              <button
                type="button"
                onClick={() => toggleItem("suspensionChecked")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.suspensionChecked ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.suspensionChecked
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Steering Centred</span>
              <button
                type="button"
                onClick={() => toggleItem("steeringCentered")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.steeringCentered ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.steeringCentered
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">
                Before/After Reporting Printed
              </span>
              <button
                type="button"
                onClick={() => toggleItem("beforeAfterReportPrinted")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.beforeAfterReportPrinted
                    ? "bg-teal-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.beforeAfterReportPrinted
                      ? "translate-x-6"
                      : "translate-x-1"
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

          {/* Submit button – uses hook's submitChecklist */}
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

export default AlignmentChecklist;
