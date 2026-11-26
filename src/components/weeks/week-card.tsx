import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { WorkoutDayRow } from '@/components/weeks/workout-day-row';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatDateRange } from '@/utils/format';

import type { PlanWeek } from '@/core/db/queries';

export type WeekCardProps = {
  /** Semana con sus días y bloques. */
  week: PlanWeek;
  /** Ids de los días que están desplegados. */
  expandedDayIds: string[];
  /** Callback al plegar/desplegar un día. */
  onToggleDay: (dayId: string) => void;
  /**
   * Muestra el nombre de la semana en la cabecera de la tarjeta.
   *
   * Por defecto es `true`. En la pantalla Plan se pasa `false` porque el
   * nombre ya aparece en el selector de la cabecera: mostrarlo dos veces
   * seguidas es ruido visual.
   */
  showTitle?: boolean;
};

/** Tarjeta de una semana con su cabecera y la lista de días. */
export function WeekCard({
  week,
  expandedDayIds,
  onToggleDay,
  showTitle = true,
}: WeekCardProps) {
  const border = useThemeColor(undefined, 'border');
  const primary = useThemeColor(undefined, 'primary');

  return (
    <ThemedView style={[styles.card, { borderColor: border }]}>
      <View style={styles.header}>
        {showTitle ? <ThemedText type="semiBold">{week.name}</ThemedText> : null}
        <ThemedText type="small" style={styles.range}>
          {formatDateRange(week.startDate, week.endDate)}
        </ThemedText>
        {week.note ? (
          <View style={styles.noteRow}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color={primary}
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
            <ThemedText type="small" style={styles.note}>
              {week.note}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View style={[styles.separator, { borderColor: border }]} />

      {week.days.length === 0 ? (
        <ThemedText type="small" style={styles.emptyDays}>
          Esta semana no tiene días planificados.
        </ThemedText>
      ) : (
        week.days.map((day) => (
          <WorkoutDayRow
            key={day.id}
            day={day}
            expanded={expandedDayIds.includes(day.id)}
            onToggle={() => onToggleDay(day.id)}
          />
        ))
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  header: {
    gap: 4,
  },
  range: {
    opacity: 0.75,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  note: {
    flex: 1,
    opacity: 0.75,
  },
  separator: {
    height: 1,
    borderTopWidth: 1,
  },
  emptyDays: {
    opacity: 0.7,
  },
});
