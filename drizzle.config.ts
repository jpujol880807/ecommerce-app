import {defineConfig} from 'drizzle-kit';

export default defineConfig({
    dialect: 'sqlite',
    out: './common/infrastructure/db/drizzle/migrations',
    schema: './common/infrastructure/db/drizzle/schema.ts',
    dbCredentials: {
        url: 'file:database/sqlite/database.sqlite'
    }
})
