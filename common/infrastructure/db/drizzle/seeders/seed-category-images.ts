import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sql } from 'drizzle-orm';
import { categories } from '../schema';

const client = createClient({
    url: process.env.SQLITE_DB_URL || 'file:database/sqlite/database.sqlite',
    authToken: process.env.SQLITE_DB_AUTH_TOKEN || '',
});

const db = drizzle(client);

export const categoryImagesSeeder = async () => {
    try {
        console.log('Starting category images seed...');

        // Expresión UUIDv4 compatible SQLite
        const uuidExpr = sql`lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)), 2) || '-' ||
            substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
            hex(randomblob(6))
        )`;

        // Obtener todas las categorías
        const allCategories = await db.select().from(categories);

        console.log(`Procesando ${allCategories.length} categorías...`);

        for (const category of allCategories) {
            console.log(`\n📁 Categoría: ${category.name} (${category.id})`);

            // Preview: imágenes principales de los 8 productos más antiguos
            const previewSql = sql`
                SELECT
                    pi.id AS product_image_id,
                    pi.product_id,
                    pi.url_small,
                    pi.url_medium,
                    pi.url_large,
                    pi.url_original,
                    pi.alt,
                    pi.position
                FROM product_images pi
                WHERE pi.product_id IN (
                    SELECT p.id
                    FROM product_categories pc
                             JOIN products p ON p.id = pc.product_id
                    WHERE pc.category_id = ${category.id}
                    ORDER BY p.created_at ASC, p.id
                    LIMIT 8
                    )
                  AND pi.position = (
                SELECT MIN(position)
                FROM product_images
                WHERE product_id = pi.product_id
                    )
            `;

            const previewResult = await db.all(previewSql);
            console.log(`   ✓ Encontradas ${previewResult.length} imágenes para insertar`);

            if (previewResult.length > 0) {
                // Insertar imágenes en category_images
                const insertSql = sql`
                    INSERT INTO category_images (
                        id,
                        category_id,
                        url_small,
                        url_medium,
                        url_large,
                        url_original,
                        alt,
                        position,
                        created_at
                    )
                    SELECT
                        ${uuidExpr} AS id,
                        ${category.id} AS category_id,
                        pi.url_small,
                        pi.url_medium,
                        pi.url_large,
                        pi.url_original,
                        pi.alt,
                        pi.position,
                        (strftime('%s','now') * 1000) AS created_at
                    FROM product_images pi
                    WHERE pi.product_id IN (
                        SELECT p.id
                        FROM product_categories pc
                                 JOIN products p ON p.id = pc.product_id
                        WHERE pc.category_id = ${category.id}
                        ORDER BY p.created_at ASC, p.id
                        LIMIT 8
                        )
                      AND pi.position = (
                    SELECT MIN(position)
                    FROM product_images
                    WHERE product_id = pi.product_id
                        )
                      AND NOT EXISTS (
                    SELECT 1
                    FROM category_images ci
                    WHERE ci.category_id = ${category.id}
                      AND ci.url_original = pi.url_original
                        )
                `;

                await db.run(insertSql);
                console.log(`   ✅ Imágenes insertadas para categoría: ${category.name}`);
            } else {
                console.log(`   ⚠️  No se encontraron imágenes para esta categoría`);
            }
        }

        console.log('\n✅ Category images seed completed successfully.');
    } catch (err) {
        console.error('❌ Seed failed:', err);
        throw err;
    } finally {
        await client.close();
    }
};
