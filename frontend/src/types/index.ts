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
  created_on?: string;
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
  emoji?: string;
  order?: number;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  order: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  year: string;
  order: number;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date_issued: string;
  url: string | null;
  order: number;
}

export interface Skill {
  id: number;
  name: string;
  order: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  order: number;
  skills: Skill[];
}

export interface GlobalLink {
  id: number;
  name: string;
  url: string;
  icon_name: string;
  short_description?: string;
  order: number;
}

export interface BrandAsset {
  id: number;
  name: string;
  logo_url: string;
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