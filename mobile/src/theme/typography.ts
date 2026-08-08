// src/theme/typography.ts

export const typography = {
  // We will map these to specific fonts loaded via Expo later (e.g., Inter or Roboto)
  fonts: {
    regular: 'sans',
    medium: 'sans-medium',
    semibold: 'sans-semibold',
    bold: 'sans-bold',
  },
  sizes: {
    xs: 12,      // Captions, timestamps, small stats
    sm: 14,      // Secondary text, small buttons
    base: 16,    // Body text, standard inputs
    lg: 18,      // Subtitles, list items
    xl: 20,      // Small headers
    '2xl': 24,   // Screen headers, Player Names
    '3xl': 30,   // Important stats (e.g., Total Team Score)
    '4xl': 36,   // Hero stats (e.g., Live Match Score)
    '5xl': 48,   // Massive numbers (e.g., End of Match Highlights)
  },
  // Line heights optimized for mobile readability and dense data tables
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;