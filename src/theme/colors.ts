// 🎨 Premium Dark Sports Theme — MOLDIN

export const colors = {
  primary: '#00FF66',
  primaryLight: '#33FF85',
  primaryDark: '#00CC52',
  primaryMuted: 'rgba(0, 255, 102, 0.08)',

  background: '#04090F',
  backgroundElevated: '#0A111A',
  backgroundCard: '#0E1721',
  backgroundInput: '#111B27',

  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#5A6878',
  textInverse: '#08120A',

  success: '#00FF66',
  error: '#FF3B4A',
  warning: '#FFB800',
  info: '#4DA6FF',
  live: '#FF0000',

  border: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.06)',

  neutral: {
    white: '#FFFFFF',
    background: '#04090F',
    surface: '#0E1721',
    text: '#FFFFFF',
    textDark: '#94A3B8',
    textLight: '#5A6878',
  },

  accent: {
    green: '#00FF66',
    blue: '#4DA6FF',
    orange: '#FF9500',
    red: '#FF3B4A',
    purple: '#A78BFA',
    yellow: '#FFD700',
  },

  chart: ['#00FF66', '#4DA6FF', '#FF9500', '#FF3B4A', '#A78BFA', '#FFD700'],

  gray: {
    100: '#E2E8F0',
    400: '#94A3B8',
    500: '#64748B',
    900: '#FFFFFF',
  },

  danger: {
    600: '#FF3B4A',
  },
};

export type Colors = typeof colors;
export default colors;