/**
 * Temas de la app (Uniwind).
 *
 * `light` y `dark` vienen built-in en Uniwind. `ocean`, `emerald` y `orange`
 * son temas propios, definidos como `@variant` en `src/global.css` y
 * registrados en `metro.config.js` -> `extraThemes`.
 *
 * `scheme` indica si el tema es de fondo claro u oscuro. Sirve para:
 *  - elegir el tema base de navegación de Expo Router (DarkTheme/DefaultTheme)
 *  - decidir qué color de un par { light, dark } usar en `useThemeColor`
 */

import { Platform } from 'react-native';
import type { ThemeName } from 'uniwind';

/**
 * Nombre de tema tal como lo conoce Uniwind. Se deriva de
 * `src/uniwind-types.d.ts`, que el bundler regenera con los `extraThemes`
 * de metro.config.js (light, dark, ocean, emerald, orange).
 */
export type UniwindThemeName = ThemeName;

/** Temas ofrecidos por la app (excluye el especial 'system' de Uniwind). */
export type AppThemeName = Exclude<UniwindThemeName, 'system'>;

export type AppTheme = {
  name: AppThemeName;
  label: string;
  icon: string;
  scheme: 'light' | 'dark';
};

export const appThemes: AppTheme[] = [
  { name: 'light', label: 'Claro', icon: '☀️', scheme: 'light' },
  { name: 'dark', label: 'Oscuro', icon: '🌙', scheme: 'dark' },
  { name: 'ocean', label: 'Ocean', icon: '🌊', scheme: 'light' },
  { name: 'emerald', label: 'Emerald', icon: '💚', scheme: 'light' },
  { name: 'orange', label: 'Orange', icon: '🧡', scheme: 'light' },
];

/** Tokens de color disponibles en todos los temas (ver src/global.css). */
export const themeColorTokens = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'danger',
  'text',
  'background',
  'border',
] as const;

export type ThemeColorToken = (typeof themeColorTokens)[number];

/** Familias de fuente disponibles (ver `--font-*` en src/global.css). */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/** Temas propios: a qué esquema (claro/oscuro) equivalen. */
export const customThemeSchemes: Record<string, 'light' | 'dark'> = {
  ocean: 'light',
  emerald: 'light',
  orange: 'light',
};
