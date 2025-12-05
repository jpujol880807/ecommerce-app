CREATE TABLE `category_images` (
	`id` text PRIMARY KEY DEFAULT (
                       lower ( hex(randomblob(4)) || '-' ||
                       hex(randomblob(2)) || '-' ||
                       '4' || substr(hex(randomblob(2)), 2) || '-' ||
                       substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' ||
                       hex(randomblob(6))
                       )) NOT NULL,
	`category_id` text NOT NULL,
	`url_small` text,
	`url_medium` text,
	`url_large` text,
	`url_original` text DEFAULT '' NOT NULL,
	`alt` text,
	`position` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
