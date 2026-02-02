/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/VehicleServiceAndChecklist.tsx
import { useParams } from "react-router-dom";
import { useGetServiceEnquiryChecklistsQuery } from "../../../redux/api/servicesApi";
import ChecklistCard from "./ChecklistCard";
import SearchFilter from "./SearchFilter";
import VehicleDetailsCard from "./VehicleDetailsCard";

// ────────────────────────────────────────────────
// Service image mapping – from your Services2.csv
// ────────────────────────────────────────────────
const serviceImageMap: Record<string, string> = {
  TYRE_INSPECT: "/assets/services/tyre-inspection.jpeg",
  TYRE_ROT: "/assets/services/tyre-rotation.jpeg",
  ALIGNMENT: "/assets/services/alignment.jpeg",
  BALANCING: "/assets/services/balancing.jpeg",
  PUC: "/assets/services/puc.jpeg",
  CAR_WASH: "/assets/services/car-wash.jpeg",
  // Add BATTERY_CHECK, OIL_CHECK, etc. when needed
};

// ────────────────────────────────────────────────
// Logical checklist groups (business rules)
// Each group maps to ONE card
// ────────────────────────────────────────────────
const checklistGroups: Record<
  string, // group key
  {
    title: string;
    imageCode: string; // which service image to use
    requiredCodes: string[]; // which service codes trigger this checklist
    status: string;
    code: string;
    progress: number;
  }
> = {
  TYRE: {
    title: "Tyre Technician checklist",
    imageCode: "TYRE_INSPECT", // use tyre inspection image
    requiredCodes: ["TYRE_INSPECT", "TYRE_ROT"],
    status: "Pending",
    code: "tyre-technician-checklist",
    progress: 25,
  },
  ALIGNMENT: {
    title: "Alignment Technician checklist",
    imageCode: "ALIGNMENT",
    requiredCodes: ["ALIGNMENT"],
    status: "Pending",
    code: "alignment-technician-checklist",
    progress: 25,
  },
  BALANCING: {
    title: "Balancing Technician checklist",
    imageCode: "BALANCING",
    requiredCodes: ["BALANCING"],
    status: "Pending",
    code: "Balancing-technician-checklist",
    progress: 50,
  },
  PUC: {
    title: "PUC Operator checklist",
    imageCode: "PUC",
    requiredCodes: ["PUC"],
    code: "PUC-Operator-checklist",
    status: "Pending",
    progress: 25,
  },
  CAR_WASH: {
    title: "Car Wash checklist",
    imageCode: "CAR_WASH",
    requiredCodes: ["CAR_WASH"],
    code: "car-wash-checklist",
    status: "Pending",
    progress: 25,
  },
  // Add more groups if you have BATTERY_CHECK, OIL_CHECK, etc.
};

const VehicleServiceAndChecklist = () => {
  const { id: enquiryId } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } =
    useGetServiceEnquiryChecklistsQuery(enquiryId!, { skip: !enquiryId });

  // ────────────────────────────────────────────────
  // Build unique checklist cards based on selected codes
  // ────────────────────────────────────────────────
  const selectedCodes = new Set(data?.selectedServiceCodes || []);

  const checklistData = Object.entries(checklistGroups)
    .filter(([_, group]) =>
      group.requiredCodes.some((code) => selectedCodes.has(code)),
    )
    .map(([groupKey, group]) => ({
      id: groupKey,
      title: group.title,
      status: group.status,
      code: group.code,
      progress: group.progress,
      imageUrl:
        serviceImageMap[group.imageCode] || "/assets/placeholder-service.jpg",
    }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-3xl mx-auto p-6">
        <div className="text-center py-12">Loading checklists...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-3xl mx-auto p-6">
        <div className="text-center py-12 text-red-600">
          Error loading checklists:{" "}
          {(error as any)?.data?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-3xl mx-auto">
      <SearchFilter />

      <div className="p-4">
        <VehicleDetailsCard
          vehicleNumber="KL 57 M 8478"
          name="Mirshad"
          phone="+91 807 812 345"
          distance="25.9400 km"
          step="3 of 5"
          status="Awaiting approval"
        />

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Vehicle Service Checklist
          </h2>

          {enquiryId && checklistData.length > 0 ? (
            checklistData.map((item) => (
              <ChecklistCard
                key={item.id}
                imageUrl={item.imageUrl}
                title={item.title}
                enquiryId={enquiryId}
                code={item.code}
                status={item.status}
                progress={item.progress}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No checklists required for the selected services
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleServiceAndChecklist;
