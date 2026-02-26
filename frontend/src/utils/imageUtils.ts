/**
 * Creates a placeholder SVG as a data URL.
 * @param type - A string key for the type of placeholder.
 * @returns A data URL string for the SVG placeholder.
 */
function createPlaceholderDataUrl(type?: string): string {
  const placeholders = {
    profile: { width: 200, height: 200, text: 'Profile' },
    project: { width: 400, height: 250, text: 'Project' },
    blogPost: { width: 800, height: 400, text: 'Blog Image' },
    card: { width: 300, height: 190, text: 'Card' },
    default: { width: 400, height: 300, text: 'Image' }
  };
  
  const config = placeholders[type as keyof typeof placeholders] || placeholders.default;
  
  const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}">
        <rect width="100%" height="100%" fill="#171717"/>
        <text x="50%" y="50%" font-family="ui-monospace, monospace" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="#525252">
          ${config.text}
        </text>
      </svg>
    `;
  
  return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
}


const imageUtils = {
  /**
   * Safely returns a full image URL from a given path or a placeholder.
   * @param imagePath - The URL or path of the image.
   * @param type - The type of image for generating a correct placeholder.
   * @returns A full image URL or a data URL for a placeholder.
   */
  getImageUrl: (imagePath: unknown, type?: string): string => {
    // Check if imagePath is a valid, non-empty string
    if (typeof imagePath !== 'string' || !imagePath) {
      return createPlaceholderDataUrl(type);
    }

    // If it's already a full URL or data URL, return it
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
      return imagePath;
    }

    // For relative paths, prepend the API base URL
    const baseUrl = import.meta.env.VITE_API_URL || '';
    // Ensure there's no double slash between the base URL and the image path
    return `${baseUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }
};

export default imageUtils;