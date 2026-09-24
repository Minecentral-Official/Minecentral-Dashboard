import { NextRequest } from 'next/server';
import { beforeEach, expect, it, vi } from 'vitest';

import { GET } from '@/app/api/resources/all/route';

const state = vi.hoisted(() => ({
  session: null as null | { user: { id: string; role: string } },
  list: vi.fn(async () => ({ resources: [] })),
}));
vi.mock('@/lib/auth/helpers/get-session', () => ({
  default: async () => state.session,
}));
vi.mock('@/features/resources/queries/resource-list-all.get', () => ({
  default: state.list,
}));

beforeEach(() => {
  state.session = null;
  state.list.mockClear();
});
it('returns 401 before querying private resources for anonymous requests', async () => {
  const response = await GET(
    new NextRequest('https://example.test/api/resources/all'),
  );
  expect(response.status).toBe(401);
  expect(state.list).not.toHaveBeenCalled();
});
it.each(['user', 'curator', 'unknown'])(
  'returns 403 for role %s',
  async (role) => {
    state.session = { user: { id: 'actor', role } };
    const response = await GET(
      new NextRequest('https://example.test/api/resources/all'),
    );
    expect(response.status).toBe(403);
    expect(state.list).not.toHaveBeenCalled();
  },
);
it.each(['moderator', 'admin'])(
  'allows %s to access moderation data',
  async (role) => {
    state.session = { user: { id: 'actor', role } };
    const response = await GET(
      new NextRequest('https://example.test/api/resources/all'),
    );
    expect(response.status).toBe(200);
    expect(state.list).toHaveBeenCalledOnce();
  },
);
