import 'server-only';

import { cache } from 'react';

import { notFound } from 'next/navigation';

import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';
import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { featureFlags } from '@/lib/env/feature-flags';

export const workspaceService = createWorkspaceService(db);
export async function workspaceActor() {
  const { user } = await validateSession();
  if (!featureFlags.workspaces) notFound();
  return user.id;
}
export const loadWorkspace = cache(async (id: string) => {
  const actorId = await workspaceActor();
  try {
    return await workspaceService.get(actorId, id);
  } catch (error) {
    if (error instanceof WorkspaceError) notFound();
    throw error;
  }
});
