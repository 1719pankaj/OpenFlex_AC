// src/types/index.ts

export interface Company {
  name: string;
  email: string;
  phone: string;
  website?: string; // Optional property
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  zincBackground: string;
}

export interface Hero {
  badge: string;
  title: string;
  subtitle: string;
  ctaButtons: {
    primary: string;
    secondary: string;
  };
}

export interface About {
  title: string;
  description: string[];
}

export interface ServiceItem {
  title: string;
  description: string;
  features: string[];
}

export interface Services {
  subtitle: string;
  items: ServiceItem[];
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
}

export interface Contact {
  subtitle: string;
  cta: string;
}

// This is the main type that you need to fix
export interface ResumeData {
  company: Company;
  theme: Theme;
  hero: Hero;
  about: About;
  services: Services;
  whyChooseUs: WhyChooseUsItem[];
  contact: Contact;
}