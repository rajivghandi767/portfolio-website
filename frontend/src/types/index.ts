// API Response Types
export interface Info {
  id: number;
  greeting: string;
  bio: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  stack: string;
  repo: string;
}

export interface BlogPost {
  id: number;
  title: string;
  body: string;
  image: string;
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
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}
