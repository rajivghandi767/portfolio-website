// src/utils/imageUtils.ts
const imageUtils = {
  /**
   * Convert relative image paths to full URLs
   * @param imagePath Relative or absolute image path
   * @param type Image type for fallback (optional)
   * @returns Full image URL or placeholder
   */
  getImageUrl: (imagePath: string | null | undefined, type?: string): string => {
    // If no image path provided, return a proper data URL placeholder
    if (!imagePath) {
      return createPlaceholderDataUrl(type);
    }
    
    // If already a full URL, return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    
    // If already a data URL, return as is
    if (imagePath.startsWith("data:")) {
      return imagePath;
    }
    
    // For relative paths starting with media/ or static/, use API base URL
    const cleanPath = imagePath.replace(/^\/+/, "");
    
    if (cleanPath.startsWith('media/') || cleanPath.startsWith('static/')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-api.rajivwallace.com';
      return `${baseUrl}/${cleanPath}`;
    }
    
    // For other relative paths, assume they're local assets
    return `/${cleanPath}`;
  }
};

/**
 * Create a proper data URL placeholder SVG
 * @param type Type of image for appropriate placeholder
 * @returns Data URL for SVG placeholder
 */
function createPlaceholderDataUrl(type?: string): string {
  const placeholders = {
    profile: { width: 200, height: 200, text: 'Profile' },
    project: { width: 400, height: 250, text: 'Project Image' },
    blogPost: { width: 400, height: 200, text: 'Blog Image' },
    card: { width: 300, height: 190, text: 'Card Image' },
    default: { width: 400, height: 300, text: 'Image' }
  };
  
  const config = placeholders[type as keyof typeof placeholders] || placeholders.default;
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}">
      <rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
      <circle cx="50%" cy="40%" r="20" fill="#e9ecef"/>
      <text x="50%" y="65%" font-family="system-ui, -apple-system, sans-serif" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#6c757d">
        ${config.text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
}

export default imageUtils;