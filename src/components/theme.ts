// src/components/theme.ts

export const COLORS = {
    primary: '#3B82F6',
    primarySoft: '#E0ECFF',
    primaryDark: '#1D4ED8',
    accent: '#F97316',
  
    background: '#F5F7FB',
    backgroundAlt: '#FFFFFF',
    card: '#FFFFFF',
  
    border: '#E5E7EB',
  
    text: '#111827',
    textMuted: '#6B7280',
  
    success: '#10B981',
    danger: '#EF4444',
  
    cardShadow: 'rgba(15, 23, 42, 0.08)',
  };
  
  export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  };
  
  export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 20,
    pill: 999,
  };
  
  export const FONT_SIZES = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
  };
  
  // ✔ = const-assertion oikein
  export const FONT_WEIGHTS = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const;
  
  export const SHADOWS = {
    card: {
      shadowColor: COLORS.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 4,
    },
  };
  
  export const CARD_STYLE = {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.card,
  };
  
  // napit
  export const BUTTON_STYLE = {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    ...SHADOWS.card,
  };
  
  export const BUTTON_TEXT_STYLE = {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  };
  
  export const BUTTON_SECONDARY_STYLE = {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.backgroundAlt,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    ...SHADOWS.card,
  };
  
  export const BUTTON_SECONDARY_TEXT_STYLE = {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  };
  