// src/components/common/Image.tsx
import React, { useState, useEffect } from "react";
import { cn } from "@/utils/styleUtils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
  aspectRatio?: "auto" | "square" | "video" | "3/2" | "4/3" | "16/9";
  objectFit?: "contain" | "cover";
  lowQualitySrc?: string; // New prop for progressive loading
  enableProgressiveLoading?: boolean; // Toggle for progressive loading
}

const Image = ({
  src,
  alt = "",
  className,
  fallbackSrc,
  fallbackComponent,
  aspectRatio = "auto",
  objectFit = "cover",
  lowQualitySrc,
  enableProgressiveLoading = false, // Default to false for backward compatibility
  ...props
}: ImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset loaded state when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const aspectRatioClasses = {
    auto: "",
    square: "aspect-square",
    video: "aspect-video",
    "3/2": "aspect-[3/2]",
    "4/3": "aspect-[4/3]",
    "16/9": "aspect-[16/9]",
  };

  const objectFitClasses = {
    contain: "object-contain",
    cover: "object-cover",
  };

  if (hasError || !src) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={cn(
            aspectRatioClasses[aspectRatio],
            objectFitClasses[objectFit],
            className
          )}
          {...props}
        />
      );
    } else if (fallbackComponent) {
      return (
        <div className={cn(aspectRatioClasses[aspectRatio], className)}>
          {fallbackComponent}
        </div>
      );
    } else {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-gray-100 dark:bg-gray-900",
            aspectRatioClasses[aspectRatio],
            className
          )}
        >
          <span className="text-gray-500 dark:text-gray-600 font-mono text-sm">
            Image Not Available
          </span>
        </div>
      );
    }
  }

  // If progressive loading is enabled and we have a low quality source
  if (enableProgressiveLoading) {
    return (
      <div
        className={cn(
          "relative overflow-hidden",
          aspectRatioClasses[aspectRatio],
          className
        )}
      >
        {lowQualitySrc && !isLoaded && (
          <img
            src={lowQualitySrc}
            alt={alt}
            className={cn(
              "w-full h-full absolute inset-0 scale-110 blur-lg transition-opacity",
              objectFitClasses[objectFit]
            )}
            aria-hidden="true"
          />
        )}

        <img
          src={src}
          alt={alt}
          loading="lazy" // Add native lazy loading
          className={cn(
            "w-full h-full transition-all duration-300",
            objectFitClasses[objectFit],
            !isLoaded && "opacity-0",
            isLoaded && "opacity-100"
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...props}
        />
      </div>
    );
  }

  // Standard image implementation (for backward compatibility)
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy" // Add native lazy loading
      className={cn(
        aspectRatioClasses[aspectRatio],
        objectFitClasses[objectFit],
        className
      )}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export { Image };
