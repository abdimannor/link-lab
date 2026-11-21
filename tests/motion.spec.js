// Motion switch in a browser that asks for reduced motion.
const { test, expect } = require('@playwright/test');

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('still by default, on after the switch, remembered after reload', async ({ page }) => {
  await page.goto('./');
  const html = page.locator('html');
  const btn = page.locator('.course-motion button');
  await expect(html).toHaveAttribute('data-motion', 'off');
  await btn.click();
  await expect(html).toHaveAttribute('data-motion', 'on');
  await page.reload();
  await expect(html).toHaveAttribute('data-motion', 'on');
  await btn.click();
  await expect(html).toHaveAttribute('data-motion', 'off');
  await page.reload();
  await expect(html).toHaveAttribute('data-motion', 'off');
});

test('checker results do not animate while motion is off', async ({ page }) => {
  await page.goto('./');
  await page.locator('#tr-check').click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
