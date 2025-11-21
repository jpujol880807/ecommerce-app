import { eq } from 'drizzle-orm';
import { users } from '~~/common/infrastructure/db/drizzle/schema';
import {drizzle, LibSQLDatabase} from 'drizzle-orm/libsql';
import type {UsersRepository} from '~~/auth/domain/users/repository/UsersRepository';
import {User} from '~~/auth/domain/users/entity/User';
import {injectable, inject} from 'inversify';
import {DatabaseFactory} from "~~/common/infrastructure/db/drizzle/DatabaseFactory";
import {TYPES} from "~~/common/infrastructure/ioc/types";

@injectable()
export class SqliteUsersRepository implements UsersRepository {
    private db: LibSQLDatabase<any>
    // @ts-ignore
    constructor(@inject(TYPES.SqliteDatabaseConnection) dbFactory: DatabaseFactory) {
        this.db = dbFactory.getDatabase();
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
