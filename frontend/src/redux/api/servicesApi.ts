/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/api/servicesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ────────────────────────────────────────────────
// Existing types (Service, RecentService) unchanged
// ────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  code: string;
  description?: string;
  category?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface RecentService {
  enquiryId: string;
  vehicleNo: string;
  customerName: string;
  status: string;
  createdAt: string;
  serviceDate?: string | null;
  odometer?: number | null;
  selectedServices: string[];
  complaintNotes?: string | null;
}

// ────────────────────────────────────────────────
// Re-use exact types from your slice for request
// ────────────────────────────────────────────────
import type {
  TyreRotationData,
  AlignmentData,
  CarWashingData,
  PUSOperatorData,
  BatteryCheckData,
  OilCheckUpData,
  TyreValues,
} from "../slices/serviceEnquiryFormSlice";
import type { TyrePosition } from "../../components/work/add-work/TyreInspectionForm";

// ────────────────────────────────────────────────
// Checklist DTOs (matching your DTO structure)
// ────────────────────────────────────────────────
export interface TyreChecklistResponse {
  id: string;
  serviceEnquiryId: string;
  correctTyreSizeVerified: boolean;
  noBeadSidewallDamage: boolean;
  correctInflation: boolean;
  wheelNutsTorqued: boolean;
  technicianNotes?: string | null;
  completedAt?: string | null;
}

export interface AlignmentChecklistResponse {
  id: string;
  serviceEnquiryId: string;
  suspensionChecked: boolean;
  steeringCentered: boolean;
  beforeAfterReportPrinted: boolean;
  technicianNotes?: string | null;
  completedAt?: string | null;
}

export interface BalancingInspectionData {
  frontLeftWeight: number | null;
  frontRightWeight: number | null;
  rearLeftWeight: number | null;
  rearRightWeight: number | null;
  complaint: string;
}
export interface BalancingChecklistResponse {
  id: string;
  serviceEnquiryId: string;
  wheelCleaned: boolean;
  weightsFixedSecurely: boolean;
  finalRecheckDone: boolean;
  technicianNotes?: string | null;
  completedAt?: string | null;
}

export interface PucChecklistResponse {
  id: string;
  serviceEnquiryId: string;
  engineWarmed: boolean;
  probeInsertedCorrectly: boolean;
  certificatePrintedAndUploaded: boolean;
  technicianNotes?: string | null;
  completedAt?: string | null;
}

export interface CarWashChecklistResponse {
  id: string;
  serviceEnquiryId: string;
  exteriorWashed: boolean;
  interiorVacuumed: boolean;
  noWaterOnEngineElectrics: boolean;
  technicianNotes?: string | null;
  completedAt?: string | null;
}

// ────────────────────────────────────────────────
// Response shape for /service-enquiry/{id}/checklists
// ────────────────────────────────────────────────
export interface ServiceEnquiryChecklistsResponse {
  serviceEnquiryId: string;
  selectedServiceCodes: string[];
  tyreChecklist?: TyreChecklistResponse | null;
  alignmentChecklist?: AlignmentChecklistResponse | null;
  balancingChecklist?: BalancingChecklistResponse | null;
  pucChecklist?: PucChecklistResponse | null;
  carWashChecklist?: CarWashChecklistResponse | null;
}

interface TyreInspectionData {
  selectedTyre: TyrePosition | null; // assuming TyrePosition is already defined elsewhere
  frontLeft: TyreValues | null;
  frontRight: TyreValues | null;
  rearLeft: TyreValues | null;
  rearRight: TyreValues | null;
  selectedComplaints: string[];
  customComplaint: string;
}
// ────────────────────────────────────────────────
// Request shape for creating Service Enquiry (unchanged)
// ────────────────────────────────────────────────
interface CreateServiceEnquiryRequest {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  pinCode: string;
  vehicleName: string;
  vehicleNo: string;
  odometer: number | undefined;
  wheel: string;
  vehicleType: string;
  serviceDate: string;
  complaintNotes?: string;
  selectedServices: string[];
  tyreInspection?: TyreInspectionData;
  tyreRotationInspection?: TyreRotationData;
  alignmentInspection?: AlignmentData;
  balancingInspection?: BalancingInspectionData;
  carWashInspection?: CarWashingData;
  pucInspection?: PUSOperatorData;
  batteryInspection?: BatteryCheckData;
  oilInspection?: OilCheckUpData;
}

// Minimal response type for create (expand later)
interface ServiceEnquiryResponse {
  id: string;
}

interface PagedEnquiries {
  items: ServiceEnquiryListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ServiceEnquiryListItem {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleNo: string;
  vehicleName: string;
  status: string;
  createdAt: string;
  serviceDate?: string | null;
  odometer?: number | null;
  serviceWithNames: Array<{
    code: string;
    name: string;
  }>;
}

export interface BatteryInspectionSummary {
  id: string;
  condition?: string | null;
  voltage?: number | null;
  specificGravity?: number | null;
  complaint?: string | null;
  completedAt?: string | null;
}

export interface TyreRotationInspectionSummary {
  id: string;
  rotationType?: string | null;
  complaint?: string | null;
  completedAt?: string | null;
}

export interface OilInspectionSummary {
  id: string;
  quality?: string | null;
  level?: string | null;
  complaint?: string | null;
  completedAt?: string | null;
}

export interface BatteryInspectionSummary {
  id: string;
  condition?: string | null;
  voltage?: number | null;
  specificGravity?: number | null;
  complaint?: string | null;
  completedAt?: string | null;
}

export interface TyreRotationInspectionSummary {
  id: string;
  rotationType?: string | null;
  complaint?: string | null;
  completedAt?: string | null;
}

export interface OilInspectionSummary {
  id: string;
  quality?: string | null;
  level?: string | null;
  complaint?: string | null;
  completedAt?: string | null;
}

export interface InspectionSummaryResponse {
  battery: BatteryInspectionSummary | null;
  tyreRotation: TyreRotationInspectionSummary | null;
  oil: OilInspectionSummary | null;
}

export interface InspectionSummaryResponse {
  battery: BatteryInspectionSummary | null;
  tyreRotation: TyreRotationInspectionSummary | null;
  oil: OilInspectionSummary | null;
}

export interface CompleteEnquiryResponse {
  message: string;
  enquiryId: string;
  completedAt: string;
}

export interface ServiceEnquiryFilter {
  page?: number; // default 1
  pageSize?: number; // default 10
  keyword?: string;
  createdFrom?: string; // ISO string "2025-01-01"
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
  minOdometer?: number;
  maxOdometer?: number;
  serviceIds?: string[]; // array of GUID strings
  status?: string; // "Pending", "Completed", etc.
}

export interface CompleteEnquiryErrorResponse {
  message: string;
  incompleteChecklists?: string[]; // list of missing/incomplete checklist names
}

export type BatteryInspectionResponse = BatteryInspectionSummary | null;
export type TyreRotationInspectionResponse =
  TyreRotationInspectionSummary | null;
export type OilInspectionResponse = OilInspectionSummary | null;

export interface MyServiceEnquiryResponse {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleNo: string;
  vehicleName: string;
  status: string;
  createdAt: string;
  serviceDate?: string;
  odometer?: number;
  services: ServiceWithNameDto[];
}

export interface ServiceWithNameDto {
  serviceId: string;
  serviceName: string;
  serviceCode: string;
}
export interface PagedServiceEnquiryResponse {
  items: MyServiceEnquiryResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: [
    "Services",
    "Service",
    "RecentServices",
    "ServiceEnquiry",
    "Checklists",
    "Inspections",
  ],
  endpoints: (builder) => ({
    // ── Existing endpoints (unchanged) ─────────────────────────────────────
    getServices: builder.query<Service[], void>({
      query: () => "/services",
      providesTags: ["Services"],
    }),

    getServiceById: builder.query<Service, string>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),

    createService: builder.mutation<Service, Partial<Service>>({
      query: (body) => ({
        url: "/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Services"],
    }),

    updateService: builder.mutation<Service, Partial<Service> & { id: string }>(
      {
        query: ({ id, ...patch }) => ({
          url: `/services/${id}`,
          method: "PUT",
          body: patch,
        }),
        invalidatesTags: (result, error, { id }) => [
          "Services",
          { type: "Service", id },
        ],
      },
    ),

    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),

    getRecentServices: builder.query<
      RecentService[],
      { vehicleNo: string; take?: number }
    >({
      query: ({ vehicleNo, take = 10 }) => ({
        url: "/service-enquiry/recent",
        params: { vehicleNo, take },
      }),
      providesTags: ["RecentServices"],
    }),

    // ── Create Service Enquiry (unchanged)
    createServiceEnquiry: builder.mutation<
      ServiceEnquiryResponse,
      CreateServiceEnquiryRequest
    >({
      query: (body) => ({
        url: "/service-enquiry",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ServiceEnquiry"],
    }),

    // ── NEW: Get checklists for a specific service enquiry
    getServiceEnquiryChecklists: builder.query<
      ServiceEnquiryChecklistsResponse,
      string // enquiry ID
    >({
      query: (enquiryId) => `/service-enquiry/${enquiryId}/checklists`,
      providesTags: (result, error, id) => [
        { type: "Checklists", id },
        "ServiceEnquiry",
      ],
    }),
    getAllServiceEnquiries: builder.query<
      PagedEnquiries,
      Partial<ServiceEnquiryFilter>
    >({
      query: (filter = {}) => ({
        url: "/service-enquiry",
        params: {
          page: filter.page ?? 1,
          pageSize: filter.pageSize ?? 10,
          keyword: filter.keyword,
          createdFrom: filter.createdFrom,
          createdTo: filter.createdTo,
          updatedFrom: filter.updatedFrom,
          updatedTo: filter.updatedTo,
          minOdometer: filter.minOdometer,
          maxOdometer: filter.maxOdometer,
          serviceIds: filter.serviceIds, // array will be serialized as comma-separated
          status: filter.status,
        },
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({
                type: "ServiceEnquiry" as const,
                id,
              })),
              { type: "ServiceEnquiry", id: "LIST" },
            ]
          : [{ type: "ServiceEnquiry", id: "LIST" }],
    }),

    getServiceEnquiryById: builder.query<ServiceEnquiryListItem, string>({
      query: (enquiryId) => `/service-enquiry/${enquiryId}`,
      providesTags: (result, error, id) => [
        { type: "ServiceEnquiry", id },
        "ServiceEnquiry",
      ],
    }),
    updateChecklist: builder.mutation<
      void, // no response body (204 No Content)
      {
        enquiryId: string;
        checklistType: string; // e.g. "tyre-technician-checklist"
        data: any; // partial checklist data (use specific DTO in TS if desired)
      }
    >({
      query: ({ enquiryId, checklistType, data }) => ({
        url: `/service-enquiry/${enquiryId}/checklists/${checklistType}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { enquiryId }) => [
        { type: "ServiceEnquiry", id: enquiryId },
        "Checklists",
      ],
    }),
    getChecklistByType: builder.query<
      any | null,
      { enquiryId: string; checklistType: string }
    >({
      query: ({ enquiryId, checklistType }) =>
        `/service-enquiry/${enquiryId}/checklists/${checklistType}`,

      providesTags: (result, error, { enquiryId, checklistType }) => [
        { type: "Checklists", id: `${enquiryId}-${checklistType}` },
        { type: "ServiceEnquiry", id: enquiryId },
      ],
    }),

    // GET /service-enquiry/{enquiryId}/inspections/{type}
    getInspectionSummaryByEnquiryId: builder.query<
      | BatteryInspectionResponse
      | TyreRotationInspectionResponse
      | OilInspectionResponse
      | null,
      { enquiryId: string; type: string }
    >({
      query: ({ enquiryId, type }) =>
        `/service-enquiry/${enquiryId}/inspections/${type}`,
      providesTags: (result, error, { enquiryId }) => [
        { type: "Inspections", id: enquiryId },
        "ServiceEnquiry",
      ],
    }),
    completeServiceEnquiry: builder.mutation<CompleteEnquiryResponse, string>({
      query: (enquiryId) => ({
        url: `/service-enquiry/${enquiryId}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, enquiryId) => [
        { type: "ServiceEnquiry", id: enquiryId }, // detail page
        { type: "ServiceEnquiry" }, // all lists
        { type: "Checklists", id: enquiryId },
        { type: "Inspections", id: enquiryId },
      ],
    }),

    getMyEnquiries: builder.query<
      PagedServiceEnquiryResponse,
      ServiceEnquiryFilter
    >({
      query: (filter) => {
        // Convert filter object to query string
        const params = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, v));
            } else {
              params.append(key, value.toString());
            }
          }
        });
        return {
          url: `/service-enquiry/my-enquiries?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetRecentServicesQuery,
  useCreateServiceEnquiryMutation,
  useGetAllServiceEnquiriesQuery,
  useGetServiceEnquiryChecklistsQuery,
  useGetServiceEnquiryByIdQuery,
  useUpdateChecklistMutation,
  useGetChecklistByTypeQuery,
  useLazyGetChecklistByTypeQuery,
  useLazyGetInspectionSummaryByEnquiryIdQuery,
  useCompleteServiceEnquiryMutation,
  useGetMyEnquiriesQuery,
} = servicesApi;

export default servicesApi.reducer;
