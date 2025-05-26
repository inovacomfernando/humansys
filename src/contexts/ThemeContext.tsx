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
  applyBrandColors: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [brandColors, setBrandColors] = useState({
    primary: '#22c55e',
    secondary: '#16a34a'
  });
  // Definir o logo correto da Humansys como padrão
  const [companyLogo, setCompanyLogo] = useState<string>('/lovable-uploads/4eb8b2ed-a39e-4a47-b3d4-9a2a9c68f7c1.png');

  useEffect(() => {
    const savedTheme = localStorage.getItem('@humansys:theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    const savedColors = localStorage.getItem('@humansys:brand-colors');
    if (savedColors) {
      setBrandColors(JSON.parse(savedColors));
    }

    const savedLogo = localStorage.getItem('@humansys:company-logo');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('@humansys:theme', theme);
  }, [theme]);

  const applyBrandColors = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', brandColors.primary);
    root.style.setProperty('--secondary-color', brandColors.secondary);
    
    // Aplicar cores do Tailwind dinamicamente
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --primary: ${hexToHsl(brandColors.primary)};
        --primary-foreground: 210 40% 98%;
      }
      .bg-primary { background-color: ${brandColors.primary} !important; }
      .text-primary { color: ${brandColors.primary} !important; }
      .border-primary { border-color: ${brandColors.primary} !important; }
    `;
    document.head.appendChild(style);
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetBrandColors = (colors: { primary: string; secondary: string }) => {
    setBrandColors(colors);
    localStorage.setItem('@humansys:brand-colors', JSON.stringify(colors));
  };

  const handleSetCompanyLogo = (logo: string) => {
    setCompanyLogo(logo);
    localStorage.setItem('@humansys:company-logo', logo);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      brandColors,
      setBrandColors: handleSetBrandColors,
      companyLogo,
      setCompanyLogo: handleSetCompanyLogo,
      applyBrandColors
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
