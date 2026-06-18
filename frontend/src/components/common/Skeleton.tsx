export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-neutral-800 rounded-lg ${className}`}
    ></div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-bg-light dark:bg-bg-dark border-2 border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm flex flex-col h-full">
      <Skeleton className="w-full aspect-[4/3] rounded-none border-b-2 border-gray-200 dark:border-neutral-800" />
      <div className="p-4 flex flex-col grow gap-3">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-wrap gap-1 mt-auto">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  );
};

export const BlogPostSkeleton = () => {
  return (
    <div className="bg-bg-light dark:bg-bg-dark border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden flex flex-col md:flex-row h-full">
      <Skeleton className="w-full md:w-1/3 aspect-[4/3] rounded-none md:border-r border-gray-200 dark:border-neutral-800" />
      <div className="p-6 flex flex-col grow gap-4 justify-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
