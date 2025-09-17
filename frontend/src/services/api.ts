// src/services/api.ts - Clean version compatible with existing useApi hook
import { ApiResponse, BlogPost, Project, Info, Card, ContactForm } from "../types";

// Configuration
const API_CONFIG = {
  DEFAULT_TIMEOUT: 10000,
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

// Enhanced fetch function that returns ApiResponse<T>
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
        console.log(`API Request (attempt ${attempt + 1}): ${url}`);
        
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
        console.log(`Raw API Response for ${endpoint}:`, rawData);
        
        // Handle different response formats from Django REST Framework
        let data: T;
        
        if (rawData && typeof rawData === 'object' && 'results' in rawData) {
          data = rawData.results as T;
          console.log(`Extracted paginated data for ${endpoint}:`, data);
        } else if (rawData && typeof rawData === 'object' && 'data' in rawData) {
          data = rawData.data as T;
          console.log(`Extracted wrapped data for ${endpoint}:`, data);
        } else {
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
        
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          break;
        }
        
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

// Blob fetch function
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

// API service object
const apiService = {
  baseUrl: API_URL,
  
  info: {
    get: (): Promise<ApiResponse<Info[]>> => fetchApi<Info[]>('info')
  },
  
  resume: {
    view: (): Promise<Blob> => fetchBlob('resume/view'),
    download: (): Promise<Blob> => fetchBlob('resume/download')
  },
  
  blog: {
    getAll: (): Promise<ApiResponse<BlogPost[]>> => fetchApi<BlogPost[]>('post'),
    getOne: (id: string): Promise<ApiResponse<BlogPost>> => fetchApi<BlogPost>(`post/${id}`)
  },
  
  projects: {
    getAll: (): Promise<ApiResponse<Project[]>> => fetchApi<Project[]>('projects'),
    getOne: (id: string): Promise<ApiResponse<Project>> => fetchApi<Project>(`projects/${id}`)
  },
  
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
  
  cards: {
    getAll: (): Promise<ApiResponse<Card[]>> => fetchApi<Card[]>('cards')
  },

  getImageUrl: (imagePath: string | null | undefined): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    
    const cleanPath = imagePath.replace(/^\/+/, "");
    
    if (cleanPath.startsWith('media/') || cleanPath.startsWith('static/')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-api.rajivwallace.com';
      return `${baseUrl}/${cleanPath}`;
    }
    
    return `/${cleanPath}`;
  }
};

export default apiService;