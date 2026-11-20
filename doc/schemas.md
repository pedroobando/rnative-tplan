import { sql, relations } from 'drizzle-orm';
import {
sqliteTable,
text,
integer,
real,
} from 'drizzle-orm/sqlite-core';

// 1. Tabla de Semanas (Microciclos)
export const weeks = sqliteTable('weeks', {
id: text('id')
.primaryKey()
.$defaultFn(() => crypto.randomUUID()),
name: text('name').notNull(),
note: text('note'),
startDate: text('start_date').notNull(), // Formato ISO: '2026-11-09'
endDate: text('end_date').notNull(), // Formato ISO: '2026-11-15'
createdAt: text('created_at')
.notNull()
.default(sql`(datetime('now'))`),
});

// 2. Catálogo de Tipos de Ejercicios
export const exerciseTypes = sqliteTable('exercise_types', {
id: text('id')
.primaryKey()
.$defaultFn(() => crypto.randomUUID()),
name: text('name').notNull().unique(),
// En SQLite los booleanos se guardan como INTEGER (0 o 1), pero Drizzle los mapea a true/false
hasBreak: integer('has_break', { mode: 'boolean' })
.notNull()
.default(false),
displayTemplate: text('display_template'),
createdAt: text('created_at')
.notNull()
.default(sql`(datetime('now'))`),
});

// 3. Días de Entrenamiento
export const workoutDays = sqliteTable('workout_days', {
id: text('id')
.primaryKey()
.$defaultFn(() => crypto.randomUUID()),
weekId: text('week_id')
.notNull()
.references(() => weeks.id, { onDelete: 'cascade' }),
dayOfWeek: integer('day_of_week').notNull(), // 1 (Lunes) a 7 (Domingo)
workoutDate: text('workout_date'), // Formato ISO: '2026-11-09'
dayType: text('day_type', { enum: ['training', 'rest', 'race'] })
.notNull()
.default('training'),
title: text('title'),
createdAt: text('created_at')
.notNull()
.default(sql`(datetime('now'))`),
});

// 4. Bloques de Ejercicios (Detalle)
export const workoutBlocks = sqliteTable('workout_blocks', {
id: text('id')
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
notes: text('notes'),
createdAt: text('created_at')
.notNull()
.default(sql`(datetime('now'))`),
});

// ==========================================
// RELACIONES (Para usar db.query.\*)
// ==========================================

export const weeksRelations = relations(weeks, ({ many }) => ({
days: many(workoutDays),
}));

export const workoutDaysRelations = relations(workoutDays, ({ one, many }) => ({
week: one(weeks, {
fields: [workoutDays.weekId],
references: [weeks.id],
}),
blocks: many(workoutBlocks),
}));

export const workoutBlocksRelations = relations(workoutBlocks, ({ one }) => ({
day: one(workoutDays, {
fields: [workoutBlocks.workoutDayId],
references: [workoutDays.id],
}),
exerciseType: one(exerciseTypes, {
fields: [workoutBlocks.exerciseTypeId],
references: [exerciseTypes.id],
}),
}));

export const exerciseTypesRelations = relations(exerciseTypes, ({ many }) => ({
blocks: many(workoutBlocks),
}));

// ==========================================
// TIPOS INFERIDOS (Listos para tu app)
// ==========================================

export type Week = typeof weeks.$inferSelect;
export type NewWeek = typeof weeks.$inferInsert;

export type ExerciseType = typeof exerciseTypes.$inferSelect;
export type NewExerciseType = typeof exerciseTypes.$inferInsert;

export type WorkoutDay = typeof workoutDays.$inferSelect;
export type NewWorkoutDay = typeof workoutDays.$inferInsert;

export type WorkoutBlock = typeof workoutBlocks.$inferSelect;
export type NewWorkoutBlock = typeof workoutBlocks.$inferInsert;

Ventajas clave que aproveché de Drizzle aquí

• Booleanos nativos (mode: 'boolean'): Aunque SQLite guarda 0 y 1 por debajo, Drizzle convierte hasBreak automáticamente a true o false en tu código TypeScript.
• Enums tipados en TypeScript: Campos como dayType ('training' | 'rest' | 'race') y workUnit ('min' | 'sec' | 'm' | 'km' | 'reps') te darán autocompletado y evitarán errores de dedo sin complicar la base de datos.
• Relaciones listas (db.query): Con relations definido abajo, podrás traer una semana entera con todos sus días, bloques y nombres de ejercicios en una sola consulta limpia:
typescript
const fullWeek = await db.query.weeks.findFirst({
where: (weeks, { eq }) => eq(weeks.id, 'week-02-2026'),
with: {
days: {
orderBy: (days, { asc }) => [asc(days.dayOfWeek)],
with: {
blocks: {
orderBy: (blocks, { asc }) => [asc(blocks.stepOrder)],
with: {
exerciseType: true,
},
},
},
},
},
});
Usa el código con precaución.
Si estás usando Expo SQLite, Turso (libSQL), Better-SQLite3 o Bun, dime cuál driver tienes configurado y te paso el archivo de conexión (db.ts) junto con la función helper para renderizar el displayTemplate.
