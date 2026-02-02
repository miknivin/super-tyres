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
  TyreInspectionData,
  TyreRotationData,
  AlignmentData,
  BalancingData,
  CarWashingData,
  PUSOperatorData,
  BatteryCheckData,
  OilCheckUpData,
} from "../slices/serviceEnquiryFormSlice";

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
  balancingInspection?: BalancingData;
  carWashInspection?: CarWashingData;
  pucInspection?: PUSOperatorData;
  batteryInspection?: BatteryCheckData;
  oilInspection?: OilCheckUpData;
}

// Minimal response type for create (expand later)
interface ServiceEnquiryResponse {
  id: string;
}

export interface ServiceEnquiryListItem {
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
// ────────────────────────────────────────────────
// API Definition
// ────────────────────────────────────────────────
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
    getAllServiceEnquiries: builder.query<ServiceEnquiryListItem[], void>({
      query: () => "/service-enquiry",
      providesTags: ["ServiceEnquiry"],
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
  useGetServiceEnquiryChecklistsQuery, // ← new hook
} = servicesApi;

export default servicesApi.reducer;
