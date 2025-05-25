
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextData {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  brandColors: {
    primary: string;
    secondary: string;
  };
  setBrandColors: (colors: { primary: string; secondary: string }) => void;
  companyLogo?: string;
  setCompanyLogo: (logo: string) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [brandColors, setBrandColors] = useState({
    primary: '#22c55e',
    secondary: '#16a34a'
  });
  const [companyLogo, setCompanyLogo] = useState<string>();

  useEffect(() => {
    const savedTheme = localStorage.getItem('@rh-system:theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    const savedColors = localStorage.getItem('@rh-system:brand-colors');
    if (savedColors) {
      setBrandColors(JSON.parse(savedColors));
    }

    const savedLogo = localStorage.getItem('@rh-system:company-logo');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('@rh-system:theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetBrandColors = (colors: { primary: string; secondary: string }) => {
    setBrandColors(colors);
    localStorage.setItem('@rh-system:brand-colors', JSON.stringify(colors));
  };

  const handleSetCompanyLogo = (logo: string) => {
    setCompanyLogo(logo);
    localStorage.setItem('@rh-system:company-logo', logo);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      brandColors,
      setBrandColors: handleSetBrandColors,
      companyLogo,
      setCompanyLogo: handleSetCompanyLogo
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
