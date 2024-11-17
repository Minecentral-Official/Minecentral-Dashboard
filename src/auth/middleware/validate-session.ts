import { auth } from "@/auth/lib/auth";
import { createMiddleware } from "next-safe-action";
import { headers } from "next/headers";

export const validateSession = createMiddleware().define(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Session is not valid!");
  }
  return next({ ctx: { ...session } });
});
