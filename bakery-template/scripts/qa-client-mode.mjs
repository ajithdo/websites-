/**
 * Builds the site as a client would get it (features.demoMode: false) into
 * dist-client/ and checks that nothing demo-only is left: the ribbon, the
 * theme switcher, "Sample" labels, noindex, and the ?name= / ?theme= preview.
 *   npm run qa:client-mode
 * src/config/site.ts is restored afterwards, even if the build fails.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sitePath = 'src/config/site.ts';
const original = readFileSync(sitePath, 'utf8');
if (!/demoMode: true,/.test(original)) {
  console.error('site.ts: expected "demoMode: true," (the check flips it to false).');
  process.exit(1);
}

try {
  writeFileSync(sitePath, original.replace('demoMode: true,', 'demoMode: false,'));
  execFileSync('npx', ['astro', 'build'], {
    stdio: ['ignore', 'ignore', 'inherit'],
    env: { ...process.env, BB_OUT_DIR: './dist-client' },
  });
} finally {
  writeFileSync(sitePath, original);
}

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) files.push(path);
  }
};
walk('dist-client');

// What must not appear in client mode (text or markup), per page.
const banned = [
  ['demo ribbon', /data-demo="ribbon"|Sample website by/],
  ['theme switcher', /ThemeSwitcher|theme-trigger/],
  ['"Sample" labels', /class="sample-pill[^"]*"/],
  ['noindex', /name="robots" content="noindex/],
  ['demo flag on <html>', /<html[^>]*\sdata-demo/],
];
const problems = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const [label, pattern] of banned) {
    // A missing page is never indexed, in any mode.
    if (label === 'noindex' && file.endsWith('404.html')) continue;
    if (pattern.test(html)) problems.push(`${file}: ${label}`);
  }
}
const robots = readFileSync('dist-client/robots.txt', 'utf8');
if (!robots.includes('Sitemap:')) problems.push('robots.txt: no Sitemap line');

// Only the active theme's variables and fonts ship.
const home = readFileSync('dist-client/index.html', 'utf8');
const themeBlocks = home.match(/:root\[data-theme="/g)?.length ?? 0;
if (themeBlocks > 1) problems.push(`index.html: ${themeBlocks} theme blocks (expected 1)`);

console.log(`Checked ${files.length} pages in dist-client/.`);
if (problems.length) {
  console.log(`\n${problems.length} demo leftover(s):\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('No demo leftovers: ribbon, switcher, sample labels and noindex are all gone.');
