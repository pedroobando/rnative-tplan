import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { PlanEmptyState, PlanErrorState, PlanLoadingState } from '@/components/weeks/plan-state';
import { WeekCard } from '@/components/weeks/week-card';
import { WeekSelector } from '@/components/weeks/week-selector';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { useWeeksPlan } from '@/hooks';

export default function WeeksScreen() {
  const {
    weeks,
    selectedWeek,
    selectedWeekId,
    selectWeek,
    loading,
    error,
    reload,
  } = useWeeksPlan();

  // Estado de días desplegado POR SEMANA: guarda, para cada semana, los ids
  // de los días que el usuario ha desplegado o plegado. Así cada semana
  // conserva su propio estado y al cambiar de selección no se arrastran ids
  // de días de otra semana.
  const [expandedByWeek, setExpandedByWeek] = useState<Record<string, string[]>>({});

  // Días desplegados de la semana visible: si el usuario ya ha tocado esa
  // semana se respeta su elección (ignorando ids que ya no existen); si no,
  // se despliega por defecto el PRIMER DÍA CON BLOQUES de la semana.
  const expandedDayIds = useMemo(() => {
    if (!selectedWeek) {
      return [];
    }

    const validDayIds = new Set(selectedWeek.days.map((day) => day.id));
    const stored = expandedByWeek[selectedWeek.id];

    if (stored) {
      return stored.filter((dayId) => validDayIds.has(dayId));
    }

    const firstDayWithBlocks = selectedWeek.days.find((day) => day.blocks.length > 0);

    return firstDayWithBlocks ? [firstDayWithBlocks.id] : [];
  }, [selectedWeek, expandedByWeek]);

  const toggleDay = useCallback(
    (dayId: string) => {
      if (!selectedWeek) {
        return;
      }

      setExpandedByWeek((previous) => {
        const validDayIds = new Set(selectedWeek.days.map((day) => day.id));
        const stored = previous[selectedWeek.id];
        const base = stored
          ? stored.filter((id) => validDayIds.has(id))
          : (() => {
              const firstDayWithBlocks = selectedWeek.days.find((day) => day.blocks.length > 0);

              return firstDayWithBlocks ? [firstDayWithBlocks.id] : [];
            })();

        const next = base.includes(dayId) ? base.filter((id) => id !== dayId) : [...base, dayId];

        return { ...previous, [selectedWeek.id]: next };
      });
    },
    [selectedWeek],
  );

  // Días de entrenamiento de la semana visible (para el resumen de la cabecera).
  const trainingDays = useMemo(() => {
    if (!selectedWeek) {
      return 0;
    }

    return selectedWeek.days.filter((day) => day.dayType === 'training').length;
  }, [selectedWeek]);

  // Resumen de la cabecera: cuántas semanas tiene el plan y cuántos días de
  // entrenamiento tiene la semana visible.
  const summary = useMemo(() => {
    if (!selectedWeek) {
      return null;
    }

    const weekCount = `${weeks.length} ${weeks.length === 1 ? 'semana' : 'semanas'}`;
    const dayCount = `${trainingDays} ${
      trainingDays === 1 ? 'día de entrenamiento' : 'días de entrenamiento'
    }`;

    return `${weekCount} en el plan · ${dayCount} en esta semana`;
  }, [weeks.length, trainingDays, selectedWeek]);

  // El contenido es siempre el mismo: solo cambia lo que se muestra cuando no
  // hay semanas (cargando, error o vacío). Si ya hay datos de una carga
  // anterior, se siguen mostrando mientras se releen.
  const emptyState = error ? (
    <PlanErrorState error={error} onRetry={reload} />
  ) : loading && selectedWeek === null ? (
    <PlanLoadingState />
  ) : (
    <PlanEmptyState />
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Plan</ThemedText>

          {weeks.length > 0 ? (
            <WeekSelector weeks={weeks} selectedWeekId={selectedWeekId} onSelect={selectWeek} />
          ) : null}

          {weeks.length > 0 && summary ? (
            <ThemedText type="small" style={styles.summary}>
              {summary}
            </ThemedText>
          ) : null}
        </View>

        {selectedWeek ? (
          <WeekCard
            week={selectedWeek}
            expandedDayIds={expandedDayIds}
            onToggleDay={toggleDay}
            // El nombre de la semana ya está en el selector de la cabecera.
            showTitle={false}
          />
        ) : (
          emptyState
        )}
      </ScrollView>
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
    gap: 8,
    marginBottom: 4,
  },
  summary: {
    opacity: 0.8,
  },
});
