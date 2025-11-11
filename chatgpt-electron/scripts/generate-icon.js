const fs = require('fs');
const path = require('path');
const png2icons = require('png2icons');

const SOURCE_ICON = path.join(__dirname, '..', 'assets', 'icon.png');
const BUILD_DIR = path.join(__dirname, '..', 'build');
const OUTPUT_ICNS = path.join(BUILD_DIR, 'icon.icns');

function generateIcon() {
  if (!fs.existsSync(SOURCE_ICON)) {
    console.error(`Source icon not found at ${SOURCE_ICON}`);
    process.exit(1);
  }

  fs.mkdirSync(BUILD_DIR, { recursive: true });
  const png = fs.readFileSync(SOURCE_ICON);
  const icns = png2icons.createICNS(png, png2icons.BICUBIC, false, 0);

  if (!icns) {
    console.error('Failed to generate .icns from PNG');
    process.exit(1);
  }

  fs.writeFileSync(OUTPUT_ICNS, icns);
  console.log(`Generated ${OUTPUT_ICNS}`);
}

try {
  generateIcon();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
