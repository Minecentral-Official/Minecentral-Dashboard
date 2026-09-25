import { z } from 'zod';

import { configService } from '@/features/workspaces/queries/config-access';
import { ConfigValidationError } from '@/features/workspaces/services/config-yaml';
import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';
import getSession from '@/lib/auth/helpers/get-session';
import { featureFlags } from '@/lib/env/feature-flags';

const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  Vary: 'Cookie',
};
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string; configId: string }> },
) {
  if (!featureFlags.workspaces)
    return new Response('Not found', { status: 404, headers: privateHeaders });
  const session = await getSession();
  if (!session)
    return new Response('Sign in required', {
      status: 401,
      headers: privateHeaders,
    });
  try {
    const { workspaceId, configId } = await params;
    const result = await configService.export(
      session.user.id,
      workspaceId,
      configId,
    );
    return new Response(result.content, {
      headers: {
        ...privateHeaders,
        'Content-Type': 'application/yaml; charset=utf-8',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof ConfigValidationError)
      return new Response(
        'Saved YAML is invalid and cannot be exported. Open the editor to repair it.',
        { status: 422, headers: privateHeaders },
      );
    if (error instanceof WorkspaceError || error instanceof z.ZodError)
      return new Response('Config not found', {
        status: 404,
        headers: privateHeaders,
      });
    return new Response('Export unavailable. Try again.', {
      status: 503,
      headers: privateHeaders,
    });
  }
}
