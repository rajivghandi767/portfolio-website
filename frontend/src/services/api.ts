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

// Utility function to get API URL with fallback and warning
function getApiUrl(): string {
  const configuredUrl = import.meta.env.VITE_API_URL;
  if (!configuredUrl) {
    console.warn('VITE_API_URL environment variable is not set. Using fallback URL.');
    return 'http://127.0.0.1:8000/'; // Default fallback for development
  }
  return configuredUrl;
}

// Main API URL
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
  const url = `${API_URL}/${endpoint.replace(/^\/+/, "")}`;
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
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
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
 * Enhanced blob fetch function with error handling
 * @param endpoint API endpoint path
 * @param options Fetch options
 * @returns Blob data
 */
async function fetchBlob(
  endpoint: string,
  options: RequestInit = {}
): Promise<Blob> {
  const url = `${API_URL}/${endpoint.replace(/^\/+/, "")}`;
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
 * Centralized API service with enhanced capabilities
 */
const apiService = {
  baseUrl: API_URL,
  
  // Bio Endpoints
  info: {
    get: () => fetchApi<Info[]>('info')
  },
  
  // Resume Endpoints
  resume: {
    view: async (): Promise<Blob> => fetchBlob('resume/view/'),
    download: async (): Promise<Blob> => fetchBlob('resume/download/')
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
    send: (data: unknown) => fetchApi('contact/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // Wallet/Cards Endpoint
  cards: {
    getAll: () => fetchApi<Card[]>('cards')
  },
  
  /**
   * Convert relative image paths to full URLs
   * @param imagePath Relative or absolute image path
   * @returns Full image URL or empty string if no image
   */
  getImageUrl: (imagePath: string | null | undefined): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    
    const cleanPath = imagePath.replace(/^\/+/, "");
    const baseUrl = API_URL.split("/").slice(0, 3).join("/");
    return `${baseUrl}/${cleanPath}`;
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