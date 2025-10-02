// src/services/api.ts - Complete frontend API service compatible with Django backend
import { ApiResponse, BlogPost, Project, Info, Card, ContactForm } from "../types";

// Configuration
const API_CONFIG = {
  DEFAULT_TIMEOUT: 15000, // 15 seconds for resume downloads
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
  const baseUrl = import.meta.env.VITE_API_URL;
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
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          
          try {
            const errorBody = await response.text();
            if (errorBody) {
              errorMessage += ` - ${errorBody}`;
            }
          } catch {
            // If we can't read the error body, use the status text
          }
          
          console.error(`API Error: ${errorMessage}`);
          
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
        
        // With pagination disabled in Django, we should get direct arrays
        // But handle legacy pagination format just in case
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
        
        console.warn(`⚠️ Request attempt ${attempt + 1} failed:`, error);
        
        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          break;
        }
        
        // Exponential backoff for network/server errors
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`💥 API Error (${endpoint}):`, error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Network error - please check your connection';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      data: null,
      error: errorMessage,
      status: error instanceof ApiError ? error.status : 0,
    };
  }
}

// Blob fetch function for file downloads
async function fetchBlob(
  endpoint: string,
  options: RequestInit = {}
): Promise<Blob> {
  const normalizedEndpoint = endpoint.replace(/^\/+/, "").replace(/\/$/, "");
  const url = normalizedEndpoint ? `${API_URL}${normalizedEndpoint}/` : API_URL;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.DEFAULT_TIMEOUT);

  try {
    console.log(`📁 Blob Request: ${url}`);
    
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
      console.error(`❌ Blob Error: HTTP ${response.status} - ${errorBody}`);
      throw new ApiError(
        `HTTP error! Status: ${response.status}, Message: ${errorBody}`, 
        response.status
      );
    }
    
    const blob = await response.blob();
    console.log(`✅ Blob received: ${blob.size} bytes, type: ${blob.type}`);
    return blob;
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`💥 Blob Fetch Error (${endpoint}):`, error);
    throw error;
  }
}

// API service object
const apiService = {
  baseUrl: API_URL,
  
  // Bio/Profile Endpoints
  info: {
    get: (): Promise<ApiResponse<Info[]>> => {
      console.log('🔍 Fetching profile info...');
      return fetchApi<Info[]>('info');
    }
  },
  
  // Resume Endpoints with enhanced error handling
  resume: {
    view: async (): Promise<Blob> => {
      console.log('👁️ Viewing resume...');
      try {
        return await fetchBlob('resume/view');
      } catch (error) {
        console.error('❌ Resume view failed:', error);
        throw new Error('Failed to load resume for viewing. Please try again.');
      }
    },
    
    download: async (): Promise<Blob> => {
      console.log('⬇️ Downloading resume...');
      try {
        return await fetchBlob('resume/download');
      } catch (error) {
        console.error('❌ Resume download failed:', error);
        throw new Error('Failed to download resume. Please try again.');
      }
    },
    
    status: (): Promise<ApiResponse<any>> => {
      console.log('📊 Checking resume status...');
      return fetchApi<any>('resume/status');
    }
  },
  
  // Blog endpoints
  blog: {
    getAll: (): Promise<ApiResponse<BlogPost[]>> => {
      console.log('📝 Fetching blog posts...');
      return fetchApi<BlogPost[]>('post');
    },
    getOne: (id: string): Promise<ApiResponse<BlogPost>> => {
      console.log(`📄 Fetching blog post ${id}...`);
      return fetchApi<BlogPost>(`post/${id}`);
    }
  },
  
  // Project Endpoints
  projects: {
    getAll: (): Promise<ApiResponse<Project[]>> => {
      console.log('🚀 Fetching projects...');
      return fetchApi<Project[]>('projects');
    },
    getOne: (id: string): Promise<ApiResponse<Project>> => {
      console.log(`🔍 Fetching project ${id}...`);
      return fetchApi<Project>(`projects/${id}`);
    }
  },
  
  // Contact Endpoint with enhanced error handling
  contact: {
    send: async (formData: ContactForm) => {
      console.log('📧 Sending contact form...', formData);
      
      try {
        const response = await fetch(`${API_URL}contact/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log('📬 Contact API Response:', data);

        if (!response.ok) {
          const errorMessage = data.detail || data.error || `HTTP ${response.status}: ${response.statusText}`;
          console.error('❌ Contact form error:', errorMessage);
          return { error: errorMessage };
        }

        console.log('✅ Contact form sent successfully');
        return { data };
        
      } catch (error) {
        console.error('💥 Contact API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
        return { error: errorMessage };
      }
    }
  },
  
  // Cards/Wallet Endpoint
  cards: {
    getAll: (): Promise<ApiResponse<Card[]>> => {
      console.log('💳 Fetching cards...');
      return fetchApi<Card[]>('cards');
    }
  },

  // Utility methods
  utils: {
    // Test API connectivity
    testConnection: async (): Promise<boolean> => {
      try {
        console.log('🔌 Testing API connection...');
        const response = await fetch(API_URL, { method: 'HEAD' });
        const isConnected = response.ok;
        console.log(`🔌 API connection test: ${isConnected ? 'Success' : 'Failed'}`);
        return isConnected;
      } catch (error) {
        console.error('🔌 API connection test failed:', error);
        return false;
      }
    },

    // Get API health status
    getHealth: (): Promise<ApiResponse<any>> => {
      console.log('🏥 Checking API health...');
      return fetchApi<any>('../health');  // Go up one level from /api/
    }
  }
};

export default apiService;