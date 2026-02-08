import React, { type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-999 p-4">
      <div className="bg-white max-h-[80vh] overflow-y-auto rounded-lg shadow-xl max-w-2xl w-full relative">
        {/* Header */}
        {title && (
          <div className="border-b border-gray-200 p-6 pb-4 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between ">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className=" ">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
