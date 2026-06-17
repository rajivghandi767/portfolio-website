import { useEffect } from "react";
import { cn } from "@/utils/styleUtils";
import { X } from "./Icons";

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
  variant?: "default" | "lightbox";
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "lg",
  variant = "default",
}: ModalProps) => {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  if (variant === "lightbox") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm cursor-zoom-out"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-[60] focus:outline-none"
          aria-label="Close lightbox"
        >
          <X size={32} />
        </button>
        <div 
          className="relative max-w-full max-h-[95vh] flex items-center justify-center cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "w-full bg-bg-light dark:bg-bg-dark text-brand-light dark:text-brand-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg shadow-xl flex flex-col max-h-[90vh]",
          maxWidthClasses[maxWidth],
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-gray-200 dark:border-neutral-800">
          {title && (
            <h3 id="modal-title" className="text-lg font-semibold">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-brand-light dark:text-brand-dark hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 rounded-full"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 flex-grow">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t-2 border-gray-200 dark:border-neutral-800 p-4 flex justify-end items-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export { Modal };
