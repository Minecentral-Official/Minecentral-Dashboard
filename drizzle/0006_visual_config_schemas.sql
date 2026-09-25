CREATE TABLE "visual_schema_release" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"release" integer NOT NULL,
	"project_id" uuid,
	"definition" jsonb NOT NULL,
	"retired" boolean DEFAULT false NOT NULL,
	"actor_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "visual_schema_release_positive" CHECK ("visual_schema_release"."release">0),
	CONSTRAINT "visual_schema_definition_size" CHECK (octet_length("visual_schema_release"."definition"::text)<=65536)
);
--> statement-breakpoint
ALTER TABLE "visual_schema_release" ADD CONSTRAINT "visual_schema_release_project_id_catalog_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."catalog_project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visual_schema_release" ADD CONSTRAINT "visual_schema_release_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "visual_schema_key_release_unique" ON "visual_schema_release" USING btree ("key","release");--> statement-breakpoint
CREATE INDEX "visual_schema_project_idx" ON "visual_schema_release" USING btree ("project_id");--> statement-breakpoint
-- Published definitions are append-only. Retirement and canonical project merges
-- can change routing, but cannot rewrite a previously reviewed schema release.
CREATE FUNCTION protect_visual_schema_release() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id OR NEW.key IS DISTINCT FROM OLD.key
    OR NEW.release IS DISTINCT FROM OLD.release OR NEW.definition IS DISTINCT FROM OLD.definition
    OR NEW.created_at IS DISTINCT FROM OLD.created_at
    OR (NEW.actor_id IS DISTINCT FROM OLD.actor_id AND NEW.actor_id IS NOT NULL)
  THEN RAISE EXCEPTION 'Published visual schemas are immutable' USING ERRCODE = '23514'; END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER visual_schema_release_immutable BEFORE UPDATE ON visual_schema_release
FOR EACH ROW EXECUTE FUNCTION protect_visual_schema_release();
