import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatNumber, formatTemplate, formatWorkValue } from '@/utils/format';

import type { PlanBlock } from '@/core/db/queries';

export type WorkoutBlockRowProps = {
  /** Bloque a pintar (con su tipo de ejercicio resuelto). */
  block: PlanBlock;
};

/**
 * Línea de trabajo de un bloque.
 *
 *  - con valor de trabajo: '3 × 5 km', '30 min', '500 m', '45 s', '10 reps'
 *  - sin valor de trabajo pero varias repeticiones: '× 10 reps'
 *  - sin valor de trabajo y una sola repetición: no se muestra la línea
 */
function formatWorkLine(block: PlanBlock): string | null {
  const repetitions = block.repetitions ?? 1;
  const workValue: number | null = block.workValue;

  if (workValue !== null && workValue !== undefined) {
    const work = formatWorkValue(workValue, block.workUnit);
    return repetitions > 1 ? `${repetitions} × ${work}` : work;
  }

  if (repetitions > 1) {
    return `× ${repetitions} reps`;
  }

  return null;
}

/** Un bloque de ejercicio: paso, nombre del ejercicio y sus detalles. */
export function WorkoutBlockRow({ block }: WorkoutBlockRowProps) {
  const primary = useThemeColor(undefined, 'primary');
  const border = useThemeColor(undefined, 'border');

  const exerciseName = block.exerciseType?.name ?? 'Ejercicio';
  const workLine = formatWorkLine(block);
  const restText =
    block.restValue !== null && block.restValue !== undefined
      ? formatWorkValue(block.restValue, block.restUnit)
      : null;
  const restLine = restText ? `Descanso ${restText}` : null;

  // El template de display del tipo de ejercicio sustituye sus placeholders.
  // `{rest}` recibe el descanso SIN la palabra "Descanso" (esa la pone la
  // línea de detalle de abajo), para que la plantilla pueda redactar frases
  // como "2 min rápido + 2 min lento".
  const template = block.exerciseType?.displayTemplate
    ? formatTemplate(block.exerciseType.displayTemplate, {
        reps: block.repetitions,
        work: workLine,
        rest: restText,
        pace: block.targetPaceOrTime,
      })
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.step, { borderColor: border }]}>
          <ThemedText type="smallBold" themeColor="primary">
            {formatNumber(block.stepOrder)}
          </ThemedText>
        </View>

        <View style={styles.headerText}>
          <ThemedText type="semiBold">{exerciseName}</ThemedText>
          {template ? (
            <ThemedText type="code" style={styles.template}>
              {template}
            </ThemedText>
          ) : null}
        </View>
      </View>

      {workLine ? (
        <ThemedText type="small" style={styles.detail}>
          {workLine}
        </ThemedText>
      ) : null}

      {block.targetPaceOrTime ? (
        <ThemedText type="small" style={styles.detail}>
          {`Objetivo: ${block.targetPaceOrTime}`}
        </ThemedText>
      ) : null}

      {restLine ? (
        <ThemedText type="small" style={styles.detail}>
          {restLine}
        </ThemedText>
      ) : null}

      {block.notes ? (
        <View style={styles.notesRow}>
          <Ionicons
            name="document-text-outline"
            size={14}
            color={primary}
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <ThemedText type="small" style={styles.notes}>
            {block.notes}
          </ThemedText>
        </View>
      ) : null}

      {block.exerciseType?.hasBreak ? (
        <View style={styles.breakWrapper}>
          <View style={[styles.breakSeparator, { borderColor: border }]} />
          <View style={[styles.breakChip, { borderColor: border }]}>
            <ThemedText type="small" style={styles.breakText}>
              descanso
            </ThemedText>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  step: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  template: {
    opacity: 0.75,
  },
  detail: {
    opacity: 0.8,
    marginLeft: 38,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 38,
  },
  notes: {
    flex: 1,
    opacity: 0.75,
  },
  breakWrapper: {
    gap: 6,
    alignItems: 'flex-start',
    marginLeft: 38,
    marginTop: 4,
  },
  breakSeparator: {
    height: 1,
    borderTopWidth: 1,
    width: '100%',
  },
  breakChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  breakText: {
    opacity: 0.7,
  },
});
