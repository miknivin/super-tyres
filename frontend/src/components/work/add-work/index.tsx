// index.tsx
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import {
  nextStep,
  prevStep,
} from "../../../redux/slices/serviceEnquiryFormSlice";
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
  const currentStep = useSelector(
    (state: RootState) => state.serviceEnquiry.currentStep,
  );
  const selectedServices = useSelector(
    (state: RootState) => state.serviceEnquiry.data.selectedServices,
  );

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
    // Alternative if you want to scroll only inside a container:
    // document.querySelector('#form-container')?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Resolve component — fallback is stable
  const CurrentComponent = stepComponents[currentStepKey] ?? NotFoundComponent;

  const handleNext = () => {
    // Special validation for "services" step
    if (currentStepKey === "services") {
      if (selectedServices.length === 0) {
        toast.error("Please select at least one service before proceeding", {
          duration: 4000,
          position: "top-center",
        });
        return; // Block navigation
      }
    }

    // Normal navigation
    if (currentStep < steps.length - 1) {
      dispatch(nextStep());
      scrollToTop();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(prevStep());
      scrollToTop();
    }
  };

  return (
    <ServiceLayout onBack={handleBack} onNext={handleNext}>
      <CurrentComponent step={currentStepKey} />
    </ServiceLayout>
  );
}
