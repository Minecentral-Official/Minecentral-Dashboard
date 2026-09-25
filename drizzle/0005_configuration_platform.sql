CREATE TABLE "config_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"entry_id" uuid,
	"project_id" uuid,
	"kind" text NOT NULL,
	"path" text NOT NULL,
	"format" text DEFAULT 'yaml' NOT NULL,
	"profile" text DEFAULT 'syntax' NOT NULL,
	"current_revision" integer DEFAULT 1 NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "config_file_kind_valid" CHECK ("config_file"."kind" IN ('server','plugin','unlinked')),
	CONSTRAINT "config_file_format_valid" CHECK ("config_file"."format" = 'yaml'),
	CONSTRAINT "config_file_profile_valid" CHECK ("config_file"."profile" IN ('syntax','bukkit-basic')),
	CONSTRAINT "config_file_source_valid" CHECK ("config_file"."source" IN ('upload','paste')),
	CONSTRAINT "config_file_revision_valid" CHECK ("config_file"."current_revision" > 0),
	CONSTRAINT "config_file_link_valid" CHECK (("config_file"."kind" = 'plugin' AND "config_file"."project_id" IS NOT NULL) OR ("config_file"."kind" IN ('server','unlinked') AND "config_file"."entry_id" IS NULL AND "config_file"."project_id" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "config_revision" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"config_id" uuid NOT NULL,
	"number" integer NOT NULL,
	"content" text NOT NULL,
	"content_hash" text NOT NULL,
	"author_id" text,
	"source" text NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"restored_from" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "config_revision_number_valid" CHECK ("config_revision"."number" > 0),
	CONSTRAINT "config_revision_size_valid" CHECK (octet_length("config_revision"."content") BETWEEN 1 AND 131072),
	CONSTRAINT "config_revision_source_valid" CHECK ("config_revision"."source" IN ('upload','paste','edit','restore'))
);
--> statement-breakpoint
ALTER TABLE "config_file" ADD CONSTRAINT "config_file_workspace_id_server_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."server_workspace"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "config_file" ADD CONSTRAINT "config_file_entry_id_stack_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."stack_entry"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "config_file" ADD CONSTRAINT "config_file_project_id_catalog_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."catalog_project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "config_revision" ADD CONSTRAINT "config_revision_config_id_config_file_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."config_file"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "config_revision" ADD CONSTRAINT "config_revision_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "config_file_workspace_path_unique" ON "config_file" USING btree ("workspace_id","path");--> statement-breakpoint
CREATE INDEX "config_file_entry_idx" ON "config_file" USING btree ("entry_id");--> statement-breakpoint
CREATE UNIQUE INDEX "config_revision_number_unique" ON "config_revision" USING btree ("config_id","number");--> statement-breakpoint
-- The current revision must belong to this file. Deferred for atomic creation
-- and append/prune transactions; the parent file also disappears on deletion.
ALTER TABLE config_file ADD CONSTRAINT config_current_revision_fk
FOREIGN KEY (id, current_revision) REFERENCES config_revision(config_id, number)
DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
CREATE FUNCTION protect_config_revision() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.config_id IS DISTINCT FROM OLD.config_id OR NEW.number IS DISTINCT FROM OLD.number
    OR NEW.content IS DISTINCT FROM OLD.content OR NEW.content_hash IS DISTINCT FROM OLD.content_hash
    OR NEW.source IS DISTINCT FROM OLD.source OR NEW.message IS DISTINCT FROM OLD.message
    OR NEW.restored_from IS DISTINCT FROM OLD.restored_from OR NEW.created_at IS DISTINCT FROM OLD.created_at
    OR NEW.id IS DISTINCT FROM OLD.id OR (NEW.author_id IS DISTINCT FROM OLD.author_id AND NEW.author_id IS NOT NULL)
  THEN RAISE EXCEPTION 'Configuration revisions are immutable' USING ERRCODE = '23514'; END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER config_revision_immutable BEFORE UPDATE ON config_revision
FOR EACH ROW EXECUTE FUNCTION protect_config_revision();
