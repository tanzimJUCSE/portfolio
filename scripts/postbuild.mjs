/**
 * GitHub Pages needs a CNAME file in the published output to serve a custom domain.
 * This keeps that file in sync with the site address in src/data/site.yml, so the
 * domain never has to be configured in two places.
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  console.warn('postbuild: no dist folder found, nothing to do.');
  process.exit(0);
}

function resolveHost() {
  // An existing CNAME at the repo root wins - GitHub writes one there when you set
  // the custom domain through the repository settings UI.
  const rootCname = path.join(root, 'CNAME');
  if (fs.existsSync(rootCname)) {
    const value = fs.readFileSync(rootCname, 'utf8').trim();
    if (value) return value;
  }

  try {
    const data = yaml.load(fs.readFileSync(path.join(root, 'src', 'data', 'site.yml'), 'utf8'));
    if (data && typeof data.url === 'string' && data.url.trim()) {
      return new URL(data.url.trim()).hostname;
    }
  } catch (error) {
    console.warn(`postbuild: could not read the site address (${error.message}).`);
  }

  return '';
}

const host = resolveHost();
const skip = !host || host.endsWith('github.io') || host === 'example.com' || host === 'localhost';

if (skip) {
  console.log(`postbuild: no custom domain to write${host ? ` (${host})` : ''}.`);
} else {
  fs.writeFileSync(path.join(dist, 'CNAME'), `${host}\n`, 'utf8');
  console.log(`postbuild: wrote dist/CNAME for ${host}`);
}
