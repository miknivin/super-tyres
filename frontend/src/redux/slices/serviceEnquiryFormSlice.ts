import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TyrePosition } from "../../components/work/add-work/TyreInspectionForm";
import type { BatteryCondition } from "../../components/work/add-work/BatteryCheckForm";
import type {
  OilLevel,
  OilQuality,
} from "../../components/work/add-work/OilCheckForm";

// ────────────────────────────────────────────────
// Interfaces (same as before)
interface CustomerVehicleFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  pinCode1: string;
  pinCode2: string;
  vehicleName: string;
  vehicleNo: string;
  odometer: string;
  wheel: "" | "2-wheeler" | "4-wheeler";
  vehicleType: "" | "sedan" | "suv" | "hatchback";
  serviceDate: string;
}

interface AlignmentData {
  lastServiceDate: string;
  complaint: string;
  inflationPressure: "AIR" | "NO";
}

interface TyreValues {
  treadDepth: "Good" | "Average" | "Replace";
  tyrePressure: number;
}

type FuelType = "Petrol" | "Diesel" | "CNG/LPG" | null;

interface TyreInspectionData {
  selectedTyre: TyrePosition | null;
  tyres: {
    frontLeft: TyreValues | null;
    frontRight: TyreValues | null;
    rearLeft: TyreValues | null;
    rearRight: TyreValues | null;
  };
  selectedComplaints: string[];
  customComplaint: string;
}

interface TyreRotationData {
  rotationType: "4-tyre" | "unidirectional" | "5-tyre" | null;
  complaint: string;
}

interface BalancingData {
  weights: {
    frontLeft: string;
    frontRight: string;
    rearLeft: string;
    rearRight: string;
  };
  complaint: string;
}

interface CarWashingData {
  selectedServices: string[];
  complaint: string;
}

interface TestToggles {
  normalPUC: boolean;
  engineWarmUp: boolean;
  highRPM: boolean;
  idleRPM: boolean;
  certificatePrint: boolean;
}

interface PUSOperatorData {
  tests: TestToggles;
  fuelType: FuelType;
}

interface BatteryCheckData {
  condition: BatteryCondition | null;
  voltage: number;
  specificGravity: number;
  complaint: string;
}

interface OilCheckUpData {
  quality: OilQuality | null;
  level: OilLevel | null;
  complaint: string;
}

interface ComplaintSummaryData {
  notes?: string;
}

// ────────────────────────────────────────────────
// State with validation & status
// ────────────────────────────────────────────────
interface ServiceEnquiryState {
  currentStep: number;
  data: {
    selectedServices: string[];
    complaintNotes: string;
    customer: CustomerVehicleFormData;
    alignment: AlignmentData;
    tyreInspection: TyreInspectionData;
    tyreRotation: TyreRotationData;
    balancing: BalancingData;
    carWashing: CarWashingData;
    pusOperator: PUSOperatorData;
    batteryCheck: BatteryCheckData;
    oilCheckUp: OilCheckUpData;
    summary: ComplaintSummaryData;
  };
  // New: field-level errors (for customer step and others)
  errors: Record<string, string>;
  // New: form submission status
  submitStatus: "idle" | "loading" | "success" | "error";
  submitError?: string;
}

const initialState: ServiceEnquiryState = {
  currentStep: 0,
  data: {
    selectedServices: [],
    complaintNotes: "",
    customer: {
      name: "",
      phone: "",
      address: "",
      city: "",
      pinCode1: "",
      pinCode2: "",
      vehicleName: "",
      vehicleNo: "",
      odometer: "",
      wheel: "",
      vehicleType: "",
      serviceDate: "",
    },
    alignment: {
      lastServiceDate: "",
      complaint: "",
      inflationPressure: "NO",
    },
    tyreInspection: {
      selectedTyre: null,
      tyres: {
        frontLeft: null,
        frontRight: null,
        rearLeft: null,
        rearRight: null,
      },
      selectedComplaints: [],
      customComplaint: "",
    },
    tyreRotation: {
      rotationType: null,
      complaint: "",
    },
    balancing: {
      weights: {
        frontLeft: "",
        frontRight: "",
        rearLeft: "",
        rearRight: "",
      },
      complaint: "",
    },
    carWashing: {
      selectedServices: [],
      complaint: "",
    },
    pusOperator: {
      tests: {
        normalPUC: true,
        engineWarmUp: false,
        highRPM: true,
        idleRPM: false,
        certificatePrint: false,
      },
      fuelType: "Diesel",
    },
    batteryCheck: {
      condition: null,
      voltage: 12.1,
      specificGravity: 1.15,
      complaint: "",
    },
    oilCheckUp: {
      quality: null,
      level: null,
      complaint: "",
    },
    summary: {},
  },
  errors: {},
  submitStatus: "idle",
};

const serviceEnquirySlice = createSlice({
  name: "serviceEnquiry",
  initialState,
  reducers: {
    // ────────────────────────────────────────────────
    // Navigation with validation guard
    // ────────────────────────────────────────────────
    nextStep: (state) => {
      // Only allow next if customer form is valid when on step 0
      if (state.currentStep === 0) {
        const customer = state.data.customer;
        const customerErrors: Record<string, string> = {};

        if (!customer.name.trim()) customerErrors.name = "Name is required";
        if (!customer.phone.trim()) customerErrors.phone = "Phone is required";
        if (!customer.address.trim())
          customerErrors.address = "Address is required";
        if (!customer.city.trim()) customerErrors.city = "City is required";
        if (!customer.pinCode1.trim())
          customerErrors.pinCode1 = "Pin code is required";
        if (!customer.vehicleName.trim())
          customerErrors.vehicleName = "Vehicle name is required";
        if (!customer.vehicleNo.trim())
          customerErrors.vehicleNo = "Vehicle number is required";
        if (!customer.odometer.trim())
          customerErrors.odometer = "Odometer is required";
        if (!customer.wheel) customerErrors.wheel = "Wheel type is required";
        if (!customer.vehicleType)
          customerErrors.vehicleType = "Vehicle type is required";
       if (!customer.serviceDate) {
          customerErrors.serviceDate = "Service date is required";
        } else {
          const selectedDate = new Date(customer.serviceDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // reset time to start of day
          if (selectedDate < today) {
            customerErrors.serviceDate = "Service date cannot be in the past";
          }
        }
        state.errors = customerErrors;

        if (Object.keys(customerErrors).length > 0) {
          return; // block next
        }
      }

      state.currentStep += 1;
      state.errors = {}; // clear errors on successful next
    },

    prevStep: (state) => {
      state.currentStep = Math.max(0, state.currentStep - 1);
      state.errors = {};
    },

    goToStep: (state, action: PayloadAction<number>) => {
      const target = action.payload;
      if (target >= 0 && target < 12) {
        // adjust max based on your steps
        state.currentStep = target;
        state.errors = {};
      }
    },

    // ────────────────────────────────────────────────
    // Existing form updates
    // ────────────────────────────────────────────────
    updateCustomer: (
      state,
      action: PayloadAction<Partial<CustomerVehicleFormData>>,
    ) => {
      state.data.customer = { ...state.data.customer, ...action.payload };
    },

    updateAlignment: (state, action: PayloadAction<Partial<AlignmentData>>) => {
      state.data.alignment = { ...state.data.alignment, ...action.payload };
    },

    updateTyreInspection: {
      reducer(
        state,
        action: PayloadAction<
          | Partial<TyreInspectionData>
          | { tyre: TyrePosition; values: Partial<TyreValues> }
        >,
      ) {
        if ("tyre" in action.payload && action.payload.tyre) {
          const { tyre, values } = action.payload;
          if (state.data.tyreInspection.tyres[tyre] === null) {
            state.data.tyreInspection.tyres[tyre] = {
              treadDepth: "Good",
              tyrePressure: 33,
            };
          }
          state.data.tyreInspection.tyres[tyre] = {
            ...state.data.tyreInspection.tyres[tyre]!,
            ...values,
          };
        } else {
          state.data.tyreInspection = {
            ...state.data.tyreInspection,
            ...action.payload,
          };
        }
      },
      prepare(payload) {
        return { payload };
      },
    },

    updateTyreRotation: (
      state,
      action: PayloadAction<Partial<TyreRotationData>>,
    ) => {
      state.data.tyreRotation = {
        ...state.data.tyreRotation,
        ...action.payload,
      };
    },

    updateBalancing: (state, action: PayloadAction<Partial<BalancingData>>) => {
      state.data.balancing = { ...state.data.balancing, ...action.payload };
    },

    updateCarWashing: (
      state,
      action: PayloadAction<Partial<CarWashingData>>,
    ) => {
      state.data.carWashing = { ...state.data.carWashing, ...action.payload };
    },

    updatePUSOperator: (
      state,
      action: PayloadAction<Partial<PUSOperatorData>>,
    ) => {
      state.data.pusOperator = { ...state.data.pusOperator, ...action.payload };
    },

    updateBatteryCheck: (
      state,
      action: PayloadAction<Partial<BatteryCheckData>>,
    ) => {
      state.data.batteryCheck = {
        ...state.data.batteryCheck,
        ...action.payload,
      };
    },

    updateOilCheckUp: (
      state,
      action: PayloadAction<Partial<OilCheckUpData>>,
    ) => {
      state.data.oilCheckUp = { ...state.data.oilCheckUp, ...action.payload };
    },

    updateComplaintNotes: (state, action: PayloadAction<string>) => {
      state.data.complaintNotes = action.payload;
    },

    // Service selection
    setSelectedServices: (state, action: PayloadAction<string[]>) => {
      state.data.selectedServices = action.payload;
    },

    toggleService: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const current = state.data.selectedServices;
      if (current.includes(id)) {
        state.data.selectedServices = current.filter((s) => s !== id);
      } else {
        state.data.selectedServices = [...current, id];
      }
    },

    clearSelectedServices: (state) => {
      state.data.selectedServices = [];
    },

    clearComplaintNotes: (state) => {
      state.data.complaintNotes = "";
    },

    // ────────────────────────────────────────────────
    // New: Reset form (useful after submit)
    // ────────────────────────────────────────────────
    resetForm: () => initialState,

    // ────────────────────────────────────────────────
    // New: Set submit status (for API calls)
    // ────────────────────────────────────────────────
    setSubmitStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "success" | "error">,
    ) => {
      state.submitStatus = action.payload;
    },

    setSubmitError: (state, action: PayloadAction<string>) => {
      state.submitError = action.payload;
    },

    // Inside reducers object
    clearError: (state, action: PayloadAction<{ field: string }>) => {
      const { field } = action.payload;
      delete state.errors[field];
    },
  },
});

export const {
  nextStep,
  prevStep,
  goToStep,
  setSelectedServices,
  toggleService,
  clearSelectedServices,
  updateComplaintNotes,
  clearComplaintNotes,
  updateCustomer,
  updateAlignment,
  updateTyreRotation,
  updateTyreInspection,
  updateBalancing,
  updateCarWashing,
  updatePUSOperator,
  updateOilCheckUp,
  updateBatteryCheck,
  resetForm,
  setSubmitStatus,
  setSubmitError,
  clearError,
} = serviceEnquirySlice.actions;

export default serviceEnquirySlice.reducer;
