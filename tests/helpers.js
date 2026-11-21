// Shared checks: page health and axe-core.
const path = require('path');
const { expect } = require('@playwright/test');

// Collects console errors, page errors and failed or 4xx/5xx requests.
function watch(page) {
  const problems = [];
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`console: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    const err = r.failure() ? r.failure().errorText : '';
    if (err.includes('ERR_ABORTED')) return; // navigation or media cancelled by the browser
    problems.push(`requestfailed: ${r.url()} ${err}`);
  });
  page.on('response', (r) => { if (r.status() >= 400) problems.push(`http ${r.status()}: ${r.url()}`); });
  return problems;
}

async function axe(page, options = {}) {
  // Let entrance animations finish first: axe measures contrast on what is painted,
  // and text caught mid fade-in reads as low contrast.
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
  await page.addScriptTag({ path: path.join(__dirname, '..', 'node_modules', 'axe-core', 'axe.min.js') });
  const result = await page.evaluate((opts) => window.axe.run(document, opts), options);
  const summary = result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  expect(summary, 'axe violations').toEqual([]);
}

module.exports = { watch, axe };
