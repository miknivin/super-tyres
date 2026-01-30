// src/components/work/add-work/CustomerVehicleForm.tsx
import { type ChangeEvent } from "react";
import { Calendar, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  clearError,
  updateCustomer,
} from "../../../redux/slices/serviceEnquiryFormSlice";
import { Link } from "react-router-dom";

export default function CustomerVehicleForm() {
  const dispatch = useDispatch();

  const formData = useSelector(
    (state: RootState) => state.serviceEnquiry.data.customer,
  );
  const today = new Date().toISOString().split("T")[0];
  // Track field-specific errors
  const errors = useSelector((state: RootState) => state.serviceEnquiry.errors);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    dispatch(updateCustomer({ [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      // Dispatch an action to clear this error from Redux
      dispatch(clearError({ field: name }));
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/work"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">Home</span>
      </Link>

      {/* Customer Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Customer Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter mobile number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="House name, street, etc."
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="City / Town"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pinCode1"
                value={formData.pinCode1}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.pinCode1 ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="6-digit pin"
                maxLength={6}
              />
              {errors.pinCode1 && (
                <p className="text-red-500 text-xs mt-1">{errors.pinCode1}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Vehicle Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Vehicle (Name/Model) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="vehicleName"
              value={formData.vehicleName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.vehicleName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. Hyundai Creta SX"
            />
            {errors.vehicleName && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicleName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Vehicle Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="vehicleNo"
              value={formData.vehicleNo}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase ${
                errors.vehicleNo ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. KL 07 AB 1234"
            />
            {errors.vehicleNo && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicleNo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Odometer Reading (km) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="odometer"
              value={formData.odometer}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.odometer ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Current reading"
            />
            {errors.odometer && (
              <p className="text-red-500 text-xs mt-1">{errors.odometer}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Wheel Type <span className="text-red-500">*</span>
            </label>
            <select
              name="wheel"
              value={formData.wheel}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${
                errors.wheel ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select wheel type</option>
              <option value="2-wheeler">2 Wheeler</option>
              <option value="4-wheeler">4 Wheeler</option>
            </select>
            {errors.wheel && (
              <p className="text-red-500 text-xs mt-1">{errors.wheel}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Vehicle Category <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${
                  errors.vehicleType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select category</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="muv">MUV</option>
                <option value="others">Others</option>
              </select>
              {errors.vehicleType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.vehicleType}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Preferred Service Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="serviceDate"
                  min={today}
                  value={formData.serviceDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.serviceDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <Calendar
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
              {errors.serviceDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.serviceDate}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
