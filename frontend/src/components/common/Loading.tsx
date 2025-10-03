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
          "animate-spin rounded-full border-t-2 border-b-2 border-black dark:border-gray-100",
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      ></div>
      {text && <p className="mt-2 text-black dark:text-gray-300">{text}</p>}
    </div>
  );
};

export { Loading };
