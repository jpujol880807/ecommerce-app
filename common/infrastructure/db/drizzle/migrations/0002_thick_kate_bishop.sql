ALTER TABLE `media` RENAME TO `product_images`;--> statement-breakpoint
CREATE TABLE `brands` (
                          `id` text PRIMARY KEY DEFAULT (
                              lower ( hex(randomblob(4)) || '-' ||
                                      hex(randomblob(2)) || '-' ||
                                      '4' || substr(hex(randomblob(2)), 2) || '-' ||
                                      substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                                      hex(randomblob(6))
                              )) NOT NULL,
                          `name` text NOT NULL,
                          `slug` text NOT NULL,
                          `created_at` integer NOT NULL,
                          `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brands_name_unique` ON `brands` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `brands_slug_unique` ON `brands` (`slug`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_product_images` (
                                        `id` text PRIMARY KEY DEFAULT (
                                            lower ( hex(randomblob(4)) || '-' ||
                                                    hex(randomblob(2)) || '-' ||
                                                    '4' || substr(hex(randomblob(2)), 2) || '-' ||
                                                    substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                                                    hex(randomblob(6))
                                            )) NOT NULL,
                                        `product_id` text NOT NULL,
                                        `variant_id` text,
                                        `url_small` text,
                                        `url_medium` text,
                                        `url_large` text,
                                        `url_original` text DEFAULT '' NOT NULL,
                                        `cloudfront_url` text,
                                        `alt` text,
                                        `position` integer DEFAULT 0,
                                        `created_at` integer NOT NULL,
                                        FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
                                        FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_product_images`("id", "product_id", "variant_id", "url_original", "alt", "position", "created_at")
SELECT "id", "product_id", "variant_id", "url", "alt", "position", "created_at" FROM `product_images`;--> statement-breakpoint
DROP TABLE `product_images`;--> statement-breakpoint
ALTER TABLE `__new_product_images` RENAME TO `product_images`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `unique_product_option`;--> statement-breakpoint
ALTER TABLE `product_options` ADD `code` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `product_options` ADD `display_type` text DEFAULT 'select';--> statement-breakpoint
ALTER TABLE `product_options` ADD `action` text DEFAULT 'scrap';--> statement-breakpoint
CREATE UNIQUE INDEX `unique_product_option` ON `product_options` (`product_id`,`code`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_product_variants` (
                                          `id` text PRIMARY KEY DEFAULT (
                                              lower ( hex(randomblob(4)) || '-' ||
                                                      hex(randomblob(2)) || '-' ||
                                                      '4' || substr(hex(randomblob(2)), 2) || '-' ||
                                                      substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                                                      hex(randomblob(6))
                                              )) NOT NULL,
                                          `product_id` text NOT NULL,
                                          `sku` text NOT NULL,
                                          `price_cents` integer,
                                          `compare_at_price_cents` integer,
                                          `inventory_count` integer DEFAULT 0,
                                          `is_available` integer DEFAULT 1 NOT NULL,
                                          `is_selected` integer DEFAULT 0 NOT NULL,
                                          `weight_grams` integer,
                                          `barcode` text,
                                          `fulfilled_by` text,
                                          `sold_by` text,
                                          `vendor_delivery_day` text,
                                          `is_active` integer DEFAULT 1 NOT NULL,
                                          `created_at` integer NOT NULL,
                                          `updated_at` integer NOT NULL,
                                          FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_product_variants`("id", "product_id", "sku", "inventory_count", "is_active", "created_at", "updated_at")
SELECT "id", "product_id", "sku", COALESCE("inventory_count", 0), COALESCE("is_active", 1), "created_at", "updated_at" FROM `product_variants`;--> statement-breakpoint
DROP TABLE `product_variants`;--> statement-breakpoint
ALTER TABLE `__new_product_variants` RENAME TO `product_variants`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_variant_sku` ON `product_variants` (`sku`);--> statement-breakpoint
ALTER TABLE `option_values` ADD `label` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `option_values` ADD `option_code` text;--> statement-breakpoint
ALTER TABLE `products` ADD `sku` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `brand_id` text REFERENCES brands(id) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `short_description` text;--> statement-breakpoint
ALTER TABLE `products` ADD `price_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `list_price_cents` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `products` ADD `shipping_cents` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `products` ADD `discount_percentage` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `products` ADD `stock_count` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `products` ADD `is_in_stock` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `is_collection` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `is_digital` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `status` text DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `weight_kg` real;--> statement-breakpoint
ALTER TABLE `products` ADD `dimensions` text;--> statement-breakpoint
ALTER TABLE `products` ADD `isbn` text;--> statement-breakpoint
ALTER TABLE `products` ADD `ean` text;--> statement-breakpoint
ALTER TABLE `products` ADD `parent_asin` text;--> statement-breakpoint
ALTER TABLE `products` ADD `product_url` text;--> statement-breakpoint
ALTER TABLE `products` ADD `vendor_url` text;--> statement-breakpoint
ALTER TABLE `products` ADD `reviews_url` text;--> statement-breakpoint
ALTER TABLE `products` ADD `fulfilled_by` text;--> statement-breakpoint
ALTER TABLE `products` ADD `sold_by` text;--> statement-breakpoint
ALTER TABLE `products` ADD `merchant_returns` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `products` ADD `rating` real;--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);
