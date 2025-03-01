import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

// Define a type for schemas that must have an id field
type SchemaWithId = z.ZodObject<{
  [key: string]: z.ZodTypeAny;
}>;

export default async function parseFormWithSchema<T extends SchemaWithId>(
  formData: FormData,
  schema: T,
) {
  return parseWithZod(formData, {
    schema,
  });
}
