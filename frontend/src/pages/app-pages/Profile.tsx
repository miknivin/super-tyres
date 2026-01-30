import { Edit, SlidersHorizontal } from "lucide-react";

export default function EmployeeProfile() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
                AK
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Ajay Kapoor
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Tyre Technician · Alignment Operator
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Employee ID{" "}
                  <span className="text-gray-900 font-medium">#231234</span>
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors">
              <Edit size={16} />
              <span className="text-sm font-medium">Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Today's Work Summary */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Work Summary
            </h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <SlidersHorizontal size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Jobs</p>
                <p className="text-3xl font-bold text-gray-900">
                  8{" "}
                  <span className="text-sm font-normal text-gray-500">
                    Today's Jobs
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Time Worked</p>
                <p className="text-3xl font-bold text-gray-900">4h35m</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Vehicles Handled</p>
                <p className="text-3xl font-bold text-gray-900">
                  4{" "}
                  <span className="text-sm font-normal text-gray-500">
                    Cars
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Est. Service Value</p>
                <p className="text-3xl font-bold text-gray-900">₹ 42,00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Work Breakdown */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Work Breakdown
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <span className="text-gray-700 font-medium">Tyre Inspection</span>
              <span className="bg-teal-100 text-teal-700 font-semibold px-3 py-1 rounded-md">
                6
              </span>
            </div>
            <div className="flex-1 bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <span className="text-gray-700 font-medium">Alignment</span>
              <span className="bg-teal-100 text-teal-700 font-semibold px-3 py-1 rounded-md">
                2
              </span>
            </div>
          </div>
        </div>

        {/* Recent Work */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Work
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">KL 10 MN 1234</span>
                <span className="text-gray-600">Alignment</span>
              </div>
              <span className="text-sm text-gray-500">45 mins ago</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">KL 10 MN 1234</span>
                <span className="text-gray-600">Alignment</span>
              </div>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">KL 10 MN 1234</span>
                <span className="text-gray-600">Alignment</span>
              </div>
              <span className="text-sm text-gray-500">45 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
