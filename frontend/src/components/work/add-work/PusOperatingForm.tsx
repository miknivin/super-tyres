// src/components/work/add-work/PUSOperatorForm.tsx

import { ChevronLeft, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store"; // adjust path
import {
  goToStep,
  updatePUSOperator,
} from "../../../redux/slices/serviceEnquiryFormSlice"; // adjust path

interface TestToggles {
  normalPUC: boolean;
  engineWarmUp: boolean;
  highRPM: boolean;
  idleRPM: boolean;
  certificatePrint: boolean;
}

type FuelType = "Petrol" | "Diesel" | "CNG/LPG" | null;

export default function PUSOperatorForm() {
  const dispatch = useDispatch();

  // Read from Redux
  const { tests, fuelType } = useSelector(
    (state: RootState) => state.serviceEnquiry.data.pusOperator,
  );

  const handleToggleTest = (test: keyof TestToggles) => {
    dispatch(
      updatePUSOperator({
        tests: {
          ...tests,
          [test]: !tests[test],
        },
      }),
    );
  };

  const handleFuelTypeChange = (value: FuelType) => {
    dispatch(updatePUSOperator({ fuelType: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Back Button – optional (ServiceLayout handles navigation) */}
        <button
          onClick={() => dispatch(goToStep(1))}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Services</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Vehicle and Customer Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-bold text-gray-900">
                KL 57 M 8478
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Customer Details
                </h3>
                <p className="text-sm text-gray-700 font-medium">Mirshad</p>
                <p className="text-xs text-gray-500">+91 807 812 345</p>
                <p className="text-xs text-gray-500">25,5400 km</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Service Details
                </h3>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service date</span>
                    <span className="text-gray-900">12/02/2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">km</span>
                    <span className="text-gray-900">58,000 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PUS Operator Section */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
              PUS Operator
            </h2>

            {/* Test Toggles */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Normal PUC Test</span>
                <button
                  onClick={() => handleToggleTest("normalPUC")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    tests.normalPUC ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      tests.normalPUC ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Engine warm-up Required
                </span>
                <button
                  onClick={() => handleToggleTest("engineWarmUp")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    tests.engineWarmUp ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      tests.engineWarmUp ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">High RPM Test</span>
                <button
                  onClick={() => handleToggleTest("highRPM")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    tests.highRPM ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      tests.highRPM ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Idle RPM Test</span>
                <button
                  onClick={() => handleToggleTest("idleRPM")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    tests.idleRPM ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      tests.idleRPM ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Certificate Print</span>
                <button
                  onClick={() => handleToggleTest("certificatePrint")}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    tests.certificatePrint ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      tests.certificatePrint
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Fuel Type
              </h3>
              <div className="flex gap-6 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fuelType"
                    checked={fuelType === "Petrol"}
                    onChange={() => handleFuelTypeChange("Petrol")}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-teal-600 peer-checked:border-[5px] transition-all"></div>
                  <span className="text-sm text-gray-700">Petrol</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fuelType"
                    checked={fuelType === "Diesel"}
                    onChange={() => handleFuelTypeChange("Diesel")}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-teal-600 peer-checked:border-[5px] transition-all"></div>
                  <span className="text-sm text-gray-700">Diesel</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fuelType"
                    checked={fuelType === "CNG/LPG"}
                    onChange={() => handleFuelTypeChange("CNG/LPG")}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-teal-600 peer-checked:border-[5px] transition-all"></div>
                  <span className="text-sm text-gray-700">CNG/LPG</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* No Back/Next buttons – handled by ServiceLayout */}
      </div>
    </div>
  );
}
