import { expect, test } from '@playwright/test';

test('home page loads hero heading', async ({ page }) => {
  await page.goto('/Website2026/');
  await expect(page.getByRole('heading', { name: /electric/i }).first()).toBeVisible();
});
