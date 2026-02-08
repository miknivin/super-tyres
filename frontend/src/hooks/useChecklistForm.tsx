/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useChecklistForm.ts
import { useState, useEffect, useRef } from "react";
import {
  useGetServiceEnquiryByIdQuery,
  useGetChecklistByTypeQuery,
  useUpdateChecklistMutation,
} from "../redux/api/servicesApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Hook configuration type
interface UseChecklistFormOptions<T extends Record<string, boolean>> {
  enquiryId: string;
  checklistType: string;
  initialState: T;
  fieldMapping: Record<keyof T, string>; // local key → backend response key
  onSuccessNavigate?: boolean; // default: true
}

export const useChecklistForm = <T extends Record<string, any>>({
  enquiryId,
  checklistType,
  initialState,
  fieldMapping,
  onSuccessNavigate = true,
}: UseChecklistFormOptions<T>) => {
  const navigate = useNavigate();
  const hasSynced = useRef(false);

  // Fetch enquiry basic info (vehicle/customer) — included in the hook
  const {
    data: enquiry,
    isLoading: isEnquiryLoading,
    isError: isEnquiryError,
    error: enquiryError,
  } = useGetServiceEnquiryByIdQuery(enquiryId, { skip: !enquiryId });

  // Fetch checklist data
  const {
    data: checklistData,
    isLoading: isChecklistLoading,
    isError: isChecklistError,
  } = useGetChecklistByTypeQuery(
    { enquiryId, checklistType },
    { skip: !enquiryId },
  );

  // Local form state
  const [formState, setFormState] = useState<T>(initialState);

  // Technician notes (common field)
  const [technicianNotes, setTechnicianNotes] = useState<string>("");

  // Mutation
  const [updateChecklist, { isLoading: isSubmitting }] =
    useUpdateChecklistMutation();

  // One-time sync from fetched checklist data
  useEffect(() => {
    if (checklistData && !hasSynced.current) {
      const newState = { ...initialState };

      // Map backend fields → local state
      Object.entries(fieldMapping).forEach(([localKey, backendKey]) => {
        const value = (checklistData as any)[backendKey];
        if (typeof value === "boolean") {
          (newState as any)[localKey] = value;
        }
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormState(newState);
      setTechnicianNotes(checklistData.technicianNotes ?? "");

      hasSynced.current = true; // prevent re-sync
    }
  }, [checklistData, initialState, fieldMapping]);

  // Toggle helper for boolean fields
  const toggleItem = (key: keyof T) => {
    setFormState((prev) => ({
      ...prev,
      [key]: !(prev[key] as boolean),
    }));
  };

  // Submit handler
  const submitChecklist = async () => {
    // Optional validation: all items must be checked
    // const allChecked = Object.values(formState).every((v) => v === true);
    // if (!allChecked) {
    //   toast.error("Please complete all checklist items");
    //   return;
    // }

    const loadingToast = toast.loading(`Saving ${checklistType}...`);

    try {
      await updateChecklist({
        enquiryId,
        checklistType,
        data: {
          ...formState, // all toggles
          technicianNotes: technicianNotes.trim() || null,
          completedAt: new Date().toISOString(),
        },
      }).unwrap();

      toast.dismiss(loadingToast);
      toast.success(`${checklistType} saved successfully!`, {
        duration: 4000,
        icon: "✅",
      });

      if (onSuccessNavigate) {
        navigate(`/work/${enquiryId}`);
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error("Failed to save checklist", { duration: 5000 });
      console.error("Update failed:", err);
    }
  };

  return {
    formState,
    setFormState,
    technicianNotes,
    setTechnicianNotes,
    toggleItem,
    submitChecklist,
    isSubmitting,
    isChecklistLoading,
    isChecklistError,
    isEnquiryLoading,
    isEnquiryError,
    enquiry, // ← now returned so component can pass to InfoCard
    enquiryError,
  };
};
