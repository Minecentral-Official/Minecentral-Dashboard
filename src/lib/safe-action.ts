import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error('Action error:', e.message);

    return e.message;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
});
