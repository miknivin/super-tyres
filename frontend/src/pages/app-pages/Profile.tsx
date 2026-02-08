import { Edit } from "lucide-react";

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
