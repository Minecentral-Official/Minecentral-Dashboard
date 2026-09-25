import type { CatalogSnapshot } from '../../src/features/catalog/schemas/catalog-input';

export function catalogFixture(
  provider: 'modrinth' | 'hangar' = 'modrinth',
): CatalogSnapshot {
  return {
    provider,
    externalId: provider === 'modrinth' ? 'oak12345' : '42',
    locator: provider === 'modrinth' ? 'oak12345' : '42',
    url:
      provider === 'modrinth' ?
        'https://modrinth.com/plugin/oak-permissions'
      : 'https://hangar.papermc.io/Oak/Permissions',
    metadata: {
      name: 'Oak Permissions',
      description: 'Manage server permissions with groups.',
      authors: ['Oak team'],
      categories: ['utility'],
      platforms: ['paper'],
      links: [{ label: 'Documentation', url: 'https://example.test/docs' }],
      icon: null,
    },
    versions: [
      {
        externalId: provider === 'modrinth' ? 'version1' : '71',
        name: 'Oak 1.0',
        channel: 'release',
        publishedAt: '2026-01-01T00:00:00Z',
        url: 'https://example.test/releases/1',
        support: [
          { platform: 'paper', kind: 'minecraft', versions: ['1.21.11'] },
        ],
        dependencies: [
          {
            sourceProjectId: 'dependency1',
            sourceVersionId: null,
            name: 'Optional bridge',
            type: 'optional',
            platform: 'paper',
          },
        ],
      },
    ],
  };
}
