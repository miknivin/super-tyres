/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/EmployeeProfile.tsx
import { Edit } from "lucide-react";
import { Loader2, AlertCircle } from "lucide-react";
import {
  useGetMyEnquiriesSummaryQuery,
  useGetMyProfileQuery,
} from "../../redux/api/userApi";

export default function EmployeeProfile() {
  // Fetch user profile (name, designations, etc.)
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorData,
  } = useGetMyProfileQuery();

  // Fetch enquiries summary (total + recent 3)
  const {
    data: summary,
    isLoading: enquiriesLoading,
    isError: enquiriesError,
    error: enquiriesErrorData,
  } = useGetMyEnquiriesSummaryQuery();

  // Calculate jobs created today (client-side from recent data)
  const jobsToday =
    summary?.recent?.filter((enq) => {
      const today = new Date().toDateString();
      const created = new Date(enq.createdAt).toDateString();
      return today === created;
    }).length ?? 0;

  // Loading state (either API)
  if (profileLoading || enquiriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state (show if either fails)
  if (profileError || enquiriesError) {
    const msg =
      (profileErrorData as any)?.data?.message ||
      (enquiriesErrorData as any)?.data?.message ||
      "Failed to load profile data";

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600">{msg}</p>
        </div>
      </div>
    );
  }

  // No data fallback
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <p className="text-gray-500">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Profile Header */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] gap-4 items-start">
            {/* Avatar */}
            <div className="min-w-20 min-h-20 max-w-20 max-h-20 rounded-full bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
              {profile.name?.charAt(0)?.toUpperCase() || "?"}
            </div>

            {/* Profile Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {profile.designations.join(" · ") || "No designations assigned"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Employee ID{" "}
                <span className="text-gray-900 font-medium">
                  {profile.employeeId ? `#${profile.employeeId}` : "N/A"}
                </span>
              </p>
            </div>

            {/* Edit Button */}
            <div className="flex sm:col-span-2 lg:col-span-1 lg:justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors">
                <Edit size={16} />
                <span className="text-sm font-medium">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Work Summary */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Work Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Jobs Created</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary?.totalEnquiries ?? 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Jobs Created Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {jobsToday}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Work */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Work
          </h3>
          {summary?.recent?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No recent enquiries yet
            </p>
          ) : (
            <div className="space-y-3">
              {summary &&
                summary.recent.map((enq) => (
                  <div
                    key={enq.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        {enq.vehicleNo}
                      </span>
                      <span className="text-gray-600">
                        {enq.serviceCount} service
                        {enq.serviceCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 block">
                        {new Date(enq.createdAt).toLocaleString([], {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        {enq.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
