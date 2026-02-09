// components/Drawer.tsx
"use client";

import { useEffect, useRef } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "right" | "left" | "top" | "bottom";
  width?: string;
  className?: string;
  showCloseButton?: boolean;
  icon?: React.ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  width = "w-96",
  className = "",
  showCloseButton = true,
  icon,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // ── Position styles ──
  const positionConfig = {
    right: {
      hidden: "translate-x-full",
      visible: "translate-x-0",
      base: "top-0 right-0 h-screen",
    },
    left: {
      hidden: "-translate-x-full",
      visible: "translate-x-0",
      base: "top-0 left-0 h-screen",
    },
    top: {
      hidden: "-translate-y-full",
      visible: "translate-y-0",
      base: "top-0 left-0 right-0",
    },
    bottom: {
      hidden: "translate-y-full",
      visible: "translate-y-0",
      base: "bottom-0 left-0 right-0",
    },
  }[position];

  const isVertical = position === "top" || position === "bottom";

  // ── Build classes ──
  const baseClasses = [
    "fixed z-999 overflow-y-auto bg-white p-3", // changed to bg-white as per your last version
    "transition-transform duration-300 ease-in-out",
    positionConfig.base,
    isVertical ? "max-h-[90vh] w-full" : `h-screen ${width}`,
    className.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  // Only one transform class at a time
  const transformClass = isOpen
    ? positionConfig.visible
    : positionConfig.hidden;

  const finalClasses = `${baseClasses} ${transformClass}`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        ref={drawerRef}
        className={finalClasses}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h5
              id="drawer-title"
              className="text-lg font-semibold text-gray-900 flex items-center gap-2.5"
            >
              {icon}
              {title || "Filters"}
            </h5>

            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close drawer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="text-gray-700 text-sm">{children}</div>
      </div>
    </>
  );
}
