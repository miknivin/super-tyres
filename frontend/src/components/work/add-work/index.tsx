/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/work/add-work/index.tsx
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  nextStep,
  prevStep,
  setSubmitStatus,
  setSubmitError,
  resetForm,
} from "../../../redux/slices/serviceEnquiryFormSlice";
import { useCreateServiceEnquiryMutation } from "../../../redux/api/servicesApi";
import ServiceLayout from "../../../layouts/ServiceLayout";
import CustomerVehicleForm from "./CustomerVehicleForm";
import AlignmentServiceForm from "./AlignmentServiceForm";
import ServiceDetailsForm from "./ServiceDetailsForm";
import TyreInspectionForm from "./TyreInspectionForm";
import TyreRotationForm from "./TyreRotationForm";
import BalancingForm from "./BalancingForm";
import CarWashingForm from "./CarWashingForm";
import PUSOperatorForm from "./PusOperatingForm";
import BatteryCheckForm from "./BatteryCheckForm";
import OilCheckForm from "./OilCheckForm";
import ComplaintSummaryPage from "./ComplaintSummaryPage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ── Placeholders ──
const NotFoundComponent = ({ step }: { step: string }) => (
  <div className="p-8 text-center text-red-600 font-medium">
    Error: No component found for step "{step}"
  </div>
);

// Order preserved
const serviceFormOrder = [
  "TYRE_INSPECT",
  "ALIGNMENT",
  "TYRE_ROT",
  "BALANCING",
  "CAR_WASH",
  "PUC",
  "BATTERY_CHECK",
  "OIL_CHECK",
] as const;

const stepComponents: Record<string, React.ComponentType<{ step?: string }>> = {
  customer: CustomerVehicleForm,
  services: ServiceDetailsForm,
  TYRE_INSPECT: TyreInspectionForm,
  ALIGNMENT: AlignmentServiceForm,
  TYRE_ROT: TyreRotationForm,
  BALANCING: BalancingForm,
  CAR_WASH: CarWashingForm,
  PUC: PUSOperatorForm,
  BATTERY_CHECK: BatteryCheckForm,
  OIL_CHECK: OilCheckForm,
  summary: ComplaintSummaryPage,
};

export default function ServiceEnquiryIndex() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentStep = useSelector(
    (state: RootState) => state.serviceEnquiry.currentStep,
  );
  const selectedServices = useSelector(
    (state: RootState) => state.serviceEnquiry.data.selectedServices,
  );
  const formData = useSelector((state: RootState) => state.serviceEnquiry.data);

  const [createEnquiry, { isLoading }] = useCreateServiceEnquiryMutation();

  const getStepSequence = () => {
    const fixed = ["customer", "services"] as const;
    const active = serviceFormOrder.filter((id) =>
      selectedServices.includes(id),
    );
    return [...fixed, ...active, "summary"] as const;
  };

  const steps = getStepSequence();
  const currentStepKey = steps[currentStep] ?? "summary";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const CurrentComponent = stepComponents[currentStepKey] ?? NotFoundComponent;

  const handleNext = () => {
    dispatch(nextStep(currentStepKey));
    scrollToTop();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(prevStep());
      scrollToTop();
    }
  };

  // Final submit handler – called only on summary page
  const handleSubmit = async () => {
    dispatch(setSubmitStatus("loading"));

    try {
      // Final quick verification
      if (selectedServices.length === 0) {
        toast.error("At least one service must be selected");
        return;
      }

      // Build payload matching CreateServiceEnquiryRequest
      const payload = {
        customerName: formData.customer.name,
        customerPhone: formData.customer.phone,
        customerAddress: formData.customer.address,
        customerCity: formData.customer.city,
        pinCode: formData.customer.pinCode1,
        vehicleName: formData.customer.vehicleName,
        vehicleNo: formData.customer.vehicleNo,
        odometer: formData.customer.odometer,
        wheel: formData.customer.wheel,
        vehicleType: formData.customer.vehicleType,
        serviceDate: formData.customer.serviceDate,
        complaintNotes: formData.complaintNotes,

        selectedServices: formData.selectedServices,

        // Include inspection data only if service was selected
        tyreInspection: selectedServices.includes("TYRE_INSPECT")
          ? formData.tyreInspection
          : undefined,
        tyreRotationInspection: selectedServices.includes("TYRE_ROT")
          ? formData.tyreRotation
          : undefined,
        alignmentInspection: selectedServices.includes("ALIGNMENT")
          ? formData.alignment
          : undefined,
        balancingInspection: selectedServices.includes("BALANCING")
          ? formData.balancing
          : undefined,
        carWashInspection: selectedServices.includes("CAR_WASH")
          ? formData.carWashing
          : undefined,
        pucInspection: selectedServices.includes("PUC")
          ? formData.pusOperator
          : undefined,
        batteryInspection: selectedServices.includes("BATTERY_CHECK")
          ? formData.batteryCheck
          : undefined,
        oilInspection: selectedServices.includes("OIL_CHECK")
          ? formData.oilCheckUp
          : undefined,
      };

      await createEnquiry(payload).unwrap();

      dispatch(setSubmitStatus("success"));
      toast.success("Service enquiry created successfully!");

      // Reset form and redirect to /work
      dispatch(resetForm());
      navigate("/work");
    } catch (err: any) {
      dispatch(setSubmitStatus("error"));
      const errorMsg = err?.data?.message || "Failed to create enquiry";
      dispatch(setSubmitError(errorMsg));
      toast.error(errorMsg);
    }
  };

  // Check if this is the last step (summary)
  const isLastStep = currentStep === steps.length - 1;

  return (
    <ServiceLayout
      onBack={handleBack}
      onNext={handleNext}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      isLastStep={isLastStep}
    >
      <CurrentComponent step={currentStepKey} />
    </ServiceLayout>
  );
}
