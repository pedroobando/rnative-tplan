/**
 * SQL del seed de ejemplo: el plan de entrenamiento de las Semanas 2 y 3.
 *
 * Por qué SQL y no inserts de Drizzle:
 * - Se puede revisar de un vistazo y versionar como un fichero de datos.
 * - Es idempotente (`INSERT OR IGNORE` + ids estables), así que se puede
 *   ejecutar varias veces sin duplicar nada.
 * - Se puede verificar fuera del dispositivo (con `bun:sqlite`), sin
 *   necesitar el emulador.
 *
 * Se ejecuta con `expoDatabase.execSync()`, que acepta varias sentencias
 * separadas por `;`. Las claves foráneas están activas en el cliente
 * (`PRAGMA foreign_keys = ON`), así que un id inexistente falla de verdad.
 *
 * Decisión de modelado (la de tu conversación con el otro asistente):
 * - `rest_type` NO existe: el matiz de la recuperación ("trote suave",
 *   "caminando") vive en `notes`.
 * - `target_pace_or_time` SÍ existe: es el único sitio donde vive un dato
 *   filtrable ("Z1", "Z2", "1:42 min").
 * - `display_template` vive en `exercise_types`: la plantilla se escribe una
 *   sola vez y se aplica a todos los bloques de ese tipo.
 * - `notes` queda libre para las indicaciones cualitativas de la entrenadora.
 */

/**
 * Ids estables del seed. Al ser fijos, el seed se puede volver a ejecutar y
 * no duplica nada.
 */
export const SEED_IDS = {
  weeks: ['seed-week-02', 'seed-week-03'],
  exerciseTypes: [
    'seed-ex-calentamiento',
    'seed-ex-enfriamiento',
    'seed-ex-flexibilidad',
    'seed-ex-core',
    'seed-ex-espalda',
    'seed-ex-tren-inferior',
    'seed-ex-tecnica',
    'seed-ex-intervalos',
    'seed-ex-series',
    'seed-ex-trote',
    'seed-ex-fartlek',
    'seed-ex-progresivo',
    'seed-ex-casa',
    'seed-ex-competencia',
    'seed-ex-descanso',
  ],
} as const;

/**
 * Los placeholders disponibles en `display_template` son los que sustituye
 * `formatTemplate` de `@/utils/format`:
 *
 * - `{work}`  → "15 min", "10 × 300 m", "3 × 20 reps"
 * - `{pace}`  → `target_pace_or_time` ("1:42 min", "Z2")
 * - `{rest}`  → "1 min" (el descanso, sin la palabra "Descanso")
 * - `{reps}`  → el número de repeticiones
 *
 * Un placeholder cuyo valor es NULL se elimina de la plantilla (y se
 * limpia el separador que quedaba colgando).
 */
export const SEED_SQL = `
-- ============================================================================
-- 1. Catálogo de tipos de ejercicio
-- ============================================================================
-- has_break: 1 si el tipo lleva pausas entre repeticiones.
-- display_template: la plantilla con la que la app renderiza el bloque.

INSERT OR IGNORE INTO exercise_types (id, name, has_break, display_template) VALUES
  ('seed-ex-calentamiento',   'Calentamiento',        0, 'Calentamiento {work}'),
  ('seed-ex-enfriamiento',    'Enfriamiento',         0, 'Enfriamiento {work}'),
  ('seed-ex-flexibilidad',    'Flexibilidad',         1, 'Series de estiramientos: {work}'),
  ('seed-ex-core',            'Abdominales y oblicuos', 1, 'Core: {work}'),
  ('seed-ex-espalda',         'Dorsales y lumbares',   1, 'Espalda y zona lumbar: {work}'),
  ('seed-ex-tren-inferior',   'Tren inferior',         1, 'Glúteos, pantorrillas y tobillos: {work}'),
  ('seed-ex-tecnica',         'Técnica de carrera',    0, 'Serie de técnica de carrera'),
  ('seed-ex-intervalos',      'Intervalos',            1, '{work} en {pace} · {rest} de descanso'),
  ('seed-ex-series',          'Series',                1, '{work} en {pace}'),
  ('seed-ex-trote',           'Trote continuo',        0, '{work} en {pace}'),
  ('seed-ex-fartlek',         'Fartlek',               1, '{work} rápido + {rest} lento'),
  ('seed-ex-progresivo',      'Progresivo',            0, '{work} progresivo en {pace}'),
  ('seed-ex-casa',            'Ejercicios en casa',    1, 'Ejercicios en casa: {work}'),
  ('seed-ex-competencia',     'Competencia',           0, 'Competencia: {work}'),
  ('seed-ex-descanso',        'Descanso',              0, 'Descanso');

-- ============================================================================
-- 2. Semana 2 (09-11 al 15-11): fuerza, velocidad y fartlek
-- ============================================================================

INSERT OR IGNORE INTO weeks (id, name, note, start_date, end_date) VALUES
  ('seed-week-02',
   'Semana 2 - Tepuy y pre CAF 2027',
   'Buenas! Semana 2 del 09-11 al 15-11 para Tepuy y pre CAF 2027',
   '2026-11-09',
   '2026-11-15');

INSERT OR IGNORE INTO workout_days (id, week_id, day_of_week, workout_date, day_type, title) VALUES
  ('seed-w02-d1', 'seed-week-02', 1, '2026-11-09', 'training', 'Fuerza y Flexibilidad'),
  ('seed-w02-d2', 'seed-week-02', 2, '2026-11-10', 'training', 'Velocidad'),
  ('seed-w02-d3', 'seed-week-02', 3, '2026-11-11', 'training', 'Trote Continuo'),
  ('seed-w02-d4', 'seed-week-02', 4, '2026-11-12', 'training', 'Velocidad'),
  ('seed-w02-d5', 'seed-week-02', 5, '2026-11-13', 'rest',     'Descanso'),
  ('seed-w02-d6', 'seed-week-02', 6, '2026-11-14', 'training', 'Fondo Progresivo'),
  ('seed-w02-d7', 'seed-week-02', 7, '2026-11-15', 'rest',     'Descanso');

-- Lunes: fuerza en casa.
INSERT OR IGNORE INTO workout_blocks
  (id, workout_day_id, exercise_type_id, step_order, repetitions, work_value, work_unit, notes) VALUES
  ('seed-w02-d1-b1', 'seed-w02-d1', 'seed-ex-calentamiento', 1, 1, NULL, NULL, 'Calentamiento general'),
  ('seed-w02-d1-b2', 'seed-w02-d1', 'seed-ex-flexibilidad', 2, 3, 20, 'reps', 'Ejercicios de flexibilidad'),
  ('seed-w02-d1-b3', 'seed-w02-d1', 'seed-ex-core',         3, 3, 20, 'reps', 'Abdominales y oblicuos'),
  ('seed-w02-d1-b4', 'seed-w02-d1', 'seed-ex-espalda',      4, 3, 20, 'reps', 'Dorsales, lumbares'),
  ('seed-w02-d1-b5', 'seed-w02-d1', 'seed-ex-tren-inferior',5, 3, 20, 'reps', 'Glúteos, pantorrillas y tobillos');

-- Martes: velocidad (intervalos).
INSERT OR IGNORE INTO workout_blocks
  (id, workout_day_id, exercise_type_id, step_order, repetitions, work_value, work_unit,
   target_pace_or_time, rest_value, rest_unit, notes) VALUES
  ('seed-w02-d2-b1', 'seed-w02-d2', 'seed-ex-calentamiento', 1, 1,  15, 'min', NULL, NULL, NULL,
   'Trote + 1 serie de técnica de carrera + 2 progresivos de 80 m'),
  ('seed-w02-d2-b2', 'seed-w02-d2', 'seed-ex-intervalos',    2, 4, 700, 'm', '4:00 min', 1, 'min',
   'Recuperación con trote suave'),
  ('seed-w02-d2-b3', 'seed-w02-d2', 'seed-ex-enfriamiento',  3, 1,   5, 'min', NULL, NULL, NULL,
   'Trote de enfriamiento');

-- Miércoles: trote continuo.
INSERT OR IGNORE INTO workout_blocks
  (id, workout_day_id, exercise_type_id, step_order, repetitions, work_value, work_unit,
   target_pace_or_time, notes) VALUES
  ('seed-w02-d3-b1', 'seed-w02-d3', 'seed-ex-trote', 1, 1, 10, 'km', 'Z2', 'Rodaje continuo');

-- Jueves: velocidad (fartlek).
-- El fartlek se modela como 5 ciclos de (2 min rápido + 2 min lento):
-- repetitions * (work_value + rest_value) = 5 * (2 + 2) = 20 min.
INSERT OR IGNORE INTO workout_blocks
  (id, workout_day_id, exercise_type_id, step_order, repetitions, work_value, work_unit,
   target_pace_or_time, rest_value, rest_unit, notes) VALUES
  ('seed-w02-d4-b1', 'seed-w02-d4', 'seed-ex-calentamiento', 1, 1, 15, 'min', NULL, NULL, NULL,
   'Trote de calentamiento'),
  ('seed-w02-d4-b2', 'seed-w02-d4', 'seed-ex-fartlek',       2, 5,  2, 'min', NULL, 2, 'min',
   '20 min en total: 5 ciclos de 2 min rápido + 2 min lento, trote suave en la recuperación'),
  ('seed-w02-d4-b3', 'seed-w02-d4', 'seed-ex-enfriamiento',  3, 1,  5, 'min', NULL, NULL, NULL,
   'Trote de enfriamiento');

-- Sábado: fondo progresivo.
INSERT OR IGNORE INTO workout_blocks
  (id, workout_day_id, exercise_type_id, step_order, repetitions, work_value, work_unit,
   target_pace_or_time, notes) VALUES
  ('seed-w02-d6-b1', 'seed-w02-d6', 'seed-ex-progresivo', 1, 1, 12, 'km', 'Z2 → ritmo fuerte',
   'Comenzar en Z2 e ir subiendo el ritmo');

-- ============================================================================
-- 3. Semana 3 (16-11 al 22-11): taper con carrera de 10K
-- ============================================================================

INSERT OR IGNORE INTO weeks (id, name, note, start_date, end_date) VALUES
  ('seed-week-03',
   'Semana 3 - Tepuy y pre CAF 2027',
   'Buenas! Semana 3 del 16-11 al 22-11 para Tepuy y pre CAF 2027',
   '2026-11-16',
   '2026-11-22');

INSERT OR IGNORE INTO workout_days (id, week_id, day_of_week, workout_date, day_type, title) VALUES
  ('seed-w03-d1', 'seed-week-03', 1, '2026-11-16', 'training', 'Intervalos de activación'),
  ('seed-w03-d2', 'seed-week-03', 2, '2026-11-17', 'training', 'Rodaje Z1'),
  ('seed-w03-d3', 'seed-week-03', 3, '2026-11-18', 'training', 'Trote y técnica'),
  ('seed-w03-d4', 'seed-week-03', 4, '2026-11-19', 'rest',     'Descanso'),
  ('seed-w03-d5', 'seed-week-03', 5, '2026-11-20', 'rest',     'Descanso'),
  ('seed-w03-d6', 'seed-week-03', 6, '2026-11-21', 'race',     'Carrera Tepuy 10k'),
  ('seed-w03-d7', 'seed-week-03', 7, '2026-11-22', 'rest',     'Descanso');

-- Lunes: intervalos de activación (la sesión de calidad de la semana).
INSERT OR IGNORE INTO workout_blocks
  (id, workout_day_id, exercise_type_id, step_order, repetitions, work_value, work_unit,
   target_pace_or_time, rest_value, rest_unit, notes) VALUES
  ('seed-w03-d1-b1', 'seed-w03-d1', 'seed-ex-calentamiento', 1, 1, 15, 'min', NULL, NULL, NULL,
   'Trote + 1 serie de técnica de carrera + 2 progresivos de 100 m'),
  ('seed-w03-d1-b2', 'seed-w03-d1', 'seed-ex-intervalos',    2, 10, 300, 'm', '1:42 min', 1, 'min',
   'Recuperación activa con trote suave'),
  ('seed-w03-d1-b3', 'seed-w03-d1', 'seed-ex-enfriamiento',  3, 1,   5, 'min', NULL, NULL, NULL,
   'Trote de enfriamiento');

-- Martes: rodaje regenerativo en Z1.
INSERT OR IGNORE INTO workout_blocks
  (id, workout_day_id, exercise_type_id, step_order, repetitions, work_value, work_unit,
   target_pace_or_time, notes) VALUES
  ('seed-w03-d2-b1', 'seed-w03-d2', 'seed-ex-trote', 1, 1, 6, 'km', 'Z1', 'Rodaje regenerativo');

-- Miércoles: base aeróbica + 6 x 200 suaves aplicando técnica.
-- Las 6 x 200 son series (no intervalos): el plan no especifica pausa entre
-- ellas, así que van con el tipo 'Series', cuya plantilla no menciona
-- descanso.
INSERT OR IGNORE INTO workout_blocks
  (id, workout_day_id, exercise_type_id, step_order, repetitions, work_value, work_unit,
   target_pace_or_time, notes) VALUES
  ('seed-w03-d3-b1', 'seed-w03-d3', 'seed-ex-trote',   1, 1, 4, 'km', 'Z2', 'Base aeróbica activa'),
  ('seed-w03-d3-b2', 'seed-w03-d3', 'seed-ex-series',  2, 6, 200, 'm', 'Suaves',
   'Aplicando técnica, sin pausa especificada');

-- Sábado: la carrera.
INSERT OR IGNORE INTO workout_blocks
  (id, workout_day_id, exercise_type_id, step_order, repetitions, work_value, work_unit,
   target_pace_or_time, notes) VALUES
  ('seed-w03-d6-b1', 'seed-w03-d6', 'seed-ex-competencia', 1, 1, 10, 'km', NULL,
   'Carrera Tepuy 10K. Semana de descarga (taper) antes de la carrera');
`;
