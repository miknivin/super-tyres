import type { ReactNode } from "react";

// 1. Define the props type
type ChecklistCardProps = {
  icon: ReactNode; // icon can be JSX element, component, SVG, etc.
  title: string;
  status: "Pending" | "Completed" | "In Progress" | string; // string fallback
  progress: number; // 0–100 expected
};

// 2. Component with TypeScript
const ChecklistCard = ({
  icon,
  title,
  status,
  progress,
}: ChecklistCardProps) => {
  // Helper function with typed parameter
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "text-yellow-600";
      case "Completed":
        return "text-green-600";
      case "In Progress":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-center gap-4">
        {/* Icon container */}
        <div className="w-16 h-16 shrink-0">{icon}</div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>

          {/* Status indicator */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className={`text-sm font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {progress}%
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">Work in progress</p>
        </div>
      </div>
    </div>
  );
};

export default ChecklistCard;
