/**
 * API Response type for all API calls
 */
export interface ApiResponse<T = any> {
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
  github: string;
  linkedin: string;
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
  created_at?: string;
  updated_at?: string;
  tags?: string[];
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
  repo: string;
  deployed_url?: string;
  technology: string;
  order?: number;
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

export interface ProjectsProps {
  limit?: number;
}

export interface BlogProps {
  limit?: number;
}

export interface WalletProps {
  limit?: number;
}