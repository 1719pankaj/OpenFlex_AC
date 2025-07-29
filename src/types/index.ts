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

// FIX: Add a type for service images
export interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  image: string; // Add image property
}

export interface Services {
  subtitle: string;
  items: ServiceItem[];
}

// NEW: Define the shape of a single client logo
export interface ClientLogo {
  src: string;
  alt: string;
}

// NEW: Define the shape for the entire clients section
export interface Clients {
  title: string;
  logos: ClientLogo[];
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
  clients: Clients; // <-- FIX: Add the new clients property here
  whyChooseUs: WhyChooseUsItem[];
  contact: Contact;
}