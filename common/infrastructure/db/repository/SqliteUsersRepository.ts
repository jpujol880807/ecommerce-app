import { eq } from 'drizzle-orm';
import { users } from '../drizzle/schema';
import {drizzle} from 'drizzle-orm/libsql';

const environment = process.env.NODE_ENV || 'development';
const dbURL = environment === 'production'
    ? process.env.TURSO_DATABASE_URL
    : 'file:database/sqlite/database.sqlite';
const db = environment === 'production'
    ? drizzle({
        connection: {
            url: dbURL as string,
            authToken: process.env.TURSO_DATABASE_AUTH_TOKEN as string,
        }
    })
    : drizzle(dbURL as string)

export class SqliteUsersRepository {
    async createUser(user: {
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }): Promise<{ id: number; email: string; firstName: string; lastName: string; } | undefined> {
        const result = await db.insert(users).values({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            passwordHash: user.passwordHash,
        }).returning({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName
        }); // Ensure the database returns these fields
        return result[0]; // Return the first result
    }

    async getUserById(id: number) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || null;
    }

    async getUserByEmail(email: string) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user || null;
    }

    async updateUser(id: number, updates: Partial<{
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }>) {
        const result = await db.update(users).set(updates).where(eq(users.id, id));
        return result;
    }

    async deleteUser(id: number) {
        const result = await db.delete(users).where(eq(users.id, id));
        return result;
    }
}
