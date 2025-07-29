// src/hooks/useResumeData.ts

import { useState, useEffect } from 'react';
// FIX: Import the single source of truth for our data type
import type { ResumeData } from '@/types/index';
import companyDataJson from '@/config/resume-data.json'; 

// REMOVED: The local CompanyData interface is no longer needed.

export const useResumeData = () => {
  // FIX: Use the imported ResumeData interface
  const [data, setData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // FIX: Cast the imported JSON to our central ResumeData type
      setData(companyDataJson as ResumeData);
      setIsLoading(false);
    } catch (e) {
      setError('Failed to load company data: ' + e);
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error };
};