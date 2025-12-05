import { sql } from 'drizzle-orm';
import {primaryKey, sqliteTable, unique} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', (t) => ({
    id: t.integer('id').primaryKey({autoIncrement: true}),
    email: t.text('email').notNull().unique(),
    firstName: t.text().notNull(),
    lastName: t.text().notNull(),
    passwordHash: t.text('password_hash').notNull(),
    createdAt: t.integer({mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull(),
    updatedAt: t.integer({mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull()
        .$onUpdateFn(() => new Date()).notNull(),
}));

// Expresión UUIDv4 compatible SQLite / Turso (no requiere extensión)
const uuidV4 = sql`(
                       lower ( hex(randomblob(4)) || '-' ||
                       hex(randomblob(2)) || '-' ||
                       '4' || substr(hex(randomblob(2)), 2) || '-' ||
                       substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                       hex(randomblob(6))
                       ))`;

/* CATEGORIES */
export const categories = sqliteTable('categories', (t) => ({
    id: t.text('id').primaryKey().default(uuidV4),
    name: t.text('name').notNull(),
    slug: t.text('slug').notNull().unique(),
    meta: t.text('meta').default('{}'),
    created_at: t.integer('created_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull(),
    updated_at: t.integer('updated_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull()
        .$onUpdateFn(() => new Date()).notNull(),
}));

/* CATEGORY CLOSURE (ancestor/descendant) */
export const categoryClosure = sqliteTable('category_closure', (t) => ({
    ancestor: t.text('ancestor').notNull().references(() => categories.id, {onDelete: 'cascade'}),
    descendant: t.text('descendant').notNull().references(() => categories.id, {onDelete: 'cascade'}),
    depth: t.integer('depth').notNull().default(0),
}), (table) => [
    primaryKey({columns: [table.ancestor, table.descendant]}),
]);

/* BRANDS */
export const brands = sqliteTable('brands', (t) => ({
    id: t.text('id').primaryKey().default(uuidV4),
    name: t.text('name').notNull().unique(),
    slug: t.text('slug').notNull().unique(),
    created_at: t.integer('created_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull(),
    updated_at: t.integer('updated_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull()
        .$onUpdateFn(() => new Date()).notNull(),
}));

/* PRODUCTS - Rediseñado */
export const products = sqliteTable('products', (t) => ({
    id: t.text('id').primaryKey().default(uuidV4),
    title: t.text('title').notNull(),
    slug: t.text('slug').notNull().unique(),
    sku: t.text('sku').notNull().unique(), // SKU principal
    brand_id: t.text('brand_id').references(() => brands.id, {onDelete: 'set null'}),

    // Descriptions
    short_description: t.text('short_description'),
    description: t.text('description'),

    // Pricing (en centavos)
    price_cents: t.integer('price_cents').notNull().default(0),
    list_price_cents: t.integer('list_price_cents').default(0),
    shipping_cents: t.integer('shipping_cents').default(0),
    discount_percentage: t.integer('discount_percentage').default(0),

    // Stock & Availability
    stock_count: t.integer('stock_count').default(0),
    is_in_stock: t.integer('is_in_stock').notNull().default(1), // 1 = true, 0 = false

    // Product Status
    status: t.text('status').notNull().default('new'), // new, used, refurbished

    // Physical attributes
    weight_kg: t.real('weight_kg'),
    dimensions: t.text('dimensions'), // "8.19\"L x 10.87\"W x 15.2\"H"

    // External references
    isbn: t.text('isbn'),
    ean: t.text('ean'),
    parent_asin: t.text('parent_asin'),

    // URLs
    product_url: t.text('product_url'),
    vendor_url: t.text('vendor_url'),
    reviews_url: t.text('reviews_url'),

    // Delivery
    fulfilled_by: t.text('fulfilled_by'),
    sold_by: t.text('sold_by'),
    merchant_returns: t.integer('merchant_returns').default(0),

    // Rating
    rating: t.real('rating'),

    // Metadata JSON para campos adicionales
    metadata: t.text('metadata').default('{}'), // merchant, merchantName, shippingCountry, etc.

    created_at: t.integer('created_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull(),
    updated_at: t.integer('updated_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull()
        .$onUpdateFn(() => new Date()).notNull(),
}));

/* PRODUCT <-> CATEGORY many-to-many */
export const productCategories = sqliteTable('product_categories', (t) => ({
    product_id: t.text('product_id').notNull().references(() => products.id, {onDelete: 'cascade'}),
    category_id: t.text('category_id').notNull().references(() => categories.id, {onDelete: 'cascade'}),
}), (table) => [
    primaryKey({columns: [table.product_id, table.category_id]}),
]);

/* PRODUCT IMAGES - Rediseñado para soportar múltiples tamaños */
export const productImages = sqliteTable('product_images', (t) => ({
    id: t.text('id').primaryKey().default(uuidV4),
    product_id: t.text('product_id').notNull().references(() => products.id, {onDelete: 'cascade'}),
    variant_id: t.text('variant_id').references(() => productVariants.id, {onDelete: 'cascade'}),

    // URLs por tamaño
    url_small: t.text('url_small'),
    url_medium: t.text('url_medium'),
    url_large: t.text('url_large'),
    url_original: t.text('url_original').notNull().default(''),

    alt: t.text('alt'),
    position: t.integer('position').default(0),

    created_at: t.integer('created_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull(),
}));

/* PRODUCT VARIANTS - Rediseñado */
export const productVariants = sqliteTable('product_variants', (t) => ({
    id: t.text('id').primaryKey().default(uuidV4),
    product_id: t.text('product_id').notNull().references(() => products.id, {onDelete: 'cascade'}),
    sku: t.text('sku').notNull(),

    // Stock
    inventory_count: t.integer('inventory_count').default(0),
    is_available: t.integer('is_available').notNull().default(1),
    is_selected: t.integer('is_selected').notNull().default(0), // Para la variante por defecto

    // Physical
    weight_grams: t.integer('weight_grams'),
    barcode: t.text('barcode'),

    // Delivery (puede diferir del producto principal)
    fulfilled_by: t.text('fulfilled_by'),
    sold_by: t.text('sold_by'),
    vendor_delivery_day: t.text('vendor_delivery_day'),

    is_active: t.integer('is_active').notNull().default(1),

    created_at: t.integer('created_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull(),
    updated_at: t.integer('updated_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull()
        .$onUpdateFn(() => new Date()).notNull(),
}), (table) => [
    unique('unique_variant_sku').on(table.sku)
]);



/* PRODUCT OPTIONS - Sin cambios estructurales */
export const productOptions = sqliteTable('product_options', (t) => ({
    id: t.text('id').primaryKey().default(uuidV4),
    product_id: t.text('product_id').notNull().references(() => products.id, {onDelete: 'cascade'}),
    name: t.text('name').notNull(), // "Color", "Size", etc.
    code: t.text('code').notNull(), // "Color", "Size" (para matching)
    display_type: t.text('display_type').default('select'), // select, swatch, button
    position: t.integer('position').default(0),
}), (table) => [
    unique('unique_product_option').on(table.product_id, table.code)
]);

/* OPTION VALUES - Mejorado */
export const optionValues = sqliteTable('option_values', (t) => ({
    id: t.text('id').primaryKey().default(uuidV4),
    option_id: t.text('option_id').notNull().references(() => productOptions.id, {onDelete: 'cascade'}),
    value: t.text('value').notNull(), // "Brown", "Red", etc.
    label: t.text('label').notNull(), // Display label
    option_code: t.text('option_code'), // "0", "1" del JSON
    position: t.integer('position').default(0),
    meta: t.text('meta').default('{}'), // Para campos adicionales
}), (table) => [
    unique('unique_option_value').on(table.option_id, table.value)
]);

/* VARIANT -> OPTION VALUE mapping (one row por opción dentro de la variante) */
export const variantOptionValues = sqliteTable('variant_option_values', (t) => ({
    variant_id: t.text('variant_id').notNull().references(() => productVariants.id, {onDelete: 'cascade'}),
    option_id: t.text('option_id').notNull().references(() => productOptions.id, {onDelete: 'cascade'}),
    option_value_id: t.text('option_value_id').notNull().references(() => optionValues.id, {onDelete: 'cascade'}),
}), (table) => [
    primaryKey({columns: [table.variant_id, table.option_id]}),
]);

/* CATEGORY IMAGES */
export const categoryImages = sqliteTable('category_images', (t) => ({
    id: t.text('id').primaryKey().default(uuidV4),
    category_id: t.text('category_id').notNull().references(() => categories.id, {onDelete: 'cascade'}),

    // URLs por tamaño
    url_small: t.text('url_small'),
    url_medium: t.text('url_medium'),
    url_large: t.text('url_large'),
    url_original: t.text('url_original').notNull().default(''),

    alt: t.text('alt'),
    position: t.integer('position').default(0),

    created_at: t.integer('created_at', {mode: 'timestamp_ms'})
        .$defaultFn(() => new Date()).notNull(),
}));
