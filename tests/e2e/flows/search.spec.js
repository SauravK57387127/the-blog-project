import { test, expect } from '@playwright/test';

test.describe('Search', () => {
    test('search page loads', async ({ page }) => {
        await page.goto('/search');
        await expect(
            page.locator(
                'input[type="search"], input[placeholder*="search" i]',
            ),
        ).toBeVisible({ timeout: 10000 });
    });

    test('searching returns results', async ({ page }) => {
        await page.goto('/search');

        const searchInput = page.locator(
            'input[placeholder="Search articles..."]',
        );
        await searchInput.fill('E2E Test Blog');

        // Don't press Enter — search triggers on change with 300ms debounce
        await page.waitForTimeout(2000); // debounce + API response

        const results = page.locator('[href*="/blog/"]');
        await expect(results.first()).toBeVisible({ timeout: 10000 });
    });

    test('searching with no match shows empty state', async ({ page }) => {
        await page.goto('/search');

        const searchInput = page.locator(
            'input[placeholder="Search articles..."]',
        );
        await searchInput.fill('zzznomatchatall');

        await page.waitForTimeout(2000);

        await expect(page.locator('text=Nothing found')).toBeVisible({
            timeout: 10000,
        });
    });
});
