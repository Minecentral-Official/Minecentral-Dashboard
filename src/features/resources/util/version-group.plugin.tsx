import { C_GameVersions } from '@/features/resources/config/c-game-versions.config';

export default function pluginGroupVersions(selected: string[]): string[] {
  const versionGroups: Record<string, Set<string>> = {};

  // Group versions by their major.minor prefix
  C_GameVersions.forEach((version) => {
    const [major, minor] = version.split('.');
    const key = `${major}.${minor}`;
    if (!versionGroups[key]) versionGroups[key] = new Set();
    versionGroups[key].add(version);
  });

  // Check if all versions of a major.minor exist in the selected list
  const selectedSet = new Set(selected);
  const result = new Set<string>();

  for (const [key, versions] of Object.entries(versionGroups)) {
    const major = key.split('.')[0]; // Extract major version
    const allSelected = [...versions].every((version) =>
      selectedSet.has(version),
    );

    if (allSelected) {
      result.add(`${major}.${key.split('.')[1]}.x`);
    } else {
      [...versions].forEach((version) => {
        if (selectedSet.has(version)) result.add(version);
      });
    }
  }

  return [...result];
}

// Example usage
// const availableVersions = ['1.8.1', '1.8.2', '1.8.3', '1.9.1', '1.9.2', '1.11'];
// const selectedVersions = ['1.8.1', '1.8.2', '1.8.3', '1.9.1'];

// console.log(groupVersions(availableVersions, selectedVersions));
// Output: [ '1.8.x', '1.9.1' ]
