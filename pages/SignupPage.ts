// SignupPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { USER } from '../utils/testData';

export class SignupPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly signupButton: Locator;
  readonly titleMr: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('input[data-qa="signup-name"]');
    this.emailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.titleMr = page.locator('#id_gender1');
    this.passwordInput = page.locator('input[data-qa="password"]');
    this.firstNameInput = page.locator('input[data-qa="first_name"]');
    this.lastNameInput = page.locator('input[data-qa="last_name"]');
    this.companyInput = page.locator('input[data-qa="company"]');
    this.address1Input = page.locator('input[data-qa="address"]');
    this.address2Input = page.locator('input[data-qa="address2"]');
    this.cityInput = page.locator('input[data-qa="city"]');
    this.stateInput = page.locator('input[data-qa="state"]');
    this.zipcodeInput = page.locator('input[data-qa="zipcode"]');
    this.mobileInput = page.locator('input[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
  }

  async fillSignupForm(name: string, email: string) {
    await this.fillField(this.nameInput, name);
    await this.fillField(this.emailInput, email);
    await this.clickWhenReady(this.signupButton);
  // Wait for the account details section to appear
    await this.page.waitForSelector('#id_gender1', { state: 'visible', timeout: 60_000 });
}
  

  async fillAccountDetails(user = USER) {
    await this.clickWhenReady(this.titleMr);
    await this.fillField(this.passwordInput, user.password);
    // Select date of birth dropdowns – static for simplicity
    await this.page.selectOption('#days', '10');
    await this.page.selectOption('#months', 'May');
    await this.page.selectOption('#years', '1990');
    // Fill the rest using test data
    await this.fillField(this.firstNameInput, user.firstName);
    await this.fillField(this.lastNameInput, user.lastName);
    await this.fillField(this.companyInput, user.company);
    await this.fillField(this.address1Input, user.address1);
    await this.fillField(this.address2Input, user.address2);
    await this.fillField(this.cityInput, user.city);
    await this.fillField(this.stateInput, user.state);
    await this.fillField(this.zipcodeInput, user.zipcode);
    await this.fillField(this.mobileInput, user.mobile);
    await this.clickWhenReady(this.createAccountButton);
  }
}