import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from '../schemas';

const DATABASE_NAME = 'elplan.db';

/**
 * Única conexión a SQLite para toda la app.
 * Las actions de core son las únicas que deben usar este cliente.
 */
export const expoDatabase = openDatabaseSync(DATABASE_NAME);

// Necesario para que los ON DELETE CASCADE / RESTRICT de los schemas se apliquen.
expoDatabase.execSync('PRAGMA foreign_keys = ON;');

export const db = drizzle(expoDatabase, { schema });

export type Database = typeof db;
