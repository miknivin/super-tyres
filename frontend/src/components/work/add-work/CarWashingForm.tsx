// src/components/work/add-work/CarWashingForm.tsx

import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store"; // adjust path
import { goToStep, updateCarWashing } from "../../../redux/slices/serviceEnquiryFormSlice"; // adjust path
import carWash from "../../../assets/services/car-wash-illustration.jpeg";
export default function CarWashingForm() {
  const dispatch = useDispatch();

  // Read from Redux
  const { selectedServices, complaint } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.carWashing,
  );

  const services = [
    "Interior vacuum",
    "Engine cleaning",
    "Tyre polishing",
    "Dashboard polishing",
  ];

  const handleToggleService = (service: string) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];

    dispatch(updateCarWashing({ selectedServices: updated }));
  };

  const handleComplaintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateCarWashing({ complaint: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Back Button – optional (ServiceLayout usually handles navigation) */}
        <button onClick={() => dispatch(goToStep(1))} className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors">
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Services</span>
        </button>

        {/* Car Wash Image */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="w-full aspect-video bg-linear-to-br from-blue-50 to-teal-50 rounded-lg flex items-center justify-center">
            <img src={carWash} alt="Car Wash Illustration" className="w-full" />
          </div>
        </div>

        {/* Washing Services Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Car Washing Services
          </h3>

          {/* Service Options */}
          <div className="flex flex-wrap gap-3 mb-6">
            {services.map((service) => (
              <button
                key={service}
                onClick={() => handleToggleService(service)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  selectedServices.includes(service)
                    ? "bg-teal-50 border-teal-600 text-teal-700"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {service}
              </button>
            ))}
          </div>

          {/* Complaint Text Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaints / Notes
            </label>
            <textarea
              placeholder="Enter any specific requests or issues..."
              value={complaint}
              onChange={handleComplaintChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* No Back/Next buttons here – handled by ServiceLayout */}
      </div>
    </div>
  );
}
