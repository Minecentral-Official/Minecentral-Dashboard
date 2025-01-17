import { createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { ticket } from '@/lib/db/schema';
import getParseStringToIntegerSchema from '@/lib/zod/parse-string-to-integer.zod';

export const updateTicketStatusZod = createUpdateSchema(ticket, {
  status: (schema) =>
    schema.refine((value) => value, {
      message: 'status is required here',
    }),
})
  .pick({
    status: true,
  })
  .merge(
    z.object({
      id: getParseStringToIntegerSchema(),
    }),
  );
