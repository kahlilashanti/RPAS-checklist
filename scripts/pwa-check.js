const fs = require('fs');

console.log('🔍 Running PWA preflight check...');

// Check manifest exists
if (!fs.existsSync('./public/manifest.json')) {
  console.error('❌ manifest.json not found in /public');
  process.exit(1);
}

// Check icons exist
const icons = ['./public/icon-192x192.png', './public/icon-512x512.png'];
const missingIcons = icons.filter(icon => !fs.existsSync(icon));

if (missingIcons.length > 0) {
  console.error(`❌ Missing icon(s): ${missingIcons.join(', ')}`);
  process.exit(1);
}

console.log('✅ PWA checks passed! Ready to deploy!');
process.exit(0);
