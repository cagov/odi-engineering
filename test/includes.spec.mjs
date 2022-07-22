import { test, expect } from '@playwright/test';
import search from './includes/search.mjs';

test.describe('feature foo', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('https://covid19.ca.gov/');
  });

  test('url check', async ({ page }) => {  
    await expect(page).toHaveURL('https://covid19.ca.gov/');
  });

  test('search', async ({ page }) => {
    search(page)
    await expect(page).toHaveURL('https://covid19.ca.gov/search/?q=vaccine#gsc.tab=0&gsc.q=vaccine&gsc.page=1');
  });

});