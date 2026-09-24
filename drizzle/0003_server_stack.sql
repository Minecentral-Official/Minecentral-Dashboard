CREATE TABLE "stack_change" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"entry_id" uuid NOT NULL,
	"event" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "stack_entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"version_id" uuid,
	"manual_version" text,
	"version_source" text DEFAULT 'unknown' NOT NULL,
	"added_via" text NOT NULL,
	"alias" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"version_changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stack_entry_version_consistent" CHECK (("stack_entry"."version_source" = 'unknown' AND "stack_entry"."version_id" IS NULL AND "stack_entry"."manual_version" IS NULL) OR ("stack_entry"."version_source" = 'manual' AND "stack_entry"."version_id" IS NULL AND "stack_entry"."manual_version" IS NOT NULL AND length(trim("stack_entry"."manual_version")) BETWEEN 1 AND 150) OR ("stack_entry"."version_source" = 'catalog' AND "stack_entry"."version_id" IS NOT NULL AND "stack_entry"."manual_version" IS NULL)),
	CONSTRAINT "stack_entry_added_via_valid" CHECK ("stack_entry"."added_via" IN ('catalog','import'))
);
--> statement-breakpoint
ALTER TABLE "stack_change" ADD CONSTRAINT "stack_change_workspace_id_server_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."server_workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stack_entry" ADD CONSTRAINT "stack_entry_workspace_id_server_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."server_workspace"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stack_entry" ADD CONSTRAINT "stack_entry_project_id_catalog_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."catalog_project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stack_entry" ADD CONSTRAINT "stack_entry_version_id_catalog_version_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."catalog_version"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stack_change_pending_idx" ON "stack_change" USING btree ("processed_at","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "stack_entry_workspace_project_unique" ON "stack_entry" USING btree ("workspace_id","project_id");--> statement-breakpoint
CREATE INDEX "stack_entry_project_idx" ON "stack_entry" USING btree ("project_id");