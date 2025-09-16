// src/services/api.ts - Updated for relative paths
import { ApiResponse, BlogPost, Project, Info, Card } from "../types";

// Configuration object for API settings
const API_CONFIG = {
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  DEFAULT_HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
};

// Custom API Error class
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getApiUrl(): string {
  return `${import.meta.env.VITE_API_URL || 'https://portfolio-api.rajivwallace.com'}/api/`;
}

const API_URL = getApiUrl();

/**
 * Enhanced fetch function with retry and more robust error handling
 * @param endpoint API endpoint path
 * @param options Fetch options
 * @param maxRetries Number of retry attempts
 * @returns Typed API response with data, error, and status
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  maxRetries = API_CONFIG.RETRY_ATTEMPTS
): Promise<ApiResponse<T>> {
  // Normalize endpoint: remove leading slashes and ensure trailing slash
  const normalizedEndpoint = endpoint.replace(/^\/+/, "").replace(/\/$/, "");
  // Form URL with proper trailing slash - now relative
  const url = normalizedEndpoint ? `${API_URL}${normalizedEndpoint}/` : API_URL;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.DEFAULT_TIMEOUT);

  try {
    const fetchOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
      },
    };

    let lastError: unknown;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, fetchOptions);
        
        // Clear timeout
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new ApiError(
            `HTTP error! Status: ${response.status}, Message: ${errorBody}`, 
            response.status
          );
        }
        
        const data = await response.json();
        return {
          data,
          error: null,
          status: response.status,
        };
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          break;
        }
        
        // Exponential backoff for network/server errors
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    // If all retries fail
    throw lastError;
  } catch (error) {
    // Clear timeout in case of early failure
    clearTimeout(timeoutId);

    console.error(`API Error (${endpoint}):`, error);
    
    return {
      data: null,
      error: error instanceof ApiError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : "An unexpected network error occurred",
      status: error instanceof ApiError ? error.status : 0,
    };
  }
}

/**
 * Enhanced blob fetch function with error handling - now relative
 * @param endpoint API endpoint path
 * @param options Fetch options
 * @returns Blob data
 */
async function fetchBlob(
  endpoint: string,
  options: RequestInit = {}
): Promise<Blob> {
  // Use the same URL normalization logic as fetchApi
  const normalizedEndpoint = endpoint.replace(/^\/+/, "").replace(/\/$/, "");
  const url = normalizedEndpoint ? `${API_URL}${normalizedEndpoint}/` : API_URL;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
      },
    });
    
    // Clear timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new ApiError(
        `HTTP error! Status: ${response.status}, Message: ${errorBody}`, 
        response.status
      );
    }
    
    return await response.blob();
  } catch (error) {
    // Clear timeout in case of early failure
    clearTimeout(timeoutId);

    console.error(`Blob Fetch Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Centralized API service with enhanced capabilities - now using relative paths
 */
const apiService = {
  baseUrl: API_URL,
  
  // Bio Endpoints
  info: {
    get: () => fetchApi<Info[]>('info')
  },
  
  // Resume Endpoints
  resume: {
    view: async (): Promise<Blob> => fetchBlob('resume/view'),
    download: async (): Promise<Blob> => fetchBlob('resume/download')
  },
  
  // Blog endpoints
  blog: {
    getAll: () => fetchApi<BlogPost[]>('post'),
    getOne: (id: string) => fetchApi<BlogPost>(`post/${id}`)
  },
  
  // Project Endpoints
  projects: {
    getAll: () => fetchApi<Project[]>('projects'),
    getOne: (id: string) => fetchApi<Project>(`projects/${id}`)
  },
  
  // Contact Endpoint
  contact: {
    send: (data: unknown) => fetchApi('contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // Wallet/Cards Endpoint
  cards: {
    getAll: () => fetchApi<Card[]>('cards')
  },
  
  /**
   * Convert relative image paths to full URLs - now relative to current domain
   * @param imagePath Relative or absolute image path
   * @returns Full image URL or empty string if no image
   */
  getImageUrl: (imagePath: string | null | undefined): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    
    // For relative paths, prepend with current domain
    const cleanPath = imagePath.replace(/^\/+/, "");
    return `/${cleanPath}`;
  },

  /**
   * Create a cancellable request
   * @param endpoint API endpoint
   * @param options Request options
   * @returns Object with request promise and cancel method
   */
  createCancellableRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ) {
    const controller = new AbortController();
    
    const request = fetchApi<T>(endpoint, {
      ...options,
      signal: controller.signal
    });
    
    return {
      request,
      cancel: () => controller.abort()
    };
  }
};

export default apiService;