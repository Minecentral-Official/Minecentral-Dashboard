'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { compatibilityService } from '@/features/workspaces/queries/compatibility-access';
import { workspaceActor } from '@/features/workspaces/queries/workspace-access';
import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';
import requirePermission from '@/lib/auth/helpers/require-permission';

import type { WorkspaceFormState } from '@/features/workspaces/schemas/workspace-form-state';

function failure(error: unknown): WorkspaceFormState {
  return {
    error:
      error instanceof WorkspaceError ? error.message
      : error instanceof z.ZodError ?
        'Check required fields, exact IDs, dates and HTTPS provenance links.'
      : 'Could not save this change. Try again.',
  };
}
export async function recomputeCompatibilityAction(
  workspaceId: string,
  _: WorkspaceFormState,
  _data: FormData,
): Promise<WorkspaceFormState> {
  const actor = await workspaceActor();
  try {
    const result = await compatibilityService.report(actor, workspaceId, true);
    if (result.error) return { error: result.error };
  } catch (error) {
    return failure(error);
  }
  revalidatePath(`/servers/${workspaceId}`, 'layout');
  return { message: 'Compatibility report recomputed.' };
}
export async function submitCommunityAction(
  workspaceId: string,
  entryId: string,
  target: { versionId: string; platform: string; minecraftVersion: string },
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const actor = await workspaceActor();
  try {
    await compatibilityService.submitCommunity(actor, workspaceId, entryId, {
      ...target,
      result: data.get('result'),
      detail: data.get('detail'),
      observedAt: data.get('observedAt'),
      consent: data.get('consent') === 'on',
    });
  } catch (error) {
    return failure(error);
  }
  revalidatePath('/servers/reports');
  revalidatePath('/admin/compatibility');
  return {
    message:
      'Report submitted for review. It does not change compatibility until trust and volume requirements are met.',
  };
}
export async function withdrawCommunityAction(
  id: string,
  _: WorkspaceFormState,
  _data: FormData,
): Promise<WorkspaceFormState> {
  const actor = await workspaceActor();
  try {
    await compatibilityService.withdrawCommunity(actor, id);
  } catch (error) {
    return failure(error);
  }
  revalidatePath('/servers/reports');
  revalidatePath('/servers', 'layout');
  return { message: 'Report withdrawn and its test details removed.' };
}
export async function curateCompatibilityAction(
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const { user } = await requirePermission('catalog:curate');
  const text = (key: string) => String(data.get(key) ?? '').trim();
  const optional = (key: string) => text(key) || null;
  const provenance = {
    provenance: text('provenance'),
    url: text('url'),
    observedAt: text('observedAt'),
    expiresAt: text('expiresAt'),
  };
  try {
    switch (text('operation')) {
      case 'evidence':
        await compatibilityService.addEvidence(user.id, {
          ...provenance,
          versionId: text('versionId'),
          platform: text('platform'),
          minecraftVersion: text('minecraftVersion'),
          kind: text('kind'),
          result: text('result'),
          confidence: text('confidence'),
        });
        break;
      case 'relationship':
        await compatibilityService.addRelationship(user.id, {
          ...provenance,
          fromProjectId: text('fromProjectId'),
          toProjectId: text('toProjectId'),
          fromVersionId: optional('fromVersionId'),
          toVersionId: optional('toVersionId'),
          kind: text('kind'),
          versionRange: optional('versionRange'),
          platform: optional('platform'),
          minecraftVersion: optional('minecraftVersion'),
        });
        break;
      case 'review':
        if (!['approved', 'rejected'].includes(text('decision')))
          return { error: 'Choose a review decision.' };
        await compatibilityService.reviewCommunity(
          user.id,
          text('id'),
          text('decision') === 'approved',
          text('reason'),
        );
        break;
      case 'revoke':
        if (!['evidence', 'relationship'].includes(text('recordType')))
          return { error: 'Choose a record type.' };
        await compatibilityService.revoke(
          user.id,
          text('recordType') as 'evidence' | 'relationship',
          text('id'),
          text('reason'),
        );
        break;
      default:
        return { error: 'Choose an operation.' };
    }
  } catch (error) {
    return failure(error);
  }
  revalidatePath('/admin/compatibility');
  revalidatePath('/servers', 'layout');
  return { message: 'Compatibility curation saved.' };
}
