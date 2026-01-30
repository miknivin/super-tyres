import { useState } from "react";
import { Plus } from "lucide-react";
import type { Vehicle } from "../../types/vehicle";
import SearchBar from "./SearchBar";
import OngoingVehicleCard from "./OngoingVehicleCard";
import CompletedVehicleCard from "./CompletedVehicleCard";
import { Link } from "react-router-dom";

const VehicleServiceManagement = () => {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing",
  );

  const ongoingVehicles: Vehicle[] = [
    {
      id: 1,
      plate: "KL 57 M 8478",
      owner: "Mirshad",
      phone: "807812345",
      mileage: "25,5400 km",
      services: "Tyre Inspection, Alignment +2more",
      status: "awaiting",
    },
    {
      id: 2,
      plate: "KL 57 M 8478",
      owner: "Leo",
      phone: "807812345",
      mileage: "56,900 km",
      services: "Tyre Inspection",
      timeBadge: "+5 minute",
      status: "ongoing",
    },
    {
      id: 3,
      plate: "KL 11 AB 1128",
      owner: "Mack",
      phone: "807812345",
      mileage: "25,734 km",
      services: "Washing",
      timeBadge: "+25 minute",
      status: "ongoing",
    },
  ];

  const completedVehicles: Vehicle[] = [
    {
      id: 4,
      plate: "KL 57 1123",
      owner: "Mirshad",
      phone: "+91 807 812 345",
      mileage: "25,5400 km",
      success: true,
    },
    {
      id: 5,
      plate: "KL 57 MM 1123",
      owner: "Mirshad",
      phone: "+91 807 812 345",
      mileage: "25,5400 km",
      success: true,
    },
    {
      id: 6,
      plate: "KL MM 1123",
      owner: "Mirshad",
      phone: "+91 807 812 345",
      mileage: "25,540 km",
      success: true,
    },
  ];

  const displayed =
    activeTab === "ongoing" ? ongoingVehicles : completedVehicles;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-teal-600 text-white px-4 py-5 flex items-center justify-between rounded-md">
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
            className={`pb-2 font-medium text-sm ${
              activeTab === "ongoing"
                ? "text-teal-700 border-b-2 border-teal-700"
                : "text-gray-500"
            }`}
          >
            Ongoing work
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 font-medium text-sm ${
              activeTab === "completed"
                ? "text-teal-700 border-b-2 border-teal-700"
                : "text-gray-500"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Cards */}
        <div className="mt-5 space-y-4">
          {displayed.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              {activeTab === "ongoing" ? (
                <OngoingVehicleCard vehicle={vehicle} />
              ) : (
                <CompletedVehicleCard vehicle={vehicle} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleServiceManagement;
