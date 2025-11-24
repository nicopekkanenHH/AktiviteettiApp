// theme.ts
export const COLORS = {
    primary: '#1E90FF',
    secondary: '#FF6347',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#333333',
    textLight: '#777777',
    border: '#E0E0E0',
    error: '#FF4C4C',
  };
  
  export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };
  
  export const FONT_SIZES = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 30,
  };
  
  // fontWeight tyypitetty tarkasti
  export const FONT_WEIGHTS = {
    regular: '400' as '400',
    medium: '500' as '500',
    bold: '700' as '700',
  };
  
  export const BORDER_RADIUS = {
    sm: 4,
    md: 8,
    lg: 12,
    round: 9999,
  };
  
  export const BUTTON_STYLE = {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center' as 'center',
  };
  
  export const BUTTON_TEXT_STYLE = {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  };
  