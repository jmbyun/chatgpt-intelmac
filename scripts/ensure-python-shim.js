const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function findPython3() {
  const result = spawnSync('which', ['python3'], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error('python3 not found on PATH. Please install Xcode Command Line Tools or Python 3.');
  }
  return result.stdout.trim();
}

function ensureShim(python3Path) {
  const shimDir = path.join(__dirname, '.bin');
  const shimPath = path.join(shimDir, 'python');
  fs.mkdirSync(shimDir, { recursive: true });
  const script = `#!/bin/bash\nexec "${python3Path}" "$@"\n`;
  fs.writeFileSync(shimPath, script);
  fs.chmodSync(shimPath, 0o755);
  console.log(`Created python shim at ${shimPath}`);
}

try {
  const python3Path = findPython3();
  ensureShim(python3Path);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
