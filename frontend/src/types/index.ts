/**
 * API Response type for all API calls
 */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Navigation Item Type
 */
export interface NavigationItem {
  id: number;
  label: string;
  path: string;
  sectionRef?: string | null;
}

/**
 * Bio/Profile information type
 */
export interface Info {
  id: number;
  site_header: string;
  professional_title: string;
  greeting: string;
  bio: string;
  profile_photo_url: string | null;
  image_width?: number;
  image_height?: number;
  github: string;
  linkedin: string;
  substack?: string;
  email?: string;
}

/**
 * Blog post type
 */
export interface BlogPost {
  id: number;
  title: string;
  author?: string;
  body: string;
  image_url: string;
  image_width?: number;
  image_height?: number;
  created_on?: string;
  publish_date?: string;
  status?: string;
  slug?: string;
  tags?: string[];
  categories?: number[];
  last_modified?: string;
  order?: number;
}

/**
 * Project type
 */
export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  image_width?: number;
  image_height?: number;
  repo: string;
  deployed_url?: string;
  emoji?: string;
  order?: number;
  switcher_order?: number;
  is_visible?: boolean;
  is_visible_switcher?: boolean;
  tags?: Tag[];
}

interface Tag {
  id: number;
  name: string;
}


/**
 * Credit card type for wallet section
 */
export interface Card {
  id: number;
  card_name: string;
  description: string;
  annual_fee?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  referral_link?: string;
  order?: number;
}

/**
 * Contact form data
 */
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}



/**
 * Notification types for UI feedback
 */
export type NotificationType = 'success' | 'error' | null;





/**
 * Common props for page components 
 */
export interface PageProps {
  limit?: number;
}