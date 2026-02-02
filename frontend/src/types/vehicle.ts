// src/types/vehicle.ts
export interface Vehicle {
  id: string; // enquiry.Id
  plate: string; // vehicleNo
  owner: string; // customerName
  phone: string; // customerPhone
  mileage?: string; // `${odometer} km` or "N/A"
  odometer?: number | null;
  services?: string; // comma-joined selectedServiceCodes (for OngoingVehicleCard)
  timeBadge?: string; // optional (you can compute from createdAt or leave empty for now)
  status?: string; // e.g. "Pending", "Ongoing", "Completed"
  isCompleted?: boolean; // true if status === "Completed"
  success?: boolean; // true for completed (green check)
}
