import type { ReactNode } from "react";

interface ServiceLayoutProps {
  children: ReactNode;
  onBack: () => void;
  onNext: () => void;
}

export default function ServiceLayout({
  children,
  onBack,
  onNext,
}: ServiceLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto min-h-dvh bg-gray-50 p-6">
        {children}
      </div>
      <div className="flex justify-end gap-3 sticky bottom-2">
        <button
          onClick={onBack}
          className="px-6 py-2.5 text-teal-600 bg-white border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
}
