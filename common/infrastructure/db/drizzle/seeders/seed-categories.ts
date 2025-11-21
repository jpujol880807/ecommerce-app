import * as fs from 'node:fs';
import * as path from 'node:path';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { categories, categoryClosure } from '../schema';
import 'dotenv/config';

type CategoryJson = {
    id: string;
    name: string;
    number?: string;
    childCategories?: CategoryJson[];
};

function readTree(): CategoryJson {
    const file = path.resolve(process.cwd(), 'common/infrastructure/db/drizzle/seeders/category-tree.json');
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw) as CategoryJson;
}

const client = createClient({
    url: process.env.SQLITE_DB_URL || 'file:database/sqlite/database.sqlite',
    authToken: process.env.SQLITE_DB_AUTH_TOKEN || '',
});

const db = drizzle(client);

async function seedCategories(tree: CategoryJson) {
    async function insertNode(
        node: CategoryJson,
        ancestors: string[]
    ): Promise<string> {
        const slug = node.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

        try {
            const [category] = await db.insert(categories).values({
                name: node.name,
                slug,
                meta: JSON.stringify({
                    externalId: node.id || null,
                    number: node.number ?? null,
                    source: 'category-tree.json',
                }),
            }).returning();

            // Insertar en closure table: self-reference + ancestros
            await db.insert(categoryClosure).values({
                ancestor: category.id,
                descendant: category.id,
                depth: 0,
            });

            for (let i = 0; i < ancestors.length; i++) {
                await db.insert(categoryClosure).values({
                    ancestor: ancestors[i],
                    descendant: category.id,
                    depth: ancestors.length - i,
                });
            }

            // Procesar hijos
            if (node.childCategories?.length) {
                for (const child of node.childCategories) {
                    await insertNode(child, [...ancestors, category.id]);
                }
            }

            return category.id;
        } catch (err) {
            console.error(`Error inserting category ${node.name} (${node.id}):`, err);
        }
    }

    const roots = (tree.id === '' || tree.name?.toLowerCase().includes('browse nodes'))
        ? (tree.childCategories ?? [])
        : [tree];

    for (const root of roots) {
        await insertNode(root, []);
    }
}

export const categoriesSeeder = async () => {
    try {
        const tree = readTree();
        console.log('Starting category seed...');
        await seedCategories(tree);
        console.log('Category seed completed successfully.');
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await client.close();
    }
};
