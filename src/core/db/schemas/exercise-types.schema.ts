import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Catálogo de tipos de ejercicio (calentamiento, series, descanso, etc.).
 * Tabla: exercise_types
 */
export const exerciseTypes = sqliteTable('exercise_types', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text().notNull().unique(),
  hasBreak: integer('has_break', { mode: 'boolean' }).notNull().default(false),
  displayTemplate: text('display_template'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type ExerciseType = typeof exerciseTypes.$inferSelect;
export type NewExerciseType = typeof exerciseTypes.$inferInsert;
