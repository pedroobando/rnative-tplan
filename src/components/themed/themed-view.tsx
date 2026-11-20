import { View, type ViewProps } from 'react-native';

import type { ThemeColorToken } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  /**
   * Token de color del tema activo (light, dark, ocean, emerald, orange).
   * Por defecto: 'background'.
   */
  colorScheme?: ThemeColorToken;
  /**
   * Overrides opcionales por esquema. Si se indican, tienen prioridad sobre
   * `colorScheme` (útil para casos puntuales que no encajan en el token).
   */
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, colorScheme, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    lightColor || darkColor ? { light: lightColor, dark: darkColor } : undefined,
    colorScheme ?? 'background',
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
