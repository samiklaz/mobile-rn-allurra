const primary = '#F22179';

export default {
  // Backgrounds
  background: '#0A0A0B',
  surface: '#141416',
  surfaceLight: '#1A1A1D',
  surfaceElevated: '#1E1E21',

  // Primary Colors
  primary,
  primaryLight: '#FF4D9F',
  primaryDark: '#CC1960',
  primaryAlpha: (opacity: number) => `rgba(242, 33, 121, ${opacity})`,

  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#A0A0A8',
  textTertiary: '#6B6B73',
  textMuted: '#505055',

  // Border Colors
  border: '#262629',
  borderLight: '#323236',
  borderFocus: primary,

  // Status Colors
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  info: '#3B82F6',
  infoLight: '#60A5FA',

  // Additional UI Colors
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  amber: '#F59E0B',
  amberLight: '#FBBF24',
  blue: '#3B82F6',
  blueLight: '#60A5FA',

  // Tab Bar
  tabIconDefault: '#6B6B73',
  tabIconSelected: primary,

  // Overlays & Shadows
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Gradients (as arrays for LinearGradient)
  gradients: {
    primary: [primary, '#FF4D9F'],
    dark: ['rgba(0, 0, 0, 0.7)', 'transparent'],
    surface: ['#1A1A1D', '#141416'],
  },
};
