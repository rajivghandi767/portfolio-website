// API Response Types
export interface Info {
  id: number;
  profile_photo: string;
  greeting: string;
  bio: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  stack: string;
  repo: string;
  thumbnail?: string;
  deployed_url?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  body: string;
  image: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  excerpt?: string;
  slug?: string;
  category?: string;
  is_published?: boolean;
  view_count?: number;
}

export interface Card {
  id: number;
  card_name: string;
  annual_fee: string;
  referral_link: string;
  description?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Form Types

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Notification Types
export type NotificationType = 'success' | 'error' | null;

// Navigation Types
export interface SiteSection {
  id: number;
  section: string;
  ref: string;
}

// Component Props Types
export interface BannerProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export interface NavBarProps {
  isMenuOpen: boolean;
}

export interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
}
