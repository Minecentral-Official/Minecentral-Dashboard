import AdmZip from 'adm-zip';

export async function detectResourceType(
  fileUrl: string,
  fileType: string,
): Promise<string | null> {
  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();
  const zip = new AdmZip(Buffer.from(buffer));
  const entries = zip.getEntries().map((entry) => entry.entryName);

  if (fileType === 'application/java-archive') {
    if (entries.includes('plugin.yml') || entries.includes('bungee.yml'))
      return 'Plugin';
    if (entries.includes('META-INF/mods.toml')) return 'Forge Mod';
    if (entries.includes('fabric.mod.json')) return 'Fabric Mod';
    if (entries.includes('quilt.mod.json')) return 'Quilt Mod';
    if (entries.includes('META-INF/neoforge.mods.toml')) return 'NeoForge Mod';
  }

  if (fileType === 'application/zip') {
    if (entries.includes('pack.mcmeta')) return 'Resource Pack';
    if (entries.includes('manifest.json')) return 'CurseForge Modpack';
    if (entries.includes('modrinth.index.json')) return 'Modrinth Modpack';
    if (
      entries.some(
        (entry) =>
          entry.startsWith('shaders/') ||
          entry.endsWith('.fsh') ||
          entry.endsWith('.vsh'),
      )
    ) {
      return 'Shader Pack';
    }
  }

  return null;
}
