'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { configService } from '@/features/workspaces/queries/config-access';
import { workspaceActor } from '@/features/workspaces/queries/workspace-access';
import { CONFIG_MAX_BYTES } from '@/features/workspaces/schemas/config-input';
import { ConfigValidationError } from '@/features/workspaces/services/config-yaml';
import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';

import type { ConfigFormState } from '@/features/workspaces/schemas/config-input';

function failure(error: unknown): ConfigFormState {
  if (error instanceof ConfigValidationError)
    return { error: error.message, diagnostics: error.diagnostics };
  return {
    error:
      error instanceof WorkspaceError ? error.message
      : error instanceof z.ZodError ?
        (error.issues[0]?.message ?? 'Check the config fields.')
      : 'Could not save this change. Your draft has not been saved; try again.',
  };
}
function metadata(data: FormData) {
  return {
    path: data.get('path'),
    kind: data.get('kind'),
    entryId: data.get('entryId') || null,
    profile: data.get('profile') || 'syntax',
  };
}
function refresh(workspaceId: string) {
  revalidatePath(`/servers/${workspaceId}`, 'layout');
}
export async function createConfigAction(
  workspaceId: string,
  _: ConfigFormState,
  data: FormData,
  content: string,
): Promise<ConfigFormState> {
  const actor = await workspaceActor();
  let id: string;
  try {
    const upload = data.get('upload');
    const uploaded = upload instanceof File && upload.size > 0;
    if (
      uploaded &&
      (!/\.ya?ml$/i.test(upload.name) || upload.size > CONFIG_MAX_BYTES)
    )
      throw new WorkspaceError('Upload a .yml or .yaml file up to 128 KiB.');
    z.string().max(CONFIG_MAX_BYTES).parse(content);
    if (uploaded) {
      try {
        new TextDecoder('utf-8', { fatal: true }).decode(
          await upload.arrayBuffer(),
        );
      } catch {
        throw new WorkspaceError('Upload a UTF-8 text file.');
      }
    }
    const created = await configService.create(
      actor,
      workspaceId,
      metadata(data),
      content,
      uploaded ? 'upload' : 'paste',
    );
    id = created.id;
  } catch (error) {
    return failure(error);
  }
  refresh(workspaceId);
  redirect(`/servers/${workspaceId}/configs/${id}`);
}
export async function saveConfigAction(
  workspaceId: string,
  id: string,
  _: ConfigFormState,
  data: FormData,
  content: string,
): Promise<ConfigFormState> {
  const actor = await workspaceActor();
  try {
    const result = await configService.save(actor, workspaceId, id, {
      content,
      expectedRevision: Number(data.get('expectedRevision')),
      message: data.get('message') ?? '',
    });
    refresh(workspaceId);
    return {
      message:
        result.unchanged ? 'No changes to save.' : 'Configuration saved.',
      revision: result.revision,
      diagnostics: result.diagnostics,
    };
  } catch (error) {
    return failure(error);
  }
}
export async function metadataConfigAction(
  workspaceId: string,
  id: string,
  _: ConfigFormState,
  data: FormData,
): Promise<ConfigFormState> {
  const actor = await workspaceActor();
  try {
    await configService.updateMetadata(
      actor,
      workspaceId,
      id,
      metadata(data),
      Number(data.get('expectedRevision')),
    );
  } catch (error) {
    return failure(error);
  }
  refresh(workspaceId);
  return { message: 'File settings saved.' };
}
export async function restoreConfigAction(
  workspaceId: string,
  id: string,
  number: number,
  _: ConfigFormState,
  data: FormData,
): Promise<ConfigFormState> {
  const actor = await workspaceActor();
  let restored: number;
  try {
    const result = await configService.restore(
      actor,
      workspaceId,
      id,
      number,
      Number(data.get('expectedRevision')),
      data.get('confirmed') === 'on',
    );
    restored = result.revision;
  } catch (error) {
    return failure(error);
  }
  refresh(workspaceId);
  redirect(`/servers/${workspaceId}/configs/${id}?restored=${restored}`);
}
export async function removeConfigAction(
  workspaceId: string,
  id: string,
  _: ConfigFormState,
  data: FormData,
): Promise<ConfigFormState> {
  const actor = await workspaceActor();
  try {
    await configService.remove(
      actor,
      workspaceId,
      id,
      String(data.get('confirmation') ?? ''),
      Number(data.get('expectedRevision')),
    );
  } catch (error) {
    return failure(error);
  }
  refresh(workspaceId);
  redirect(`/servers/${workspaceId}/configs`);
}
