import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TyrePosition } from "../../components/work/add-work/TyreInspectionForm";
import type { BatteryCondition } from "../../components/work/add-work/BatteryCheckForm";
import type {
  OilLevel,
  OilQuality,
} from "../../components/work/add-work/OilCheckForm";
import { validateCurrentStep } from "./serviceValidationSlice";

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
  odometer: number | undefined;
  wheel: "" | "2-wheeler" | "4-wheeler";
  vehicleType: "" | "sedan" | "suv" | "hatchback";
  serviceDate: string;
}

export interface AlignmentData {
  lastServiceDate: string;
  complaint: string;
  inflationPressure: "AIR" | "NO";
}

export interface TyreValues {
  treadDepth: "Good" | "Average" | "Replace";
  tyrePressure: number;
}

type FuelType = "Petrol" | "Diesel" | "CNG/LPG" | null;

export interface TyreInspectionData {
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

export interface TyreRotationData {
  rotationType: "4-tyre" | "unidirectional" | "5-tyre" | null;
  complaint: string;
}

export interface BalancingData {
  weights: {
    frontLeft: number | undefined;
    frontRight: number | undefined;
    rearLeft: number | undefined;
    rearRight: number | undefined;
  };
  complaint: string;
}

export interface CarWashingData {
  selectedServices: string[];
  complaint: string;
}

export interface TestToggles {
  normalPUC: boolean;
  engineWarmUp: boolean;
  highRPM: boolean;
  idleRPM: boolean;
  certificatePrint: boolean;
}

export interface PUSOperatorData {
  tests: TestToggles;
  fuelType: FuelType;
}

export interface BatteryCheckData {
  condition: BatteryCondition | null;
  voltage: number;
  specificGravity: number;
  complaint: string;
}

export interface OilCheckUpData {
  quality: OilQuality | null;
  level: OilLevel | null;
  complaint: string;
}

export interface ComplaintSummaryData {
  notes?: string;
}

export interface ServiceEnquiryState {
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
const today = new Date().toISOString().split("T")[0];
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
      odometer: undefined,
      wheel: "",
      vehicleType: "",
      serviceDate: "",
    },
    alignment: {
      lastServiceDate: today,
      complaint: "",
      inflationPressure: "NO",
    },
    tyreInspection: {
      selectedTyre: null,
      tyres: {
        frontLeft: { treadDepth: "Good", tyrePressure: 33 },
        frontRight: { treadDepth: "Good", tyrePressure: 33 },
        rearLeft: { treadDepth: "Good", tyrePressure: 33 },
        rearRight: { treadDepth: "Good", tyrePressure: 33 },
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
        frontLeft: undefined,
        frontRight: undefined,
        rearLeft: undefined,
        rearRight: undefined,
      },
      complaint: "",
    },
    carWashing: {
      selectedServices: [],
      complaint: "",
    },
    pusOperator: {
      tests: {
        normalPUC: false,
        engineWarmUp: false,
        highRPM: false,
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
    nextStep: (state, action: PayloadAction<string | undefined>) => {
      const stepKey = action.payload || "inspection"; // fallback if no payload
      const newErrors = validateCurrentStep(state, stepKey);

      state.errors = newErrors;

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      state.currentStep += 1;
      state.errors = {};
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
