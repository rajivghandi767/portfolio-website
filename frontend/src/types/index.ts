/**
 * API Response type for all API calls
 */
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Bio/Profile information type
 */
export interface Info {
  id: number;
  greeting: string;
  bio: string;
  profile_photo: string | null;
}

/**
 * Blog post type
 */
export interface BlogPost {
  id: number;
  title: string;
  author?: string;
  body: string;
  image: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
}

/**
 * Project type
 */
export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  repo: string;
  deployed_url?: string;
  technology: string;
}

/**
 * Credit card type for wallet section
 */
export interface Card {
  id: number;
  card_name: string;
  description: string;
  annual_fee?: string;
  thumbnail?: string;
  referral_link?: string;
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
 * Contact response type
 */
export interface ContactResponse {
  status: string;
  message: string;
  notifications?: {
    email: boolean;
    discord: boolean;
  };
}

/**
 * Notification types for UI feedback
 */
export type NotificationType = 'success' | 'error' | null;

/**
 * Theme context type
 */
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

/**
 * Banner props
 */
export interface BannerProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

/**
 * NavBar props
 */
export interface NavBarProps {
  isMenuOpen: boolean;
}

/**
 * Resume Modal props
 */
export interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Section components props
 */
export interface SectionProps {
  id?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Layout component props
 */
export interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Common props for page components 
 */
export interface PageProps {
  limit?: number;
}