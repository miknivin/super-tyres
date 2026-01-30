// src/components/alerts/AlertsListPage.tsx
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

import { mockAlerts } from '../../data/mockAlerts';   // adjust path
import { AlertCard } from '../../components/work-alerts/AlertCard';

export default function WorkAlertsListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return mockAlerts;

    const query = searchQuery.toLowerCase().trim();
    return mockAlerts.filter((alert) =>
      alert.vehicleNumber.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Alerts</h1>

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
              placeholder="Search by vehicle number..."
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
            No alerts found matching <strong>"{searchQuery}"</strong>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert, index) => (
              <AlertCard
                key={`${alert.vehicleNumber}-${index}`}
                alert={alert}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}