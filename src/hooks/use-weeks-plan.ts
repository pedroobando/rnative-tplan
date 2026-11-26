import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getWeeksWithPlan, type PlanWeek } from '@/core/db/queries';

export type UseWeeksPlanResult = {
  /** Semanas con sus días y bloques. */
  weeks: PlanWeek[];
  /** true mientras se lee el plan de la base de datos. */
  loading: boolean;
  /** Mensaje del último error, o null si no hay error. */
  error: string | null;
  /** Vuelve a leer el plan (reintento tras un error). */
  reload: () => void;
};

/**
 * Carga el plan de entrenamiento (semanas → días → bloques).
 *
 * El driver de `drizzle-orm/expo-sqlite` es síncrono, así que la lectura se
 * hace dentro de un efecto y se guardan los datos en estado.
 */
export function useWeeksPlan(): UseWeeksPlanResult {
  const [weeks, setWeeks] = useState<PlanWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      setWeeks(getWeeksWithPlan());
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

  return { weeks, loading, error, reload: load };
}
