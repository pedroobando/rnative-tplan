CREATE TABLE `exercise_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`has_break` integer DEFAULT false NOT NULL,
	`display_template` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_types_name_unique` ON `exercise_types` (`name`);--> statement-breakpoint
CREATE TABLE `weeks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`note` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_day_id` text NOT NULL,
	`exercise_type_id` text NOT NULL,
	`step_order` integer NOT NULL,
	`repetitions` integer DEFAULT 1 NOT NULL,
	`work_value` real,
	`work_unit` text,
	`target_pace_or_time` text,
	`rest_value` real,
	`rest_unit` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`workout_day_id`) REFERENCES `workout_days`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_type_id`) REFERENCES `exercise_types`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `workout_days` (
	`id` text PRIMARY KEY NOT NULL,
	`week_id` text NOT NULL,
	`day_of_week` integer NOT NULL,
	`workout_date` text,
	`day_type` text DEFAULT 'training' NOT NULL,
	`title` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`week_id`) REFERENCES `weeks`(`id`) ON UPDATE no action ON DELETE cascade
);
