import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { PlanEmptyState, PlanErrorState, PlanLoadingState } from '@/components/weeks/plan-state';
import { WeekCard } from '@/components/weeks/week-card';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { useWeeksPlan } from '@/hooks';

export default function WeeksScreen() {
  const { weeks, loading, error, reload } = useWeeksPlan();

  // Elección explícita del usuario sobre qué días están desplegados. Se guarda
  // junto a una "firma" del plan: si los datos cambian (por ejemplo tras un
  // `reload`), la firma cambia y la elección se descarta, de modo que el
  // estado expandido vuelve a derivarse del plan nuevo en lugar de conservar
  // ids de días que ya no existen.
  const planSignature = useMemo(
    () =>
      weeks
        .map(
          (week) =>
            `${week.id}#${week.days.map((day) => `${day.id}:${day.blocks.length}`).join('|')}`,
        )
        .join(';'),
    [weeks],
  );

  const [userExpanded, setUserExpanded] = useState<{ signature: string; dayIds: string[] } | null>(
    null,
  );

  // Estado por defecto: el PRIMER DÍA CON BLOQUES DE CADA SEMANA (uno por
  // semana), no solo el de la primera semana.
  const defaultExpandedDayIds = useMemo(
    () =>
      weeks.flatMap((week) => {
        const firstDayWithBlocks = week.days.find((day) => day.blocks.length > 0);

        return firstDayWithBlocks ? [firstDayWithBlocks.id] : [];
      }),
    [weeks],
  );

  const visibleExpandedDayIds =
    userExpanded && userExpanded.signature === planSignature
      ? userExpanded.dayIds
      : defaultExpandedDayIds;

  const toggleDay = (dayId: string) => {
    const base =
      userExpanded && userExpanded.signature === planSignature
        ? userExpanded.dayIds
        : defaultExpandedDayIds;

    const next = base.includes(dayId) ? base.filter((id) => id !== dayId) : [...base, dayId];

    setUserExpanded({ signature: planSignature, dayIds: next });
  };

  const trainingDays = useMemo(
    () =>
      weeks.reduce(
        (total, week) => total + week.days.filter((day) => day.dayType === 'training').length,
        0,
      ),
    [weeks],
  );

  // La lista es siempre la misma: solo cambia lo que se muestra cuando no hay
  // semanas (cargando, error o vacío).
  const emptyState = error ? (
    <PlanErrorState error={error} onRetry={reload} />
  ) : loading ? (
    <PlanLoadingState />
  ) : (
    <PlanEmptyState />
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={weeks}
        keyExtractor={(week) => week.id}
        renderItem={({ item }) => (
          <WeekCard week={item} expandedDayIds={visibleExpandedDayIds} onToggleDay={toggleDay} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="subtitle">Plan</ThemedText>
            {!loading && !error ? (
              <ThemedText type="small" style={styles.summary}>
                {`${weeks.length} ${weeks.length === 1 ? 'semana' : 'semanas'} · ${trainingDays} ${
                  trainingDays === 1 ? 'día de entrenamiento' : 'días de entrenamiento'
                }`}
              </ThemedText>
            ) : null}
          </View>
        }
        ListEmptyComponent={emptyState}
        contentContainerStyle={styles.content}
        removeClippedSubviews={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  header: {
    gap: 4,
    marginBottom: 4,
  },
  summary: {
    opacity: 0.8,
  },
});
