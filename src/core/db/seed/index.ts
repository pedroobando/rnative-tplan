import { expoDatabase } from '../connections/client';

import { SEED_SQL } from './sql';

export { SEED_IDS, SEED_SQL } from './sql';

/**
 * Carga el plan de ejemplo (Semanas 2 y 3) en la base de datos.
 *
 * Es idempotente: los ids son estables y los `INSERT` son `OR IGNORE`, así
 * que se puede llamar tantas veces como haga falta sin duplicar filas.
 *
 * Solo debe llamarla la capa de core: las pantallas llegan aquí a través del
 * hook `useSeedExamplePlan`.
 */
export function seedExamplePlan(): void {
  expoDatabase.execSync(SEED_SQL);
}

/**
 * Indica si la base de datos ya tiene semanas cargadas.
 *
 * Sirve para que la UI de desarrollo no parezca un botón inútil cuando los
 * datos de ejemplo ya están cargados.
 */
export function hasSeededPlan(): boolean {
  const row = expoDatabase.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM weeks',
  );

  return (row?.count ?? 0) > 0;
}
