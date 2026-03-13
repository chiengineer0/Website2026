import { expect, test } from '@playwright/test';

test('home page loads hero heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main h1').first()).toBeVisible();
});
