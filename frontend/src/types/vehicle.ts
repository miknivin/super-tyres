// src/types/vehicle.ts
export interface Vehicle {
  id: number;
  plate: string;
  owner: string;
  phone: string;
  mileage: string;
  services?: string; // used in ongoing
  timeBadge?: string; // "+5 minute", etc.
  status?: "awaiting" | "ongoing";
  isCompleted?: boolean;
  success?: boolean; // green check for completed
}
