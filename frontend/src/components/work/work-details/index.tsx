import ChecklistCard from "./ChecklistCard";
import SearchFilter from "./SearchFilter";
import VehicleDetailsCard from "./VehicleDetailsCard";

const VehicleServiceAndChecklist = () => {
  const checklistData = [
    {
      id: 1,
      title: "Tyre Technician checklist",
      status: "Pending",
      progress: 25,
      icon: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="32" cy="32" r="28" fill="#4B5563" />
          <circle cx="32" cy="32" r="20" fill="#6B7280" />
          <circle cx="32" cy="32" r="12" fill="#9CA3AF" />
          <circle cx="32" cy="32" r="6" fill="#D1D5DB" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Alignment Technician checklist",
      status: "Pending",
      progress: 25,
      icon: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <rect x="16" y="8" width="32" height="48" fill="#4B5563" rx="2" />
          <circle cx="32" cy="28" r="12" fill="#6B7280" />
          <rect x="20" y="45" width="24" height="12" fill="#3B82F6" rx="1" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Balancing Technician checklist",
      status: "Pending",
      progress: 50,
      icon: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <ellipse cx="32" cy="40" rx="24" ry="8" fill="#4B5563" />
          <circle cx="32" cy="28" r="16" fill="#6B7280" />
          <circle cx="32" cy="28" r="10" fill="#9CA3AF" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "PUC Operator checklist",
      status: "Pending",
      progress: 25,
      icon: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <rect
            x="12"
            y="16"
            width="40"
            height="32"
            fill="#E5E7EB"
            stroke="#4B5563"
            strokeWidth="2"
            rx="2"
          />
          <circle cx="32" cy="32" r="8" fill="#3B82F6" />
          <path
            d="M 28 32 L 30 34 L 36 28"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchFilter />

      <div className="p-4">
        <VehicleDetailsCard
          vehicleNumber="KL 57 M 8478"
          name="Mirshad"
          phone="+91 807 812 345"
          distance="25.9400 km"
          step="3 of 5"
          status="Awaiting approval"
        />

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Vehicle Service Checklist
          </h2>

          {checklistData.map((item) => (
            <ChecklistCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              status={item.status}
              progress={item.progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleServiceAndChecklist;
