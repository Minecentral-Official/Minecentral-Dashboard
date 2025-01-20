// import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

// export const clientEnv = createEnv({
//   client: {
//     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
//   },
//   runtimeEnv: {
//     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
//   },
// });

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_FRONTEND_URL: z.string(),
  },
  runtimeEnv: {
    // eslint-disable-next-line n/no-process-env
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    // eslint-disable-next-line n/no-process-env
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  },
});
