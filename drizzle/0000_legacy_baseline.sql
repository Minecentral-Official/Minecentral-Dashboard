CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	"impersonatedBy" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"role" text DEFAULT 'user',
	"banned" boolean,
	"banReason" text,
	"banExpires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "ticketMessage" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ticketMessage_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"ticketId" integer NOT NULL,
	"userId" text NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ticket_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "liked_resources" (
	"user_id" text NOT NULL,
	"resource_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "liked_resources_user_id_resource_id_pk" PRIMARY KEY("user_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE "resourceTableReleases" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "resourceTableReleases_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 10000 CACHE 1),
	"pluginId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"compatibleVersions" text[] NOT NULL,
	"loaders" text[],
	"fileUrl" text NOT NULL,
	"version" text NOT NULL,
	"downloads" integer DEFAULT 0,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resourceTable" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"categories" text[],
	"iconUrl" text,
	"languages" text[],
	"status" text DEFAULT 'draft' NOT NULL,
	"linkIssues" text,
	"linkSource" text,
	"linkSupport" text,
	"linkDiscord" text,
	"linkDonation" text,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resourceTable_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "serverTable" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"ip" text NOT NULL,
	"port" integer NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"description" text,
	"categories" text[],
	"platforms" text[],
	"iconUrl" text,
	"languages" text[],
	"linkDiscord" text,
	"versions" text[],
	"editions" text[],
	"region" text,
	"accessType" text,
	"websiteUrl" text,
	"storeUrl" text,
	"mapUrl" text,
	"modpackUrl" text,
	"voteCooldownHours" integer DEFAULT 24 NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "serverVote" (
	"id" text PRIMARY KEY NOT NULL,
	"serverId" text NOT NULL,
	"anonymousVoterId" text NOT NULL,
	"ipHash" text,
	"userAgentHash" text,
	"userId" text,
	"minecraftUsername" text,
	"votifierEnabledAtVote" boolean DEFAULT false NOT NULL,
	"votifierDeliveryStatus" text DEFAULT 'not_configured' NOT NULL,
	"votifierDeliveryError" text,
	"voteTime" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "serverVotifierTable" (
	"serverId" text PRIMARY KEY NOT NULL,
	"ip" text NOT NULL,
	"port" integer,
	"publicKey" text,
	"enabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"userId" text NOT NULL,
	"hostingCustomerId" text,
	"resourcesCustomerId" text,
	"worldsCustomerId" text
);
--> statement-breakpoint
CREATE TABLE "recentActivity" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recentActivity_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" text NOT NULL,
	"action" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticketMessage" ADD CONSTRAINT "ticketMessage_ticketId_ticket_id_fk" FOREIGN KEY ("ticketId") REFERENCES "public"."ticket"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticketMessage" ADD CONSTRAINT "ticketMessage_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "liked_resources" ADD CONSTRAINT "liked_resources_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "liked_resources" ADD CONSTRAINT "liked_resources_resource_id_resourceTable_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resourceTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resourceTableReleases" ADD CONSTRAINT "resourceTableReleases_pluginId_resourceTable_id_fk" FOREIGN KEY ("pluginId") REFERENCES "public"."resourceTable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resourceTable" ADD CONSTRAINT "resourceTable_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serverTable" ADD CONSTRAINT "serverTable_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serverVote" ADD CONSTRAINT "serverVote_serverId_serverTable_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."serverTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serverVote" ADD CONSTRAINT "serverVote_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serverVotifierTable" ADD CONSTRAINT "serverVotifierTable_serverId_serverTable_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."serverTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recentActivity" ADD CONSTRAINT "recentActivity_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "server_slug_unique" ON "serverTable" USING btree (lower("slug"));--> statement-breakpoint
CREATE UNIQUE INDEX "server_address_unique" ON "serverTable" USING btree (lower("ip"),"port");