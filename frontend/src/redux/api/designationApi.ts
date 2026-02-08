// src/redux/api/designationsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ────────────────────────────────────────────────
// DTO / Response types (matching your backend DTO)
// ────────────────────────────────────────────────
export interface DesignationResponseDto {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  serviceId?: string | null;
  serviceName?: string | null;
  isActive: boolean;
  imageurl?: string | null;
  isAssigned: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

// ────────────────────────────────────────────────
// API Slice
// ────────────────────────────────────────────────
export const designationsApi = createApi({
  reducerPath: "designationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include", // if using cookies / auth
  }),
  tagTypes: ["Designations", "Designation"],
  endpoints: (builder) => ({
    // GET /api/designations → all active designations
    getDesignations: builder.query<DesignationResponseDto[], void>({
      query: () => "/designations",
      providesTags: ["Designations"],
    }),

    // GET /api/designations/{id} → single designation
    getDesignationById: builder.query<DesignationResponseDto, string>({
      query: (id) => `/designations/${id}`,
      providesTags: (result, error, id) => [
        { type: "Designation", id },
        "Designations",
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetDesignationsQuery,
  useGetDesignationByIdQuery,
  useLazyGetDesignationsQuery,
  useLazyGetDesignationByIdQuery,
} = designationsApi;

export default designationsApi.reducer;
