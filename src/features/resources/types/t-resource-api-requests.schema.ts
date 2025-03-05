import { z } from "zod";

const tPluginCategorySchema = z.any();

const tPluginVersionSchema = z.any();

const tResourceTypeSchema = z.any();

export const tResourceFilterRequestSchema = z.object({
    query: z.string().optional(),
    page: z.number(),
    limit: z.number(),
    categories: z.array(tPluginCategorySchema).optional(),
    versions: z.array(tPluginVersionSchema).optional(),
    type: tResourceTypeSchema
});

export const tResourceSimpleRequestSchema = z.object({
    page: z.number(),
    limit: z.number(),
    type: tResourceTypeSchema.optional()
});

// inferred types:
export type T_ResourceFilterRequest = z.infer<typeof tResourceFilterRequestSchema>;

export type T_ResourceSimpleRequest = z.infer<typeof tResourceSimpleRequestSchema>;