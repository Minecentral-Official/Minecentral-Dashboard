import 'server-only';

import { revalidateTag } from 'next/cache';

// Immediate expiry preserves legacy read-after-write behavior, including callbacks.
export function invalidateTag(tag: string) {
  revalidateTag(tag, { expire: 0 });
}
