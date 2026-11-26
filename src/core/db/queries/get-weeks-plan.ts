import { asc } from 'drizzle-orm';

import { db } from '@/core/db/connections/client';
import {
  type ExerciseType,
  type Week,
  type WorkoutBlock,
  type WorkoutDay,
  weeks,
  workoutBlocks,
  workoutDays,
} from '@/core/db/schemas';

/** Bloque de un día con su tipo de ejercicio resuelto (puede ser null). */
export type PlanBlock = WorkoutBlock & { exerciseType: ExerciseType | null };

/** Día de entrenamiento con sus bloques ordenados por `stepOrder`. */
export type PlanDay = WorkoutDay & { blocks: PlanBlock[] };

/** Semana con sus días ordenados por `dayOfWeek`. */
export type PlanWeek = Week & { days: PlanDay[] };

/**
 * Lee todas las semanas con sus días y bloques.
 *
 * El driver de `drizzle-orm/expo-sqlite` es SÍNCRONO: la consulta devuelve un
 * `SQLiteSyncRelationalQuery` y hay que ejecutarla con `.sync()` (no con
 * `await`).
 *
 * Los `orderBy` anidados son obligatorios: sin ellos los arrays de `days` y
 * `blocks` no vienen ordenados. Aun así, se aplica un orden defensivo en
 * memoria al final (ver más abajo).
 */
export function getWeeksWithPlan(): PlanWeek[] {
  const result = db.query.weeks.findMany({
    orderBy: asc(weeks.startDate),
    with: {
      days: {
        orderBy: asc(workoutDays.dayOfWeek),
        with: {
          blocks: {
            orderBy: asc(workoutBlocks.stepOrder),
            with: {
              exerciseType: true,
            },
          },
        },
      },
    },
  });

  const weeksResult = result.sync();

  // Orden defensivo en memoria: en drizzle-orm 0.45 los arrays anidados de
  // una query relacional no está garantizado que vengan ordenados aunque se
  // pase un `orderBy` anidado, así que ordenamos por nuestra cuenta. Se
  // ordenan copias (`[...array]`) para no mutar los arrays originales.
  return weeksResult
    .map((week) => ({
      ...week,
      days: [...week.days]
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
        .map((day) => ({
          ...day,
          blocks: [...day.blocks].sort((a, b) => a.stepOrder - b.stepOrder),
        })),
    }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}
