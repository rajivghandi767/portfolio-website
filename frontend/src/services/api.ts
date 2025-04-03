import { ApiResponse, BlogPost, Project, Info, Card } from "../types";

function getApiUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL;
  if (!configuredUrl) {
    console.warn('VITE_API_URL environment variable is not set. Using fallback URL.');
    return 'http://127.0.0.1:8000/'; // Default fallback for development
  }
  return configuredUrl;
}

const API_URL = getApiUrl();

/**
 * Generic fetch function with error handling and typing
 * @param endpoint API endpoint path
 * @param options Fetch options
 * @returns Typed API response with data, error, and status
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}/${endpoint.replace(/^\/+/, "")}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "An unknown error occurred",
      status: 0,
    };
  }
}

/**
 * Fetch blob data (PDFs, etc.)
 * @param endpoint API endpoint path
 * @param options Fetch options
 * @returns Blob data
 */
async function fetchBlob(
  endpoint: string,
  options: RequestInit = {}
): Promise<Blob> {
  const url = `${API_URL}/${endpoint.replace(/^\/+/, "")}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return await response.blob();
}

/**
 * Centralized API service for all endpoints
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
};

export default apiService;