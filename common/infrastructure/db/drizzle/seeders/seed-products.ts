import * as fs from 'node:fs';
import * as path from 'node:path';
import {drizzle} from 'drizzle-orm/libsql';
import {createClient} from '@libsql/client';
import {
    brands,
    categories,
    optionValues,
    productCategories,
    productImages,
    productOptions,
    products,
    productVariants,
    variantOptionValues
} from '../schema';
import {eq} from 'drizzle-orm';
import 'dotenv/config';

interface ProductJson {
    availability: ProductAvailability;
    isCollection: boolean;
    brand: string;
    category: string[];
    categoryDetails: CategoryDetail[];
    deliveryData: ProductDeliveryData;
    dimension: string;
    images: Image[];
    cloudfrontImages: string[];
    sizedImages: SizedImage[];
    isbn: string;
    largeDescription: string;
    name: Name;
    newProductUrl: string;
    prices: Prices;
    productStatus: string;
    rating: Rating;
    shortDescription: string;
    sku: string;
    sliders: any[];
    variations: Variation[];
    merchantUrl: string;
    vendorUrl: string;
    reviewsUrl: string;
    weight: number;
    merchantReturns: boolean;
    isDigitalProduct: boolean;
    metadata: Metadata;
    parentAsin: string;
    allVariationsSkus: string[];
}

export interface Rating {
    number: string;
    count: string;
}

export interface ProductAvailability {
    stock: boolean;
    stockCount: number;
}

export interface CategoryDetail {
    label: string;
    level: number;
    nodeId: string;
}

export interface ProductDeliveryData {
    fulfillBy: string;
    soldBy: string;
}

export interface Image {
    alt: Name;
    src: string;
}

export enum Name {
    SaddleBag1UnitSR38CafeRacer = "Saddle Bag 1 Unit SR38 Cafe Racer",
}

export interface Metadata {
    merchant: string;
    merchantName: string;
    ean: string;
    vendorSku: string;
    shippingCountry: string;
}

export interface Prices {
    listPrice: number;
    percentage: number;
    shipping: number;
    price: number;
}

export interface SizedImage {
    small: Image;
    medium: Image;
    large: Image;
}

export interface Variation {
    options: Option[];
    variationLabel: string;
    variationCode: string;
    variationDisplayType: string;
    variationAction: string;
}

export interface Option {
    sku: string;
    optionCode: string;
    label: string;
    selected: boolean;
    available: boolean;
    images: any[];
    deliveryData: OptionDeliveryData;
    availability: OptionAvailability;
}

export interface OptionAvailability {
    stock: boolean;
}

export interface OptionDeliveryData {
    fulfillBy: string;
    soldBy: string;
    vendorDeliveryDay: string;
}


type CategoryWithProductsJson = {
    id: string;
    name: string;
    slug: string;
    products: ProductJson[];
};

function readProductsJson(): CategoryWithProductsJson[] {
    const file = path.resolve(
        process.cwd(),
        'common/infrastructure/db/drizzle/seeders/categories_with_products.json'
    );
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw) as CategoryWithProductsJson[];
}

const client = createClient({
    url: process.env.SQLITE_DB_URL || 'file:database/sqlite/database.sqlite',
    authToken: process.env.SQLITE_DB_AUTH_TOKEN || '',
});

const db = drizzle(client);

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
}

function parsePriceToCents(priceStr: string | number): number {
    if (typeof priceStr === 'number') {
        return Math.round(priceStr * 100);
    }
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    return Math.round(parseFloat(cleaned) * 100) || 0;
}

function parseWeight(weightStr?: string): number | null {
    if (!weightStr) return null;
    const match = weightStr.match(/[\d.]+/);
    if (!match) return null;

    const value = parseFloat(match[0]);
    if (weightStr.toLowerCase().includes('pound')) {
        return value * 0.453592; // libras a kg
    }
    return value;
}

async function findOrCreateBrand(brandName: string): Promise<string> {
    const slug = generateSlug(brandName);

    const existing = await db.select()
        .from(brands)
        .where(eq(brands.slug, slug))
        .limit(1);

    if (existing.length > 0) {
        return existing[0].id;
    }

    const [brand] = await db.insert(brands).values({
        name: brandName,
        slug,
    }).returning();

    return brand.id;
}

async function findCategoryById(id: string): Promise<string | null> {
    const result = await db.select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);

    return result.length > 0 ? result[0].id : null;
}

async function seedProducts(categoriesData: CategoryWithProductsJson[]) {
    for (const categoryData of categoriesData) {
        console.log(`\nSeeding products for category: ${categoryData.name}`);

        const categoryId = await findCategoryById(categoryData.id);

        if (!categoryId) {
            console.warn(`Category not found: ${categoryData.id} - ${categoryData.name}`);
            continue;
        }

        for (const productData of categoryData.products) {
            try {
                // 1. Crear o encontrar brand
                const brandId = await findOrCreateBrand(productData.brand);

                // 2. Parsear precios
                const priceCents = parsePriceToCents(productData.prices.price || 0);
                const listPriceCents = parsePriceToCents(productData.prices.listPrice || 0);
                const shippingCents = parsePriceToCents(productData.prices.shipping || 0);
                const discountPercentage = productData.prices.percentage || 0;

                // 3. Determinar condición del producto
                let status: 'new' | 'used' | 'refurbished' = 'new';
                if (productData.productStatus?.toLowerCase().includes('used')) {
                    status = 'used';
                } else if (productData.productStatus?.toLowerCase().includes('refurbished')) {
                    status = 'refurbished';
                }

                // 4. Calcular stock
                const stockCount = productData.availability.stockCount;

                const isInStock = productData.availability.stock;

                // 5. Parsear peso y dimensiones
                const weightKg = productData.weight;

                // 6. Crear metadata
                const metadata = {
                    merchant: productData.metadata.merchant,
                    merchantName: productData.metadata.merchantName,
                    shippingCountry: productData.metadata.shippingCountry,
                };

                // 7. Crear producto
                const productSlug = generateSlug(productData.name);
                const [product] = await db.insert(products).values({
                    title: productData.name,
                    slug: productSlug,
                    sku: productData.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    brand_id: brandId,
                    short_description: productData.shortDescription || null,
                    description: productData.largeDescription,
                    price_cents: priceCents,
                    list_price_cents: listPriceCents,
                    shipping_cents: shippingCents,
                    discount_percentage: discountPercentage,
                    stock_count: stockCount,
                    is_in_stock: isInStock ? 1 : 0,
                    status,
                    weight_kg: weightKg,
                    dimensions: productData.dimension,
                    isbn: productData.isbn,
                    ean: '',
                    parent_asin: productData.parentAsin,
                    product_url: productData.merchantUrl,
                    vendor_url: productData.vendorUrl,
                    reviews_url: productData.reviewsUrl,
                    fulfilled_by: productData.deliveryData.fulfillBy,
                    sold_by: productData.deliveryData.soldBy,
                    merchant_returns: productData.merchantReturns ? 1 : 0,
                    rating: parseFloat(productData.rating?.number) || null,
                    metadata: JSON.stringify(metadata),
                }).returning();

                // 8. Asociar con categoría
                await db.insert(productCategories).values({
                    product_id: product.id,
                    category_id: categoryId,
                });

                // 9. Insertar imágenes
                // 9. Insertar imágenes
                if (productData.sizedImages?.length) {
                    for (let i = 0; i < productData.sizedImages.length; i++) {
                        const sizedImage = productData.sizedImages[i];
                        await db.insert(productImages).values({
                            product_id: product.id,
                            url_small: sizedImage.small.src,
                            url_medium: sizedImage.medium.src,
                            url_large: sizedImage.large.src,
                            url_original: productData.images[i]?.src || sizedImage.large.src,
                            alt: sizedImage.large.alt || `${productData.name} - Image ${i + 1}`,
                            position: i,
                        });
                    }
                }

// 10. Insertar opciones
                const optionMap = new Map<string, string>(); // code -> option_id
                const optionValueMap = new Map<string, string>(); // code:value -> option_value_id

                if (productData.variations?.length) {
                    for (const variation of productData.variations) {
                        const optionCode = generateSlug(variation.variationLabel);

                        const [option] = await db.insert(productOptions).values({
                            product_id: product.id,
                            name: variation.variationLabel,
                            code: optionCode,
                            display_type: variation.variationDisplayType || 'select',
                        }).returning();

                        optionMap.set(variation.variationCode, option.id);

                        // Insertar valores de opción
                        for (let i = 0; i < variation.options.length; i++) {
                            const opt = variation.options[i];
                            const [optVal] = await db.insert(optionValues).values({
                                option_id: option.id,
                                value: opt.label,
                                label: opt.label,
                                option_code: opt.optionCode,
                                position: i,
                            }).returning();

                            optionValueMap.set(`${variation.variationCode}:${opt.label}`, optVal.id);
                        }
                    }
                }

// 11. Insertar variantes
                if (productData.variations?.length) {
                    for (const variation of productData.variations) {
                        for (const opt of variation.options) {
                            const [variant] = await db.insert(productVariants).values({
                                product_id: product.id,
                                sku: opt.sku,
                                inventory_count: 0,
                                is_available: opt.available ? 1 : 0,
                                is_selected: opt.selected ? 1 : 0,
                                fulfilled_by: opt.deliveryData.fulfillBy,
                                sold_by: opt.deliveryData.soldBy,
                                vendor_delivery_day: opt.deliveryData.vendorDeliveryDay,
                            }).returning();

                            // Asociar opción con variante
                            const optionId = optionMap.get(variation.variationCode);
                            const optionValueId = optionValueMap.get(`${variation.variationCode}:${opt.label}`);

                            if (optionId && optionValueId) {
                                await db.insert(variantOptionValues).values({
                                    variant_id: variant.id,
                                    option_id: optionId,
                                    option_value_id: optionValueId,
                                });
                            }
                        }
                    }
                }
                console.log(`✓ Product seeded: ${product.title}`);
            } catch (err) {
                console.error(`✗ Error seeding product ${productData.name}:`, err);
            }
        }
    }
}

export const productsSeeder = async () => {
    try {
        const data = readProductsJson();
        console.log('Starting products seed...');
        await seedProducts(data);
        console.log('\nProducts seed completed successfully.');
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await client.close();
    }
};
