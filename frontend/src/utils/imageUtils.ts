// src/utils/imageUtils.ts
import apiService from '../services/api';

/**
 * Creates a data URL for SVG placeholder when image is unavailable
 * @param width Width of the placeholder 
 * @param height Height of the placeholder
 * @param text Text to display in the placeholder
 * @returns Data URL for SVG placeholder
 */
export function createPlaceholderSvg(
  width: number = 400, 
  height: number = 300, 
  text: string = 'Image Unavailable'
): string {
  // Create a simple SVG data URL
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#eaeaea"/>
      <text x="50%" y="50%" font-family="monospace" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#999">
        ${text}
      </text>
    </svg>
  `;
  
  // Convert to data URL
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;
}

/**
 * Generate appropriate image URLs for different components
 * @param path Image path (relative or absolute)
 * @param type Type of image (determines fallback)
 * @returns Full image URL or appropriate placeholder
 */
export function getImageUrl(
  path: string | null | undefined, 
  type: 'profile' | 'project' | 'blogPost' | 'card' = 'project'
): string {
  // If no path provided, return appropriate placeholder
  if (!path) {
    const placeholders = {
      profile: createPlaceholderSvg(200, 200, 'No Profile Image'),
      project: createPlaceholderSvg(400, 250, 'Project Image Unavailable'),
      blogPost: createPlaceholderSvg(800, 400, 'Blog Image Unavailable'),
      card: createPlaceholderSvg(200, 140, 'Card Image Unavailable')
    };
    
    return placeholders[type];
  }
  
  // If path is already a complete URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If path is a data URL, return it
  if (path.startsWith('data:')) {
    return path;
  }
  
  // Otherwise get full URL via API service
  return apiService.getImageUrl(path);
}

/**
 * Preload images to avoid layout shifts
 * @param urls Array of image URLs to preload
 */
export function preloadImages(urls: string[]): void {
  urls.forEach(url => {
    if (!url) return;
    
    const img = new Image();
    img.src = url;
  });
}

export default {
  createPlaceholderSvg,
  getImageUrl,
  preloadImages
};