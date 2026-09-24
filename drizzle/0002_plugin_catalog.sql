CREATE TABLE "catalog_audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" text,
	"project_id" uuid,
	"event" text NOT NULL,
	"detail" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"locator" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "catalog_job_provider_check" CHECK ("catalog_job"."provider" IN ('modrinth','hangar')),
	CONSTRAINT "catalog_job_status_check" CHECK ("catalog_job"."status" IN ('queued','running','done','failed'))
);
--> statement-breakpoint
CREATE TABLE "catalog_project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"curated" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"merged_into_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "catalog_project_status_check" CHECK ("catalog_project"."status" IN ('published','hidden','merged'))
);
--> statement-breakpoint
CREATE TABLE "catalog_source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"external_id" text NOT NULL,
	"locator" text NOT NULL,
	"url" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"status" text NOT NULL,
	"last_synced_at" timestamp with time zone,
	"last_attempt_at" timestamp with time zone,
	"next_sync_at" timestamp with time zone DEFAULT now() NOT NULL,
	"failures" integer DEFAULT 0 NOT NULL,
	"error" text,
	CONSTRAINT "catalog_source_provider_check" CHECK ("catalog_source"."provider" IN ('modrinth','hangar','manual')),
	CONSTRAINT "catalog_source_status_check" CHECK ("catalog_source"."status" IN ('ok','pending','error','unavailable','manual'))
);
--> statement-breakpoint
CREATE TABLE "catalog_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"external_id" text NOT NULL,
	"name" text NOT NULL,
	"channel" text NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"url" text NOT NULL,
	"support" jsonb NOT NULL,
	"dependencies" jsonb NOT NULL,
	"available" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "catalog_version_available_check" CHECK ("catalog_version"."available" IN (0,1))
);
--> statement-breakpoint
ALTER TABLE "catalog_audit" ADD CONSTRAINT "catalog_audit_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_audit" ADD CONSTRAINT "catalog_audit_project_id_catalog_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."catalog_project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_project" ADD CONSTRAINT "catalog_project_merged_into_id_catalog_project_id_fk" FOREIGN KEY ("merged_into_id") REFERENCES "public"."catalog_project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_source" ADD CONSTRAINT "catalog_source_project_id_catalog_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."catalog_project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_version" ADD CONSTRAINT "catalog_version_source_id_catalog_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."catalog_source"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "catalog_audit_project_idx" ON "catalog_audit" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "catalog_job_due_idx" ON "catalog_job" USING btree ("status","next_attempt_at");--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_job_active_unique" ON "catalog_job" USING btree ("provider","locator") WHERE "catalog_job"."status" IN ('queued','running');--> statement-breakpoint
CREATE INDEX "catalog_project_name_idx" ON "catalog_project" USING btree ("name","id");--> statement-breakpoint
CREATE INDEX "catalog_project_updated_idx" ON "catalog_project" USING btree ("updated_at","id");--> statement-breakpoint
CREATE INDEX "catalog_project_search_idx" ON "catalog_project" USING gin (to_tsvector('simple', "name" || ' ' || "description"));--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_source_identity_unique" ON "catalog_source" USING btree ("provider","external_id");--> statement-breakpoint
CREATE INDEX "catalog_source_project_idx" ON "catalog_source" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "catalog_source_due_idx" ON "catalog_source" USING btree ("next_sync_at");--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_version_identity_unique" ON "catalog_version" USING btree ("source_id","external_id");--> statement-breakpoint
CREATE INDEX "catalog_version_source_date_idx" ON "catalog_version" USING btree ("source_id","published_at");