// src/components/work/add-work/ComplaintSummaryPage.tsx
import { useState } from "react";
import { Check, ChevronRight, MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store"; // adjust path if needed

// Import Modal component

// Import ALL service forms
import TyreInspectionForm from "./TyreInspectionForm";
import AlignmentServiceForm from "./AlignmentServiceForm";
import TyreRotationForm from "./TyreRotationForm";
import BalancingForm from "./BalancingForm";
import CarWashingForm from "./CarWashingForm";
import PUSOperatorForm from "./PusOperatingForm";
import BatteryCheckForm from "./BatteryCheckForm";
import OilCheckForm from "./OilCheckForm";
import Modal from "../../ui/Modal";

// Service name mapping
const serviceNameMap: Record<string, string> = {
  "tyre-inspection": "Tyre Inspection",
  alignment: "Wheel Alignment",
  "tyre-rotation": "Tyre Rotation",
  balancing: "Balancing",
  "car-wash": "Car Wash",
  "puc-operator": "PUC Test",
  "battery-check": "Battery Check-up",
  "oil-check": "Oil Check-up",
};

// Service ID → Form component mapping (for modal editing)
const serviceFormComponents: Record<string, React.ComponentType> = {
  "tyre-inspection": TyreInspectionForm,
  alignment: AlignmentServiceForm,
  "tyre-rotation": TyreRotationForm,
  balancing: BalancingForm,
  "car-wash": CarWashingForm,
  "puc-operator": PUSOperatorForm,
  "battery-check": BatteryCheckForm,
  "oil-check": OilCheckForm,
};

export default function ComplaintSummaryPage() {
  const {
    data: {
      customer,
      selectedServices,
      complaintNotes,
      tyreInspection,
      tyreRotation,
      alignment,
      carWashing,
      batteryCheck,
      oilCheckUp,
    },
  } = useSelector((state: RootState) => state.serviceEnquiry);

  // ── Modal state ───────────────────────────────────────────────
  const [editServiceId, setEditServiceId] = useState<string | null>(null);

  const isModalOpen = editServiceId !== null;
  const modalTitle = editServiceId
    ? (serviceNameMap[editServiceId] ?? "Edit Service")
    : "";

  const SelectedForm = editServiceId
    ? serviceFormComponents[editServiceId]
    : null;

  // ── Prepare displayed service list ────────────────────────────
  const selectedServiceList = selectedServices
    .map((id) => ({
      id,
      name: serviceNameMap[id] || id,
    }))
    .filter((item) => item.name !== item.id); // optional filter

  const totalServices = selectedServiceList.length;

  // ── Collect ALL complaints from every service ─────────────────
  const allComplaints = [
    // Tyre Inspection
    ...(tyreInspection?.selectedComplaints || []),
    tyreInspection?.customComplaint?.trim() || "",

    // Tyre Rotation
    tyreRotation?.complaint?.trim() || "",

    // Alignment
    alignment?.complaint?.trim() || "",

    // Car Wash
    carWashing?.complaint?.trim() || "",

    // PUC / PUS Operator

    // Battery Check
    batteryCheck?.complaint?.trim() || "",

    // Oil Check
    oilCheckUp?.complaint?.trim() || "",

    // Global complaint notes (from summary or general field)
    complaintNotes?.trim() || "",
  ].filter(Boolean); // remove empty strings

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center shadow-lg">
            <Check size={32} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-lg font-semibold text-gray-900 mb-6">
          Complaint Entry Completed
        </h1>

        {/* Vehicle & Customer Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-gray-900">
              {customer.vehicleNo || "KL 57 M 8478"}
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
              <p className="text-sm text-gray-700 font-medium">
                {customer.name || "Mirshad"}
              </p>
              <p className="text-xs text-gray-500">
                {customer.phone || "+91 807 812 345"}
              </p>
              <p className="text-xs text-gray-500">
                {customer.odometer || "25,5400 km"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Service Details
              </h3>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service date</span>
                  <span className="text-gray-900">
                    {customer.serviceDate || "12/02/2024"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Odometer</span>
                  <span className="text-gray-900">
                    {customer.odometer || "58,000 km"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Complaints */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Entered Services & Complaints
            </h3>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              Total {totalServices} service{totalServices !== 1 ? "s" : ""}{" "}
              entered
            </span>
          </div>

          <div className="space-y-2">
            {selectedServiceList.length > 0 ? (
              selectedServiceList.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-sm text-gray-700">{service.name}</span>
                  <button
                    onClick={() => setEditServiceId(service.id)}
                    className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                    title={`Edit ${service.name}`}
                  >
                    <ChevronRight
                      size={18}
                      className="text-gray-400 group-hover:text-teal-600"
                    />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No services selected yet
              </p>
            )}
          </div>

          {/* All collected complaints */}
          {allComplaints.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-800 mb-2">
                Notes / Complaints
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                {allComplaints.map((note, idx) => (
                  <p key={idx} className="bg-gray-50 p-2 rounded">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Estimated Time */}
        <div className="mb-8">
          <div className="bg-teal-100 text-teal-700 rounded-lg px-4 py-3 inline-block">
            <div className="text-xs mb-1">Estimated Time</div>
            <div className="text-lg font-bold">1 hour 30 min</div>
          </div>
        </div>

        {/* Start Work Button */}
        <div className="flex justify-center">
          <button className="px-8 py-3 w-full bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-md">
            Start Work
          </button>
        </div>

        {/* ── Edit Modal ──────────────────────────────────────────────── */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setEditServiceId(null)}
          title={`Edit ${modalTitle}`}
        >
          {SelectedForm ? (
            <SelectedForm />
          ) : (
            <div className="py-8 text-center text-gray-500">
              Form not implemented for this service yet.
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
