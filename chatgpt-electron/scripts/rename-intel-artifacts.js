const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

const distDir = path.join(__dirname, '..', 'dist');
const baseName = `${packageJson.productName || packageJson.name}-${packageJson.version}`;
const renameTargets = [
  { from: `${baseName}.dmg`, to: `${baseName}-x86_64.dmg` },
  { from: `${baseName}-mac.zip`, to: `${baseName}-x86_64-mac.zip` },
  { from: `${baseName}-mac.zip.blockmap`, to: `${baseName}-x86_64-mac.zip.blockmap` },
];

renameTargets.forEach(({ from, to }) => {
  const fromPath = path.join(distDir, from);
  const toPath = path.join(distDir, to);

  if (!fs.existsSync(fromPath)) {
    console.warn(`Skipping rename, source not found: ${fromPath}`);
    return;
  }

  fs.renameSync(fromPath, toPath);
  console.log(`Renamed ${from} -> ${to}`);
});
