// src/redux/slices/serviceValidation.ts

import type { ServiceEnquiryState } from "./serviceEnquiryFormSlice";

// ────────────────────────────────────────────────
// Helper type for validation functions
// ────────────────────────────────────────────────
type ValidatorFn = (
  data: ServiceEnquiryState["data"],
  errors: Record<string, string>,
) => Record<string, string>;

// ────────────────────────────────────────────────
// Customer validation (now centralized here)
// ────────────────────────────────────────────────
const validateCustomer: ValidatorFn = (data, errors) => {
  const customer = data.customer;

  if (!customer.name.trim()) errors["customer.name"] = "Name is required";
  if (!customer.phone.trim()) errors["customer.phone"] = "Phone is required";
  if (!customer.address.trim())
    errors["customer.address"] = "Address is required";
  if (!customer.city.trim()) errors["customer.city"] = "City is required";
  if (!customer.pinCode1.trim())
    errors["customer.pinCode1"] = "Pin code is required";
  if (!customer.vehicleName.trim())
    errors["customer.vehicleName"] = "Vehicle name is required";
  if (!customer.vehicleNo.trim())
    errors["customer.vehicleNo"] = "Vehicle number is required";
  if (!customer.odometer) errors["customer.odometer"] = "Odometer is required";
  if (!customer.wheel) errors["customer.wheel"] = "Wheel type is required";
  if (!customer.vehicleType)
    errors["customer.vehicleType"] = "Vehicle type is required";

  if (!customer.serviceDate) {
    errors["customer.serviceDate"] = "Service date is required";
  } else {
    const selectedDate = new Date(customer.serviceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors["customer.serviceDate"] = "Service date cannot be in the past";
    }
  }

  return errors;
};

// ────────────────────────────────────────────────
// Per-service inspection validators
// ────────────────────────────────────────────────
const serviceValidators: Record<string, ValidatorFn> = {
  TYRE_INSPECT: (data, errors) => {
    const { tyres } = data.tyreInspection;

    if (!tyres.frontLeft)
      errors["tyreInspection.tyres.frontLeft"] =
        "Front Left tyre data is required";
    if (!tyres.frontRight)
      errors["tyreInspection.tyres.frontRight"] =
        "Front Right tyre data is required";
    if (!tyres.rearLeft)
      errors["tyreInspection.tyres.rearLeft"] =
        "Rear Left tyre data is required";
    if (!tyres.rearRight)
      errors["tyreInspection.tyres.rearRight"] =
        "Rear Right tyre data is required";

    return errors;
  },

  TYRE_ROT: (data, errors) => {
    if (!data.tyreRotation.rotationType) {
      errors["tyreRotation.rotationType"] = "Rotation type is required";
    }
    return errors;
  },

  BALANCING: (data, errors) => {
    const { weights } = data.balancing;

    if (weights.frontLeft === undefined || weights.frontLeft === null) {
      errors["balancing.weights.frontLeft"] = "Front Left weight is required";
    }
    if (weights.frontRight === undefined || weights.frontRight === null) {
      errors["balancing.weights.frontRight"] = "Front Right weight is required";
    }
    if (weights.rearLeft === undefined || weights.rearLeft === null) {
      errors["balancing.weights.rearLeft"] = "Rear Left weight is required";
    }
    if (weights.rearRight === undefined || weights.rearRight === null) {
      errors["balancing.weights.rearRight"] = "Rear Right weight is required";
    }
    return errors;
  },

  CAR_WASH: (data, errors) => {
    if (data.carWashing.selectedServices.length === 0) {
      errors["carWashing.selectedServices"] =
        "At least one car wash service must be selected";
    }
    return errors;
  },

  BATTERY_CHECK: (data, errors) => {
    const { batteryCheck } = data;

    if (!batteryCheck.condition) {
      errors["batteryCheck.condition"] = "Battery condition is required";
    }
    if (!batteryCheck.voltage || batteryCheck.voltage <= 0) {
      errors["batteryCheck.voltage"] = "Valid voltage is required";
    }
    if (!batteryCheck.specificGravity || batteryCheck.specificGravity <= 0) {
      errors["batteryCheck.specificGravity"] =
        "Valid specific gravity is required";
    }
    return errors;
  },

  OIL_CHECK: (data, errors) => {
    const { oilCheckUp } = data;

    if (!oilCheckUp.quality) {
      errors["oilCheckUp.quality"] = "Oil quality is required";
    }
    if (!oilCheckUp.level) {
      errors["oilCheckUp.level"] = "Oil level is required";
    }
    return errors;
  },

  PUC: (data, errors) => {
    const { pusOperator } = data;

    if (!pusOperator.fuelType) {
      errors["pusOperator.fuelType"] = "Fuel type is required for PUC";
    }
    return errors;
  },

  // Add more services here when needed (e.g. ALIGNMENT)
};

// ────────────────────────────────────────────────
// Main validation function – used by nextStep reducer
// ────────────────────────────────────────────────
export const validateCurrentStep = (
  state: ServiceEnquiryState,
  stepKey: string,
): Record<string, string> => {
  let errors: Record<string, string> = {};

  // Customer step
  if (stepKey === "customer") {
    return validateCustomer(state.data, errors);
  }

  // Services step
  if (stepKey === "services") {
    if (state.data.selectedServices.length === 0) {
      errors["selectedServices"] = "Please select at least one service";
    }
    return errors;
  }

  // Inspection step: validate ONLY the current service/step
  const validator = serviceValidators[stepKey];
  if (validator) {
    errors = validator(state.data, errors);
  }

  return errors;
};
