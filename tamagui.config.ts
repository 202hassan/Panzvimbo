import { createTamagui, createTokens } from 'tamagui'
import { colors } from './src/constants/colors'

// Tamagui tokens configuration
const tokens = createTokens({
  color: {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    secondary: colors.secondary,
    secondaryDark: colors.secondaryDark,
    secondaryLight: colors.secondaryLight,
    tertiary: colors.tertiary,
    tertiaryDark: colors.tertiaryDark,
    tertiaryLight: colors.tertiaryLight,
    blue: colors.blue,
    blueDark: colors.blueDark,
    blueLight: colors.blueLight,
    white: colors.white,
    black: colors.black,
    background: colors.background,
    backgroundDark: colors.backgroundDark,
    surface: colors.surface,
    surfaceAlt: colors.gray100,
    inputBackground: colors.gray100,
    text: colors.gray900,
    textSecondary: colors.gray600,
    textMuted: colors.gray500,
    textDark: colors.gray50,
    border: colors.gray300,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  space: {
    xs: 4, 
    sm: 8, 
    md: 16, 
    lg: 24, 
    xl: 32, 
    xxl: 48,
    // Aliases for existing code compatibility
    '1': 4,
    '2': 8,
    '3': 12,
    '4': 16,
    '5': 20,
    '6': 24,
    '8': 32,
    '10': 40,
    true: 16,
    '$true': 16,
  },
  size: {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
    // Aliases
    '1': 4,
    '2': 8,
    '3': 12,
    '4': 16,
    '5': 20,
    true: 48,
    '$true': 48,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
    // Aliases
    '2': 4,
    '4': 8,
    true: 8,
    '$true': 8,
  },
  zIndex: {
    low: 1,
    medium: 10,
    high: 100,
    overlay: 1000,
    true: 10,
    '$true': 10,
  },
})

// Simple configuration object for Tamagui
const config = createTamagui({
  tokens,
  themes: {
    light: {
      background: tokens.color.background,
      color: tokens.color.text,
      borderColor: tokens.color.border,
      primary: tokens.color.primary,
      secondary: tokens.color.secondary,
      // Map card backgrounds
      cardBackground: tokens.color.surface,
    },
    dark: {
      background: tokens.color.backgroundDark,
      color: tokens.color.textDark,
      borderColor: tokens.color.border,
      primary: tokens.color.primary,
      secondary: tokens.color.secondary,
      cardBackground: tokens.color.surfaceAlt,
    },
  },
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
  },
  shorthands: {
    p: 'padding',
    m: 'margin',
    bg: 'backgroundColor',
    f: 'flex',
    w: 'width',
    h: 'height',
    br: 'borderRadius',
  }
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
