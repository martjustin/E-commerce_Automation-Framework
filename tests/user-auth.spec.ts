import { test, expect } from '../fixtures/testFixtures';
import { USER, uniqueEmail } from '../utils/testData';

test.describe('User Authentication', () => {
  test('TC10 - Register a new user', async ({ homePage, signupPage, page }) => {
    await homePage.open();
    await homePage.goToSignupLogin();
    // uniqueEmail() is called fresh here so this test doesn't collide with
    // the email TC11 registers below (both used to share one Date.now()
    // value computed once at module import, causing "Email Address already
    // exist!" on whichever test ran second).
    await signupPage.fillSignupForm(USER.name, uniqueEmail());
    await signupPage.fillAccountDetails(USER);
    // Verify account created text
    await expect(page.getByText('Account Created!')).toBeVisible();
  });

  test('TC11 - Login with valid credentials', async ({ homePage, loginPage, signupPage, page }) => {
    // First register the user (could be done in beforeAll)
    const email = uniqueEmail();
    await homePage.open();
    await homePage.goToSignupLogin();
    await signupPage.fillSignupForm(USER.name, email);
    await signupPage.fillAccountDetails(USER);
    await page.getByText('Continue').click();
    // Logout (link available after login)
    await page.getByText('Logout').click();
    // Now login
    await homePage.goToSignupLogin();
    await loginPage.login(email, USER.password);
    // Verify logged in by checking Logout link visible
    await expect(page.getByText('Logout')).toBeVisible();
  });

  test('TC12 - Login with invalid credentials shows error', async ({ homePage, loginPage }) => {
    await homePage.open();
    await homePage.goToSignupLogin();
    // automationexercise.com is a public shared demo site with no email
    // verification — the well-known literal "wrong@example.com" /
    // "wrongpass" (used by countless QA tutorials) can and did get
    // registered by someone else, which flipped this "invalid" login into
    // a real one and made the test non-deterministic. uniqueEmail() with
    // high-entropy randomness guarantees an account that has never existed.
    await loginPage.login(uniqueEmail('neverregistered'), 'wrongpass');
    // Site also silently redirects to "/" on invalid creds with no inline
    // error text anywhere in the DOM (verified live) — assert the user was
    // never authenticated instead of asserting copy the app no longer renders.
    expect(await loginPage.isLoggedOut()).toBeTruthy();
  });
});