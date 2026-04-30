// Design tokens from Zyra design file
export const COLORS = {
  bg: '#FFFFFF',
  bgDark: '#0A0A0B',
  ink: '#0A0A0B',
  inkDim: 'rgba(10,10,11,0.55)',
  inkFaint: 'rgba(10,10,11,0.08)',
  line: 'rgba(10,10,11,0.08)',
  blue: '#0066FF',
  green: '#C6FF3D',
  black: '#0A0A0B',
};

export const FONTS = {
  header: 'System',
  body: 'System',
};

export const lightTheme = {
  colors: {
    primary: COLORS.green,
    primaryDark: '#A8D430',
    background: COLORS.bg,
    surface: '#F5F5F5',
    surfaceVariant: '#EFEFEF',
    text: COLORS.ink,
    textSecondary: COLORS.inkDim,
    textTertiary: 'rgba(10,10,11,0.35)',
    border: COLORS.line,
    divider: COLORS.inkFaint,
    blue: COLORS.blue,
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: COLORS.blue,
  },
};

export const darkTheme = {
  colors: {
    primary: COLORS.green,
    primaryDark: '#A8D430',
    background: COLORS.bgDark,
    surface: '#161618',
    surfaceVariant: '#1E1E22',
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.65)',
    textTertiary: 'rgba(255,255,255,0.45)',
    border: 'rgba(255,255,255,0.08)',
    divider: 'rgba(255,255,255,0.04)',
    blue: COLORS.blue,
    success: '#81C784',
    warning: '#FFB74D',
    error: '#EF5350',
    info: COLORS.blue,
  },
};

export type Theme = typeof lightTheme;
