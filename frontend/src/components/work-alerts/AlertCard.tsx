// src/components/work-alerts/AlertCard.tsx
import { useNavigate } from "react-router-dom";

interface EnquiryAlertCardProps {
  alert: {
    id: string;
    customerName: string;
    customerPhone: string;
    vehicleNumber: string;
    vehicleName: string;
    status: string;
    createdAt: string;
    serviceDate?: string | null;
    odometer?: number | null;
    displayServices?: string;
    timeElapsed?: string;
  };
}

export function AlertCard({ alert }: EnquiryAlertCardProps) {
  const navigate = useNavigate();

  const displayOdometer =
    alert.odometer != null ? `${alert.odometer.toLocaleString()} km` : "—";

  const servicesText = alert.displayServices || "Service";

  const time = alert.timeElapsed || "—";

  const statusColorClass =
    alert.status === "Pending"
      ? "text-amber-600 dark:text-amber-400"
      : alert.status === "Completed"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-teal-600 dark:text-teal-400";

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow">
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {alert.vehicleNumber}
            </h3>
            <p className="font-medium text-gray-700">{alert.customerName}</p>
            <p className="text-sm text-gray-500">{alert.customerPhone}</p>
          </div>

          <span className="inline-flex items-center whitespace-nowrap rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
            {time}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span>{displayOdometer}</span>
          <span
            className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500"
            aria-hidden="true"
          />
          <span className="font-medium">{servicesText}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${statusColorClass}`}>
            {alert.status}
          </span>

          {alert.status === "Pending" && (
            <button
              type="button"
              className="rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800"
              onClick={() => navigate(`/work/${alert.id}`)}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
