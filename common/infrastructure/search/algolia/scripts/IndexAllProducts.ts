// common/infrastructure/search/algolia/scripts/IndexAllProducts.ts
import 'reflect-metadata';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import {algoliasearch} from 'algoliasearch';
import {products, brands, productCategories, categories, productImages} from '../../../db/drizzle/schema';
import {eq, sql} from 'drizzle-orm';
import 'dotenv/config';

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || '';
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_WRITE_API_KEY || '';
const INDEX_NAME = 'ecommerce_app_products';
const BATCH_SIZE = 100;

async function indexAllProducts() {
    console.log('🚀 Iniciando indexación de productos en Algolia...');

    // Conexión a la base de datos
    const dbClient = createClient({
        url: process.env.SQLITE_DB_URL || 'file:database/sqlite/database.sqlite',
        authToken: process.env.SQLITE_DB_AUTH_TOKEN || '',
    });
    const db = drizzle(dbClient);

    // Conexión a Algolia
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
// En IndexAllProducts.ts, después de setSettings
    await client.setSettings({
        indexName: INDEX_NAME,
        indexSettings: {
            searchableAttributes: ['title', 'short_description', 'description', 'brand_name'],
            attributesForFaceting: ['brand_id', 'categories.id', 'is_in_stock'],
            customRanking: ['desc(rating)', 'desc(created_at)'],
            replicas: [
                'ecommerce_app_products_price_asc',
                'ecommerce_app_products_price_desc',
                'ecommerce_app_products_rating_desc',
                'ecommerce_app_products_created_at_desc',
            ],
        },
    });

// Configurar cada réplica
    await client.setSettings({
        indexName: 'ecommerce_app_products_price_asc',
        indexSettings: {
            ranking: ['asc(price_cents)', 'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
        },
    });

    await client.setSettings({
        indexName: 'ecommerce_app_products_price_desc',
        indexSettings: {
            ranking: ['desc(price_cents)', 'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
        },
    });

    await client.setSettings({
        indexName: 'ecommerce_app_products_rating_desc',
        indexSettings: {
            ranking: ['desc(rating)', 'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
        },
    });

    await client.setSettings({
        indexName: 'ecommerce_app_products_created_at_desc',
        indexSettings: {
            ranking: ['desc(created_at)', 'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
        },
    });


    try {
        // Obtener todos los productos con sus relaciones
        const allProducts = await db
            .select({
                id: products.id,
                title: products.title,
                slug: products.slug,
                short_description: products.short_description,
                description: products.description,
                price_cents: products.price_cents,
                list_price_cents: products.list_price_cents,
                discount_percentage: products.discount_percentage,
                rating: products.rating,
                is_in_stock: products.is_in_stock,
                stock_count: products.stock_count,
                brand_id: products.brand_id,
                brand_name: brands.name,
                created_at: products.created_at,
                updated_at: products.updated_at,
                status: products.status,
            })
            .from(products)
            .leftJoin(brands, eq(products.brand_id, brands.id))
            .all();

        console.log(`📦 Se encontraron ${allProducts.length} productos`);

        // Obtener categorías por producto
        const productCategoriesData = await db
            .select({
                product_id: productCategories.product_id,
                category_id: categories.id,
                category_name: categories.name,
                category_slug: categories.slug,
            })
            .from(productCategories)
            .innerJoin(categories, eq(productCategories.category_id, categories.id))
            .all();

        // Obtener imagen principal por producto
        const productImagesData = await db
            .select({
                product_id: productImages.product_id,
                url: sql<string>`COALESCE(${productImages.url_large}, ${productImages.url_medium}, ${productImages.url_small}, ${productImages.url_original})`.as('url'),
            })
            .from(productImages)
            .where(eq(productImages.position, 0))
            .all();

        // Mapear datos
        const categoriesByProduct = productCategoriesData.reduce((acc, row) => {
            if (!acc[row.product_id]) acc[row.product_id] = [];
            acc[row.product_id].push({
                id: row.category_id,
                name: row.category_name,
                slug: row.category_slug,
            });
            return acc;
        }, {} as Record<string, any[]>);

        const imagesByProduct = productImagesData.reduce((acc, row) => {
            acc[row.product_id] = row.url;
            return acc;
        }, {} as Record<string, string>);

        // Transformar productos a formato Algolia
        const algoliaRecords = allProducts.map(product => ({
            objectID: product.id,
            title: product.title,
            slug: product.slug,
            short_description: product.short_description || '',
            description: product.description || '',
            price_cents: product.price_cents,
            list_price_cents: product.list_price_cents || 0,
            discount_percentage: product.discount_percentage || 0,
            rating: product.rating,
            is_in_stock: product.is_in_stock === 1,
            stock_count: product.stock_count || 0,
            brand_id: product.brand_id,
            brand_name: product.brand_name,
            primary_image_url: imagesByProduct[product.id] || null,
            categories: categoriesByProduct[product.id] || [],
            created_at: product.created_at?.getTime(),
            updated_at: product.updated_at?.getTime(),
            status: product.status,
        }));

        console.log('📤 Enviando productos a Algolia en lotes...');

        // Indexar en lotes
        for (let i = 0; i < algoliaRecords.length; i += BATCH_SIZE) {
            const batch = algoliaRecords.slice(i, i + BATCH_SIZE);
            await client.saveObjects({
                indexName: INDEX_NAME,
                objects: batch
            });
            console.log(`✅ Lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(algoliaRecords.length / BATCH_SIZE)} indexado`);
        }

        // Configurar atributos buscables y filtros
        await client.setSettings({
            indexName: INDEX_NAME,
            indexSettings: {
                searchableAttributes: [
                    'title',
                    'short_description',
                    'description',
                    'brand_name',
                ],
                attributesForFaceting: [
                    'brand_id',
                    'categories.id',
                    'is_in_stock',
                ],
                customRanking: [
                    'desc(rating)',
                    'desc(created_at)',
                ],
            },
        });

        console.log('✅ Indexación completada exitosamente');
        console.log(`📊 Total de productos indexados: ${algoliaRecords.length}`);

    } catch (error) {
        console.error('❌ Error durante la indexación:', error);
        throw error;
    }
}

// Ejecutar script
indexAllProducts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
