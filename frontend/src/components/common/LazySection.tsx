import { useEffect, useRef, useState, ReactNode } from "react";

interface LazySectionProps {
  id?: string;
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
}

export const LazySection = ({
  id,
  children,
  fallback = <div className="min-h-[50vh]" aria-hidden="true" />,
  rootMargin = "200px",
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleReveal = (): void => {
      setIsVisible(true);
    };

    window.addEventListener("lazysection:reveal", handleReveal);
    return () => {
      window.removeEventListener("lazysection:reveal", handleReveal);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    // If the browser doesn't support IntersectionObserver, just render it immediately
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return <div id={isVisible ? undefined : id} ref={ref}>{isVisible ? children : fallback}</div>;
};
