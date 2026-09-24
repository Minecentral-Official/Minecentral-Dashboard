CREATE TABLE "workspace_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"actor_id" text,
	"event" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_member" (
	"workspace_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_member_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id"),
	CONSTRAINT "workspace_member_role_valid" CHECK ("workspace_member"."role" IN ('admin', 'editor', 'viewer'))
);
--> statement-breakpoint
CREATE TABLE "server_workspace" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"platform" text DEFAULT 'paper' NOT NULL,
	"minecraft_version" text NOT NULL,
	"java_version" integer,
	"status" text DEFAULT 'planning' NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"connection_host" text,
	"connection_port" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone,
	CONSTRAINT "server_workspace_name_length" CHECK (length(trim("server_workspace"."name")) BETWEEN 1 AND 80),
	CONSTRAINT "server_workspace_slug_format" CHECK ("server_workspace"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	CONSTRAINT "server_workspace_status_valid" CHECK ("server_workspace"."status" IN ('planning', 'active', 'paused')),
	CONSTRAINT "server_workspace_visibility_valid" CHECK ("server_workspace"."visibility" IN ('private', 'team')),
	CONSTRAINT "server_workspace_platform_valid" CHECK ("server_workspace"."platform" = 'paper'),
	CONSTRAINT "server_workspace_version_valid" CHECK ("server_workspace"."minecraft_version" IN ('1.20.6', '1.21.4', '1.21.11')),
	CONSTRAINT "server_workspace_java_valid" CHECK ("server_workspace"."java_version" IS NULL OR "server_workspace"."java_version" = 21),
	CONSTRAINT "server_workspace_port_valid" CHECK ("server_workspace"."connection_port" IS NULL OR ("server_workspace"."connection_host" IS NOT NULL AND "server_workspace"."connection_port" BETWEEN 1 AND 65535))
);
--> statement-breakpoint
ALTER TABLE "workspace_activity" ADD CONSTRAINT "workspace_activity_workspace_id_server_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."server_workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_activity" ADD CONSTRAINT "workspace_activity_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_workspace_id_server_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."server_workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_workspace" ADD CONSTRAINT "server_workspace_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workspace_activity_recent_idx" ON "workspace_activity" USING btree ("workspace_id","created_at");--> statement-breakpoint
CREATE INDEX "workspace_member_user_idx" ON "workspace_member" USING btree ("user_id","workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "server_workspace_owner_slug_unique" ON "server_workspace" USING btree ("owner_id","slug");--> statement-breakpoint
CREATE INDEX "server_workspace_owner_activity_idx" ON "server_workspace" USING btree ("owner_id","archived_at","updated_at");