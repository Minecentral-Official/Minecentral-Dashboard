'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

import { resource } from '@/features/resource/schemas/resource.table';
import { resourceCreateZod } from '@/features/resource/schemas/zod/resource.zod';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';

export default async function resourceCreate(
  // prevState: unknown
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();
  const submission = parseWithZod(formData, {
    schema: resourceCreateZod,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { description, subtitle, title, versionSupport } = submission.value;

  const newResource = await db.transaction(async (tx) => {
    //Insert new ticket info
    const newTicket = await tx
      .insert(resource)
      .values({
        title,
        userId: user.id,
        description,
        subtitle,
        versionSupport,
      })
      .returning();
    //Insert first message as Ticket Message
    // await tx
    //   .insert(ticketMessage)
    //   .values({ message, ticketId: newTicket[0].id, userId: user.id });
    return newTicket;
  });

  await activityAddAction(
    user.id,
    ACTIVITY.NEW_RESOURCE,
    `${newResource[0].id}`,
  );

  // revalidateTag(`tickets-user-${user.id}`);

  redirect(
    '/dashboard/resources?toast-success=true&toast-message=Resource%20successfully%20created&toast-id=create-ticket',
  );
}
