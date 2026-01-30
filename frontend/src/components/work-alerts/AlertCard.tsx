// src/components/alerts/AlertCard.tsx

import type { Alert } from "../../types/alert.types";

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow">
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {alert.vehicleNumber}
            </h3>
            <p className="font-medium text-gray-700">{alert.customerName}</p>
            <p className="text-sm text-gray-500">{alert.phone}</p>
          </div>

          <span className="inline-flex items-center whitespace-nowrap rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
            {alert.timeElapsed}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-3 text-sm text-gray-600">
          <span>{alert.odometer}</span>
          <span className="h-1 w-1 rounded-full bg-gray-400" aria-hidden="true" />
          <span>{alert.service}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-teal-600">{alert.status}</span>

          <button
            type="button"
            className="rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}