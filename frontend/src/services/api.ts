// src/services/api.ts - Compatible with existing useApi hook and architecture
import { ApiResponse, BlogPost, Project, Info, Card, ContactForm, ContactResponse } from "../types";

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
  const baseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-api.rajivwallace.com';
  return `${baseUrl}/api/`;
}

const API_URL = getApiUrl();

/**
 * Enhanced fetch function that returns ApiResponse<T> (compatible with useApi hook)
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  maxRetries = API_CONFIG.RETRY_ATTEMPTS
): Promise<ApiResponse<T>> {
  const normalizedEndpoint = endpoint.replace(/^\/+/, "").replace(/\/$/, "");
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
        console.log(`API Request (attempt ${attempt + 1}): ${url}`); // Debug log
        
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.text();
          const errorMessage = `HTTP error! Status: ${response.status}, Message: ${errorBody}`;
          
          return {
            data: null,
            error: errorMessage,
            status: response.status,
          };
        }
        
        const rawData = await response.json();
        console.log(`Raw API Response for ${endpoint}:`, rawData); // Debug log
        
        // Handle different response formats from Django REST Framework
        let data: T;
        
        // Handle paginated responses (Django REST Framework default)
        if (rawData && typeof rawData === 'object' && 'results' in rawData) {
          data = rawData.results as T;
          console.log(`Extracted paginated data for ${endpoint}:`, data);
        }
        // Handle custom wrapper responses  
        else if (rawData && typeof rawData === 'object' && 'data' in rawData) {
          data = rawData.data as T;
          console.log(`Extracted wrapped data for ${endpoint}:`, data);
        }
        // Handle direct responses
        else {
          data = rawData as T;
          console.log(`Direct data for ${endpoint}:`, data);
        }
        
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

    throw lastError;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`API Error (${endpoint}):`, error);
    
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: error instanceof ApiError ? error.status : 0,
    };
  }
}
}

/**
 * Enhanced blob fetch function
 */
async function fetchBlob(
  endpoint: string,
  options: RequestInit = {}
): Promise<Blob> {
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
    clearTimeout(timeoutId);
    console.error(`Blob Fetch Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * API service compatible with existing useApi hook architecture
 */
const apiService = {
  baseUrl: API_URL,
  
  // Bio Endpoints
  info: {
    get: (): Promise<ApiResponse<Info[]>> => fetchApi<Info[]>('info')
  },
  
  // Resume Endpoints
  resume: {
    view: (): Promise<Blob> => fetchBlob('resume/view'),
    download: (): Promise<Blob> => fetchBlob('resume/download')
  },
  
  // Blog endpoints
  blog: {
    getAll: (): Promise<ApiResponse<BlogPost[]>> => fetchApi<BlogPost[]>('post'),
    getOne: (id: string): Promise<ApiResponse<BlogPost>> => fetchApi<BlogPost>(`post/${id}`)
  },
  
  // Project Endpoints
  projects: {
    getAll: (): Promise<ApiResponse<Project[]>> => fetchApi<Project[]>('projects'),
    getOne: (id: string): Promise<ApiResponse<Project>> => fetchApi<Project>(`projects/${id}`)
  },
  
  // Contact Endpoint - Compatible with existing Contact component
  contact: {
    send: async (formData: ContactForm) => {
      try {
        console.log('Sending contact form:', formData);
        
        const response = await fetch(`${API_URL}contact/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log('Contact API Response:', data);

        if (!response.ok) {
          return { error: data.detail || `HTTP ${response.status}: ${response.statusText}` };
        }

        return { data };
      } catch (error) {
        console.error('Contact API Error:', error);
        return { error: error instanceof Error ? error.message : 'Network error occurred' };
      }
    }
  },
  
  // Cards/Wallet Endpoint
  cards: {
    getAll: (): Promise<ApiResponse<Card[]>> => fetchApi<Card[]>('cards')
  },

  /**
   * Convert relative image paths to full URLs - Compatible with imageUtils
   * @param imagePath Relative or absolute image path
   * @returns Full image URL or empty string if no image
   */
  getImageUrl: (imagePath: string | null | undefined): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    
    // For relative paths, handle media/static properly
    const cleanPath = imagePath.replace(/^\/+/, "");
    
    // If the path starts with 'media/' or 'static/', use the full API base URL
    if (cleanPath.startsWith('media/') || cleanPath.startsWith('static/')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-api.rajivwallace.com';
      return `${baseUrl}/${cleanPath}`;
    }
    
    // Otherwise, assume it's a local asset
    return `/${cleanPath}`;
  }
};

export default apiService;