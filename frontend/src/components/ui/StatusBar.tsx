// BatteryStatusBar.tsx
import React from 'react';

interface BatteryStatusBarProps {
  label: string;
  value: string | number;
  min: number;
  optimal: number;
  max: number;
  unit?: string;
}

export default function BatteryStatusBar({
  label,
  value,
  min,
  optimal,
  max,
  unit = '',
}: BatteryStatusBarProps) {
  // Convert value to percentage (0–100)
  const percentage = Math.min(Math.max(((Number(value) - min) / (max - min)) * 100, 0), 100);

  return (
    <div className="w-full max-w-md space-y-1.5">
      {/* Label + Value */}
      <div className="flex justify-between items-baseline px-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>

      {/* Progress container with slant effect */}
      <div className="relative h-8 rounded overflow-hidden bg-gray-100 border border-gray-300 shadow-sm">
        {/* Background zones */}
        <div className="absolute inset-0 grid grid-cols-3">
          {/* Bad / Low zone */}
          <div className="bg-red-100/60" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }} />
          {/* Middle / Caution zone */}
          <div className="bg-yellow-100/60" />
          {/* Good / Optimal zone */}
          <div className="bg-teal-100/70" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }} />
        </div>

        {/* Animated fill bar */}
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-700 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />

          {/* Slanted right edge */}
          <div
            className="absolute top-0 right-0 h-full w-12 bg-teal-700/80"
            style={{ transform: 'skewX(-20deg)', transformOrigin: 'right center' }}
          />
        </div>

        {/* Optional current value marker line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-10"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-teal-600 rounded-full shadow" />
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between px-1 text-xs text-gray-500">
        <span>{min}{unit}</span>
        <span>{optimal}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}