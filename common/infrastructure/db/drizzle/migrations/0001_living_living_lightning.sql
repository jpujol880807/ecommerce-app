CREATE TABLE `categories` (
	`id` text PRIMARY KEY DEFAULT (
                       lower ( hex(randomblob(4)) || '-' ||
                       hex(randomblob(2)) || '-' ||
                       '4' || substr(hex(randomblob(2)), 2) || '-' ||
                       substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                       hex(randomblob(6))
                       )) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`meta` text DEFAULT '{}',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `category_closure` (
	`ancestor` text NOT NULL,
	`descendant` text NOT NULL,
	`depth` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`ancestor`, `descendant`),
	FOREIGN KEY (`ancestor`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`descendant`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY DEFAULT (
                       lower ( hex(randomblob(4)) || '-' ||
                       hex(randomblob(2)) || '-' ||
                       '4' || substr(hex(randomblob(2)), 2) || '-' ||
                       substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                       hex(randomblob(6))
                       )) NOT NULL,
	`product_id` text,
	`variant_id` text,
	`url` text NOT NULL,
	`alt` text,
	`position` integer DEFAULT 0,
	`metadata` text DEFAULT '{}',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `option_values` (
	`id` text PRIMARY KEY DEFAULT (
                       lower ( hex(randomblob(4)) || '-' ||
                       hex(randomblob(2)) || '-' ||
                       '4' || substr(hex(randomblob(2)), 2) || '-' ||
                       substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                       hex(randomblob(6))
                       )) NOT NULL,
	`option_id` text NOT NULL,
	`value` text NOT NULL,
	`meta` text DEFAULT '{}',
	`position` integer DEFAULT 0,
	FOREIGN KEY (`option_id`) REFERENCES `product_options`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_option_value` ON `option_values` (`option_id`,`value`);--> statement-breakpoint
CREATE TABLE `product_categories` (
	`product_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`product_id`, `category_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_options` (
	`id` text PRIMARY KEY DEFAULT (
                       lower ( hex(randomblob(4)) || '-' ||
                       hex(randomblob(2)) || '-' ||
                       '4' || substr(hex(randomblob(2)), 2) || '-' ||
                       substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                       hex(randomblob(6))
                       )) NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`position` integer DEFAULT 0,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_product_option` ON `product_options` (`product_id`,`name`);--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY DEFAULT (
                       lower ( hex(randomblob(4)) || '-' ||
                       hex(randomblob(2)) || '-' ||
                       '4' || substr(hex(randomblob(2)), 2) || '-' ||
                       substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                       hex(randomblob(6))
                       )) NOT NULL,
	`product_id` text NOT NULL,
	`sku` text,
	`price_cents` integer DEFAULT 0 NOT NULL,
	`compare_at_price_cents` integer,
	`inventory_count` integer DEFAULT 0,
	`weight_grams` integer,
	`barcode` text,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_variant_sku` ON `product_variants` (`product_id`,`sku`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY DEFAULT (
                       lower ( hex(randomblob(4)) || '-' ||
                       hex(randomblob(2)) || '-' ||
                       '4' || substr(hex(randomblob(2)), 2) || '-' ||
                       substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                       hex(randomblob(6))
                       )) NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`metadata` text DEFAULT '{}',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `variant_option_values` (
	`variant_id` text NOT NULL,
	`option_id` text NOT NULL,
	`option_value_id` text NOT NULL,
	PRIMARY KEY(`variant_id`, `option_id`),
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`option_id`) REFERENCES `product_options`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`option_value_id`) REFERENCES `option_values`(`id`) ON UPDATE no action ON DELETE cascade
);
