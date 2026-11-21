// Every page loads cleanly; the lesson page passes axe.
const { test, expect } = require('@playwright/test');
const { watch, axe } = require('./helpers');

test('./ loads without errors and passes axe', async ({ page }) => {
  const problems = watch(page);
  await page.goto('./');
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('#tr-check').click();
  await page.locator('#tr-list').click();
  // The framed original.html is the 2023 exercise kept verbatim (no lang, no title),
  // so axe checks the lesson page and not the inside of that frame.
  await axe(page, { iframes: false });
  expect(problems).toEqual([]);
});

test('original.html is the 2023 exercise with its three links replaced', async ({ page }) => {
  const problems = watch(page);
  await page.goto('./original.html');
  const links = page.locator('a');
  await expect(links).toHaveCount(3);
  await expect(links.nth(0)).toHaveAttribute('href', 'https://info.cern.ch/hypertext/WWW/TheProject.html');
  await expect(links.nth(0)).toHaveCSS('font-family', 'Verdana');
  expect(await page.locator('style').textContent()).toContain('color: pink;');
  expect(problems).toEqual([]);
});

test('the front page is a lesson: course bar, hero, framed original, pager', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.course-bar [aria-current="page"]')).toContainText('Link Lab');
  await expect(page.locator('.hero .goals li')).toHaveCount(3);
  const frame = page.frameLocator('#original iframe');
  await expect(frame.locator('a')).toHaveCount(3);
  await expect(page.locator('.course-next a[rel="prev"]')).toContainText('Tech World');
  await expect(page.locator('.course-next a[rel="next"]')).toContainText('Dress Code');
});

test.describe('dark colour scheme', () => {
  test.use({ colorScheme: 'dark' });
  test('./ passes axe in dark mode with the demos opened', async ({ page }) => {
    await page.goto('./');
    await page.locator('#tr-check').click();
    await page.locator('#tr-list').click();
    await page.locator('#vp-ask').click();
    await axe(page, { iframes: false });
  });
});
