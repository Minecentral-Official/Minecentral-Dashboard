CREATE TABLE "compatibility_cache" (
	"workspace_id" uuid PRIMARY KEY NOT NULL,
	"fingerprint" text NOT NULL,
	"report" jsonb,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "compatibility_community_report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"version_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"minecraft_version" text NOT NULL,
	"result" text NOT NULL,
	"detail" text NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consented_at" timestamp with time zone NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reviewer_id" text,
	"review_reason" text,
	"reviewed_at" timestamp with time zone,
	CONSTRAINT "compatibility_community_result_valid" CHECK ("compatibility_community_report"."result" IN ('compatible','incompatible')),
	CONSTRAINT "compatibility_community_status_valid" CHECK ("compatibility_community_report"."status" IN ('pending','approved','rejected','withdrawn'))
);
--> statement-breakpoint
CREATE TABLE "compatibility_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"minecraft_version" text NOT NULL,
	"kind" text NOT NULL,
	"result" text NOT NULL,
	"confidence" text NOT NULL,
	"provenance" text NOT NULL,
	"url" text NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_id" text NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "compatibility_evidence_result_valid" CHECK ("compatibility_evidence"."result" IN ('compatible','incompatible','unknown')),
	CONSTRAINT "compatibility_evidence_kind_valid" CHECK ("compatibility_evidence"."kind" IN ('developer-declared','source-metadata','community-tested','automated-test','manual-curation')),
	CONSTRAINT "compatibility_evidence_dates_valid" CHECK ("compatibility_evidence"."expires_at" > "compatibility_evidence"."observed_at")
);
--> statement-breakpoint
CREATE TABLE "compatibility_relationship" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_project_id" uuid NOT NULL,
	"to_project_id" uuid NOT NULL,
	"from_version_id" uuid,
	"to_version_id" uuid,
	"kind" text NOT NULL,
	"version_range" text,
	"platform" text,
	"minecraft_version" text,
	"provenance" text NOT NULL,
	"url" text NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"actor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "compatibility_relationship_kind_valid" CHECK ("compatibility_relationship"."kind" IN ('required','optional','conflict','overlap')),
	CONSTRAINT "compatibility_relationship_dates_valid" CHECK ("compatibility_relationship"."expires_at" > "compatibility_relationship"."observed_at")
);
--> statement-breakpoint
CREATE TABLE "compatibility_revision" (
	"scope" text PRIMARY KEY NOT NULL,
	"revision" bigint DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalog_version" ADD COLUMN "version_number" text;--> statement-breakpoint
ALTER TABLE "compatibility_cache" ADD CONSTRAINT "compatibility_cache_workspace_id_server_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."server_workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_community_report" ADD CONSTRAINT "compatibility_community_report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_community_report" ADD CONSTRAINT "compatibility_community_report_version_id_catalog_version_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."catalog_version"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_community_report" ADD CONSTRAINT "compatibility_community_report_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_evidence" ADD CONSTRAINT "compatibility_evidence_version_id_catalog_version_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."catalog_version"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_evidence" ADD CONSTRAINT "compatibility_evidence_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_relationship" ADD CONSTRAINT "compatibility_relationship_from_project_id_catalog_project_id_fk" FOREIGN KEY ("from_project_id") REFERENCES "public"."catalog_project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_relationship" ADD CONSTRAINT "compatibility_relationship_to_project_id_catalog_project_id_fk" FOREIGN KEY ("to_project_id") REFERENCES "public"."catalog_project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_relationship" ADD CONSTRAINT "compatibility_relationship_from_version_id_catalog_version_id_fk" FOREIGN KEY ("from_version_id") REFERENCES "public"."catalog_version"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_relationship" ADD CONSTRAINT "compatibility_relationship_to_version_id_catalog_version_id_fk" FOREIGN KEY ("to_version_id") REFERENCES "public"."catalog_version"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_relationship" ADD CONSTRAINT "compatibility_relationship_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "compatibility_community_report_unique" ON "compatibility_community_report" USING btree ("user_id","version_id","platform","minecraft_version");--> statement-breakpoint
CREATE INDEX "compatibility_community_review_idx" ON "compatibility_community_report" USING btree ("status","observed_at");--> statement-breakpoint
CREATE INDEX "compatibility_evidence_target_idx" ON "compatibility_evidence" USING btree ("version_id","platform","minecraft_version");--> statement-breakpoint
CREATE INDEX "compatibility_relationship_from_idx" ON "compatibility_relationship" USING btree ("from_project_id");--> statement-breakpoint
-- Derived cache invalidation is database-owned, including direct admin/worker writes.
CREATE FUNCTION compatibility_catalog_changed() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO compatibility_revision(scope, revision) VALUES ('catalog', 1)
  ON CONFLICT(scope) DO UPDATE SET revision = compatibility_revision.revision + 1;
  RETURN NULL;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION compatibility_workspace_changed() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE affected uuid;
BEGIN
  IF TG_TABLE_NAME = 'stack_entry' THEN
    affected := CASE WHEN TG_OP = 'DELETE' THEN OLD.workspace_id ELSE NEW.workspace_id END;
  ELSE
    affected := CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END;
    IF TG_OP = 'DELETE' THEN
      DELETE FROM compatibility_revision WHERE scope = 'workspace:' || affected::text;
      RETURN OLD;
    END IF;
  END IF;
  INSERT INTO compatibility_revision(scope, revision) VALUES ('workspace:' || affected::text, 1)
  ON CONFLICT(scope) DO UPDATE SET revision = compatibility_revision.revision + 1;
  RETURN NULL;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER compatibility_catalog_project_changed AFTER INSERT OR UPDATE OR DELETE ON catalog_project FOR EACH STATEMENT EXECUTE FUNCTION compatibility_catalog_changed();
--> statement-breakpoint
CREATE TRIGGER compatibility_catalog_source_changed AFTER INSERT OR UPDATE OR DELETE ON catalog_source FOR EACH STATEMENT EXECUTE FUNCTION compatibility_catalog_changed();
--> statement-breakpoint
CREATE TRIGGER compatibility_catalog_version_changed AFTER INSERT OR UPDATE OR DELETE ON catalog_version FOR EACH STATEMENT EXECUTE FUNCTION compatibility_catalog_changed();
--> statement-breakpoint
CREATE TRIGGER compatibility_evidence_changed AFTER INSERT OR UPDATE OR DELETE ON compatibility_evidence FOR EACH STATEMENT EXECUTE FUNCTION compatibility_catalog_changed();
--> statement-breakpoint
CREATE TRIGGER compatibility_relationship_changed AFTER INSERT OR UPDATE OR DELETE ON compatibility_relationship FOR EACH STATEMENT EXECUTE FUNCTION compatibility_catalog_changed();
--> statement-breakpoint
CREATE TRIGGER compatibility_community_changed AFTER INSERT OR UPDATE OR DELETE ON compatibility_community_report FOR EACH STATEMENT EXECUTE FUNCTION compatibility_catalog_changed();
--> statement-breakpoint
CREATE TRIGGER compatibility_account_trust_changed AFTER UPDATE OF banned, "createdAt" ON "user" FOR EACH STATEMENT EXECUTE FUNCTION compatibility_catalog_changed();
--> statement-breakpoint
CREATE TRIGGER compatibility_stack_changed AFTER INSERT OR UPDATE OR DELETE ON stack_entry FOR EACH ROW EXECUTE FUNCTION compatibility_workspace_changed();
--> statement-breakpoint
CREATE TRIGGER compatibility_runtime_changed AFTER UPDATE OF platform, minecraft_version ON server_workspace FOR EACH ROW EXECUTE FUNCTION compatibility_workspace_changed();
--> statement-breakpoint
CREATE TRIGGER compatibility_workspace_deleted AFTER DELETE ON server_workspace FOR EACH ROW EXECUTE FUNCTION compatibility_workspace_changed();
