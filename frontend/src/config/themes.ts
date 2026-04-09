/**
 * Theme Configuration for Kygoo Business Lines
 * Each line has its unique aesthetic, colors, typography, and animations
 */

export type BusinessLine = 'studio' | 'photobooth' | 'digital' | 'coffee';

export interface ThemeConfig {
  // Brand Identity
  name: string;
  subtitle: string;
  businessLine: BusinessLine;
  
  // Color Palette
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
  };
  
  // Typography
  typography: {
    displayFont: string;
    bodyFont: string;
    headingScale: number;
  };
  
  // Animation Presets
  animations: {
    transition: string;
    easeOut: string;
    entrance: string;
    exit: string;
  };
  
  // Visual Effects
  effects: {
    blur: string;
    shadow: string;
    accentGradient: string;
  };
}

// ====================================
// 1. KYGOO STUDIO - Luxury Photography
// ====================================
export const studioTheme: ThemeConfig = {
  name: 'Kygoo Studio',
  subtitle: 'Premium Photography & Design',
  businessLine: 'studio',
  
  colors: {
    primary: '#000000',      // Deep black
    secondary: '#ffffff',    // Pure white
    accent: '#d4af37',       // Gold
    background: '#f8f8f8',   // Warm off-white
    foreground: '#1a1a1a',   // Near-black
    muted: '#a0a0a0',        // Sophisticated gray
    mutedForeground: '#666666',
    border: '#e0e0e0',
  },
  
  typography: {
    displayFont: "'Playfair Display', serif", // Elegant serif for display
    bodyFont: "'Inter', sans-serif",           // Clean sans for body
    headingScale: 1.2,
  },
  
  animations: {
    transition: '0.6s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth deceleration
    easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    entrance: 'fadeInSlow 0.8s ease-out forwards',    // Slow elegant reveal
    exit: 'fadeOut 0.6s ease-in forwards',
  },
  
  effects: {
    blur: 'blur(24px)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    accentGradient: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
  },
};

// ====================================
// 2. KYGOO PHOTOBOOTH - Fun & Playful
// ====================================
export const photoboothTheme: ThemeConfig = {
  name: 'Kygoo Photobooth',
  subtitle: 'Fun Moments, Perfect Shots',
  businessLine: 'photobooth',
  
  colors: {
    primary: '#ff006e',      // Hot pink/magenta
    secondary: '#00d9ff',    // Cyan
    accent: '#ffbe0b',       // Vibrant yellow
    background: '#0a0e27',   // Dark navy
    foreground: '#ffffff',
    muted: '#8a92b2',        // Soft lavender
    mutedForeground: '#b0b8d4',
    border: '#2d2f4d',
  },
  
  typography: {
    displayFont: "'Fredoka', sans-serif",      // Geometric playful font
    bodyFont: "'Inter', sans-serif",           // Clean body
    headingScale: 1.3,                         // Bolder scale
  },
  
  animations: {
    transition: '0.35s cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy
    easeOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',          // Spring effect
    entrance: 'scaleAndFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    exit: 'scaleAndFadeOut 0.4s ease-in forwards',
  },
  
  effects: {
    blur: 'blur(16px)',
    shadow: '0 12px 48px rgba(255, 0, 110, 0.3)',
    accentGradient: 'linear-gradient(135deg, #ff006e 0%, #00d9ff 100%)',
  },
};

// ====================================
// 3. KYGOO DIGITAL - Tech Forward
// ====================================
export const digitalTheme: ThemeConfig = {
  name: 'Kygoo Digital',
  subtitle: 'Digital Solutions & Innovation',
  businessLine: 'digital',
  
  colors: {
    primary: '#0f0f23',      // Deep navy/black
    secondary: '#00d084',    // Neon green
    accent: '#00e5ff',       // Cyan accent
    background: '#0a0a15',   // Almost black
    foreground: '#e0e0ff',   // Soft white-blue
    muted: '#4a4a6a',        // Dark gray
    mutedForeground: '#7a7a9a',
    border: '#1a1a3a',
  },
  
  typography: {
    displayFont: "'Space Mono', monospace",     // Technical vibe
    bodyFont: "'Inter', sans-serif",            // Modern sans
    headingScale: 1.15,                         // Tight scale
  },
  
  animations: {
    transition: '0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    entrance: 'slideUpAndFade 0.6s ease-out forwards',
    exit: 'slideDownAndFade 0.4s ease-in forwards',
  },
  
  effects: {
    blur: 'blur(20px)',
    shadow: '0 8px 32px rgba(0, 224, 255, 0.2)',
    accentGradient: 'linear-gradient(90deg, #00d084 0%, #00e5ff 100%)',
  },
};

// ====================================
// 4. KYGOO COFFEE - Warm & Organic
// ====================================
export const coffeeTheme: ThemeConfig = {
  name: 'Kygoo Coffee',
  subtitle: 'Artisanal Coffee Experience',
  businessLine: 'coffee',
  
  colors: {
    primary: '#6f4e37',      // Deep coffee brown
    secondary: '#f5e6d3',    // Warm cream
    accent: '#d97706',       // Terracotta/warmth
    background: '#faf7f2',   // Off-white warm
    foreground: '#2c1810',   // Very dark brown
    muted: '#a0845a',        // Warm taupe
    mutedForeground: '#8b7355',
    border: '#e8dcc8',
  },
  
  typography: {
    displayFont: "'Merriweather', serif",      // Warm serif
    bodyFont: "'Lato', sans-serif",            // Friendly sans
    headingScale: 1.25,
  },
  
  animations: {
    transition: '0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    entrance: 'fadeInUp 0.6s ease-out forwards',
    exit: 'fadeOut 0.5s ease-in forwards',
  },
  
  effects: {
    blur: 'blur(18px)',
    shadow: '0 10px 40px rgba(111, 78, 55, 0.15)',
    accentGradient: 'linear-gradient(135deg, #6f4e37 0%, #d97706 100%)',
  },
};

// Theme Map
export const themeMap: Record<BusinessLine, ThemeConfig> = {
  studio: studioTheme,
  photobooth: photoboothTheme,
  digital: digitalTheme,
  coffee: coffeeTheme,
};

export const getTheme = (businessLine: BusinessLine): ThemeConfig => {
  return themeMap[businessLine];
};

export const getAllThemes = (): ThemeConfig[] => {
  return Object.values(themeMap);
};
