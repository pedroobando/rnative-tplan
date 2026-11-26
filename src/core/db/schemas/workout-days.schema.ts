import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { weeks } from './weeks.schema';

/**
 * Días de entrenamiento de un microciclo.
 * Tabla: workout_days
 */
export const workoutDays = sqliteTable('workout_days', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  weekId: text('week_id')
    .notNull()
    .references(() => weeks.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 1 (lunes) a 7 (domingo)
  workoutDate: text('workout_date'), // ISO: '2026-11-09'
  dayType: text('day_type', { enum: ['training', 'rest', 'race'] })
    .notNull()
    .default('training'),
  title: text(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type WorkoutDay = typeof workoutDays.$inferSelect;
export type NewWorkoutDay = typeof workoutDays.$inferInsert;
