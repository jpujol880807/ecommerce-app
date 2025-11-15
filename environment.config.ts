import 'dotenv/config';
const config = {
    env: process.env.NODE_ENV!! || 'development' as string,
    sqliteDBURL: process.env.TURSO_DATABASE_URL!! as string || 'file:database/sqlite/database.sqlite',
    sqliteDBAuthToken: process.env.TURSO_AUTH_TOKEN!! as string || ''
};
export default config;
