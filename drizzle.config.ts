import {Config} from 'drizzle-kit';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';
const credentials = isProduction ? {
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_DATABASE_AUTH_TOKEN as string,
} : {
    url: 'file:database/sqlite/database.sqlite'
};
const localConfig = {
    dialect: 'sqlite',
    out: './common/infrastructure/db/drizzle/migrations',
    schema: './common/infrastructure/db/drizzle/schema.ts',
    dbCredentials: {
        url: 'file:database/sqlite/database.sqlite'
    }
} satisfies Config;

const productionConfig = {
    dialect: 'turso',
    out: './common/infrastructure/db/drizzle/migrations',
    schema: './common/infrastructure/db/drizzle/schema.ts',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL as string,
        authToken: process.env.TURSO_AUTH_TOKEN as string,
    }
} satisfies Config;

const config = isProduction ? productionConfig : localConfig;
console.log('Drizzle Config Loaded:', isProduction ? 'Production' : 'Local');
export default config;

