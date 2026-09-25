'use server';

import { revalidatePath } from 'next/cache';

import { visualSchemas } from '@/features/workspaces/queries/visual-schema-access';
import requirePermission from '@/lib/auth/helpers/require-permission';

export async function publishVisualSchema(
  _: { error?: string; message?: string },
  data: FormData,
) {
  const session = await requirePermission('catalog:curate');
  try {
    const raw = String(data.get('definition') ?? '');
    if (new TextEncoder().encode(raw).length > 65536)
      throw new Error('Schema exceeds 64 KiB.');
    await visualSchemas.publish(
      session.user.id,
      String(data.get('projectId') ?? '') || null,
      JSON.parse(raw),
    );
    revalidatePath('/admin/config-schemas');
    return { message: 'Schema release published.' };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Could not publish schema.',
    };
  }
}
export async function retireVisualSchema(
  id: string,
  _: { error?: string; message?: string },
  data: FormData,
) {
  const session = await requirePermission('catalog:curate');
  if (data.get('confirmed') !== 'on')
    return { error: 'Confirm retirement first.' };
  try {
    await visualSchemas.retire(session.user.id, id);
    revalidatePath('/admin/config-schemas');
    return { message: 'Schema release retired.' };
  } catch {
    return { error: 'Could not retire schema release.' };
  }
}
