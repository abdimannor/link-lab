// Motion is on by default, even when the browser asks for reduced motion; the course-bar button pauses it.
const { test, expect } = require('@playwright/test');

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('moving by default, paused by the button, remembered after reload', async ({ page }) => {
  await page.goto('./');
  const html = page.locator('html');
  const btn = page.locator('.course-motion');
  await expect(html).toHaveAttribute('data-motion', 'on');
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await expect(btn).toHaveAccessibleName('Pause motion');
  await btn.click();
  await expect(html).toHaveAttribute('data-motion', 'off');
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  await expect(btn).toHaveAccessibleName('Play motion');
  await page.reload();
  await expect(html).toHaveAttribute('data-motion', 'off');
  await btn.click();
  await expect(html).toHaveAttribute('data-motion', 'on');
  await page.reload();
  await expect(html).toHaveAttribute('data-motion', 'on');
});

test('the entrance and checker results animate by default', async ({ page }) => {
  await page.goto('./');
  expect(await page.evaluate(() => document.getAnimations().length)).toBeGreaterThan(0);
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
  await page.locator('#tr-check').click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBeGreaterThan(0);
});

test('checker results do not animate once motion is paused', async ({ page }) => {
  await page.goto('./');
  await page.locator('.course-motion').click();
  // Let the button's own hover fade finish, then only the checker could start anything.
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
  await page.locator('#tr-check').click();
  expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)).toBe(0);
});
