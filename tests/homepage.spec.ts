import { test, expect } from '../fixtures/testFixtures';

test.describe('Homepage', () => {
  test('TC01 - Verify homepage loads and displays featured products', async ({ homePage }) => {
    await homePage.open();
    expect(await homePage.isLoaded()).toBeTruthy();
    const title = await homePage.getTitle();
    expect(title).toContain('Automation Exercise');
  });

  test('TC02 - Navigate to Signup/Login from homepage', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.goToSignupLogin();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText('Login to your account')).toBeVisible();
  });
});