import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { exerciseTypes } from './exercise-types.schema';
import { workoutDays } from './workout-days.schema';

/**
 * Bloques de ejercicio dentro de un día de entrenamiento.
 * Tabla: workout_blocks
 */
export const workoutBlocks = sqliteTable('workout_blocks', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workoutDayId: text('workout_day_id')
    .notNull()
    .references(() => workoutDays.id, { onDelete: 'cascade' }),
  exerciseTypeId: text('exercise_type_id')
    .notNull()
    .references(() => exerciseTypes.id, { onDelete: 'restrict' }),
  stepOrder: integer('step_order').notNull(),
  repetitions: integer('repetitions').notNull().default(1),
  workValue: real('work_value'),
  workUnit: text('work_unit', { enum: ['min', 'sec', 'm', 'km', 'reps'] }),
  targetPaceOrTime: text('target_pace_or_time'),
  restValue: real('rest_value'),
  restUnit: text('rest_unit', { enum: ['min', 'sec'] }),
  notes: text(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type WorkoutBlock = typeof workoutBlocks.$inferSelect;
export type NewWorkoutBlock = typeof workoutBlocks.$inferInsert;
