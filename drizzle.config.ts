import {defineConfig} from 'drizzle-kit';

const environment = process.env.NODE_ENV || 'development';
const credentials = environment === 'production' ? {
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_DATABASE_AUTH_TOKEN as string,
} : {
    url: 'file:database/sqlite/database.sqlite'
};

export default defineConfig({
    dialect: 'sqlite',
    out: './common/infrastructure/db/drizzle/migrations',
    schema: './common/infrastructure/db/drizzle/schema.ts',
    dbCredentials: {
        url: 'file:database/sqlite/database.sqlite'
    }
})
