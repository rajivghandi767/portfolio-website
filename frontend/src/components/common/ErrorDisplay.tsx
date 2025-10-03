import { cn } from "@/utils/styleUtils";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string | null;
  className?: string;
}

const ErrorDisplay = ({ error, className }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div
      className={cn(
        "bg-red-50 dark:bg-black text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-900 flex items-start gap-2",
        className
      )}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

export { ErrorDisplay };
