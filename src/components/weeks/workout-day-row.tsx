import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { DayTypeBadge, getDayTypeLabel } from '@/components/weeks/day-type-badge';
import { WorkoutBlockRow } from '@/components/weeks/workout-block-row';
import { ThemedText } from '@/components/themed/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatDateShort, formatDayOfWeek, formatFullDate } from '@/utils/format';

import type { PlanDay } from '@/core/db/queries';

export type WorkoutDayRowProps = {
  /** Día de entrenamiento con sus bloques. */
  day: PlanDay;
  /** Si el día está desplegado mostrando sus bloques. */
  expanded: boolean;
  /** Callback para plegar/desplegar el día. */
  onToggle: () => void;
};

/** Etiqueta legible del tipo de día (se usa también en accesibilidad). */

export function WorkoutDayRow({ day, expanded, onToggle }: WorkoutDayRowProps) {
  const text = useThemeColor(undefined, 'text');

  const dayName = formatDayOfWeek(day.dayOfWeek);
  const dateLabel = day.workoutDate ? formatDateShort(day.workoutDate) : '';
  const typeLabel = getDayTypeLabel(day.dayType);
  const blockCount = day.blocks.length;

  const accessibilityLabel = [
    `${dayName} ${day.workoutDate ? formatFullDate(day.workoutDate) : ''}`.trim(),
    typeLabel,
    `${blockCount} ${blockCount === 1 ? 'bloque' : 'bloques'}`,
  ]
    .filter(Boolean)
    .join('. ')
    .concat('.');

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={expanded ? 'Plegar' : 'Desplegar'}
        style={[styles.row, day.dayType === 'rest' ? styles.restRow : undefined]}
      >
        <View style={styles.rowMain}>
          <ThemedText type="smallBold">{dayName}</ThemedText>
          {day.title ? (
            <ThemedText type="small" style={styles.title}>
              {day.title}
            </ThemedText>
          ) : null}
          <View style={styles.metaRow}>
            <DayTypeBadge dayType={day.dayType} />
            <ThemedText type="small" style={styles.count}>
              {`${blockCount} ${blockCount === 1 ? 'bloque' : 'bloques'}`}
            </ThemedText>
          </View>
        </View>

        <View style={styles.rowSide}>
          {dateLabel ? (
            <ThemedText type="small" style={styles.date}>
              {dateLabel}
            </ThemedText>
          ) : null}
          <Ionicons
            name="chevron-down-outline"
            size={18}
            color={text}
            style={[styles.chevron, expanded ? styles.chevronOpen : styles.chevronClosed]}
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </View>
      </Pressable>

      {expanded ? (
        <View style={styles.blocks}>
          {blockCount === 0 ? (
            <ThemedText type="small" style={styles.emptyBlocks}>
              {day.dayType === 'rest' ? 'Día de descanso.' : 'Sin bloques en este día.'}
            </ThemedText>
          ) : (
            day.blocks.map((block) => <WorkoutBlockRow key={block.id} block={block} />)
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  restRow: {
    opacity: 0.85,
  },
  rowMain: {
    flex: 1,
    gap: 4,
  },
  rowSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    opacity: 0.85,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  count: {
    opacity: 0.7,
  },
  date: {
    opacity: 0.75,
  },
  chevron: {
    opacity: 0.7,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  chevronClosed: {
    transform: [{ rotate: '0deg' }],
  },
  blocks: {
    gap: 12,
    paddingLeft: 2,
  },
  emptyBlocks: {
    opacity: 0.7,
  },
});
