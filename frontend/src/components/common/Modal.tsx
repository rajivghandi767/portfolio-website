// src/components/common/Modal.tsx
import React, { useEffect } from "react";
import { cn } from "@/utils/styleUtils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "lg",
}: ModalProps) => {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle max width classes
  const maxWidthClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "w-full bg-white dark:bg-black border-2 border-black dark:border-gray-800 rounded-lg shadow-xl flex flex-col max-h-[90vh]",
          maxWidthClasses[maxWidth]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-black dark:border-gray-800">
          {title && (
            <h3
              id="modal-title"
              className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-900 dark:from-white dark:to-gray-300"
            >
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 rounded-full"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 flex-grow">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t-2 border-black dark:border-gray-800 p-4 flex justify-end items-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export { Modal };
