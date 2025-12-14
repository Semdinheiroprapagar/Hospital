import type { IDatabase } from './types';
import { SQLiteAdapter } from './adapters/sqlite.adapter';
import { SupabaseAdapter } from './adapters/supabase.adapter';

let dbInstance: IDatabase | null = null;

export function getDatabase(): IDatabase {
    if (dbInstance) {
        return dbInstance;
    }

    const databaseType = process.env.DATABASE_TYPE || 'sqlite';

    switch (databaseType.toLowerCase()) {
        case 'supabase':
            console.log('🚀 Using Supabase database');
            dbInstance = new SupabaseAdapter();
            break;
        case 'sqlite':
        default:
            console.log('💾 Using SQLite database');
            dbInstance = new SQLiteAdapter();
            break;
    }

    return dbInstance;
}

// Export singleton instance
export const db = getDatabase();
