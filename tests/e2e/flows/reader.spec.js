import { test, expect } from '@playwright/test';

test.describe('Reader Journey', () => {
  test('homepage loads with header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
  });

  test('blog page loads directly by slug', async ({ page }) => {
    await page.goto('/blog/e2e-test-blog-1');
    await expect(page.getByRole('heading', { name: /E2E Test Blog/ }))
      .toBeVisible({ timeout: 15000 });
  });

  test('blog page renders content', async ({ page }) => {
    await page.goto('/blog/e2e-test-blog-1');
    await expect(page.getByRole('heading', { name: /E2E Test Blog/ }))
      .toBeVisible({ timeout: 15000 });
    await expect(page.locator('.blog-content, [class*="prose"], main p').first())
      .toBeVisible({ timeout: 15000 });
  });
});
