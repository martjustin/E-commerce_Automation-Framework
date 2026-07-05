// fixtures/testFixtures.ts
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { SearchPage } from '../pages/SearchPage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { analyzeFailure } from '../utils/aiFailureAnalysis';  // 👈 import the analyser

type MyFixtures = {
  homePage: HomePage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  searchPage: SearchPage;
  loginPage: LoginPage;
  signupPage: SignupPage;
};

// Extend base test with page objects
export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
});

// 👇 Global afterEach that applies to every test using this `test` object
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'failed') return;

  // Grab the screenshot automatically taken by Playwright (if configured)
  const screenshotAttachment = testInfo.attachments.find(a => a.name === 'screenshot');
  const screenshotPath = screenshotAttachment?.path;

  const analysis = await analyzeFailure(
    testInfo.error?.message ?? 'Unknown error',
    screenshotPath,
    page.url()
  );

  // Attach the AI analysis to the test report
  testInfo.attachments.push({
    name: 'AI Failure Analysis',
    contentType: 'text/plain',
    body: Buffer.from(analysis),
  });
});

export { expect } from '@playwright/test';