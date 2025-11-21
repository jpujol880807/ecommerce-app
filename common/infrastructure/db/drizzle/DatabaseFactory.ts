// typescript
// common/infrastructure/db/drizzle/DatabaseFactory.ts
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { injectable } from 'inversify';

@injectable()
export class DatabaseFactory {
    private db: LibSQLDatabase<any> | null = null;
    constructor(
        private sqliteDBURL: string,
        private sqliteDBAuthToken?: string,
        private environment: string = process.env.NODE_ENV ?? 'development'
    ) {}

    getDatabase(): LibSQLDatabase<any> {
        if (this.db) return this.db;

        this.db =
            this.environment === 'production'
                ? drizzle({
                    connection: {
                        url: this.sqliteDBURL,
                        authToken: this.sqliteDBAuthToken
                    }
                })
                : drizzle(this.sqliteDBURL);

        return this.db;
    }
}
