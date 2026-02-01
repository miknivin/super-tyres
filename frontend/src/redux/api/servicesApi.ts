// src/redux/api/servicesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Import the exact types from your slice
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
// Request shape for creating Service Enquiry
// Reuses the exact types from your slice
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

  // Re-use the exact types from your slice
  tyreInspection?: TyreInspectionData;
  tyreRotationInspection?: TyreRotationData;
  alignmentInspection?: AlignmentData;
  balancingInspection?: BalancingData;
  carWashInspection?: CarWashingData;
  pucInspection?: PUSOperatorData;
  batteryInspection?: BatteryCheckData;
  oilInspection?: OilCheckUpData;
}

// Minimal response type (expand later if needed)
interface ServiceEnquiryResponse {
  id: string;
  // add any other fields you return from backend
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
  tagTypes: ["Services", "Service", "RecentServices", "ServiceEnquiry"],
  endpoints: (builder) => ({
    // ── Existing endpoints unchanged ───────────────────────────────────────
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

    // ── NEW: Create Service Enquiry using imported types ────────────────────
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
} = servicesApi;

export default servicesApi.reducer;
