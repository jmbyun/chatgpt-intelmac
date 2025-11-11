const fs = require('fs');
const path = require('path');
const plist = require('plist');

const ELECTRON_BASE = path.join(
  __dirname,
  '..',
  'node_modules',
  'electron',
  'dist',
  'Electron.app'
);

const INFO_PLISTS = [
  path.join(ELECTRON_BASE, 'Contents', 'Info.plist'),
  path.join(ELECTRON_BASE, 'Contents', 'Frameworks', 'Electron Helper.app', 'Contents', 'Info.plist'),
  path.join(ELECTRON_BASE, 'Contents', 'Frameworks', 'Electron Helper (GPU).app', 'Contents', 'Info.plist'),
  path.join(ELECTRON_BASE, 'Contents', 'Frameworks', 'Electron Helper (Renderer).app', 'Contents', 'Info.plist'),
  path.join(ELECTRON_BASE, 'Contents', 'Frameworks', 'Electron Helper (Plugin).app', 'Contents', 'Info.plist'),
];

const REQUIRED_KEYS = {
  NSCameraUsageDescription: 'ChatGPT needs camera access to enable voice or vision features.',
  NSMicrophoneUsageDescription: 'ChatGPT uses the microphone for voice conversations.',
  NSCameraUseContinuityCameraDeviceType: true,
};

function ensureInfoPlist(plistPath) {
  if (!fs.existsSync(plistPath)) {
    console.warn(`Info.plist not found at ${plistPath}. Skipping patch.`);
    return;
  }

  const raw = fs.readFileSync(plistPath, 'utf8');
  const plistData = plist.parse(raw);

  let updated = false;
  Object.entries(REQUIRED_KEYS).forEach(([key, value]) => {
    if (plistData[key] === undefined) {
      plistData[key] = value;
      updated = true;
    }
  });

  if (updated) {
    const nextContent = plist.build(plistData);
    fs.writeFileSync(plistPath, nextContent, 'utf8');
    console.log(`Patched ${plistPath}`);
  } else {
    console.log(`No changes needed for ${plistPath}`);
  }
}

INFO_PLISTS.forEach(ensureInfoPlist);
