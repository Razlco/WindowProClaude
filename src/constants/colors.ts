// Color palette for the app
export const Colors = {
  primary: '#2563eb', // Blue
  primaryDark: '#1d4ed8',
  primaryLight: '#60a5fa',

  secondary: '#10b981', // Green
  secondaryDark: '#059669',
  secondaryLight: '#34d399',

  accent: '#f59e0b', // Amber
  accentDark: '#d97706',
  accentLight: '#fbbf24',

  background: '#ffffff',
  backgroundGray: '#f3f4f6',

  text: '#111827',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',

  border: '#e5e7eb',
  borderDark: '#d1d5db',

  error: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  info: '#3b82f6',

  // Status colors
  draft: '#9ca3af',
  quoted: '#3b82f6',
  approved: '#10b981',
  inProgress: '#f59e0b',
  completed: '#059669',
  cancelled: '#ef4444',
};

export type ColorKeys = keyof typeof Colors;
