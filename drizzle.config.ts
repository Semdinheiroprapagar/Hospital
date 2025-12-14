import type { Config } from 'drizzle-kit';

export default {
    schema: './lib/database/schema/index.ts',
    out: './lib/database/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: './hospital.db',
    },
} satisfies Config;
