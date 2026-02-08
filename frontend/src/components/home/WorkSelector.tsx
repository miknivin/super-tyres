/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-render */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/work/WorkTypeSelector.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetDesignationsQuery } from "../../redux/api/designationApi";
import { useUpdateUserDesignationsMutation } from "../../redux/api/userApi";
import type { RootState } from "../../redux/store";

export default function WorkTypeSelector() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [initialAssigned, setInitialAssigned] = useState<string[]>([]); // snapshot of pre-loaded assigned IDs
  const [hasChanges, setHasChanges] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id)
        ? prev.filter((typeId) => typeId !== id)
        : [...prev, id],
    );
  };

  // Fetch designations
  const {
    data: designations = [],
    isLoading,
    isError,
    error,
  } = useGetDesignationsQuery();

  // Mutation
  const [updateUserDesignations, { isLoading: isSubmitting }] =
    useUpdateUserDesignationsMutation();

  // Get current user
  const user = useSelector((state: RootState) => state.auth.user);

  // Pre-select assigned designations when data loads
  useEffect(() => {
    console.log("useeffect executed");

    if (designations.length > 0 && initialAssigned.length === 0) {
      const preSelected = designations
        .filter((d: any) => d.isAssigned === true)
        .map((d: any) => d.id.toString()); // ensure string

      setSelectedTypes(preSelected);
      setInitialAssigned(preSelected); // snapshot for comparison
    }
  }, [designations]);

  // Detect if selection has changed from initial assigned
  useMemo(() => {
    console.log("usemeo executed");
    const currentSorted = [...selectedTypes].sort();
    const initialSorted = [...initialAssigned].sort();

    const changed =
      currentSorted.length !== initialSorted.length ||
      currentSorted.some((id, index) => id !== initialSorted[index]);

    setHasChanges(changed);
  }, [selectedTypes, initialAssigned]);

  // Handle Submit
  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to submit");
      return;
    }

    if (selectedTypes.length === 0) {
      toast.error("Please select at least one work type");
      return;
    }

    try {
      await updateUserDesignations({
        designationIds: selectedTypes,
      }).unwrap();

      toast.success("Your work types have been updated successfully!");

      // Optional: update initial state after success
      setInitialAssigned([...selectedTypes]);
      setHasChanges(false);
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to update work types";
      toast.error(msg);
    }
  };

  // Loading / Error / Empty states (unchanged)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
          <p className="text-gray-600">Loading available work types...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to load work types
          </h2>
          <p className="text-gray-600">
            {(error as any)?.data?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (designations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500 text-center">
          No active work types available at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="w-full max-w-2xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Select Work Type
          </h1>
          <p className="text-sm text-gray-500">
            Choose the service you're assigned to start working
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-8">
          {designations.map((designation: any) => {
            const isSelected = selectedTypes.includes(designation.id);

            return (
              <label
                key={designation.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer relative block"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelection(designation.id)}
                  className="sr-only"
                />

                <div className="absolute top-4 left-4">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-teal-600 bg-teal-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center mb-4 mt-2">
                  <div className="w-32 h-24  from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <img src={designation.imageUrl} alt="" />
                  </div>
                </div>

                <h3 className="text-center text-sm font-semibold text-gray-800">
                  {designation.name}
                </h3>
                {designation.serviceName && (
                  <p className="text-center text-xs text-gray-500 mt-1">
                    {designation.serviceName}
                  </p>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Sticky Submit Button – only visible when selection has changed */}
      {hasChanges && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedTypes.length === 0}
              className={`w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isSubmitting ? "animate-pulse" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                `Submit`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
