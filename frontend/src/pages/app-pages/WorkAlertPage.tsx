/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/alerts/AlertsListPage.tsx
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AlertCard } from "../../components/work-alerts/AlertCard";
import { useGetMyEnquiriesQuery } from "../../redux/api/servicesApi"; // adjust path to your api slice

// You can define this type locally or export it from a types file
interface EnquiryAlert {
  id: string;
  customerName: string;
  customerPhone: string; // renamed from phone
  vehicleNumber: string; // renamed from vehicleNumber
  vehicleName: string;
  vehicleNo: string;
  status: number;
  createdAt: string;
  serviceDate?: string | null;
  phone: string;
  odometer?: number | null;
  serviceWithNames: Array<{
    code: string;
    name: string;
  }>;
  // You can compute these two fields in the component if backend doesn't send them
  timeElapsed?: string;
  service?: string; // displayed service summary
}

export default function WorkAlertsListPage() {
  const {
    data: enquiries = [],
    isLoading,
    isError,
    error,
  } = useGetMyEnquiriesQuery();

  const [searchQuery, setSearchQuery] = useState("");

  // Optional: enrich data with frontend-only computed fields
  const alerts: EnquiryAlert[] = useMemo(() => {
    return enquiries.map((enq: EnquiryAlert) => ({
      ...enq,
      vehicleNumber: enq.vehicleNumber, // map for AlertCard compatibility
      phone: enq.customerPhone,
      // Example — compute a main service name (first one or most important)
      service: enq.serviceWithNames?.[0]?.name || "General Service",
      // Very basic time elapsed (improve with date-fns or luxon)
      timeElapsed: getTimeElapsed(enq.createdAt),
    }));
  }, [enquiries]);

  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return alerts;
    const query = searchQuery.toLowerCase().trim();
    return alerts.filter(
      (alert) =>
        alert.vehicleNumber.toLowerCase().includes(query) ||
        alert.customerName.toLowerCase().includes(query) ||
        alert.phone?.toLowerCase().includes(query),
    );
  }, [searchQuery, alerts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 flex items-center justify-center">
        <div className="text-gray-500">Loading your assigned enquiries...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-lg bg-red-50 p-6 text-red-700">
          Failed to load enquiries
          <div className="mt-2 text-sm">
            {(error as any)?.data?.message || "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          My Work Alerts / Enquiries
        </h1>

        {/* Search + Filter */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by vehicle number, customer name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Filter alerts"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Content */}
        {filteredAlerts.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500">
            {searchQuery.trim()
              ? `No matching enquiries for "${searchQuery}"`
              : "No pending enquiries assigned to you right now"}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Quick helper — improve with proper date library later
function getTimeElapsed(isoDate: string): string {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;
  return `${Math.floor(diffMins / 1440)} days ago`;
}
