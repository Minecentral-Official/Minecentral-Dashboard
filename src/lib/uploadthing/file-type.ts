import AdmZip from 'adm-zip';

import { T_ResourceType } from '@/lib/types/t-resource-type.type';

export async function detectResourceType(
  fileUrl: string,
  fileType: string,
): Promise<T_ResourceType | null> {
  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();
  const zip = new AdmZip(Buffer.from(buffer));
  const entries = zip.getEntries().map((entry) => entry.entryName);

  if (fileType === 'application/java-archive') {
    if (entries.includes('plugin.yml') || entries.includes('bungee.yml'))
      return 'plugin';
    if (entries.includes('META-INF/mods.toml')) return 'mod'; //return 'Forge Mod';
    if (entries.includes('fabric.mod.json')) return 'mod'; //return 'Fabric Mod';
    if (entries.includes('quilt.mod.json')) return 'mod'; //return 'Quilt Mod';
    if (entries.includes('META-INF/neoforge.mods.toml')) return 'mod'; //return 'NeoForge Mod';
  }

  if (fileType === 'application/zip') {
    if (entries.includes('pack.mcmeta')) return 'resource-pack'; //return 'Resource Pack';
    if (entries.includes('manifest.json')) return 'mod'; //return 'CurseForge Modpack';
    if (entries.includes('modrinth.index.json')) return 'mod'; //return 'Modrinth Modpack';
    if (
      entries.some(
        (entry) =>
          entry.startsWith('shaders/') ||
          entry.endsWith('.fsh') ||
          entry.endsWith('.vsh'),
      )
    ) {
      return 'shader';
    }
  }

  return null;
}
