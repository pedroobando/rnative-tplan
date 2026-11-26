import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { db } from './connections/client';
import migrations from './migrations/migrations';

/**
 * Aplica las migraciones de Drizzle al iniciar la app.
 * Las pantallas solo consumen este hook; nunca importan la conexión ni SQL.
 */
export const useDatabaseMigrations = () => useMigrations(db, migrations);
