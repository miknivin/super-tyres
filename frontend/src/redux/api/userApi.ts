// src/redux/api/usersApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ────────────────────────────────────────────────
// Types (matching your backend DTOs / responses)
// ────────────────────────────────────────────────
export interface UserListItem {
  id: string;
  username: string;
  email: string;
  role: string; // "Admin" | "Employee"
  employeeId: string;
  createdAt: string;
  designationCount: number;
}

export interface DesignationInfo {
  designationId: string;
  designationName: string;
  designationCode: string;
  assignedAt: string;
}

export interface UserDetailResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  employeeId: string;
  createdAt: string;
  designations: DesignationInfo[];
}

export interface UpdateUserDesignationsRequest {
  designationIds: string[]; // array of GUID strings
}

export interface UpdateUserDesignationsResponse {
  message: string;
  userId: string;
  designationCount: number;
}

// Response for GET /api/users/me/profile
export interface MyProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId: string;
  createdAt: string;
  designations: string[]; // array of designation names
}

// Response for GET /api/users/me/enquiries
export interface MyEnquiriesSummaryResponse {
  totalEnquiries: number;
  recent: Array<{
    id: string;
    vehicleNo: string;
    customerName: string;
    status: string;
    createdAt: string;
    serviceDate?: string | null;
    serviceCount: number;
    odometer?: number | null;
  }>;
}

// ────────────────────────────────────────────────
// API Slice
// ────────────────────────────────────────────────
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include", // sends cookies (jwt)
  }),
  tagTypes: ["Users", "User", "UserDesignations", "ServiceEnquiry"],
  endpoints: (builder) => ({
    // GET /api/users — list all users (Admin only)
    getUsers: builder.query<UserListItem[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // GET /api/users/{id} — single user with designations
    getUserById: builder.query<UserDetailResponse, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "User", id: userId },
        "Users",
      ],
    }),

    // PATCH /api/users/{userId}/designations — assign/replace designations
    updateUserDesignations: builder.mutation<
      { message: string; designationCount: number },
      { designationIds: string[] } // no userId needed
    >({
      query: ({ designationIds }) => ({
        url: "/users/designations",
        method: "PATCH",
        body: { designationIds },
      }),
      invalidatesTags: ["User", "UserDesignations"],
    }),
    getMyProfile: builder.query<MyProfileResponse, void>({
      query: () => "/users/me/profile",
      providesTags: ["User"],
    }),

    // ── NEW: GET /api/users/me/enquiries ─────────────────────────────────
    getMyEnquiriesSummary: builder.query<MyEnquiriesSummaryResponse, void>({
      query: () => "/users/me/enquiries",
      providesTags: ["ServiceEnquiry", "User"],
    }),
  }),
});

// Export hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserDesignationsMutation,
  useLazyGetUsersQuery,
  useLazyGetUserByIdQuery,
  useGetMyEnquiriesSummaryQuery,
  useGetMyProfileQuery,
} = usersApi;

export default usersApi.reducer;
