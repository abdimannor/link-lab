// The deeper parts: :visited privacy, focus modality, honest link text.
const { test, expect } = require('@playwright/test');

test('getComputedStyle reports the unvisited colour for a visited link', async ({ page }) => {
  await page.goto('./');
  await page.locator('#vp-ask').click();
  await expect(page.locator('#vp-computed')).toHaveText('rgb(22, 101, 52)');
  await expect(page.locator('#vp-verdict')).toContainText('unvisited colour');
});

test('mouse focus matches :focus only, keyboard focus also matches :focus-visible', async ({ page }) => {
  await page.goto('./');
  await page.locator('.fo-a').click();
  const first = page.locator('#fo-log li').first();
  await expect(first).toContainText('via pointer:');
  if ((await first.textContent()).includes('not focused at all')) {
    // macOS WebKit follows the platform convention: a mouse click does not focus a button, and the page says so.
    await page.locator('.fo-a').focus();
  } else {
    await expect(first).toContainText('via pointer: :focus yes, :focus-visible no');
  }
  await page.keyboard.press('Tab');
  if (!(await page.locator('.fo-b').evaluate((el) => el === document.activeElement))) {
    // macOS Safari reaches buttons with Option+Tab unless Full Keyboard Access is on.
    await page.locator('.fo-a').focus();
    await page.keyboard.press('Alt+Tab');
  }
  await expect(first).toContainText(':focus-visible yes');
  const outline = await page.locator('.fo-b').evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).toBe('solid');
});

test('link text checker flags vague, bare and duplicate texts', async ({ page }) => {
  await page.goto('./');
  await page.locator('#tr-input').fill('läs mer\nClick here\nhttps://example.com\nSVT Nyheter Helsingborg\nSVT Nyheter Helsingborg\nHelsingborgs Dagblad om ungdomarna');
  await page.locator('#tr-check').click();
  const items = page.locator('#tr-results li');
  await expect(items).toHaveCount(6);
  await expect(page.locator('#tr-results .tr-bad')).toHaveCount(5);
  await expect(items.last()).toHaveClass('tr-ok');
});

test('links list shows every link with its name and new-tab note', async ({ page }) => {
  await page.goto('./');
  await page.locator('#tr-list').click();
  const count = await page.locator('a[href]').count();
  await expect(page.locator('#tr-links li')).toHaveCount(count);
  await expect(page.locator('#tr-links')).toContainText('SVT SVT Nyheter Helsingborg (new tab)');
});

test('the three original links open in a new tab with noopener noreferrer', async ({ page }) => {
  await page.goto('./');
  for (const a of await page.locator('.links a').all()) {
    await expect(a).toHaveAttribute('target', '_blank');
    await expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  }
});
