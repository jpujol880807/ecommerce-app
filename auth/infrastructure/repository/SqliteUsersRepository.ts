import { eq } from 'drizzle-orm';
import { users } from '~~/common/infrastructure/db/drizzle/schema';
import {drizzle, LibSQLDatabase} from 'drizzle-orm/libsql';
import type {UsersRepository} from '~~/auth/domain/users/repository/UsersRepository';
import {User} from '~~/auth/domain/users/entity/User';
import {injectable} from 'inversify';

@injectable()
export class SqliteUsersRepository implements UsersRepository {
    private db: LibSQLDatabase<any>
    constructor() {
        const config = useRuntimeConfig();
        const environment = config.env as string;

        this.db = environment === 'production'
            ? drizzle({
                connection: {
                    url: config.sqliteDBURL as string,
                    authToken: config.sqliteDBAuthToken as string
                }
            })
            : drizzle(config.sqliteDBURL as string)
    }
    async create(user: {
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }): Promise<User | null> {
        const results = await this.db.insert(users).values({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            passwordHash: user.passwordHash,
        }).returning({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            passwordHash: users.passwordHash,
        }); // Ensure the database returns these fields
        return results.length ? new User(results[0]!!) : null; // Return the first result
    }

    async getById(id: number) {
        const results = await this.db.select().from(users).where(eq(users.id, id));
        return results.length ? new User(results[0]!!) : null;
    }

    async getByEmail(email: string) {
        const results = await this.db.select().from(users).where(eq(users.email, email));
        return results.length ? new User(results[0]!!) : null;
    }

    async update(id: number, updates: Partial<{
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }>): Promise<User | null> {
        const results = await this.db.update(users).set(updates).where(eq(users.id, id)).returning();
        return results.length ? new User(results[0]!!): null;
    }

    async delete(id: number) {
        const results = await this.db.delete(users).where(eq(users.id, id)).returning();
        return results.length ? new User(results[0]!!): null;
    }
}
