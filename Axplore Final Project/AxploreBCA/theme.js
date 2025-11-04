export const COLORS = {
  primary: '#6200EE',
  primaryLight: '#9C64D1',
  primaryDark: '#4B0082',
  secondary: '#03DAC6',
  accent: '#FF4081',
  background: '#F5F7FF',
  surface: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    light: '#FFFFFF',
  },
  status: {
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00',
    info: '#007AFF',
  },
  divider: 'rgba(0, 0, 0, 0.1)',
  white: '#FFFFFF',
  black: '#000000',
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  s: 4,
  m: 8,
  l: 12,
  xl: 16,
  xxl: 24,
  round: 999,
};

export const LAYOUT = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  header: {
    height: 60,
    paddingHorizontal: SPACING.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    ...SHADOWS.medium,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
  },
};

export const ANIMATIONS = {
  button: {
    scale: 0.98,
    duration: 100,
  },
  transition: {
    duration: 200,
  },
};

export const CARD_STYLES = {
  base: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
  },
  elevated: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    ...SHADOWS.medium,
  },
};

export const INPUT_STYLES = {
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.m,
    paddingHorizontal: SPACING.m,
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  error: {
    ...TYPOGRAPHY.caption,
    color: COLORS.status.error,
    marginTop: SPACING.xs,
  },
};

export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.m,
    ...SHADOWS.small,
  },
  secondary: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  text: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
  },
}; 