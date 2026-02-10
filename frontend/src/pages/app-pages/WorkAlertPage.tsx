/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/alerts/WorkAlertsListPage.tsx
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { AlertCard } from "../../components/work-alerts/AlertCard";
import {
  useGetMyEnquiriesQuery,
  type ServiceEnquiryFilter,
} from "../../redux/api/servicesApi";
import ServiceFilter from "../../components/ui/ServiceFilter";
import { useSearchParams } from "react-router-dom";

export default function WorkAlertsListPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [allAlerts, setAllAlerts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const pageSize = 20; // smaller page size = smoother infinite scroll

  // Build filter object (page changes will trigger new query)
  const filter = useMemo<ServiceEnquiryFilter>(
    () => ({
      keyword: searchParams.get("keyword")?.trim() || undefined,
      createdFrom: searchParams.get("createdFrom") || undefined,
      createdTo: searchParams.get("createdTo") || undefined,
      updatedFrom: searchParams.get("updatedFrom") || undefined,
      updatedTo: searchParams.get("updatedTo") || undefined,
      minOdometer: searchParams.get("minOdometer")
        ? Number(searchParams.get("minOdometer"))
        : undefined,
      maxOdometer: searchParams.get("maxOdometer")
        ? Number(searchParams.get("maxOdometer"))
        : undefined,
      status: searchParams.get("status") || "Pending",
      page,
      pageSize,
      serviceIds: searchParams.get("serviceIds")?.split(",") || undefined,
    }),
    [searchParams, page],
  );

  const { data, isLoading, isFetching, isError, error } =
    useGetMyEnquiriesQuery(filter, {
      // Important: skip if we already know there's no more data
      skip: !hasMore,
    });

  // Merge new page of data into accumulated list
  useEffect(() => {
    if (data?.items) {
      setAllAlerts((prev) =>
        page === 1 ? data.items : [...prev, ...data.items],
      );

      // Check if we got fewer items than pageSize → no more data
      if (data.items.length < pageSize) {
        setHasMore(false);
      }
    }
  }, [data?.items, page]);

  // Reset when filters change (very important!)
  useEffect(() => {
    setPage(1);
    setAllAlerts([]);
    setHasMore(true);
  }, [searchParams]);

  // Infinite scroll trigger
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isFetching],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "300px", // start loading 300px before reaching bottom
      threshold: 0.1,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

  // Map to AlertCard props
  const alerts = useMemo(() => {
    return allAlerts.map((enq) => {
      const servicesText =
        enq.services
          ?.map((s: any) => s.serviceName || "—")
          .filter(Boolean)
          .join(", ") || "No services";

      return {
        id: enq.id,
        customerName: enq.customerName,
        customerPhone: enq.customerPhone,
        vehicleNumber: enq.vehicleNo,
        vehicleName: enq.vehicleName,
        status: enq.status,
        createdAt: enq.createdAt,
        serviceDate: enq.serviceDate,
        odometer: enq.odometer,
        displayServices: servicesText,
        timeElapsed: getTimeElapsed(enq.createdAt),
      };
    });
  }, [allAlerts]);

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  if (isLoading && page === 1) {
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
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Alerts</h1>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <ServiceFilter />
          </div>
        </div>

        {alerts.length === 0 && !isFetching ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500">
            {filter.keyword?.trim()
              ? `No matching enquiries for "${filter.keyword}"`
              : "No pending enquiries assigned to you right now"}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>

            {/* Loader / Trigger element */}
            <div
              ref={loaderRef}
              className="py-8 flex justify-center text-gray-500 text-sm"
            >
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Loading more...
                </div>
              ) : hasMore ? (
                "Scroll down to load more"
              ) : (
                "No more enquiries"
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
