import { injectable, inject } from 'inversify';
import { eq, and, inArray, sql } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { Product } from '../../domain/products/entity/Product';
import { ProductVariation } from '../../domain/products/entity/ProductVariation';
import { ProductImage } from '../../domain/products/entity/ProductImage';
import { Category } from '../../domain/categories/entity/Category';
import {
    products,
    productCategories,
    productImages,
    productVariants,
    productOptions,
    optionValues,
    variantOptionValues,
    brands,
    categories
} from '~~/common/infrastructure/db/drizzle/schema';
import { TYPES } from '~~/common/infrastructure/ioc/types';
import type {ProductsRepository} from '../../domain/products/repository/ProductsRepository';
import {DatabaseFactory} from '~~/common/infrastructure/db/drizzle/DatabaseFactory';

@injectable()
export class SqliteProductsRepository implements ProductsRepository {
    private db: LibSQLDatabase<any>;

    // @ts-ignore
    constructor(@inject(TYPES.SqliteDatabaseConnection) dbFactory: DatabaseFactory) {
        this.db = dbFactory.getDatabase();
    }

    async getById(id: string): Promise<Product | null> {
        const result = await this.db
            .select()
            .from(products)
            .where(eq(products.id, id))
            .limit(1);

        if (!result.length) return null;

        return this.hydrateProduct(result[0]);
    }

    async getBySku(sku: string): Promise<Product | null> {
        const result = await this.db
            .select()
            .from(products)
            .where(eq(products.sku, sku))
            .limit(1);

        if (!result.length) return null;

        return this.hydrateProduct(result[0]);
    }

    async getBySlug(slug: string): Promise<Product | null> {
        const result = await this.db
            .select()
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1);

        if (!result.length) return null;

        return this.hydrateProduct(result[0]);
    }

    async getByCategoryId(categoryId: string, limit = 20, offset = 0): Promise<Product[]> {
        const productIds = await this.db
            .select({ id: productCategories.product_id })
            .from(productCategories)
            .where(eq(productCategories.category_id, categoryId))
            .limit(limit)
            .offset(offset);

        if (!productIds.length) return [];

        const productsList = await this.db
            .select()
            .from(products)
            .where(inArray(products.id, productIds.map(p => p.id)));

        return Promise.all(productsList.map(p => this.hydrateProduct(p)));
    }

    async getByBrandId(brandId: string, limit = 20, offset = 0): Promise<Product[]> {
        const productsList = await this.db
            .select()
            .from(products)
            .where(eq(products.brand_id, brandId))
            .limit(limit)
            .offset(offset);

        return Promise.all(productsList.map(p => this.hydrateProduct(p)));
    }

    async getAll(limit = 20, offset = 0): Promise<Product[]> {
        const productsList = await this.db
            .select()
            .from(products)
            .limit(limit)
            .offset(offset);

        return Promise.all(productsList.map(p => this.hydrateProduct(p)));
    }

    async search(query: string, limit = 20, offset = 0): Promise<Product[]> {
        const productsList = await this.db
            .select()
            .from(products)
            .where(
                sql`${products.title} LIKE ${'%' + query + '%'} OR ${products.description} LIKE ${'%' + query + '%'}`
            )
            .limit(limit)
            .offset(offset);

        return Promise.all(productsList.map(p => this.hydrateProduct(p)));
    }

    async create(productData: Partial<Product>): Promise<Product> {
        const [result] = await this.db
            .insert(products)
            .values({
                title: productData.title!,
                slug: productData.slug!,
                sku: productData.sku!,
                brand_id: productData.brandId || null,
                short_description: productData.shortDescription || null,
                description: productData.description || null,
                price_cents: productData.priceCents || 0,
                list_price_cents: productData.listPriceCents || 0,
                shipping_cents: productData.shippingCents || 0,
                discount_percentage: productData.discountPercentage || 0,
                stock_count: productData.stockCount || 0,
                is_in_stock: productData.isInStock ? 1 : 0,
                status: productData.status || 'new',
                weight_kg: productData.weightKg || null,
                dimensions: productData.dimensions || null,
                isbn: productData.isbn || null,
                ean: productData.ean || null,
                parent_asin: productData.parentAsin || null,
                product_url: productData.productUrl || null,
                vendor_url: productData.vendorUrl || null,
                reviews_url: productData.reviewsUrl || null,
                fulfilled_by: productData.fulfilledBy || null,
                sold_by: productData.soldBy || null,
                merchant_returns: productData.merchantReturns ? 1 : 0,
                rating: productData.rating || null,
                metadata: JSON.stringify(productData.metadata || {}),
            })
            .returning();

        return this.hydrateProduct(result);
    }

    async update(id: string, updates: Partial<Product>): Promise<Product | null> {
        const updateData: any = {};

        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.slug !== undefined) updateData.slug = updates.slug;
        if (updates.sku !== undefined) updateData.sku = updates.sku;
        if (updates.brandId !== undefined) updateData.brand_id = updates.brandId;
        if (updates.shortDescription !== undefined) updateData.short_description = updates.shortDescription;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.priceCents !== undefined) updateData.price_cents = updates.priceCents;
        if (updates.listPriceCents !== undefined) updateData.list_price_cents = updates.listPriceCents;
        if (updates.shippingCents !== undefined) updateData.shipping_cents = updates.shippingCents;
        if (updates.discountPercentage !== undefined) updateData.discount_percentage = updates.discountPercentage;
        if (updates.stockCount !== undefined) updateData.stock_count = updates.stockCount;
        if (updates.isInStock !== undefined) updateData.is_in_stock = updates.isInStock ? 1 : 0;
        if (updates.status !== undefined) updateData.status = updates.status;
        if (updates.weightKg !== undefined) updateData.weight_kg = updates.weightKg;
        if (updates.dimensions !== undefined) updateData.dimensions = updates.dimensions;
        if (updates.isbn !== undefined) updateData.isbn = updates.isbn;
        if (updates.ean !== undefined) updateData.ean = updates.ean;
        if (updates.parentAsin !== undefined) updateData.parent_asin = updates.parentAsin;
        if (updates.productUrl !== undefined) updateData.product_url = updates.productUrl;
        if (updates.vendorUrl !== undefined) updateData.vendor_url = updates.vendorUrl;
        if (updates.reviewsUrl !== undefined) updateData.reviews_url = updates.reviewsUrl;
        if (updates.fulfilledBy !== undefined) updateData.fulfilled_by = updates.fulfilledBy;
        if (updates.soldBy !== undefined) updateData.sold_by = updates.soldBy;
        if (updates.merchantReturns !== undefined) updateData.merchant_returns = updates.merchantReturns ? 1 : 0;
        if (updates.rating !== undefined) updateData.rating = updates.rating;
        if (updates.metadata !== undefined) updateData.metadata = JSON.stringify(updates.metadata);

        const result = await this.db
            .update(products)
            .set(updateData)
            .where(eq(products.id, id))
            .returning();

        if (!result.length) return null;

        return this.hydrateProduct(result[0]);
    }

    async delete(id: string): Promise<Product | null> {
        const result = await this.db
            .delete(products)
            .where(eq(products.id, id))
            .returning();

        if (!result.length) return null;

        return this.hydrateProduct(result[0]);
    }

    private async hydrateProduct(productRow: any): Promise<Product> {
        if (productRow.products) {
            productRow = productRow.products;
        }
        const product = new Product(
            productRow.id,
            productRow.title,
            productRow.slug,
            productRow.sku,
            productRow.brand_id,
            productRow.short_description,
            productRow.description,
            productRow.price_cents,
            productRow.list_price_cents || 0,
            productRow.shipping_cents || 0,
            productRow.discount_percentage || 0,
            productRow.stock_count || 0,
            Boolean(productRow.is_in_stock),
            productRow.status,
            false, // isCollection
            false, // isDigital
            productRow.weight_kg,
            productRow.dimensions,
            productRow.isbn,
            productRow.ean,
            productRow.parent_asin,
            productRow.product_url,
            productRow.vendor_url,
            productRow.reviews_url,
            productRow.fulfilled_by,
            productRow.sold_by,
            Boolean(productRow.merchant_returns),
            productRow.rating,
            productRow.metadata ? JSON.parse(productRow.metadata) : {},
            new Date(productRow.created_at),
            new Date(productRow.updated_at)
        );

        // Cargar categorías
        const categoryRows = await this.db
            .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
                meta: categories.meta,
                created_at: categories.created_at,
                updated_at: categories.updated_at
            })
            .from(productCategories)
            .innerJoin(categories, eq(productCategories.category_id, categories.id))
            .where(eq(productCategories.product_id, productRow.id));

        for (const cat of categoryRows) {
            product.addCategory(new Category({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                meta: cat.meta ? JSON.parse(cat.meta) : {},
                createdAt: cat.created_at,
                updatedAt: cat.updated_at
            }));
        }

        // Cargar imágenes
        const imageRows = await this.db
            .select()
            .from(productImages)
            .where(eq(productImages.product_id, productRow.id))
            .orderBy(productImages.position);

        for (const img of imageRows) {
            product.addImage(new ProductImage(
                img.id,
                img.product_id,
                img.variant_id || null,
                img.url_small || null,
                img.url_medium || null,
                img.url_large || null,
                img.url_original,
                img.alt || null,
                img.position || 0,
                new Date(img.created_at)
            ));
        }

        // Cargar variantes con sus opciones
        const variantRows = await this.db
            .select()
            .from(productVariants)
            .where(eq(productVariants.product_id, productRow.id));

        for (const variant of variantRows) {
            const variantOptions = await this.db
                .select({
                    optionCode: productOptions.code,
                    value: optionValues.value
                })
                .from(variantOptionValues)
                .innerJoin(productOptions, eq(variantOptionValues.option_id, productOptions.id))
                .innerJoin(optionValues, eq(variantOptionValues.option_value_id, optionValues.id))
                .where(eq(variantOptionValues.variant_id, variant.id));

            const options: Record<string, string> = {};
            variantOptions.forEach(vo => {
                options[vo.optionCode] = vo.value;
            });

            product.addVariation(new ProductVariation(
                variant.id,
                variant.product_id,
                variant.sku,
                variant.inventory_count || 0,
                Boolean(variant.is_available),
                Boolean(variant.is_selected),
                variant.weight_grams || undefined,
                variant.barcode || undefined,
                variant.fulfilled_by || undefined,
                variant.sold_by || undefined,
                variant.vendor_delivery_day || undefined,
                Boolean(variant.is_active),
                options,
                new Date(variant.created_at),
                new Date(variant.updated_at)
            ));
        }

        return product;
    }

    async getMostExpensivePerCategory(limitPerCategory = 1): Promise<Product[]> {
        const categoryRows = await this.db
            .select({ id: categories.id })
            .from(categories)
            .where(
                sql`NOT EXISTS (
                SELECT 1 FROM category_closure AS cc
                WHERE cc.descendant = ${categories.id}
                  AND cc.depth > 0
            )`
        );

        const results: Product[] = [];
        const seen = new Set<string>();

        for (const cat of categoryRows) {
            const productRows = await this.db
                .select()
                .from(products)
                .innerJoin(productCategories, eq(productCategories.product_id, products.id))
                .where(
                    and(
                        eq(productCategories.category_id, cat.id),
                        sql`${products.price_cents} > ${0}`,
                        eq(products.discount_percentage, 0)
                    )
                )
                .orderBy(sql`${products.price_cents} DESC`)
                .limit(limitPerCategory);

            for (const p of productRows) {
                if (seen.has(p.products.id)) continue;
                seen.add(p.products.id);
                results.push(await this.hydrateProduct(p));
            }
        }

        return results;
    }

    async getGreatestDiscountPerCategory(limitPerCategory = 1): Promise<Product[]> {
        const categoryRows = await this.db
            .select({ id: categories.id })
            .from(categories)
            .where(
                sql`NOT EXISTS (
                SELECT 1 FROM category_closure AS cc
                WHERE cc.descendant = ${categories.id}
                AND cc.depth > 0
                )`
            );

        const results: Product[] = [];
        const seen = new Set<string>();

        for (const cat of categoryRows) {
            const productRows = await this.db
                .select()
                .from(products)
                .innerJoin(productCategories, eq(productCategories.product_id, products.id))
                .where(
                    and(
                        eq(productCategories.category_id, cat.id),
                        sql`${products.price_cents} > ${0}`,
                        sql`${products.discount_percentage} > ${0}`
                    )
                )
                .orderBy(sql`((${products.price_cents} * ${products.discount_percentage}) / ${100}) DESC`)
                .limit(limitPerCategory);

            for (const p of productRows) {
                if (seen.has(p.products.id)) continue;
                seen.add(p.products.id);
                results.push(await this.hydrateProduct(p));
            }
        }

        return results;
    }


    async getGreatestDiscounts(limit = 20): Promise<Product[]> {
        const productRows = await this.db
            .select()
            .from(products)
            .where(
                and(
                    sql`${products.price_cents} > ${0}`,
                    sql`${products.discount_percentage} > ${0}`
                )
            )
            .orderBy(sql`((${products.price_cents} * ${products.discount_percentage}) / ${100}) DESC`)
            .limit(limit);

        return Promise.all(productRows.map(p => this.hydrateProduct(p)));
    }
}
