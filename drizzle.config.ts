import {defineConfig} from 'drizzle-kit';
import 'dotenv/config';

const credentials = process.env.NODE_ENV === 'production' ? {
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_DATABASE_AUTH_TOKEN as string,
} : {
    url: 'file:database/sqlite/database.sqlite',
};

export default defineConfig({
    dialect: 'sqlite',
    out: './common/infrastructure/db/drizzle/migrations',
    schema: './common/infrastructure/db/drizzle/schema.ts',
    dbCredentials: credentials
})
