// src/layouts/ServiceLayout.tsx
import type { ReactNode } from "react";

interface ServiceLayoutProps {
  children: ReactNode;
  onBack: () => void;
  onNext: () => void;
  isLoading?: boolean;
  onSubmit?: () => void; // new optional prop for summary
  isLastStep?: boolean; // new prop to know when we're on summary
}

export default function ServiceLayout({
  children,
  onBack,
  onNext,
  isLoading = false,
  onSubmit,
  isLastStep = false,
}: ServiceLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto min-h-[75dvh] bg-gray-50">
        {children}
      </div>

      <div className="flex justify-end gap-3 sticky bottom-2">
        <button
          onClick={onBack}
          className="px-6 py-2.5 text-teal-600 bg-white border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
        >
          Back
        </button>

        {isLastStep && onSubmit ? (
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className={`px-6 py-2.5 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isLoading ? "Submitting..." : "Start work"}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-6 py-2.5 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
