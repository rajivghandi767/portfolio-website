import { cn } from "@/utils/styleUtils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const Loading = ({ className, size = "md", text }: LoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-t-2 border-b-2 border-brand-light dark:border-brand-dark",
          sizeClasses[size],
        )}
        role="status"
        aria-label="Loading"
      ></div>
      {text && (
        <p className="mt-2 text-brand-light dark:text-brand-dark">{text}</p>
      )}
    </div>
  );
};

export { Loading };
