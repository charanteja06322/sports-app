const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'node_modules/expo-asset/build/AssetUris.js');

if (fs.existsSync(target)) {
  let content = fs.readFileSync(target, 'utf8');
  if (content.includes('urlObject.protocol = nextProtocol;') || content.includes('const urlObject = new URL(manifestUrl);')) {
    const fixedFunction = `export function getManifestBaseUrl(manifestUrl) {
    let url = String(manifestUrl || '');
    if (url.startsWith('exps://')) {
        url = 'https://' + url.slice(7);
    } else if (url.startsWith('exp://')) {
        url = 'http://' + url.slice(6);
    }
    url = url.split('?')[0].split('#')[0];
    const match = url.match(/^(https?:\/\/[^/]+)(\/?.*)$/);
    if (match) {
        const origin = match[1];
        let path = match[2] || '/';
        const lastSlash = path.lastIndexOf('/');
        if (lastSlash !== -1) {
            path = path.substring(0, lastSlash + 1);
        }
        return origin + (path.startsWith('/') ? path : '/' + path);
    }
    const lastSlashIndex = url.lastIndexOf('/');
    return lastSlashIndex !== -1 ? url.substring(0, lastSlashIndex + 1) : url + '/';
}`;
    content = content.replace(/export function getManifestBaseUrl\(manifestUrl\) \{[\s\S]*?\n\}/, fixedFunction);
    fs.writeFileSync(target, content, 'utf8');
    console.log('[EZKORA] Applied Hermes URL getter fix to expo-asset/build/AssetUris.js');
  }
}
