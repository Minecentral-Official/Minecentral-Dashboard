import { execSync } from 'child_process';
import fs from 'fs';

// Get system info
const nodeVersion = process.version;
const platform = process.platform;
const cpuArch = process.arch;

console.log('=== Environment Information ===');
console.log(`Node.js Version: ${nodeVersion}`);
console.log(`Platform: ${platform}`);
console.log(`CPU Architecture: ${cpuArch}`);

// Check package.json for potential issues
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

  console.log('\n=== Dependencies Analysis ===');

  // Check for native dependencies that might cause issues
  const allDeps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };

  const potentialProblemDeps = Object.entries(allDeps).filter(([name]) => {
    return (
      name.includes('sharp') ||
      name.includes('canvas') ||
      name.includes('node-sass') ||
      name.includes('fibers') ||
      name.includes('sqlite3') ||
      name.includes('node-gyp') ||
      name.includes('swc') ||
      name.includes('esbuild')
    );
  });

  if (potentialProblemDeps.length > 0) {
    console.log('Potential platform-specific dependencies found:');
    potentialProblemDeps.forEach(([name, version]) => {
      console.log(`  - ${name}: ${version}`);
    });
    console.log(
      'These packages may require native compilation and could cause issues across platforms.',
    );
  } else {
    console.log('No obvious platform-specific dependencies detected.');
  }

  // Check for next.js version
  if (allDeps['next']) {
    console.log(`\nNext.js version: ${allDeps['next']}`);
  }

  // Check for build script
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log(`Build script: "${packageJson.scripts.build}"`);
  }
} catch (error) {
  console.error('Error analyzing package.json:', error);
}

// Try to run a minimal build with diagnostics
console.log('\n=== Attempting Build With Diagnostics ===');
try {
  console.log('Running: NODE_OPTIONS="--trace-warnings" next build --no-lint');
  execSync('NODE_OPTIONS="--trace-warnings" next build --no-lint', {
    stdio: 'inherit',
  });
} catch {
  console.log('Build failed with diagnostics enabled.');
}
