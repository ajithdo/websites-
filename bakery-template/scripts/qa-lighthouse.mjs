/**
 * Lighthouse (mobile) for the key pages against a running preview.
 *   npm run build && npm run preview   (in another terminal)
 *   npm run qa:lighthouse -- [label] [baseUrl]
 *
 * Runs each page 3 times and keeps the median performance run. Reports go to
 * docs/qa/lighthouse/<label>/ and a summary table is printed. Uses the
 * Playwright Chromium when CHROME_PATH is not set.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const [, , label = 'demo', base = 'http://localhost:4321'] = process.argv;
const pages = process.env.LH_PAGES
  ? JSON.parse(process.env.LH_PAGES)
  : [
      ['home', '/'],
      ['menu', '/menu/'],
      ['custom-cakes', '/custom-cakes/'],
      ['gallery', '/gallery/'],
      ['contact', '/contact/'],
    ];
const runs = Number(process.env.LH_RUNS ?? 3);
const outDir = join('docs/qa/lighthouse', label);
mkdirSync(outDir, { recursive: true });

const pwChrome = '/opt/pw-browsers';
const chromePath =
  process.env.CHROME_PATH ??
  (existsSync(pwChrome)
    ? join(
        pwChrome,
        readdirSync(pwChrome).find((d) => /^chromium-\d+$/.test(d)) ?? '',
        'chrome-linux/chrome',
      )
    : undefined);

const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
const rows = [];
for (const [name, path] of pages) {
  const results = [];
  for (let i = 0; i < runs; i++) {
    const file = join(outDir, `${name}-${i}.json`);
    execFileSync(
      'npx',
      [
        '-y',
        'lighthouse@13',
        base + path,
        '--quiet',
        '--output=json',
        `--output-path=${file}`,
        `--only-categories=${categories.join(',')}`,
        '--chrome-flags=--headless=new --no-sandbox',
      ],
      {
        stdio: 'inherit',
        env: { ...process.env, ...(chromePath ? { CHROME_PATH: chromePath } : {}) },
      },
    );
    results.push({ file, report: JSON.parse(readFileSync(file, 'utf8')) });
  }
  results.sort(
    (a, b) => a.report.categories.performance.score - b.report.categories.performance.score,
  );
  const { file: medianFile, report: median } = results[Math.floor(results.length / 2)];
  const score = (id) => Math.round((median.categories[id]?.score ?? 0) * 100);
  const metric = (id) => median.audits[id]?.displayValue ?? '–';
  rows.push({
    page: name,
    perf: score('performance'),
    a11y: score('accessibility'),
    bp: score('best-practices'),
    seo: score('seo'),
    lcp: metric('largest-contentful-paint'),
    tbt: metric('total-blocking-time'),
    cls: metric('cumulative-layout-shift'),
    fcp: metric('first-contentful-paint'),
    weight: metric('total-byte-weight'),
  });
  // Keep the median report as the page's reference file.
  copyFileSync(medianFile, join(outDir, `${name}.json`));
  for (const { file } of results) rmSync(file);
}

console.log(`\nLighthouse mobile · ${label} · median of ${runs}\n`);
console.log('| Page | Perf | A11y | BP | SEO | LCP | TBT | CLS | FCP | Weight |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const r of rows) {
  console.log(
    `| ${r.page} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${r.lcp} | ${r.tbt} | ${r.cls} | ${r.fcp} | ${r.weight} |`,
  );
}
