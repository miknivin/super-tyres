// src/components/work/VehicleServiceManagement.tsx
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllServiceEnquiriesQuery } from "../../redux/api/servicesApi";
import SearchBar from "./SearchBar";
import OngoingVehicleCard from "./OngoingVehicleCard";
import CompletedVehicleCard from "./CompletedVehicleCard";
import { useState } from "react";

const VehicleServiceManagement = () => {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing",
  );

  // Fetch all service enquiries from backend
  const {
    data: enquiries = [],
    isLoading,
    isError,
  } = useGetAllServiceEnquiriesQuery();

  // Split enquiries into ongoing and completed
  const ongoingEnquiries = enquiries.filter(
    (e) =>
      e.status.toLowerCase() === "pending" ||
      e.status.toLowerCase() === "in progress" ||
      e.status.toLowerCase() === "ongoing",
  );

  const completedEnquiries = enquiries.filter(
    (e) => e.status.toLowerCase() === "completed",
  );

  const displayed =
    activeTab === "ongoing" ? ongoingEnquiries : completedEnquiries;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto text-center py-12 text-gray-600">
          Loading Enquiries...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto text-center py-12 text-red-600">
          Failed to load vehicles. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-teal-600 text-white px-4 py-5 flex items-center justify-between rounded-md mb-6">
          <span className="text-lg font-semibold">Add New Vehicle</span>
          <Link to="/work/add">
            <Plus className="w-7 h-7" />
          </Link>
        </div>

        <SearchBar />

        {/* Tabs */}
        <div className="flex gap-6 my-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`pb-2 font-medium text-sm transition-colors ${
              activeTab === "ongoing"
                ? "text-teal-700 border-b-2 border-teal-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Ongoing work ({ongoingEnquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 font-medium text-sm transition-colors ${
              activeTab === "completed"
                ? "text-teal-700 border-b-2 border-teal-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed ({completedEnquiries.length})
          </button>
        </div>

        {/* Cards */}
        <div className="mt-5 space-y-4">
          {displayed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {activeTab === "ongoing"
                ? "No ongoing work at the moment"
                : "No completed work yet"}
            </div>
          ) : (
            displayed.map((enquiry) => (
              <div
                key={enquiry.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                {activeTab === "ongoing" ? (
                  <OngoingVehicleCard
                    vehicle={{
                      id: enquiry.id,
                      plate: enquiry.vehicleNo,
                      owner: enquiry.customerName,
                      phone: enquiry.customerPhone,
                      odometer: enquiry.odometer ? enquiry.odometer : 0,
                      services: enquiry.serviceWithNames
                        .map((s) => s.name)
                        .join(", "),
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleServiceManagement;
