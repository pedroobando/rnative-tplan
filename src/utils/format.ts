/**
 * Helpers de formato para fechas y unidades.
 *
 * IMPORTANTE: no se usa `Intl` ni `toLocaleDateString`. Hermes en React
 * Native 0.88 puede no llevar la configuración regional completa, así que el
 * parseo de fechas ISO se hace a mano (`split('-')`). Además, `new Date(iso)`
 * interpreta la fecha como UTC y en husos negativos muestra el día anterior.
 */

const DAY_NAMES = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const;

const MONTH_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const;

const MONTH_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

/** Unidades de trabajo de un bloque. */
export type WorkUnit = 'min' | 'sec' | 'm' | 'km' | 'reps';

/** Unidades de descanso de un bloque. */
export type RestUnit = 'min' | 'sec';

type ParsedDate = {
  year: string;
  month: number;
  day: number;
};

/** Divide una fecha ISO ('2026-11-09') en año, mes y día sin usar `Date`. */
function parseIsoDate(iso: string | null | undefined): ParsedDate | null {
  if (!iso) {
    return null;
  }

  const parts = iso.split('-');
  if (parts.length < 3) {
    return null;
  }

  const [year, month, day] = parts;
  const monthNumber = Number(month);
  const dayNumber = Number(day);

  if (!year || Number.isNaN(monthNumber) || Number.isNaN(dayNumber)) {
    return null;
  }

  return { year, month: monthNumber, day: dayNumber };
}

/** 'Lunes'…'Domingo'. Los números fuera de 1-7 devuelven 'Día n'. */
export function formatDayOfWeek(dayOfWeek: number): string {
  return DAY_NAMES[dayOfWeek - 1] ?? `Día ${dayOfWeek}`;
}

/** 'ene'…'dic'. */
export function formatMonthShort(month: number): string {
  return MONTH_SHORT[month - 1] ?? '';
}

/** '9 nov' a partir de una fecha ISO. */
export function formatDateShort(iso: string | null | undefined): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) {
    return '';
  }

  return `${parsed.day} ${formatMonthShort(parsed.month)}`;
}

/** '9 de noviembre de 2026'. */
export function formatFullDate(iso: string | null | undefined): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) {
    return '';
  }

  return `${parsed.day} de ${MONTH_LONG[parsed.month - 1] ?? ''} de ${parsed.year}`;
}

/** '9 de noviembre' (sin año). */
export function formatDayMonthLong(iso: string | null | undefined): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) {
    return '';
  }

  return `${parsed.day} de ${MONTH_LONG[parsed.month - 1] ?? ''}`;
}

/**
 * Rango de fechas de una semana:
 *  - mismo mes y año → '9 – 15 nov 2026'
 *  - mismo año, distinto mes → '9 nov – 15 dic 2026'
 *  - distinto año → '9 nov 2026 – 15 ene 2027'
 *
 * Con `withYear: false` el año se omite cuando la semana no cruza años:
 * '9 – 15 nov'.
 */
export function formatDateRange(
  startIso: string,
  endIso: string,
  options?: { withYear?: boolean },
): string {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const withYear = options?.withYear ?? true;

  if (!start || !end) {
    return '';
  }

  if (start.year !== end.year) {
    return `${formatDateShort(startIso)} ${start.year} – ${formatDateShort(endIso)} ${end.year}`;
  }

  if (start.month !== end.month) {
    const range = `${formatDateShort(startIso)} – ${formatDateShort(endIso)}`;

    return withYear ? `${range} ${start.year}` : range;
  }

  const range = `${start.day} – ${end.day} ${formatMonthShort(start.month)}`;

  return withYear ? `${range} ${start.year}` : range;
}

/** Entero sin decimales si es entero; si no, un decimal con '.'. */
export function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(1);
}

/** '30 min', '45 s', '500 m', '5 km', '10 reps'. */
export function formatWorkValue(value: number, unit: WorkUnit | null | undefined): string {
  const amount = formatNumber(value);

  switch (unit) {
    case 'min':
      return `${amount} min`;
    case 'sec':
      return `${amount} s`;
    case 'm':
      return `${amount} m`;
    case 'km':
      return `${amount} km`;
    case 'reps':
      return `${amount} reps`;
    default:
      return amount;
  }
}

/** Valores que sustituyen a los placeholders de `exercise_types.display_template`. */
export type TemplateValues = {
  reps?: string | number | null;
  work?: string | null;
  rest?: string | null;
  pace?: string | null;
};

/**
 * Sustituye los placeholders conocidos ({reps}, {work}, {rest}, {pace}).
 *
 * Un placeholder cuyo valor es `null` o `undefined` se ELIMINA (no se deja
 * el literal `{work}` en pantalla). Después se limpia el texto resultante:
 * paréntesis vacíos, separadores colgantes, espacios de más y el texto que
 * acompañaba al placeholder eliminado (por ejemplo, "de descanso" en
 * "{rest} de descanso" cuando no hay descanso).
 *
 * Un placeholder NO reconocido se deja tal cual: delata una plantilla mal
 * escrita en lugar de borrarla en silencio.
 */
export function formatTemplate(template: string, values: TemplateValues): string {
  const filled = template.replace(/\{(\w+)\}/g, (match, key: string) => {
    switch (key) {
      case 'reps': {
        const reps = values.reps;
        return reps === null || reps === undefined ? MISSING : String(reps);
      }
      // Ojo: se compara con `null`/`undefined` en lugar de usar truthiness,
      // porque un valor de '0' es válido y debe sustituir al placeholder.
      case 'work':
        return values.work != null ? values.work : MISSING;
      case 'rest':
        return values.rest != null ? values.rest : MISSING;
      case 'pace':
        return values.pace != null ? values.pace : MISSING;
      default:
        return match;
    }
  });

  return cleanTemplate(filled);
}

/** Marca los placeholders eliminados, para poder limpiar su texto de apoyo. */
const MISSING = '\u0001';

/** Limpia los restos de un placeholder eliminado. */
function cleanTemplate(text: string): string {
  return text
    // El texto que acompañaba al placeholder eliminado se va con él (por
    // ejemplo, "de descanso" en "{rest} de descanso" sin descanso).
    .replace(new RegExp(`${MISSING}\\s*(de\\s+descanso)?`, 'gi'), '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s*[+·•|]\s*$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
