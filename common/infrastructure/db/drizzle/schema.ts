import {sqliteTable} from 'drizzle-orm/sqlite-core/table';

export const users = sqliteTable('users', (t) => ({
    id: t.integer('id').primaryKey({autoIncrement: true}),
    email: t.text('email').notNull().unique(),
    firstName: t.text().notNull(),
    lastName: t.text().notNull(),
    passwordHash: t.text('password_hash').notNull(),
    createdAt: t.integer({mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull()
        .$onUpdateFn(() => new Date()).notNull(),
    updatedAt: t.integer({mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull()
        .$onUpdateFn(() => new Date()).notNull(),
}));
