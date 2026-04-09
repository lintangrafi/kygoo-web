/**
 * Theme Context and Hook
 * Provides dynamic theme switching for business lines
 */

'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { BusinessLine, ThemeConfig, getTheme } from '@/src/config/themes';
import { Global, css, ThemeProvider } from '@emotion/react';
import {
  studioAnimations,
  photoboothAnimations,
  digitalAnimations,
  coffeeAnimations,
  utilityAnimations,
} from '@/src/styles/animations';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  businessLine: BusinessLine;
  switchTheme: (line: BusinessLine) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function KygooThemeProvider({ children }: { children: ReactNode }) {
  const [businessLine, setBusinessLine] = useState<BusinessLine>('studio');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('kygoo_theme') as BusinessLine;
    if (savedTheme && ['studio', 'photobooth', 'digital', 'coffee'].includes(savedTheme)) {
      setBusinessLine(savedTheme);
    }
  }, []);

  const switchTheme = (line: BusinessLine) => {
    setBusinessLine(line);
    localStorage.setItem('kygoo_theme', line);
  };

  const currentTheme = getTheme(businessLine);

  // Get appropriate animations for current theme
  const getThemeAnimations = (line: BusinessLine): any => {
    const animationMap = {
      studio: studioAnimations,
      photobooth: photoboothAnimations,
      digital: digitalAnimations,
      coffee: coffeeAnimations,
    };
    return animationMap[line];
  };

  // Global styles with CSS variables
  const globalStyles = css`
    :root {
      --color-primary: ${currentTheme.colors.primary};
      --color-secondary: ${currentTheme.colors.secondary};
      --color-accent: ${currentTheme.colors.accent};
      --color-background: ${currentTheme.colors.background};
      --color-foreground: ${currentTheme.colors.foreground};
      --color-muted: ${currentTheme.colors.muted};
      --color-muted-foreground: ${currentTheme.colors.mutedForeground};
      --color-border: ${currentTheme.colors.border};

      --font-display: ${currentTheme.typography.displayFont};
      --font-body: ${currentTheme.typography.bodyFont};

      --transition: ${currentTheme.animations.transition};
      --ease-out: ${currentTheme.animations.easeOut};

      --effect-blur: ${currentTheme.effects.blur};
      --effect-shadow: ${currentTheme.effects.shadow};
      --effect-gradient: ${currentTheme.effects.accentGradient};
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      background-color: var(--color-background);
      color: var(--color-foreground);
      font-family: var(--font-body);
      line-height: 1.6;
      transition: background-color 0.6s ease, color 0.6s ease;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-display);
      font-weight: 600;
    }

    a {
      color: var(--color-accent);
      transition: color 0.3s ease;
      text-decoration: none;

      &:hover {
        opacity: 0.8;
      }
    }

    /* Smooth page transitions */
    .page-enter {
      animation: ${currentTheme.animations.entrance};
    }

    .page-exit {
      animation: ${currentTheme.animations.exit};
    }

    /* Selection highlight */
    ::selection {
      background-color: var(--color-accent);
      color: var(--color-background);
    }

    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 10px;
    }

    ::-webkit-scrollbar-track {
      background: var(--color-background);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--color-accent);
      border-radius: 5px;

      &:hover {
        background: var(--color-primary);
      }
    }
  `;

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, businessLine, switchTheme }}>
      <ThemeProvider theme={currentTheme}>
        <Global styles={[globalStyles, getThemeAnimations(businessLine), utilityAnimations]} />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useKygooTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useKygooTheme must be used within KygooThemeProvider');
  }
  return context;
}

// Alias for convenience
export const useTheme = useKygooTheme;

