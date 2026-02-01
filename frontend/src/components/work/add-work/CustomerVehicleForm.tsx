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
  const errors = useSelector((state: RootState) => state.serviceEnquiry.errors);

  const today = new Date().toISOString().split("T")[0];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // For odometer (number), convert string to number or undefined
    const payloadValue =
      name === "odometer" ? (value ? Number(value) : undefined) : value;

    dispatch(updateCustomer({ [name]: payloadValue }));

    // Clear error for this field when user types/changes value
    const errorKey = `customer.${name}`;
    if (errors[errorKey]) {
      dispatch(clearError({ field: errorKey }));
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
                errors["customer.name"] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full name"
            />
            {errors["customer.name"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["customer.name"]}
              </p>
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
                errors["customer.phone"] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter mobile number"
            />
            {errors["customer.phone"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["customer.phone"]}
              </p>
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
                errors["customer.address"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="House name, street, etc."
            />
            {errors["customer.address"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["customer.address"]}
              </p>
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
                  errors["customer.city"] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="City / Town"
              />
              {errors["customer.city"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["customer.city"]}
                </p>
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
                  errors["customer.pinCode1"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="6-digit pin"
                maxLength={6}
              />
              {errors["customer.pinCode1"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["customer.pinCode1"]}
                </p>
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
                errors["customer.vehicleName"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="e.g. Hyundai Creta SX"
            />
            {errors["customer.vehicleName"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["customer.vehicleName"]}
              </p>
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
                errors["customer.vehicleNo"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="e.g. KL 07 AB 1234"
            />
            {errors["customer.vehicleNo"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["customer.vehicleNo"]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Odometer Reading (km) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="odometer"
              value={formData.odometer ?? ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors["customer.odometer"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Current reading"
            />
            {errors["customer.odometer"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["customer.odometer"]}
              </p>
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
                errors["customer.wheel"] ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select wheel type</option>
              <option value="2-wheeler">2 Wheeler</option>
              <option value="4-wheeler">4 Wheeler</option>
            </select>
            {errors["customer.wheel"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["customer.wheel"]}
              </p>
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
                  errors["customer.vehicleType"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select category</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="muv">MUV</option>
                <option value="others">Others</option>
              </select>
              {errors["customer.vehicleType"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["customer.vehicleType"]}
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
                    errors["customer.serviceDate"]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <Calendar
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
              {errors["customer.serviceDate"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["customer.serviceDate"]}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
