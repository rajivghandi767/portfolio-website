import { useState, useEffect, useRef } from 'react';
import { ApiResponse } from '../types';

// Simple in-memory cache and in-flight request deduplication
const apiCache: Record<string, { data: unknown; timestamp: number }> = {};
const inFlightRequests: Record<string, Promise<ApiResponse<unknown>> | undefined> = {};
const CACHE_TTL = import.meta.env.DEV ? 0 : 5 * 60 * 1000; // 0 in dev, 5 mins in prod

/**
 * A custom React hook for making API calls with built-in caching, error handling, and loading states.
 * 
 * Highly educational note: We abstract API calls into this hook to centralize our state management
 * (loading, error, data) and caching logic. This prevents redundant network requests and ensures
 * components remain clean and focused on rendering rather than data fetching logistics.
 *
 * @param apiCall - A function returning a Promise that resolves to an ApiResponse.
 * @param dependencies - Array of dependencies that will trigger a refetch when changed.
 * @param cacheKey - Optional string to uniquely identify this request in the cache.
 * @param cacheTTL - Time to live for the cache in milliseconds.
 * @returns Object containing data, error state, loading state, and a refetch method.
 */
function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: React.DependencyList = [],
  cacheKey?: string, // Optional cache key
  cacheTTL: number = CACHE_TTL // Optional TTL override
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // We use a ref to store the latest apiCall function to avoid unnecessary re-renders 
  // or infinite loops if the function is recreated on every render of the parent component.
  const apiCallRef = useRef(apiCall);

  /**
   * The core fetching logic. Supports skipping the cache when an explicit refetch is needed.
   * Handles caching checks, network request execution, and state updates (loading/error/data).
   */
  const fetchData = async (skipCache = false) => {
    setIsLoading(true);
    setError(null);
    
    // Check cache if we have a cache key and aren't skipping cache
    if (cacheKey && !skipCache) {
      const cached = apiCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < cacheTTL) {
        setData(cached.data as T);
        setIsLoading(false);
        return;
      }
    }
    
    try {
      let requestPromise: Promise<ApiResponse<T>>;
      if (cacheKey && !skipCache) {
        const existingInFlight = inFlightRequests[cacheKey] as Promise<ApiResponse<T>> | undefined;
        if (existingInFlight) {
          requestPromise = existingInFlight;
        } else {
          requestPromise = apiCallRef.current();
          inFlightRequests[cacheKey] = requestPromise;
        }
      } else {
        requestPromise = apiCallRef.current();
      }

      const result = await requestPromise;
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setData(result.data);
      
      // Store in cache if we have a cache key
      if (cacheKey) {
        apiCache[cacheKey] = {
          data: result.data,
          timestamp: Date.now(),
        };
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error in API call:', err);
      }
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      if (cacheKey) {
        delete inFlightRequests[cacheKey];
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Keep the ref up to date with the latest apiCall without triggering effect re-runs
    apiCallRef.current = apiCall;
  }, [apiCall]);

  useEffect(() => {
    // We use a mounted flag to prevent state updates if the component unmounts 
    // before the async API call finishes. This prevents React "memory leak" warnings.
    let isMounted = true;
    
    const execute = async () => {
      if (!isMounted) return;

      try {
        await fetchData();
      } catch (err) {
        if (isMounted && import.meta.env.DEV) {
          console.error('Error in API call setup:', err);
        }
      }
    };

    void execute();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps, @eslint-react/exhaustive-deps
  }, [...dependencies]);

  return { 
    data, 
    error, 
    isLoading, 
    refetch: (skipCache = true) => fetchData(skipCache) 
  };
}

export default useApi;