import { test, expect } from '@playwright/test';

test('should add employee and show it on list', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByText(/add new employee/i).click()
  await page.getByLabel('name').type('Andrew Endest')
  await page.getByLabel('title').type('Engineering Productivity')
  await page.getByLabel('organization').click();
  await page.locator('[title="Core"]').click();
  await page.getByLabel(/^Active$/).check();
  await page.getByText('Submit').click();
  await page.getByPlaceholder('Search...').type('Endest')
  await page.locator('.filter-active').click();
  await expect(page.getByText(/Andrew Endest/).first()).toBeVisible();
  await expect(page.getByText(/Engineering Productivity/).first()).toBeVisible();
  await expect(page.getByText(/Core/).first()).toBeVisible();
  await expect(page.locator('.status-andrew').first()).toHaveText('Active');
});
