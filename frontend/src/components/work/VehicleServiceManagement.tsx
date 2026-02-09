/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/work/VehicleServiceManagement.tsx

import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetAllServiceEnquiriesQuery } from "../../redux/api/servicesApi"; // adjust path if needed
import OngoingVehicleCard from "./OngoingVehicleCard";
import CompletedVehicleCard from "./CompletedVehicleCard";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import ServiceFilter from "./ServiceFilter";

// ────────────────────────────────────────────────
// Types (extended to match your filter + response)
// ────────────────────────────────────────────────
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

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
const VehicleServiceManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    (searchParams.get("tab") as "ongoing" | "completed") || "ongoing",
  );

  const [page, setPage] = useState(1);
  const [allEnquiries, setAllEnquiries] = useState<ServiceEnquiryListItem[]>(
    [],
  );
  const [hasMore, setHasMore] = useState(true);

  const [ongoingTotalCount, setOngoingTotalCount] = useState<number | null>(
    null,
  );
  const [completedTotalCount, setCompletedTotalCount] = useState<number | null>(
    null,
  );

  // ────────────────────────────────────────────────
  // Build filter object from URL params + tab
  // ────────────────────────────────────────────────
  const filters = useMemo(() => {
    const status = activeTab === "ongoing" ? "Pending" : "Completed";

    return {
      status,
      page: Number(searchParams.get("page")) || 1,
      pageSize: 10, // ← you can make this configurable later

      // Filter form fields
      keyword: searchParams.get("keyword") || undefined,

      createdFrom: searchParams.get("createdFrom") || undefined,
      createdTo: searchParams.get("createdTo") || undefined,
      updatedFrom: searchParams.get("updatedFrom") || undefined,
      updatedTo: searchParams.get("updatedTo") || undefined,

      minOdometer: searchParams.has("minOdometer")
        ? Number(searchParams.get("minOdometer"))
        : undefined,
      maxOdometer: searchParams.has("maxOdometer")
        ? Number(searchParams.get("maxOdometer"))
        : undefined,

      // Add later when needed:
      // serviceIds: searchParams.get("serviceIds")?.split(","),
      // status: ... (but we already control via tab)
    };
  }, [searchParams, activeTab]);

  // ────────────────────────────────────────────────
  // Sync tab ↔ URL (but preserve other filters)
  // ────────────────────────────────────────────────
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", activeTab);
        // Important: do NOT delete other filters when changing tab
        return next;
      },
      { replace: true },
    );
  }, [activeTab, setSearchParams]);

  // Reset page + accumulated data when tab or major filters change
  useEffect(() => {
    setPage(1);
    setAllEnquiries([]);
    setHasMore(true);
  }, [
    activeTab,
    filters.keyword,
    filters.createdFrom,
    filters.createdTo,
    filters.updatedFrom,
    filters.updatedTo,
    filters.minOdometer,
    filters.maxOdometer,
  ]);

  // ────────────────────────────────────────────────
  // Fetch data with full filters
  // ────────────────────────────────────────────────
  const {
    data: pagedData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllServiceEnquiriesQuery(filters);

  // Append new page of results
  useEffect(() => {
    if (!pagedData) return;

    setAllEnquiries((prev) =>
      page === 1 ? pagedData.items : [...prev, ...pagedData.items],
    );

    setHasMore(page < pagedData.totalPages);

    // Update tab-specific total count
    if (activeTab === "ongoing") {
      setOngoingTotalCount(pagedData.totalCount);
    } else {
      setCompletedTotalCount(pagedData.totalCount);
    }
  }, [pagedData, page, activeTab]);

  // ────────────────────────────────────────────────
  // Infinite Scroll
  // ────────────────────────────────────────────────
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore],
  );

  // ────────────────────────────────────────────────
  // Early returns (loading / error)
  // ────────────────────────────────────────────────
  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError) {
    const msg = (error as any)?.data?.message || "Failed to load enquiries";
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <p className="text-gray-600">{msg}</p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header + Add button */}
        <div className="bg-teal-600 text-white px-5 py-5 flex justify-between items-center rounded-lg shadow-sm">
          <span className="text-lg font-semibold">
            Vehicle Service Management
          </span>
          <Link to="/work/add" className="hover:opacity-90 transition">
            <Plus className="w-8 h-8" />
          </Link>
        </div>

        {/* Filter Form (new) */}
        <ServiceFilter />

        {/* Tabs */}
        <div className="flex gap-8 border-b">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`pb-3 text-base font-medium transition-colors ${
              activeTab === "ongoing"
                ? "text-teal-700 border-b-2 border-teal-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Ongoing {ongoingTotalCount !== null ? `(${ongoingTotalCount})` : ""}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 text-base font-medium transition-colors ${
              activeTab === "completed"
                ? "text-teal-700 border-b-2 border-teal-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed{" "}
            {completedTotalCount !== null ? `(${completedTotalCount})` : ""}
          </button>
        </div>

        {/* Cards / List */}
        <div className="space-y-4">
          {allEnquiries.length === 0 && !isFetching ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
              No service enquiries found
            </div>
          ) : (
            <>
              {allEnquiries.map((enquiry, index) => {
                const isLast = index === allEnquiries.length - 1;
                return (
                  <div
                    key={enquiry.id}
                    ref={isLast ? lastElementRef : undefined}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {activeTab === "ongoing" ? (
                      <OngoingVehicleCard
                        vehicle={{
                          id: enquiry.id,
                          plate: enquiry.vehicleNo,
                          owner: enquiry.customerName,
                          phone: enquiry.customerPhone,
                          odometer: enquiry.odometer ?? 0,
                          services:
                            enquiry.serviceWithNames
                              .map((s) => s.name)
                              .join(", ") || "No services specified",
                          status: enquiry.status.toLowerCase(),
                        }}
                      />
                    ) : (
                      <CompletedVehicleCard
                        vehicle={{
                          id: enquiry.id,
                          plate: enquiry.vehicleNo,
                          owner: enquiry.customerName,
                          phone: enquiry.customerPhone,
                          mileage: enquiry.odometer
                            ? `${enquiry.odometer} km`
                            : "N/A",
                          success: true,
                        }}
                      />
                    )}
                  </div>
                );
              })}

              {isFetching && (
                <div className="text-center py-6 text-gray-600">
                  <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2" />
                  <p>Loading more...</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleServiceManagement;
