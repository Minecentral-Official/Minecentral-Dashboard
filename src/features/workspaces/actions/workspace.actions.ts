'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import {
  workspaceActor,
  workspaceService,
} from '@/features/workspaces/queries/workspace-access';
import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';

import type { WorkspaceFormState } from '@/features/workspaces/schemas/workspace-form-state';

function fields(data: FormData) {
  return {
    name: String(data.get('name') ?? ''),
    description: String(data.get('description') ?? ''),
    notes: String(data.get('notes') ?? ''),
    platform: data.get('platform') as 'paper',
    minecraftVersion: data.get('minecraftVersion') as '1.21.11',
    javaVersion: data.get('javaVersion'),
    status: (data.get('status') ?? 'planning') as 'planning',
    visibility: (data.get('visibility') ?? 'private') as 'private',
    connectionHost: String(data.get('connectionHost') ?? ''),
    connectionPort: data.get('connectionPort'),
  };
}
function failure(error: unknown): WorkspaceFormState {
  if (error instanceof z.ZodError)
    return {
      error: 'Check the highlighted fields.',
      fields: Object.fromEntries(
        error.issues.map((issue) => [issue.path[0], issue.message]),
      ),
    };
  if (error instanceof WorkspaceError) return { error: error.message };
  return {
    error: 'Could not save this change. Refresh the page and try again.',
  };
}
function refresh(id?: string) {
  revalidatePath('/servers');
  if (id) revalidatePath(`/servers/${id}`, 'layout');
}
export async function createWorkspaceAction(
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const actorId = await workspaceActor();
  let id: string;
  try {
    id = (await workspaceService.create(actorId, fields(data))).id;
  } catch (error) {
    return failure(error);
  }
  refresh();
  redirect(`/servers/${id}`);
}
export async function updateWorkspaceAction(
  id: string,
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const actorId = await workspaceActor();
  try {
    await workspaceService.update(actorId, id, fields(data));
  } catch (error) {
    return failure(error);
  }
  refresh(id);
  return { message: 'Settings saved.' };
}
export async function addMemberAction(
  id: string,
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const actorId = await workspaceActor();
  try {
    await workspaceService.addMember(actorId, id, {
      email: data.get('email'),
      role: data.get('role'),
    });
  } catch (error) {
    return failure(error);
  }
  refresh(id);
  return { message: 'Collaborator access saved. Team sharing is enabled.' };
}
export async function removeMemberAction(
  id: string,
  userId: string,
  _: WorkspaceFormState,
  _data: FormData,
): Promise<WorkspaceFormState> {
  const actorId = await workspaceActor();
  try {
    await workspaceService.removeMember(actorId, id, userId);
  } catch (error) {
    return failure(error);
  }
  refresh(id);
  return { message: 'Collaborator removed.' };
}
export async function archiveWorkspaceAction(
  id: string,
  archived: boolean,
  _: WorkspaceFormState,
  _data: FormData,
): Promise<WorkspaceFormState> {
  const actorId = await workspaceActor();
  try {
    await workspaceService.archive(actorId, id, archived);
  } catch (error) {
    return failure(error);
  }
  refresh(id);
  return { message: archived ? 'Workspace archived.' : 'Workspace restored.' };
}
export async function deleteWorkspaceAction(
  id: string,
  _: WorkspaceFormState,
  data: FormData,
): Promise<WorkspaceFormState> {
  const actorId = await workspaceActor();
  try {
    await workspaceService.delete(
      actorId,
      id,
      String(data.get('confirmation') ?? ''),
    );
  } catch (error) {
    return failure(error);
  }
  refresh(id);
  redirect('/servers?archived=true');
}
