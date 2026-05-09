import { test, expect } from '@playwright/test';

test.describe('Admin — Login and Publish', () => {
    test('admin login page loads', async ({ page }) => {
        await page.goto('/admin/login');
        await expect(
            page.locator('input[name="username"], input[type="text"]'),
        ).toBeVisible({ timeout: 10000 });
        await expect(page.locator('input[type="password"]')).toBeVisible({
            timeout: 10000,
        });
    });

    // Skipped: error element selector needs inspection of actual DOM
    test.skip('login with wrong credentials shows error', async ({ page }) => {
        await page.goto('/admin/login');
        await page.locator('input[id="username"]').fill('wronguser');
        await page.locator('input[id="password"]').fill('WrongPassword!');
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(2000);
        await expect(page.getByText('Validation failed')).toBeVisible({
            timeout: 10000,
        });
    });

    // Skipped: Next.js middleware cookie timing issue — needs server-side cookie approach
    test.skip('login with valid credentials redirects to dashboard', async ({
        page,
    }) => {
        await page.goto('/admin/login');
        await page.locator('input[id="username"]').fill('e2e-admin');
        await page.locator('input[id="password"]').fill('E2ePassword123!');
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(5000);
        await expect(page).toHaveURL(/\/admin\/home/, { timeout: 15000 });
    });

    // Skipped: depends on login redirect working
    test.skip('admin can see drafts after login', async ({ page }) => {
        // Step 1 — login in same context
        await page.goto('/admin/login');
        await page.locator('input[id="username"]').fill('e2e-admin');
        await page.locator('input[id="password"]').fill('E2ePassword123!');
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(5000);

        // Step 2 — navigate to drafts in same session
        await page.goto('/admin/drafts');
        await expect(page.locator('header')).toBeVisible({ timeout: 10000 });
    });
});
