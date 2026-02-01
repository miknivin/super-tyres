// src/components/work/add-work/ComplaintSummaryPage.tsx
import { useState } from "react";
import { Check, ChevronRight, MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import Modal from "../../ui/Modal";

// Import ALL service forms (for modal editing)
import TyreInspectionForm from "./TyreInspectionForm";
import AlignmentServiceForm from "./AlignmentServiceForm";
import TyreRotationForm from "./TyreRotationForm";
import BalancingForm from "./BalancingForm";
import CarWashingForm from "./CarWashingForm";
import PUSOperatorForm from "./PusOperatingForm";
import BatteryCheckForm from "./BatteryCheckForm";
import OilCheckForm from "./OilCheckForm";

// Service code → display name mapping (matches backend codes)
const serviceNameMap: Record<string, string> = {
  TYRE_INSPECT: "Tyre Inspection",
  ALIGNMENT: "Wheel Alignment",
  TYRE_ROT: "Tyre Rotation",
  BALANCING: "Balancing",
  CAR_WASH: "Car Wash",
  PUC: "PUC Test",
  BATTERY_CHECK: "Battery Check-up",
  OIL_CHECK: "Oil Check-up",
};

// Service code → Form component mapping (for modal editing)
const serviceFormComponents: Record<string, React.ComponentType> = {
  TYRE_INSPECT: TyreInspectionForm,
  ALIGNMENT: AlignmentServiceForm,
  TYRE_ROT: TyreRotationForm,
  BALANCING: BalancingForm,
  CAR_WASH: CarWashingForm,
  PUC: PUSOperatorForm,
  BATTERY_CHECK: BatteryCheckForm,
  OIL_CHECK: OilCheckForm,
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

  // ── Modal state for editing individual services ───────────────────────────
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const isModalOpen = editServiceId !== null;
  const modalTitle = editServiceId
    ? (serviceNameMap[editServiceId] ?? "Edit Service")
    : "";
  const SelectedForm = editServiceId
    ? serviceFormComponents[editServiceId]
    : null;

  // ── Prepare displayed service list ────────────────────────────────────────
  const selectedServiceList = selectedServices.map((code) => ({
    code,
    name: serviceNameMap[code] || code, // fallback to code if no mapping
  }));

  const totalServices = selectedServiceList.length;

  // ── Collect ALL complaints/notes from every service + global notes ────────
  const allComplaints: string[] = [];

  // Tyre Inspection
  if (tyreInspection) {
    tyreInspection.selectedComplaints.forEach((c) => allComplaints.push(c));
    if (tyreInspection.customComplaint?.trim()) {
      allComplaints.push(tyreInspection.customComplaint.trim());
    }
  }

  // Tyre Rotation
  if (tyreRotation?.complaint?.trim()) {
    allComplaints.push(tyreRotation.complaint.trim());
  }

  // Alignment
  if (alignment?.complaint?.trim()) {
    allComplaints.push(alignment.complaint.trim());
  }

  // Car Wash
  if (carWashing?.complaint?.trim()) {
    allComplaints.push(carWashing.complaint.trim());
  }

  // PUC / PUS Operator (if you have complaint field later)
  // if (pusOperator?.complaint?.trim()) allComplaints.push(...);

  // Battery Check
  if (batteryCheck?.complaint?.trim()) {
    allComplaints.push(batteryCheck.complaint.trim());
  }

  // Oil Check
  if (oilCheckUp?.complaint?.trim()) {
    allComplaints.push(oilCheckUp.complaint.trim());
  }

  // Global complaint notes
  if (complaintNotes?.trim()) {
    allComplaints.push(complaintNotes.trim());
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center shadow-lg">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-8">
          Complaint Entry Completed
        </h1>

        {/* Vehicle & Customer Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {customer.vehicleNo || "Vehicle Number Not Set"}
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Customer Details
              </h3>
              <p className="text-sm text-gray-700 font-medium">
                {customer.name || "Not Set"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {customer.phone || "Not Set"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Odometer: {customer.odometer ?? "Not Set"} km
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Service Details
              </h3>
              <div className="text-sm space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Date</span>
                  <span>
                    {customer.serviceDate
                      ? new Date(customer.serviceDate).toLocaleDateString()
                      : "Not Set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Odometer</span>
                  <span>{customer.odometer ?? "Not Set"} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Complaints Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Entered Services & Complaints
            </h3>
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              {totalServices} service{totalServices !== 1 ? "s" : ""} entered
            </span>
          </div>

          {/* List of selected services */}
          {selectedServiceList.length > 0 ? (
            <div className="space-y-3 mb-8">
              {selectedServiceList.map((service) => (
                <div
                  key={service.code}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-base font-medium text-gray-800">
                    {service.name}
                  </span>
                  <button
                    onClick={() => setEditServiceId(service.code)}
                    className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                    title={`Edit ${service.name}`}
                  >
                    <ChevronRight
                      size={20}
                      className="text-gray-400 group-hover:text-teal-600"
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">
              No services selected yet
            </p>
          )}

          {/* All collected complaints/notes */}
          {allComplaints.length > 0 ? (
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Notes / Complaints
              </h4>
              <div className="space-y-3">
                {allComplaints.map((note, idx) => (
                  <p
                    key={idx}
                    className="bg-gray-50 p-4 rounded-lg text-gray-700 border border-gray-100"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-6 border-t border-gray-200 text-center text-gray-500">
              No complaints or notes entered
            </div>
          )}
        </div>

        {/* ── Edit Modal ────────────────────────────────────────────────────── */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setEditServiceId(null)}
          title={`Edit ${modalTitle}`}
        >
          {SelectedForm ? (
            <SelectedForm />
          ) : (
            <div className="py-12 text-center text-gray-500">
              Form not implemented for this service yet.
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
