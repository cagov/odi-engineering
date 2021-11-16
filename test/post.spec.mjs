// run this using playwright inspector by setting debug: PWDEBUG=1 npx playwright test post.spec.mjs
// more info: https://playwright.dev/docs/inspector/#open-playwright-inspector

import { test, expect } from '@playwright/test';

test.describe('feature foo', () => {
  test('post test', async ({ page }) => {

    await page.goto('https://staging.covid19.ca.gov/');

    await page.route('https://api.alpha.ca.gov/WasHelpful', (route, request) => {
      const method = 'POST';
      const postData = '{"url":"https://staging.covid19.ca.gov/","helpful":"yes","comments":"testing2","userAgent":"Playwright"}';
      route.continue({ method, postData });
    });

    await page.pause();

    const response = page.goto('https://api.alpha.ca.gov/WasHelpful');

    await page.pause();

    await page.goto('https://staging.covid19.ca.gov/');

    await page.pause();

    expect(true).toBe(true);

  });
});


