import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import type { ThemeColorToken } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

/** Tipos de día admitidos por `workout_days.day_type`. */
export type DayType = 'training' | 'rest' | 'race';

export type DayTypeBadgeProps = {
  /** Tipo de día del que se pinta el badge. */
  dayType: DayType;
};

type DayTypeConfig = {
  icon: ComponentProps<typeof Ionicons>['name'];
  token: ThemeColorToken;
};

/**
 * Etiqueta legible de cada tipo de día.
 *
 * Vive aquí para que el badge y cualquier otro componente que necesite el
 * texto (por ejemplo, las etiquetas de accesibilidad) usen la misma fuente.
 */
export const dayTypeLabels: Record<DayType, string> = {
  training: 'Entrenamiento',
  rest: 'Descanso',
  race: 'Carrera',
};

/** Etiqueta legible de un tipo de día. */
export function getDayTypeLabel(dayType: DayType): string {
  return dayTypeLabels[dayType];
}

/**
 * Cada tipo de día tiene su icono, su texto y su color de borde.
 * Nunca se depende solo del color: el badge siempre lleva icono + texto.
 */
const dayTypeConfig: Record<DayType, DayTypeConfig> = {
  training: { icon: 'barbell-outline', token: 'primary' },
  rest: { icon: 'moon-outline', token: 'secondary' },
  race: { icon: 'flag-outline', token: 'tertiary' },
};

export function DayTypeBadge({ dayType }: DayTypeBadgeProps) {
  const { icon, token } = dayTypeConfig[dayType];
  const label = getDayTypeLabel(dayType);

  // Solo el BORDE usa el token del tipo; el texto mantiene contraste con `text`.
  const borderColor = useThemeColor(undefined, token);

  return (
    <ThemedView style={[styles.badge, { borderColor }]}>
      <Ionicons
        name={icon}
        size={14}
        color={borderColor}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <ThemedText type="small">{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
