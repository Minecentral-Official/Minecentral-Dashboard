import yaml from 'js-yaml';
import JSZip from 'jszip';

// Define types for our results
interface MinecraftFileInfo {
  fileName: string;
  fileType: string;
  name: string;
  version: string;
}

interface AnalysisResult {
  success: boolean;
  fileInfo?: MinecraftFileInfo;
  error?: string;
}

// Helper function to get file extension
function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
}

// Helper function to get base name without extension
function getBaseName(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
}

// Main function to analyze a Minecraft file
export async function analyzeMinecraftFile(
  file: File,
): Promise<AnalysisResult> {
  try {
    const fileName = file.name;
    const fileExtension = getExtension(fileName);

    // If it's a ZIP file or JAR file (which is essentially a ZIP)
    if (fileExtension === '.zip' || fileExtension === '.jar') {
      return analyzeZipFile(file, fileName);
    } else {
      // For individual files
      return analyzeIndividualFile(file, fileName);
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Function to read a file as text
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Function to analyze ZIP/JAR files
async function analyzeZipFile(
  file: File,
  fileName: string,
): Promise<AnalysisResult> {
  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the ZIP file
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Initialize result with default values
    const result: MinecraftFileInfo = {
      fileName: fileName,
      fileType: 'unknown',
      name: 'Unknown',
      version: 'Unknown',
    };

    // Check if it's a plugin (Bukkit/Spigot/Paper)
    if (zip.files['plugin.yml']) {
      result.fileType = 'plugin';
      const content = await zip.files['plugin.yml'].async('string');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pluginYml = yaml.load(content) as Record<string, any>;
      result.name = pluginYml.name || 'Unknown';
      result.version = pluginYml.version || 'Unknown';
    }

    // Check if it's a BungeeCord plugin
    else if (zip.files['bungee.yml']) {
      result.fileType = 'bungee_plugin';
      const content = await zip.files['bungee.yml'].async('string');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bungeeYml = yaml.load(content) as Record<string, any>;
      result.name = bungeeYml.name || 'Unknown';
      result.version = bungeeYml.version || 'Unknown';
    }

    // Check if it's a Fabric mod
    else if (zip.files['fabric.mod.json']) {
      result.fileType = 'fabric_mod';
      const content = await zip.files['fabric.mod.json'].async('string');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fabricModJson = JSON.parse(content) as Record<string, any>;
      result.name = fabricModJson.name || 'Unknown';
      result.version = fabricModJson.version || 'Unknown';
    }

    // Check if it's a Forge mod (newer format)
    else if (
      Object.keys(zip.files).some((path) => path.toLowerCase() === 'mods.toml')
    ) {
      const tomlPath = Object.keys(zip.files).find(
        (path) => path.toLowerCase() === 'mods.toml',
      )!;
      result.fileType = 'forge_mod';
      const content = await zip.files[tomlPath].async('string');
      // Basic parsing of TOML (simplified)
      const displayName = content.match(/displayName\s*=\s*"([^"]+)"/)?.[1];
      const modId = content.match(/modId\s*=\s*"([^"]+)"/)?.[1];
      const version = content.match(/version\s*=\s*"([^"]+)"/)?.[1];

      result.name = displayName || modId || 'Unknown';
      result.version = version || 'Unknown';
    }

    // Check if it's a Forge mod (older format)
    else if (
      Object.keys(zip.files).some((path) => path.toLowerCase() === 'mcmod.info')
    ) {
      const mcmodPath = Object.keys(zip.files).find(
        (path) => path.toLowerCase() === 'mcmod.info',
      )!;
      result.fileType = 'forge_mod_legacy';
      try {
        const content = await zip.files[mcmodPath].async('string');
        const mcmodInfo = JSON.parse(content);
        const modInfo =
          Array.isArray(mcmodInfo) ? mcmodInfo[0]
          : mcmodInfo.modList && mcmodInfo.modList[0] ? mcmodInfo.modList[0]
          : {};

        result.name = modInfo.name || 'Unknown';
        result.version = modInfo.version || 'Unknown';
      } catch {
        // Keep defaults if parsing fails
      }
    }

    // Check if it's a resource pack or data pack
    else if (
      Object.keys(zip.files).some(
        (path) => path.toLowerCase() === 'pack.mcmeta',
      )
    ) {
      const mcmetaPath = Object.keys(zip.files).find(
        (path) => path.toLowerCase() === 'pack.mcmeta',
      )!;
      try {
        const content = await zip.files[mcmetaPath].async('string');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const packMcmeta = JSON.parse(content) as Record<string, any>;

        if (packMcmeta.pack) {
          result.fileType = 'resource_pack';
          // Resource packs don't typically have a name in pack.mcmeta, use filename
          result.name = getBaseName(fileName);
          // Format can be considered a "version" of sorts
          result.version = String(packMcmeta.pack.pack_format || 'Unknown');
        } else if (packMcmeta.data) {
          result.fileType = 'data_pack';
          result.name = getBaseName(fileName);
          result.version = String(packMcmeta.data.pack_format || 'Unknown');
        }
      } catch {
        // Keep defaults if parsing fails
      }
    }

    // Check if it's a shader pack
    const hasShaderFiles = Object.keys(zip.files).some(
      (path) =>
        path.startsWith('shaders/') &&
        (path.endsWith('.vsh') ||
          path.endsWith('.fsh') ||
          path.endsWith('.glsl')),
    );

    if (hasShaderFiles) {
      result.fileType = 'shader_pack';

      // Try to find a name from shaderpack.properties if it exists
      const shaderPropsPath = Object.keys(zip.files).find(
        (path) => path.toLowerCase() === 'shaders/shaderpack.properties',
      );

      if (shaderPropsPath) {
        const content = await zip.files[shaderPropsPath].async('string');
        const name = content.match(/name\s*=\s*(.+)/)?.[1];
        if (name) result.name = name;
      } else {
        result.name = getBaseName(fileName);
      }
    }

    // If we still don't know what it is, look for other indicators
    if (result.fileType === 'unknown') {
      // Check for LiteLoader mods
      const litemodPath = Object.keys(zip.files).find(
        (path) => path.toLowerCase() === 'litemod.json',
      );

      if (litemodPath) {
        result.fileType = 'liteloader_mod';
        try {
          const content = await zip.files[litemodPath].async('string');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const litemodJson = JSON.parse(content) as Record<string, any>;
          result.name = litemodJson.name || 'Unknown';
          result.version = litemodJson.version || 'Unknown';
        } catch {
          // Keep defaults if parsing fails
        }
      }
    }

    return {
      success: true,
      fileInfo: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Function to analyze individual files (not in ZIP)
async function analyzeIndividualFile(
  file: File,
  fileName: string,
): Promise<AnalysisResult> {
  try {
    const fileContent = await readFileAsText(file);

    const result: MinecraftFileInfo = {
      fileName: fileName,
      fileType: 'unknown',
      name: 'Unknown',
      version: 'Unknown',
    };

    // Check if it's a YAML file that might be a plugin.yml
    if (fileName.toLowerCase() === 'plugin.yml') {
      result.fileType = 'plugin_config';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pluginYml = yaml.load(fileContent) as Record<string, any>;
      result.name = pluginYml.name || 'Unknown';
      result.version = pluginYml.version || 'Unknown';
    }

    // Check if it's a JSON file that might be a mod config
    else if (fileName.toLowerCase() === 'fabric.mod.json') {
      result.fileType = 'fabric_mod_config';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fabricModJson = JSON.parse(fileContent) as Record<string, any>;
      result.name = fabricModJson.name || 'Unknown';
      result.version = fabricModJson.version || 'Unknown';
    }

    // Check if it's a pack.mcmeta file
    else if (fileName.toLowerCase() === 'pack.mcmeta') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const packMcmeta = JSON.parse(fileContent) as Record<string, any>;

        if (packMcmeta.pack) {
          result.fileType = 'resource_pack_config';
          // Resource packs don't typically have a name in pack.mcmeta, use filename
          result.name = getBaseName(fileName);
          // Format can be considered a "version" of sorts
          result.version = String(packMcmeta.pack.pack_format || 'Unknown');
        } else if (packMcmeta.data) {
          result.fileType = 'data_pack_config';
          result.name = getBaseName(fileName);
          result.version = String(packMcmeta.data.pack_format || 'Unknown');
        }
      } catch {
        // Keep defaults if parsing fails
      }
    }

    return {
      success: true,
      fileInfo: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Example usage in a browser environment
// This is just for demonstration - in a real app, you'd call analyzeMinecraftFile
// from your event handlers
// async function testAnalyzer() {
//   // This would be from a file input in a real app
//   const fileInput = document.getElementById('fileInput') as HTMLInputElement;

//   if (fileInput && fileInput.files && fileInput.files.length > 0) {
//     const file = fileInput.files[0];
//     console.log(`Analyzing: ${file.name}`);

//     const result = await analyzeMinecraftFile(file);

//     if (result.success && result.fileInfo) {
//       console.log('\nAnalysis Results:');
//       console.log('----------------');
//       console.log(`File Name: ${result.fileInfo.fileName}`);
//       console.log(`File Type: ${result.fileInfo.fileType}`);
//       console.log(`Name: ${result.fileInfo.name}`);
//       console.log(`Version: ${result.fileInfo.version}`);
//     } else {
//       console.error('Error:', result.error);
//     }
//   } else {
//     console.log('No file selected');
//   }
// }

// // For Node.js testing - this won't run in a browser
// if (typeof process !== 'undefined') {
//   console.log('This script is designed for browser environments');
// }

// // For browser testing
// if (typeof window !== 'undefined') {
//   // You can call testAnalyzer() when a file is selected
//   console.log('Ready to analyze Minecraft files');
// }
