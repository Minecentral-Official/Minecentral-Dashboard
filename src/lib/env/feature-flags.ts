import 'server-only';

import { serverEnv } from '@/lib/env/server.env';

export const featureFlags = Object.freeze({
  workspaces: serverEnv.FEATURE_V2_WORKSPACES,
  community: serverEnv.FEATURE_V2_COMMUNITY,
  agent: serverEnv.FEATURE_V2_AGENT,
});

export function requireFeature(feature: keyof typeof featureFlags) {
  if (!featureFlags[feature]) throw new Error('Feature unavailable');
}
