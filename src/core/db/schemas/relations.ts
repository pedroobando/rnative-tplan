import { relations } from 'drizzle-orm';

import { exerciseTypes } from './exercise-types.schema';
import { weeks } from './weeks.schema';
import { workoutBlocks } from './workout-blocks.schema';
import { workoutDays } from './workout-days.schema';

/**
 * Relaciones centralizadas para evitar imports circulares entre schemas.
 * Permite consultas anidadas con db.query.<tabla>.findMany({ with: ... }).
 */
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
