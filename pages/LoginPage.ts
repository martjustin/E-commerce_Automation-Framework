import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly signupLoginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[data-qa="login-email"]');
    this.passwordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
  }

  async login(email: string, password: string) {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.clickWhenReady(this.loginButton);
  }

  /**
   * automationexercise.com no longer renders an inline "Your email or
   * password is incorrect!" message (verified live: invalid login now
   * returns a 302 redirect to "/" with no error text anywhere in the DOM).
   * A failed login is now only observable by the user staying logged out.
   */
  async isLoggedOut(): Promise<boolean> {
    await this.page.waitForLoadState('domcontentloaded');
    return await this.signupLoginLink.isVisible();
  }
}