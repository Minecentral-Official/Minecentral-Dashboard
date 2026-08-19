'use server';

import serverVotifierUpsert from '@/features/serverlist/mutations/upsert-votifier.server';
import userCanEditServer from '@/features/serverlist/queries/user-can-edit-server.boolean';
import { S_ServerUpdateVotifier } from '@/features/serverlist/schemas/zod/s-server-update-votifier.zod';
import parseFormWithSchema from '@/lib/utils/parse-form-with-schema.util';

export default async function serverUpdateVotifierAction(
  _: unknown,
  formData: FormData,
) {
  const parsedForm = await parseFormWithSchema(formData, S_ServerUpdateVotifier);

  if (parsedForm.status !== 'success') {
    console.log(parsedForm.error);
    return { success: false, message: 'Invalid form data!' };
  }

  const { id, enabled, ip, port, publicKey, voteCooldownHours } =
    parsedForm.value;

  if (!(await userCanEditServer(id)))
    return {
      success: false,
      message: 'You are not allowed to edit this listing.',
    };

  if (enabled && (!ip || !port || !publicKey)) {
    return {
      success: false,
      message: 'Votifier IP, port, and public key are required when rewards are enabled.',
    };
  }

  await serverVotifierUpsert({
    serverId: id,
    enabled,
    ip,
    port,
    publicKey,
    voteCooldownHours,
  });

  return { success: true, message: 'Voting settings updated.' };
}
