export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  role: string;
  feedback: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOTags {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface AILandingPageData {
  brandName: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  mainBenefit: string;
  features: Feature[];
  aboutTitle: string;
  aboutContent: string;
  testimonials: Testimonial[];
  faqs: FAQItem[];
  seo: SEOTags;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  niche?: string;
  createdAt: string;
}

export interface SEOAnalysisResult {
  score: number;
  analysis: string[];
  recommendations: string[];
}

export type ThemePreset = 'modern' | 'minimalist' | 'warm' | 'bold';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  bg: string;
  cardBg: string;
  text: string;
  textMuted: string;
  border: string;
}

export type FontPreset = 'Inter' | 'Space Grotesk' | 'Playfair Display' | 'JetBrains Mono';
