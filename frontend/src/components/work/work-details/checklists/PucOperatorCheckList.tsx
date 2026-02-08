// src/components/checklists/PUCOperatorChecklist.tsx
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import InfoCard from "../../../shared/InfoCard";
import { useChecklistForm } from "../../../../hooks/useChecklistForm";

// Type for this checklist's items
interface PUCChecklistItems {
  engineWarmed: boolean;
  probeInsertedCorrectly: boolean;
  certificatePrintedAndUploaded: boolean;
}

// Props from parent
interface PUCOperatorChecklistProps {
  enquiryId: string;
}

const PUCOperatorChecklist: React.FC<PUCOperatorChecklistProps> = ({
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
  } = useChecklistForm<PUCChecklistItems>({
    enquiryId,
    checklistType: "puc-operator-checklist",

    initialState: {
      engineWarmed: false,
      probeInsertedCorrectly: false,
      certificatePrintedAndUploaded: false,
    },

    fieldMapping: {
      engineWarmed: "engineWarmed",
      probeInsertedCorrectly: "probeInsertedCorrectly",
      certificatePrintedAndUploaded: "certificatePrintedAndUploaded",
    },

    onSuccessNavigate: true,
  });

  // Unified loading state (enquiry OR checklist)
  if (isEnquiryLoading || isChecklistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading PUC details...</div>
      </div>
    );
  }

  // Unified error state
  if (isEnquiryError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-red-600 text-center">
          Failed to load PUC details
        </div>
      </div>
    );
  }

  // No data guard (if enquiry is null after loading)
  if (!enquiry) return null;

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

        {/* Vehicle info – now comes from hook */}
        <InfoCard
          vehicleNumber={enquiry.vehicleNo}
          customerName={enquiry.customerName}
          phoneNumber={enquiry.customerPhone}
          distance={enquiry.odometer ? `${enquiry.odometer} km` : "N/A"}
          status={enquiry.status}
          currentStep={3}
          totalSteps={5}
        />

        {/* Checklist section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-center text-gray-900 font-semibold text-lg mb-6">
            PUC Operator Checklist
          </h2>

          {/* Toggle switches */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Engine Warmed</span>
              <button
                type="button"
                onClick={() => toggleItem("engineWarmed")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.engineWarmed ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.engineWarmed ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">
                Probe inserted Correctly
              </span>
              <button
                type="button"
                onClick={() => toggleItem("probeInsertedCorrectly")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.probeInsertedCorrectly
                    ? "bg-teal-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.probeInsertedCorrectly
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">
                Certificate Printed & Uploaded
              </span>
              <button
                type="button"
                onClick={() => toggleItem("certificatePrintedAndUploaded")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formState.certificatePrintedAndUploaded
                    ? "bg-teal-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formState.certificatePrintedAndUploaded
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

export default PUCOperatorChecklist;
