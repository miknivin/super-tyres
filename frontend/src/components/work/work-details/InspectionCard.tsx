/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/work/InspectionCard.tsx
import React, { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import BatteryCheckForm from "../add-work/BatteryCheckForm";
import OilCheckForm from "../add-work/OilCheckForm";
import TyreRotationForm from "../add-work/TyreRotationForm";
import Modal from "../../ui/Modal";
import { useLazyGetInspectionSummaryByEnquiryIdQuery } from "../../../redux/api/servicesApi";

// ────────────────────────────────────────────────
// Mapping: code → title + component
// The code itself is used as the backend inspection type
// ────────────────────────────────────────────────
const inspectionViewMap: Record<
  string,
  {
    title: string;
    component: React.ComponentType<{ isViewMode?: boolean; data?: any }>;
  }
> = {
  "battery-check": {
    title: "Battery Checkup Details",
    component: BatteryCheckForm,
  },
  "oil-check": {
    title: "Oil Checkup Details",
    component: OilCheckForm,
  },
  "tyre-rotation": {
    title: "Tyre Rotation Inspection Details",
    component: TyreRotationForm,
  },
};

interface InspectionCardProps {
  imageUrl?: string;
  title: string;
  status: string;
  code: string; // e.g. "battery-check", "oil-check", "tyre-rotation"
  enquiryId: string;
}

const InspectionCard = ({
  imageUrl,
  title,
  status,
  code,
  enquiryId,
}: InspectionCardProps) => {
  const [fetchInspection, { data: inspectionData, isLoading, isError, error }] =
    useLazyGetInspectionSummaryByEnquiryIdQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const normalizedCode = code.toLowerCase();
  const viewConfig = inspectionViewMap[normalizedCode];

  // If the code doesn't match any known inspection → don't render
  if (!viewConfig) {
    console.warn(`No view configuration found for inspection code: ${code}`);
    return null;
  }

  const ViewComponent = viewConfig.component;

  const handleViewClick = () => {
    setIsModalOpen(true);

    fetchInspection({
      enquiryId,
      type: normalizedCode, 
    });
  };

  return (
    <>
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow">
        <div className="flex items-center gap-4">
          {/* Image / Placeholder */}
          <div className="w-20 h-20 shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                className="w-full h-full object-cover rounded"
                alt={title}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
            <p className="text-sm text-gray-600 mb-3">{status}</p>

            <button
              onClick={handleViewClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              View Details
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={viewConfig.title}

      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
            <span className="text-gray-600 font-medium">
              Loading inspection data...
            </span>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-600">
            <p className="font-medium text-lg mb-2">Failed to load details</p>
            <p className="text-sm">
              {(error as any)?.data?.message || "Please try again later."}
            </p>
          </div>
        ) : inspectionData ? (
          <ViewComponent isViewMode={true} data={inspectionData} />
        ) : (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg font-medium">No inspection data found</p>
            <p className="text-sm mt-2">
              This inspection may not have been completed yet.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default InspectionCard;
