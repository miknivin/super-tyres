/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/work/VehicleServiceAndChecklist.tsx
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetServiceEnquiryByIdQuery,
  useGetServiceEnquiryChecklistsQuery,
  type ServiceEnquiryChecklistsResponse,
  useCompleteServiceEnquiryMutation,
} from "../../../redux/api/servicesApi";
import ChecklistCard from "./ChecklistCard";
import InspectionCard from "./InspectionCard";
import SearchFilter from "./SearchFilter";
import VehicleDetailsCard from "./VehicleDetailsCard";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import toast from "react-hot-toast";

// Service image mapping
const serviceImageMap: Record<string, string> = {
  TYRE_INSPECT: "/assets/services/tyre-inspection.jpeg",
  TYRE_ROT: "/assets/services/tyre-rotation.jpeg",
  ALIGNMENT: "/assets/services/alignment.jpeg",
  BALANCING: "/assets/services/balancing.jpeg",
  PUC: "/assets/services/puc.jpeg",
  CAR_WASH: "/assets/services/car-wash.jpeg",
  BATTERY_CHECK: "/assets/services/battery-checkup.jpeg",
  OIL_CHECK: "/assets/services/oil-check.jpeg",
};

// Checklist groups (only services with checklists)
const checklistGroups: Record<
  string,
  {
    title: string;
    imageCode: string;
    requiredCodes: string[];
    code: string;
    checklistKey: keyof ServiceEnquiryChecklistsResponse;
  }
> = {
  TYRE: {
    title: "Tyre Technician checklist",
    imageCode: "TYRE_INSPECT",
    requiredCodes: ["TYRE_INSPECT", "TYRE_ROT"],
    code: "tyre-technician-checklist",
    checklistKey: "tyreChecklist",
  },
  ALIGNMENT: {
    title: "Alignment Technician checklist",
    imageCode: "ALIGNMENT",
    requiredCodes: ["ALIGNMENT"],
    code: "alignment-technician-checklist",
    checklistKey: "alignmentChecklist",
  },
  BALANCING: {
    title: "Balancing Technician checklist",
    imageCode: "BALANCING",
    requiredCodes: ["BALANCING"],
    code: "balancing-technician-checklist",
    checklistKey: "balancingChecklist",
  },
  PUC: {
    title: "PUC Operator checklist",
    imageCode: "PUC",
    requiredCodes: ["PUC"],
    code: "puc-operator-checklist",
    checklistKey: "pucChecklist",
  },
  CAR_WASH: {
    title: "Car Wash checklist",
    imageCode: "CAR_WASH",
    requiredCodes: ["CAR_WASH"],
    code: "car-wash-checklist",
    checklistKey: "carWashChecklist",
  },
};

// Inspection-only services (no checklist, only view)
const inspectionOnlyGroups: Record<
  string,
  {
    title: string;
    imageCode: string;
    code: string;
  }
> = {
  BATTERY_CHECK: {
    title: "Battery Check",
    imageCode: "BATTERY_CHECK",
    code: "battery-check",
  },
  OIL_CHECK: {
    title: "Oil Check",
    imageCode: "OIL_CHECK",
    code: "oil-check",
  },
  TYRE_ROT: {
    title: "Tyre Rotation",
    imageCode: "TYRE_ROT",
    code: "tyre-rotation",
  },
};

const calculateProgress = (checklist: Record<string, any> | null): number => {
  if (!checklist) return 0;
  const booleanValues = Object.values(checklist).filter(
    (value) => typeof value === "boolean",
  );
  if (booleanValues.length === 0) return 0;
  const completed = booleanValues.filter(Boolean).length;
  return Math.round((completed / booleanValues.length) * 100);
};

const isChecklistObject = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const VehicleServiceAndChecklist = () => {
  const navigate = useNavigate();
  const { id: enquiryId } = useParams<{ id: string }>();

  // Get enquiry & checklists
  const {
    data: enquiry,
    isLoading: enquiryLoading,
    isError: enquiryError,
  } = useGetServiceEnquiryByIdQuery(enquiryId!, { skip: !enquiryId });

  const {
    data: checklists,
    isLoading: checklistsLoading,
    isError: checklistsError,
  } = useGetServiceEnquiryChecklistsQuery(enquiryId!, { skip: !enquiryId });

  // Get current user role from auth slice
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  // Approve mutation
  const [completeEnquiry, { isLoading: isCompleting }] =
    useCompleteServiceEnquiryMutation();

  const isLoading = enquiryLoading || checklistsLoading;
  const isError = enquiryError || checklistsError;
  const selectedCodes = new Set(checklists?.selectedServiceCodes || []);

  // Checklist cards
  const checklistData = Object.entries(checklistGroups)
    .filter(([_, group]) =>
      group.requiredCodes.some((code) => selectedCodes.has(code)),
    )
    .map(([groupKey, group]) => {
      const checklistPayload = checklists?.[group.checklistKey] ?? null;
      const progress = isChecklistObject(checklistPayload)
        ? calculateProgress(checklistPayload)
        : 0;
      const status = progress === 100 ? "Completed" : "Pending";

      return {
        id: groupKey,
        title: group.title,
        status,
        code: group.code,
        progress,
        imageUrl:
          serviceImageMap[group.imageCode] || "/assets/placeholder-service.jpg",
      };
    });

  // Inspection-only cards
  const inspectionData = Object.entries(inspectionOnlyGroups)
    .filter(([code]) => selectedCodes.has(code))
    .map(([code, group]) => ({
      id: code,
      title: group.title,
      status: "Pending",
      code: group.code,
      imageUrl:
        serviceImageMap[group.imageCode] || "/assets/placeholder-service.jpg",
    }));

  // Handle Approve click
  const handleApprove = async () => {
    if (!enquiryId) return;

    try {
      const result = await completeEnquiry(enquiryId).unwrap();
      toast.success(
        result.message || "Enquiry approved and marked as Completed",
      );
      navigate("/work");
      // Optional: refetch or navigate away
    } catch (err: any) {
      console.log(err, "err");
      if (err?.incompleteChecklists?.length) {
        toast.error(
          `${err?.message}\n\nMissing/Incomplete:\n- ${err.incompleteChecklists.join("\n- ")}`,
        );
      } else {
        toast.error(err?.message || "Failed to approve enquiry");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-3xl mx-auto p-6">
        <div className="text-center py-12">Loading vehicle details...</div>
      </div>
    );
  }

  if (isError || !enquiry) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-3xl mx-auto p-6">
        <div className="text-center py-12 text-red-600">
          {enquiry ? "Failed to load details" : "Enquiry not found"}
        </div>
      </div>
    );
  }

  const isAdmin = userRole === "Admin";

  return (
    <div className="min-h-screen bg-gray-50 max-w-3xl mx-auto">
      <Link
        to={`/work`}
        className="flex items-center mb-1 text-teal-600 hover:text-teal-700"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      <SearchFilter />

      <div className="p-4">
        <VehicleDetailsCard
          vehicleNumber={enquiry.vehicleNo}
          name={enquiry.customerName}
          phone={enquiry.customerPhone}
          distance={enquiry.odometer ? `${enquiry.odometer} km` : "N/A"}
          step="3 of 5"
          status={enquiry.status}
        />

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Vehicle Service & Checks
          </h2>

          {checklistData.length > 0 || inspectionData.length > 0 ? (
            <>
              {checklistData.map((item) => (
                <ChecklistCard
                  key={item.id}
                  imageUrl={item.imageUrl}
                  title={item.title}
                  enquiryId={enquiryId!}
                  code={item.code}
                  status={item.status}
                  progress={item.progress}
                />
              ))}

              {inspectionData.map((item) => (
                <InspectionCard
                  key={item.id}
                  imageUrl={item.imageUrl}
                  title={item.title}
                  status={item.status}
                  code={item.code}
                  enquiryId={enquiryId!}
                />
              ))}
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No services or checks required for this vehicle
            </p>
          )}
        </div>

        {/* Approve button – only visible to Admin */}
        {isAdmin && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleApprove}
              disabled={isCompleting}
              className={`w-full max-w-md px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isCompleting ? "animate-pulse" : ""
              }`}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve & Mark as Completed"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleServiceAndChecklist;
