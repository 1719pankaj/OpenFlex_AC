// src/hooks/useResumeData.ts

import { useState, useEffect } from 'react';
// It's fine to keep the filename as is, or you can rename it to company-data.json
import companyDataJson from '@/config/resume-data.json'; 

// NEW: Define an interface that matches the Accountants Point JSON structure
export interface CompanyData {
  company: {
    name: string;
    email: string;
    phone: string;
    website?: string; // Optional property
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    zincBackground: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButtons: {
      primary: string;
      secondary: string;
    };
  };
  about: {
    title: string;
    description: string[];
  };
  services: {
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      features: string[];
    }>;
  };
  whyChooseUs: Array<{
    title: string;
    description: string;
  }>;
  contact: {
    subtitle: string;
    cta: string;
  };
}


export const useResumeData = () => {
  // Use the new CompanyData interface here
  const [data, setData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Cast the imported JSON to our new CompanyData type
      setData(companyDataJson as CompanyData);
      setIsLoading(false);
    } catch (e) {
      setError('Failed to load company data'+ e);
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error };
};