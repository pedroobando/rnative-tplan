import { useCallback, useState } from 'react';

import { hasSeededPlan, seedExamplePlan } from '@/core/db/seed';

/** Estado del seed de ejemplo. */
export type SeedExampleState = 'idle' | 'seeding' | 'done' | 'error';

export type UseSeedExamplePlanResult = {
  /** Estado actual de la carga. */
  state: SeedExampleState;
  /** Mensaje del último error, o null. */
  message: string | null;
  /** true si la base de datos ya tiene semanas cargadas. */
  seeded: boolean;
  /** Carga el plan de ejemplo. Es idempotente. */
  seed: () => void;
};

/**
 * Carga el plan de entrenamiento de ejemplo (Semanas 2 y 3) en la base de
 * datos.
 *
 * Es una herramienta de desarrollo: la app real no debe meter datos de
 * ejemplo por su cuenta, así que el botón que la dispara solo se muestra en
 * `__DEV__`.
 */
export function useSeedExamplePlan(): UseSeedExamplePlanResult {
  const [state, setState] = useState<SeedExampleState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [seeded, setSeeded] = useState<boolean>(() => hasSeededPlan());

  const seed = useCallback(() => {
    setState('seeding');
    setMessage(null);

    try {
      seedExamplePlan();
      setSeeded(true);
      setState('done');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Error desconocido.');
    }
  }, []);

  return { state, message, seeded, seed };
}
