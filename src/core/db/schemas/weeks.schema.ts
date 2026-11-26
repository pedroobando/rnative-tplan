import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Microciclos (semanas de entrenamiento).
 * Tabla: weeks
 */
export const weeks = sqliteTable('weeks', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  note: text(),
  startDate: text('start_date').notNull(), // ISO: '2026-11-09'
  endDate: text('end_date').notNull(), // ISO: '2026-11-15'
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Week = typeof weeks.$inferSelect;
export type NewWeek = typeof weeks.$inferInsert;
