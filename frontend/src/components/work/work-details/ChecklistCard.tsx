import type { JSX } from "react";
import { Link } from "react-router-dom";

// 1. Define the props type
interface ChecklistCardProps {
  imageUrl?: string; // ← new prop for real service image
  icon?: JSX.Element; // ← keep optional if you want fallback
  title: string;
  status: string;
  code: string;
  enquiryId: string;
  progress: number;
}

// 2. Component with TypeScript
const ChecklistCard = ({
  imageUrl,
  title,
  status,
  code,
  enquiryId,
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
    <Link
      to={`/work/${enquiryId}/${code}`}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-3"
    >
      <div className="flex items-center gap-4">
        {/* Icon container */}
        <div className="w-20 h-20 shrink-0">
          <img src={imageUrl} className="w-full h-full" alt="" />
        </div>

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
    </Link>
  );
};

export default ChecklistCard;
