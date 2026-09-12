/**
 * Theme Configuration Utilities
 * Color palettes, theme modes, and styling utilities
 */

/**
 * Color palette definitions
 */
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  neutral: {
    white: '#ffffff',
    black: '#000000',
  },
};

/**
 * Theme mode definitions
 */
export const themes = {
  light: {
    name: 'Light',
    value: 'light',
    icon: 'sun',
    colors: {
      background: '#ffffff',
      foreground: '#1f2937',
      card: '#ffffff',
      border: '#e5e7eb',
    },
  },
  dark: {
    name: 'Dark',
    value: 'dark',
    icon: 'moon',
    colors: {
      background: '#0f172a',
      foreground: '#f8fafc',
      card: '#1e293b',
      border: '#334155',
    },
  },
};

/**
 * Component size definitions
 */
export const sizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
};

/**
 * Spacing scale
 */
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

/**
 * Breakpoints
 */
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Get color value from palette
 */
export const getColor = (colorName, shade = 500) => {
  return colors[colorName]?.[shade] || colors.primary[shade];
};

/**
 * Get contrast color (light or dark) based on background
 */
export const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

/**
 * Generate color scale
 */
export const generateColorScale = (baseColor) => {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  // This is simplified - a real implementation would use proper color math
  return shades.reduce((acc, shade) => {
    acc[shade] = baseColor;
    return acc;
  }, {});
};

/**
 * Theme transition utilities
 */
export const transitions = {
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  normal: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  slowest: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
};

/**
 * Elevation/shadow utilities
 */
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  dark: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};

/**
 * Border radius utilities
 */
export const radii = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
};

/**
 * Z-index scale
 */
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
};

/**
 * Opacity utilities
 */
export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
};

/**
 * Get theme-aware value
 */
export const getThemeValue = (value, theme = 'light') => {
  const themeConfig = themes[theme];
  return themeConfig?.colors?.[value] || value;
};
