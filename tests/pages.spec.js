// Every page loads cleanly and passes axe.
const { test, expect } = require('@playwright/test');
const { watch, axe } = require('./helpers');

for (const path of ['./']) {
  test(`${path} loads without errors and passes axe`, async ({ page }) => {
    const problems = watch(page);
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('#tr-check').click();
    await page.locator('#tr-list').click();
    await axe(page);
    expect(problems).toEqual([]);
  });
}
