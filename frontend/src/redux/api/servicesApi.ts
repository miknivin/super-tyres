// src/redux/api/servicesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service type (you can move this to types if preferred)
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

interface CreateServiceRequest {
  name: string;
  code: string;
  description?: string;
  category?: string;
  image?: string;
}

interface UpdateServiceRequest {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  category?: string;
  image?: string;
  isActive?: boolean;
}

export interface RecentService {
  enquiryId: string;
  vehicleNo: string;
  customerName: string;
  status: string;
  createdAt: string;
  serviceDate?: string | null;
  odometer?: string | null;
  selectedServices: string[];
  complaintNotes?: string | null;
}

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),

  tagTypes: ["Services", "Service", "RecentServices"],

  endpoints: (builder) => ({
    // GET all active services
    getServices: builder.query<Service[], void>({
      query: () => "/services",
      providesTags: ["Services"],
    }),

    // GET single service by ID
    getServiceById: builder.query<Service, string>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),

    // POST – create new service
    createService: builder.mutation<Service, CreateServiceRequest>({
      query: (body) => ({
        url: "/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Services"],
    }),

    // PUT – update existing service
    updateService: builder.mutation<Service, UpdateServiceRequest>({
      query: ({ id, ...patch }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Services",
        { type: "Service", id },
      ],
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

    // DELETE – soft delete (set isActive = false)
    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetRecentServicesQuery,
} = servicesApi;

export default servicesApi.reducer;
