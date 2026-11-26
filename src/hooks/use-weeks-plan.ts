import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getWeeksWithPlan, type PlanWeek } from '@/core/db/queries';

export type UseWeeksPlanResult = {
  /** Semanas con sus días y bloques. */
  weeks: PlanWeek[];
  /** Semana visible (la elegida por el usuario o, por defecto, la más reciente). */
  selectedWeek: PlanWeek | null;
  /** Id de la semana visible, o null si no hay semanas. */
  selectedWeekId: string | null;
  /** Cambia la semana visible. */
  selectWeek: (weekId: string) => void;
  /** true mientras se lee el plan de la base de datos. */
  loading: boolean;
  /** Mensaje del último error, o null si no hay error. */
  error: string | null;
  /** Vuelve a leer el plan (reintento tras un error). */
  reload: () => void;
};

/**
 * Ordena las semanas de más reciente a más antigua: primero por `startDate`
 * descendente y, a igualdad, por `endDate` descendente.
 */
function byMostRecent(a: PlanWeek, b: PlanWeek): number {
  if (a.startDate !== b.startDate) {
    return a.startDate < b.startDate ? 1 : -1;
  }

  if (a.endDate !== b.endDate) {
    return a.endDate < b.endDate ? 1 : -1;
  }

  return 0;
}

/**
 * Carga el plan de entrenamiento (semanas → días → bloques) y expone la
 * semana que se está mostrando.
 *
 * El driver de `drizzle-orm/expo-sqlite` es síncrono, así que la lectura se
 * hace dentro de un efecto y se guardan los datos en estado.
 */
export function useWeeksPlan(): UseWeeksPlanResult {
  const [weeks, setWeeks] = useState<PlanWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Semana elegida por el usuario. Si deja de existir (p. ej. tras un
  // `reload`), la selección se deriva de la lista actual (la más reciente).
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      // El desplegable de semanas se muestra de más reciente a más antigua,
      // así que se ordena aquí con `byMostRecent`. La query sigue devolviendo
      // el orden ascendente original (no se toca) y el cálculo de "semana más
      // reciente" sigue siendo correcto porque `byMostRecent` no depende del
      // orden de entrada.
      setWeeks([...getWeeksWithPlan()].sort(byMostRecent));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error desconocido.');
      setWeeks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // La lectura se hace al enfocar la pantalla (no solo al montarla): así, si
  // el plan cambia en la base de datos —por ejemplo tras cargar el seed—,
  // la lista se actualiza al volver a la pestaña sin reiniciar la app.
  useFocusEffect(
    useCallback(() => {
      // La lectura se aplaza un tick: así el primer render muestra el estado
      // de carga y evita un setState síncrono dentro del efecto.
      const timer = setTimeout(() => {
        load();
      }, 0);

      return () => clearTimeout(timer);
    }, [load]),
  );

  // La semana más reciente del plan: la de `startDate` más reciente y, a
  // igualdad de inicio, la de `endDate` más reciente.
  const latestWeek = useMemo(() => {
    if (weeks.length === 0) {
      return null;
    }

    return [...weeks].sort(byMostRecent)[0];
  }, [weeks]);

  // Deriva la semana visible: la elegida por el usuario si sigue existiendo,
  // y en caso contrario la más reciente. Al ser una derivación no hay estados
  // que puedan desincronizarse tras un `reload`.
  const selectedWeek = useMemo(() => {
    if (weeks.length === 0) {
      return null;
    }

    return weeks.find((week) => week.id === selectedWeekId) ?? latestWeek;
  }, [weeks, selectedWeekId, latestWeek]);

  const selectWeek = useCallback((weekId: string) => {
    setSelectedWeekId(weekId);
  }, []);

  return {
    weeks,
    selectedWeek,
    selectedWeekId: selectedWeek?.id ?? null,
    selectWeek,
    loading,
    error,
    reload: load,
  };
}
