'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { stackService } from '@/features/workspaces/queries/stack-access';
import { workspaceActor } from '@/features/workspaces/queries/workspace-access';
import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';

import type {
  ImportPreview,
  ImportResult,
} from '@/features/workspaces/schemas/stack-input';
import type { WorkspaceFormState } from '@/features/workspaces/schemas/workspace-form-state';

export type StackImportState = WorkspaceFormState & {
  preview?: ImportPreview[];
  text?: string;
  results?: ImportResult[];
};
function failure(error: unknown): WorkspaceFormState {
  if (error instanceof WorkspaceError) return { error: error.message };
  if (error instanceof z.ZodError || error instanceof SyntaxError)
    return {
      error:
        'Check your input. Imports accept up to 100 lines or a JSON object with a plugins array; versions are limited to 150 characters.',
    };
  return { error: 'Could not save the stack. Refresh and try again.' };
}
function refresh(id: string) {
  revalidatePath(`/servers/${id}`, 'layout');
}
function version(data: FormData) {
  const value = String(data.get('version') ?? 'unknown');
  return (
    value === 'unknown' ? { versionSource: 'unknown' }
    : value === 'manual' ?
      { versionSource: 'manual', manualVersion: data.get('manualVersion') }
    : { versionSource: 'catalog', versionId: value }
  );
}
export async function addStackAction(
  workspaceId: string,
  projectId: string,
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const actor = await workspaceActor();
  try {
    await stackService.add(actor, workspaceId, projectId, version(data));
  } catch (error) {
    return failure(error);
  }
  refresh(workspaceId);
  redirect(`/servers/${workspaceId}/stack`);
}
export async function versionStackAction(
  workspaceId: string,
  id: string,
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const actor = await workspaceActor();
  try {
    await stackService.setVersion(actor, workspaceId, id, version(data));
  } catch (error) {
    return failure(error);
  }
  refresh(workspaceId);
  return {
    message: 'Installed version saved. Compatibility has not been checked.',
  };
}
export async function metadataStackAction(
  workspaceId: string,
  id: string,
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const actor = await workspaceActor();
  try {
    await stackService.metadata(actor, workspaceId, id, {
      alias: String(data.get('alias') ?? ''),
      notes: String(data.get('notes') ?? ''),
      enabled: data.get('enabled') === 'on',
    });
  } catch (error) {
    return failure(error);
  }
  refresh(workspaceId);
  return { message: 'Private metadata saved.' };
}
export async function removeStackAction(
  workspaceId: string,
  id: string,
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const actor = await workspaceActor();
  try {
    await stackService.remove(
      actor,
      workspaceId,
      id,
      data.get('confirmed') === 'on',
    );
  } catch (error) {
    return failure(error);
  }
  refresh(workspaceId);
  redirect(`/servers/${workspaceId}/stack`);
}
export async function previewStackImportAction(
  workspaceId: string,
  _: StackImportState,
  data: FormData,
): Promise<StackImportState> {
  const actor = await workspaceActor();
  const text = String(data.get('text') ?? '');
  try {
    return {
      preview: await stackService.previewImport(actor, workspaceId, text),
      text,
    };
  } catch (error) {
    return failure(error);
  }
}
export async function commitStackImportAction(
  workspaceId: string,
  _: StackImportState,
  data: FormData,
): Promise<StackImportState> {
  const actor = await workspaceActor();
  try {
    const choices = Object.fromEntries(
      [...data.entries()]
        .filter(([key]) => /^choice-\d{1,3}$/.test(key))
        .map(([key, value]) => [key.slice(7), value]),
    );
    const results = await stackService.import(
      actor,
      workspaceId,
      String(data.get('text') ?? ''),
      choices,
    );
    refresh(workspaceId);
    return {
      results,
      message: `${results.filter((r) => r.status === 'added').length} added · ${results.filter((r) => r.status === 'skipped').length} skipped · ${results.filter((r) => r.status === 'unresolved').length} unresolved`,
    };
  } catch (error) {
    return failure(error);
  }
}
