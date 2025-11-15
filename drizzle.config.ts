import 'dotenv/config';
import {Config} from 'drizzle-kit';
import config from './environment.config';

const isProduction = config.env === 'production';
const localConfig = {
    dialect: 'sqlite',
    out: './common/infrastructure/db/drizzle/migrations',
    schema: './common/infrastructure/db/drizzle/schema.ts',
    dbCredentials: {
        url: config.sqliteDBURL
    }
} satisfies Config;

const productionConfig = {
    dialect: 'turso',
    out: './common/infrastructure/db/drizzle/migrations',
    schema: './common/infrastructure/db/drizzle/schema.ts',
    dbCredentials: {
        url: config.sqliteDBURL as string,
        authToken: config.sqliteDBAuthToken as string,
    }
} satisfies Config;

const drizzleConfig = isProduction ? productionConfig : localConfig;
console.log('Drizzle Config Loaded:', isProduction ? 'Production' : 'Local');
export default drizzleConfig;

