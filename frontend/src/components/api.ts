import { ApiResponse } from "../types/index";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL;

// Generic fetch function with error handling and typing
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}/${endpoint.replace(/^\/+/, "")}`;
  
  try {
    console.log(`Fetching from: ${url}`);
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

// API service with methods for different endpoints
const apiService = {
  // Base URL exposed for rare cases where direct access is needed
  baseUrl: API_URL,
  
  // API endpoints and methods
  info: {
    get: () => fetchApi('info')
  },
  blog: {
    getAll: () => fetchApi('blog'),
    getOne: (id: string) => fetchApi(`blog/${id}`)
  },
  projects: {
    getAll: () => fetchApi('projects'),
    getOne: (id: string) => fetchApi(`projects/${id}`)
  },
  
  // Helper functions
  getImageUrl: (imagePath: string | null): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    
    const cleanPath = imagePath.replace(/^\/+/, "");
    const baseUrl = API_URL.split("/").slice(0, 3).join("/");
    return `${baseUrl}/${cleanPath}`;
  },
};

export default apiService;