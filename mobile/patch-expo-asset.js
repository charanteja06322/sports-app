const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'node_modules/expo-asset/build/AssetUris.js');

if (fs.existsSync(target)) {
  let content = fs.readFileSync(target, 'utf8');
  if (
    content.includes('urlObject.protocol = nextProtocol;') ||
    content.includes('const urlObject = new URL(manifestUrl);') ||
    content.includes('const match = url.match')
  ) {
    const fixedFunction = `export function getManifestBaseUrl(manifestUrl) {
    let url = String(manifestUrl || '');
    if (url.startsWith('exps://')) {
        url = 'https://' + url.slice(7);
    } else if (url.startsWith('exp://')) {
        url = 'http://' + url.slice(6);
    }
    url = url.split('?')[0].split('#')[0];
    const lastSlash = url.lastIndexOf('/');
    if (lastSlash > 8) {
        return url.substring(0, lastSlash + 1);
    }
    return url.endsWith('/') ? url : url + '/';
}`;
    content = content.replace(/export function getManifestBaseUrl\(manifestUrl\) \{[\s\S]*?\n\}/, fixedFunction);
    fs.writeFileSync(target, content, 'utf8');
    console.log('[EZKORA] Successfully patched expo-asset/build/AssetUris.js (syntax-safe)');
  }
}
