// src/components/work/add-work/ServiceDetailsPage.tsx
import { Plus, ChevronLeft, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  prevStep,
  toggleService,
  updateComplaintNotes,
} from "../../../redux/slices/serviceEnquiryFormSlice";
import {
  useGetServicesQuery,
  useGetRecentServicesQuery,
} from "../../../redux/api/servicesApi";
import { useEffect, useState } from "react";

export default function ServiceDetailsPage() {
  const dispatch = useDispatch();

  // ────────────────────────────────────────────────
  // Get form data from Redux
  // ────────────────────────────────────────────────
  const customer = useSelector(
    (state: RootState) => state.serviceEnquiry.data.customer,
  );
  const selectedServices = useSelector(
    (state: RootState) => state.serviceEnquiry.data.selectedServices,
  );
  const currentStep = useSelector(
    (state: RootState) => state.serviceEnquiry.currentStep,
  );
  const complaintNotes = useSelector(
    (state: RootState) => state.serviceEnquiry.data.complaintNotes,
  );

  const vehicleNo = customer.vehicleNo?.trim() || "";

  // Auto-back if vehicle number is missing (with debounce to avoid race)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!vehicleNo) {
        dispatch(prevStep());
      }
    }, 500); // 500ms delay – gives user time to type

    return () => clearTimeout(timer);
  }, [vehicleNo, dispatch]);

  // ────────────────────────────────────────────────
  // Fetch all services (for selection grid)
  // ────────────────────────────────────────────────
  const { data: services = [], isLoading: servicesLoading } =
    useGetServicesQuery();

  // ────────────────────────────────────────────────
  // Fetch recent services for this vehicle
  // ────────────────────────────────────────────────
  const { data: recentServices = [], isLoading: recentLoading } =
    useGetRecentServicesQuery(
      { vehicleNo, take: 1 }, // take only 1 – we need the most recent
      { skip: !vehicleNo }, // don't fetch if no vehicleNo
    );

  const errors = useSelector((state: RootState) => state.serviceEnquiry.errors);
  // Get the latest (most recent) service – first item after sorting desc
  const latestService = recentServices[0];

  const [showComplaintInput, setShowComplaintInput] = useState(false);

  const handleToggle = (id: string) => {
    dispatch(toggleService(id));
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateComplaintNotes(e.target.value));
  };

  const toggleComplaintInput = () => {
    setShowComplaintInput((prev) => !prev);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(prevStep());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back to Customer</span>
        </button>

        {/* Vehicle & Customer Summary Card – dynamic from Redux */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {vehicleNo || "Vehicle Number Not Set"}
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Customer
              </h3>
              <p className="text-sm text-gray-800 font-medium">
                {customer.name || "Not Set"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {customer.phone || "Not Set"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Last Service
              </h3>
              <div className="text-xs space-y-1.5 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span>
                    {recentLoading
                      ? "Loading..."
                      : latestService?.serviceDate
                        ? new Date(
                            latestService.serviceDate,
                          ).toLocaleDateString()
                        : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Odometer</span>
                  <span>
                    {recentLoading
                      ? "Loading..."
                      : latestService?.odometer || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Selection + Complaint Section */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            Select Services
          </h2>

          {servicesLoading && (
            <div className="text-center py-8 text-gray-500">
              Loading services...
            </div>
          )}

          {services.length === 0 && !servicesLoading && (
            <div className="text-center py-8 text-gray-500">
              No services available
            </div>
          )}

          {services.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {services.map((service) => {
                const isSelected = selectedServices.includes(service.code);
                return (
                  <button
                    key={service.id}
                    onClick={() => handleToggle(service.code)}
                    className={`flex flex-col items-center group relative transition-all ${
                      isSelected ? "" : "hover:scale-105"
                    }`}
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200">
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                          <span className="bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                            Selected
                          </span>
                        </div>
                      )}
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/placeholder-service.png";
                            }}
                          />
                        ) : (
                          <div className="text-gray-400 text-4xl">🛠️</div>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-medium text-gray-700 text-center leading-tight">
                      {service.name}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
          {/* Selected services error – placed right below the grid */}
          {errors["selectedServices"] && (
            <div className="mt-4 text-center">
              <p className="text-red-500 text-sm font-medium">
                {errors["selectedServices"]}
              </p>
            </div>
          )}
          {/* Add / Edit Complaint Button */}
          <button
            onClick={toggleComplaintInput}
            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {showComplaintInput ? (
              <>
                <X size={20} /> Hide Notes
              </>
            ) : (
              <>
                <Plus size={20} /> Add Complaint / Notes
              </>
            )}
          </button>

          {/* Complaint Textarea */}
          {showComplaintInput && (
            <div className="mt-6">
              <label
                htmlFor="complaint"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Additional Complaints / Notes
              </label>
              <textarea
                id="complaint"
                value={complaintNotes}
                onChange={handleComplaintChange}
                rows={4}
                placeholder="Describe any specific issues, customer requests, or additional observations..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500 text-right">
                {complaintNotes.length} characters
              </p>
            </div>
          )}
        </div>

        {/* Recent Services – dynamic from API */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Recent Services
          </h3>

          {recentLoading && (
            <div className="text-center py-8 text-gray-500">
              Loading recent services...
            </div>
          )}

          {!recentLoading && recentServices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recent services found for this vehicle
            </div>
          )}

          {!recentLoading && recentServices.length > 0 && (
            <div className="space-y-3">
              {recentServices.map((service) => (
                <div
                  key={service.enquiryId}
                  className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      {service.selectedServices.join(", ") || "Service"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {service.customerName} •{" "}
                      {new Date(service.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {service.odometer || "-"} • {service.status}
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
